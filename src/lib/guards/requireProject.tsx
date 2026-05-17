// CivilPowerEc — Guard: requireProject
// Redirige a /onboarding si la empresa no tiene proyecto activo.
// Aplicar a todos los módulos operativos: diario, pedidos, presupuesto, etc.

import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useTenant } from '@/lib/tenant/useTenant'
import { tieneProyectoActivo } from '@/modules/proyectos/services/proyectoService'
import { Spinner } from '@/components/ui/Spinner'

interface Props {
  children: React.ReactNode
}

export function RequireProject({ children }: Props) {
  const { empresaId, loading: tenantLoading } = useTenant()
  const [checking, setChecking] = useState(true)
  const [tieneProyecto, setTieneProyecto] = useState(false)

  useEffect(() => {
    if (!empresaId || tenantLoading) return

    tieneProyectoActivo(empresaId).then(tiene => {
      setTieneProyecto(tiene)
      setChecking(false)
    })
  }, [empresaId, tenantLoading])

  if (tenantLoading || checking) return <Spinner />
  if (!tieneProyecto) return <Navigate to="/onboarding" replace />
  return <>{children}</>
}
