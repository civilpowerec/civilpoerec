// CivilPowerEc — Tipos: Equipo
import type { UUID } from '@/types/database'
import type { RolEmpresa } from '@/types/roles'

export interface MiembroEquipo {
  id: UUID
  empresa_id: UUID
  user_id: UUID
  nombre: string | null
  email: string
  roles: RolEmpresa[]
  estado: 'invitado' | 'activo' | 'inactivo'
  created_at: string
}
