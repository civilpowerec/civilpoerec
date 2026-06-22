// CivilPowerEc — Invitacion Service
// Toda consulta Supabase relacionada con invitaciones vive aquí.
// No meter lógica de invitaciones en src/lib.
//
// NOTA sobre registrarAudit:
// AuditPayload NO tiene campo userId — registrarAudit obtiene el usuario
// internamente con supabase.auth.getUser(). No pasar userId en el payload.

import { supabase } from '@/lib/supabase/client'
import { registrarAudit } from '@/lib/audit/audit'
import type { UUID } from '@/types/database'
import type { Invitacion, CrearInvitacionInput, AceptarInvitacionResult } from '@/types/invitacion'

// Crea una invitación y devuelve el token generado
export async function crearInvitacion(
  empresaId: UUID,
  input: CrearInvitacionInput
): Promise<{ ok: boolean; token?: string; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  // TODO: considerar token base64url más robusto para producción.
  const token = crypto.randomUUID()

  const { data, error } = await supabase
    .from('invitaciones')
    .insert({
      empresa_id:   empresaId,
      email:        input.email ?? null,
      nombre:       input.nombre ?? null,
      roles:        input.roles,
      token,
      estado:       'pendiente',
      invitado_por: user.id,
      // expires_at se calcula automáticamente en BD (now() + 7 days)
    })
    .select('id, token')
    .single()

  if (error || !data) return { ok: false, error: error?.message ?? 'Error al crear invitación' }

  // registrarAudit obtiene user internamente — no pasar userId en el payload
  await registrarAudit({
    empresaId,
    accion:     'invitar_miembro',
    tabla:      'invitaciones',
    registroId: data.id,
    valorNuevo: { roles: input.roles, email: input.email },
  })

  return { ok: true, token: data.token }
}

// Cancela una invitación pendiente
export async function cancelarInvitacion(
  empresaId: UUID,
  invitacionId: UUID
): Promise<{ ok: boolean; error?: string }> {
  // Verificar autenticación antes de proceder
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  const { error } = await supabase
    .from('invitaciones')
    .update({ estado: 'cancelada', updated_at: new Date().toISOString() })
    .eq('id', invitacionId)
    .eq('empresa_id', empresaId)
    .eq('estado', 'pendiente')

  if (error) return { ok: false, error: error.message }

  // registrarAudit obtiene user internamente — no pasar userId en el payload
  await registrarAudit({
    empresaId,
    accion:     'invitar_miembro',
    tabla:      'invitaciones',
    registroId: invitacionId,
    valorNuevo: { accion: 'cancelada' },
  })

  return { ok: true }
}

// Regenera el token de una invitación pendiente y extiende su expiración
export async function regenerarLinkInvitacion(
  empresaId: UUID,
  invitacionId: UUID,
): Promise<{ ok: boolean; token?: string; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'No autenticado' }

  const newToken = crypto.randomUUID()
  const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('invitaciones')
    .update({
      token:      newToken,
      expires_at: newExpiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', invitacionId)
    .eq('empresa_id', empresaId)
    .eq('estado', 'pendiente')
    .select('id')

  if (error) return { ok: false, error: error.message }
  if (!data || data.length === 0) return { ok: false, error: 'Invitación no encontrada o ya no está pendiente' }

  await registrarAudit({
    empresaId,
    accion:     'invitar_miembro',
    tabla:      'invitaciones',
    registroId: invitacionId,
    valorNuevo: { accion: 'regenerar_link' },
  })

  return { ok: true, token: newToken }
}

// Obtiene todas las invitaciones de una empresa
export async function getInvitaciones(empresaId: UUID): Promise<Invitacion[]> {
  const { data } = await supabase
    .from('invitaciones')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('created_at', { ascending: false })

  return (data ?? []) as Invitacion[]
}

// Obtiene invitaciones pendientes de una empresa
export async function getInvitacionesPendientes(empresaId: UUID): Promise<Invitacion[]> {
  const { data } = await supabase
    .from('invitaciones')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('estado', 'pendiente')
    .order('created_at', { ascending: false })

  return (data ?? []) as Invitacion[]
}

// Resultado de get_invitation_by_token
interface InvitacionPublica {
  ok: boolean
  error?: string
  id?: UUID
  empresa_id?: UUID
  nombre?: string | null
  email?: string | null
  roles?: string[]
  estado?: string
  expires_at?: string
}

// Busca una invitación por token via RPC SECURITY DEFINER.
// No usa SELECT directo — el invitado todavía no es miembro
// y RLS no le permite leer la tabla directamente.
export async function getInvitacionPorToken(
  token: string
): Promise<InvitacionPublica> {
  const { data, error } = await supabase.rpc('get_invitation_by_token', {
    p_token: token,
  })

  if (error) return { ok: false, error: 'error_interno' }

  return data as InvitacionPublica
}

// Acepta una invitación via RPC — operación atómica SECURITY DEFINER.
// La RPC valida internamente que p_user_id === auth.uid().
export async function aceptarInvitacion(
  token: string,
  nombre?: string
): Promise<AceptarInvitacionResult> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'token_invalido' }

  const { data, error } = await supabase.rpc('accept_invitation', {
    p_token:   token,
    p_user_id: user.id,
    p_nombre:  nombre ?? null,
  })

  if (error) return { ok: false, error: 'error_interno' }

  return data as AceptarInvitacionResult
}

// Construye el link de invitación
export function buildInvitacionLink(token: string): string {
  const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin
  return `${baseUrl}/invitacion/${token}`
}
