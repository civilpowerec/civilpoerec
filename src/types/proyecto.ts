// CivilPowerEc — Tipos: Proyecto

import type { UUID, TenantEntity } from '@/types/database'
import type { TipoProyecto } from '@/types/onboarding'
import type { EstadoProyecto, BudgetMode } from '@/types/status'

export interface Proyecto extends TenantEntity {
  // Proyecto tiene empresa_id, pero NO tiene proyecto_id propio.
  // Su ID de proyecto es el campo id heredado de BaseEntity.
  cliente_id: UUID | null
  contacto_id: UUID | null
  nombre: string
  descripcion: string | null
  ubicacion: string
  ciudad: string | null
  provincia: string | null
  tipo_obra: TipoProyecto
  fecha_inicio: string
  fecha_fin: string | null
  estado: EstadoProyecto
  budget_mode: BudgetMode
}

export interface CrearProyectoInput {
  nombre: string
  ubicacion: string
  tipo_obra: TipoProyecto
  fecha_inicio: string
  cliente_id?: UUID
  contacto_id?: UUID
  descripcion?: string
  ciudad?: string
  provincia?: string
  fecha_fin?: string
}

export interface ProyectoMiembro extends TenantEntity {
  proyecto_id: UUID
  user_id: UUID
  rol: 'residente' | 'qs' | 'fiscalizador'
  activo: boolean
  asignado_por: UUID | null
  asignado_at: string
}