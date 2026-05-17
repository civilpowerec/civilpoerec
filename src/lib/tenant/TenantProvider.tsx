// CivilPowerEc — TenantProvider
// Contexto React para la empresa activa del usuario autenticado.
// Vive en src/lib/tenant/ porque es infraestructura global, no módulo de negocio.
//
// SEPARACIÓN DE RESPONSABILIDADES:
//   tenant.ts          → lógica pura / helpers sin React
//   TenantProvider.tsx → contexto React con estado
//   useTenant.ts       → hook de acceso al contexto

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { UUID } from '@/types/database'
import type { RolEmpresa } from '@/types/roles'

interface TenantContextValue {
  empresaId: UUID | null
  roles: RolEmpresa[]
  loading: boolean
  setEmpresaActiva: (empresaId: UUID, roles: RolEmpresa[]) => void
  clearTenant: () => void
}

const TenantContext = createContext<TenantContextValue | null>(null)

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [empresaId, setEmpresaId] = useState<UUID | null>(null)
  const [roles, setRoles] = useState<RolEmpresa[]>([])
  const [loading, setLoading] = useState(true)

  // Al montar, intenta recuperar la empresa activa del usuario autenticado
  useEffect(() => {
    async function cargarTenant() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        // Obtener el primer miembro activo del usuario
        const { data: miembro } = await supabase
          .from('miembros')
          .select('empresa_id, roles')
          .eq('user_id', user.id)
          .eq('estado', 'activo')
          .order('created_at', { ascending: true })
          .limit(1)
          .single()

        if (miembro) {
          setEmpresaId(miembro.empresa_id)
          setRoles((miembro.roles ?? []) as RolEmpresa[])
        }
      } catch {
        // Usuario sin empresa todavía — es esperado en onboarding
      } finally {
        setLoading(false)
      }
    }

    cargarTenant()
  }, [])

  const setEmpresaActiva = useCallback((id: UUID, rolesUsuario: RolEmpresa[]) => {
    setEmpresaId(id)
    setRoles(rolesUsuario)
  }, [])

  const clearTenant = useCallback(() => {
    setEmpresaId(null)
    setRoles([])
  }, [])

  return (
    <TenantContext.Provider value={{ empresaId, roles, loading, setEmpresaActiva, clearTenant }}>
      {children}
    </TenantContext.Provider>
  )
}

// Export interno para useTenant.ts
export { TenantContext }
