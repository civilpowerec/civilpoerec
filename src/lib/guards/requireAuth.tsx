// CivilPowerEc — Guard: requireAuth
// Redirige a /login si el usuario no está autenticado.

import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase/client'
import { Spinner } from '@/components/ui/Spinner'

interface Props {
  children: React.ReactNode
}

export function RequireAuth({ children }: Props) {
  const [checking, setChecking] = useState(true)
  const [autenticado, setAutenticado] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAutenticado(!!session)
      setChecking(false)
    })
  }, [])

  if (checking) return <Spinner />
  if (!autenticado) return <Navigate to="/login" replace />
  return <>{children}</>
}
