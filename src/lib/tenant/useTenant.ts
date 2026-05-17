// CivilPowerEc — useTenant hook
// Acceso al contexto de empresa activa desde cualquier componente.
// Usar este hook en lugar de acceder directamente al contexto.

import { useContext } from 'react'
import { TenantContext } from '@/lib/tenant/TenantProvider'

export function useTenant() {
  const ctx = useContext(TenantContext)
  if (!ctx) {
    throw new Error('useTenant debe usarse dentro de <TenantProvider>')
  }
  return ctx
}
