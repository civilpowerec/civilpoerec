// CivilPowerEc — Tipos: Miembro
import type { UUID, TenantEntity } from '@/types/database'
import type { RolEmpresa } from '@/types/roles'
import type { EstadoMiembro } from '@/types/status'

export interface Miembro extends TenantEntity {
  user_id: UUID
  nombre: string | null
  email: string
  roles: RolEmpresa[]
  estado: EstadoMiembro
  es_admin_secundario: boolean
  admin_secundario_designado_at: string | null
  admin_secundario_designado_por: UUID | null
  admin_secundario_confirmado: boolean
}
