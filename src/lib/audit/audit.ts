// CivilPowerEc — Audit log helper

import { supabase } from '@/lib/supabase/client'
import type { UUID } from '@/types/database'

export type AuditAction =
  | 'crear_empresa'
  | 'crear_miembro'
  | 'crear_suscripcion'
  | 'crear_proyecto'
  | 'actualizar_onboarding'
  | 'cambiar_roles'
  | 'desactivar_miembro'
  | 'crear_registro'
  | 'actualizar_registro'
  | 'eliminar_logico'

export interface AuditLogInput {
  empresaId: UUID
  userId?: UUID | null
  accion: AuditAction | string
  tabla: string
  registroId?: UUID | null
  valorAnterior?: unknown
  valorNuevo?: unknown
}

export async function registrarAudit(input: AuditLogInput): Promise<void> {
  const { error } = await supabase.from('audit_logs').insert({
    empresa_id: input.empresaId,
    user_id: input.userId,
    accion: input.accion,
    tabla: input.tabla,
    registro_id: input.registroId ?? null,
    valor_anterior: input.valorAnterior ?? null,
    valor_nuevo: input.valorNuevo ?? null,
  })

  if (error) {
    console.error('Error registrando audit log:', error)
    throw error
  }
}