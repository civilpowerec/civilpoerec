// CivilPowerEc — Guard: requireEmpresa
// Redirige a /crear-empresa si el usuario no tiene empresa activa.

import { Navigate } from 'react-router-dom'
import { useTenant } from '@/lib/tenant/useTenant'
import { Spinner } from '@/components/ui/Spinner'

interface Props {
  children: React.ReactNode
}

export function RequireEmpresa({ children }: Props) {
  const { empresaId, loading } = useTenant()

  if (loading) return <Spinner />
  if (!empresaId) return <Navigate to="/crear-empresa" replace />
  return <>{children}</>
}
