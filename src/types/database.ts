// CivilPowerEc — Tipos base compartidos

export type UUID = string

export interface BaseEntity {
  id: UUID
  created_at: string
  updated_at: string
}

export interface TenantEntity extends BaseEntity {
  empresa_id: UUID
}
