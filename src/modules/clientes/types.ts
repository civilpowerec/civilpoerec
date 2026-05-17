// CivilPowerEc — Tipos: Clientes
import type { UUID, TenantEntity } from '@/types/database'

export type TipoCliente = 'empresa' | 'persona_natural'

export interface Cliente extends TenantEntity {
  tipo: TipoCliente
  nombre: string
  ruc: string | null
  telefono_empresa: string | null
  email_empresa: string | null
  ciudad_principal: string | null
  notas: string | null
  activo: boolean
}

export interface ContactoCliente {
  id: UUID
  empresa_id: UUID
  cliente_id: UUID
  nombre: string
  cargo: string | null
  telefono: string | null
  email: string | null
  ciudad: string | null
  provincia: string | null
  es_principal: boolean
  notas: string | null
  activo: boolean
  created_at: string
  updated_at: string
}
