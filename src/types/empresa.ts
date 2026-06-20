// CivilPowerEc — Tipos: Empresa

import type { UUID, BaseEntity } from '@/types/database'
import type {
  TipoProyecto,
  TipoPersona,
  TipoIdentificacion,
  OnboardingStatus,
} from '@/types/onboarding'

export interface Empresa extends BaseEntity {
  // Empresa NO tiene empresa_id propio porque ella misma es el tenant.
  owner_user_id: UUID
  nombre: string
  tipo_persona: TipoPersona
  nombre_representante: string | null
  tipo_identificacion: TipoIdentificacion
  numero_identificacion: string | null
  tipo_proyectos: TipoProyecto[]
  telefono: string
  email: string | null
  direccion: string | null
  ciudad: string
  provincia: string | null
  pais: string
  logo_url: string | null
  plan: string
  beta: boolean
  features: Record<string, boolean>
  onboarding_status: OnboardingStatus
  onboarding_completed: boolean
  onboarding_completed_at: string | null
}
export interface CrearEmpresaInput {
  nombre: string
  tipo_persona: TipoPersona
  nombre_representante: string | null
  tipo_identificacion: TipoIdentificacion
  numero_identificacion: string | null
  tipo_proyectos: TipoProyecto[]
  telefono: string
  email?: string | null
  direccion?: string | null
  ciudad: string
  provincia?: string | null
}

export function validarIdentificacion(
  tipo: TipoIdentificacion | string,
  numero: string
): { valido: boolean; mensaje?: string } {
  const tipoNormalizado = String(tipo).toLowerCase().trim()
  const limpio = String(numero).replace(/\D/g, '')

  if (tipoNormalizado === 'ruc') {
    if (limpio.length !== 13) {
      return { valido: false, mensaje: 'El RUC debe tener 13 dígitos' }
    }

    return { valido: true }
  }

  if (tipoNormalizado === 'cedula' || tipoNormalizado === 'cédula') {
    if (limpio.length !== 10) {
      return { valido: false, mensaje: 'La cédula debe tener 10 dígitos' }
    }

    return { valido: true }
  }

  if (tipoNormalizado === 'pasaporte') {
    const pasaporte = String(numero).trim()

    if (!/^[A-Za-z0-9]{5,20}$/.test(pasaporte)) {
      return {
        valido: false,
        mensaje: 'El pasaporte debe tener entre 5 y 20 caracteres',
      }
    }

    return { valido: true }
  }

  return { valido: false, mensaje: 'Tipo de identificación inválido' }
}