// CivilPowerEc — Empresa Service
// Crea empresa, miembro admin y suscripción trial en una sola operación.

import { supabase } from '@/lib/supabase/client'
import { registrarAudit } from '@/lib/audit/audit'
import type { CrearEmpresaInput } from '@/types/empresa'
import type { UUID } from '@/types/database'

export interface CrearEmpresaResult {
  ok: boolean
  empresaId?: UUID
  error?: string
}

// Crea empresa + miembro admin + suscripción trial
// Debe ejecutarse después de que el usuario esté autenticado
export async function crearEmpresa(
  input: CrearEmpresaInput,
  userName: string,
  userEmail: string
): Promise<CrearEmpresaResult> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Usuario no autenticado' }

  // 1. Crear empresa
  const { data: empresa, error: errorEmpresa } = await supabase
    .from('empresas')
    .insert({
      owner_user_id: user.id,
      nombre: input.nombre,
      tipo_persona: input.tipo_persona,
      nombre_representante: input.nombre_representante,
      tipo_identificacion: input.tipo_identificacion,
      numero_identificacion: input.numero_identificacion,
      tipo_proyectos: input.tipo_proyectos,
      telefono: input.telefono,
      email: input.email ?? null,
      direccion: input.direccion ?? null,
      ciudad: input.ciudad,
      provincia: input.provincia,
      onboarding_status: 'empresa_creada',
    })
    .select('id')
    .single()

  if (errorEmpresa || !empresa) {
    return { ok: false, error: errorEmpresa?.message ?? 'Error al crear empresa' }
  }

  const empresaId: UUID = empresa.id

  // 2. Crear miembro admin
  const { error: errorMiembro } = await supabase
    .from('miembros')
    .insert({
      empresa_id: empresaId,
      user_id: user.id,
      nombre: userName,
      email: userEmail,
      roles: ['admin'],
      estado: 'activo',
    })

  if (errorMiembro) {
    return { ok: false, error: errorMiembro.message }
  }

  // 3. Crear suscripción trial de 21 días
  const { error: errorSuscripcion } = await supabase
    .from('suscripciones')
    .insert({
      empresa_id: empresaId,
      plan: 'trial',
      estado: 'trial',
      // trial_ends_at se calcula automáticamente en la BD (now() + 21 days)
    })

  if (errorSuscripcion) {
    return { ok: false, error: errorSuscripcion.message }
  }

  // 4. Registrar audit log
  await registrarAudit({
    empresaId,
    accion: 'crear_empresa',
    tabla: 'empresas',
    registroId: empresaId,
    valorNuevo: { nombre: input.nombre, plan: 'trial' },
  })

  return { ok: true, empresaId }
}

// Verifica si el usuario autenticado ya tiene una empresa
export async function getEmpresaDelUsuario(): Promise<{ empresaId: UUID; roles: string[] } | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('miembros')
    .select('empresa_id, roles')
    .eq('user_id', user.id)
    .eq('estado', 'activo')
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  if (!data) return null
  return { empresaId: data.empresa_id, roles: data.roles }
}
