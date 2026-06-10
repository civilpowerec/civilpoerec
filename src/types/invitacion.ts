// CivilPowerEc — Tipos: Invitación
import type { UUID } from '@/types/database'
import type { RolEmpresa } from '@/types/roles'

export type EstadoInvitacion = 'pendiente' | 'aceptada' | 'expirada' | 'cancelada'

export interface Invitacion {
  id: UUID
  empresa_id: UUID
  email: string | null
  nombre: string | null
  roles: RolEmpresa[]
  token: string
  estado: EstadoInvitacion
  invitado_por: UUID | null
  expires_at: string
  accepted_by: UUID | null
  accepted_at: string | null
  created_at: string
  updated_at: string
}

export interface CrearInvitacionInput {
  email?: string
  nombre?: string
  roles: RolEmpresa[]
}

export interface AceptarInvitacionResult {
  ok: boolean
  empresa_id?: UUID
  roles?: RolEmpresa[]
  error?:
    | 'token_invalido'
    | 'aceptada'
    | 'cancelada'
    | 'expirada'
    | 'no_autorizado'
    | 'error_interno'
}
