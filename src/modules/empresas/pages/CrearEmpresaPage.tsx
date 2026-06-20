// CivilPowerEc — Empresas: CrearEmpresaPage
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { CrearEmpresaForm } from '@/modules/empresas/components/CrearEmpresaForm'
import { crearEmpresa } from '@/modules/empresas/services/empresaService'
import { getUsuarioActual } from '@/modules/auth/services/authService'
import { useTenant } from '@/lib/tenant/useTenant'
import type { CrearEmpresaInput } from '@/types/empresa'
import type { RolEmpresa } from '@/types/roles'

export function CrearEmpresaPage() {
  const navigate = useNavigate()
  const { setEmpresaActiva } = useTenant()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCrear(input: CrearEmpresaInput) {
    setError('')
    setLoading(true)

    const user = await getUsuarioActual()
    if (!user) {
      setError('Sesión expirada. Vuelve a iniciar sesión.')
      setLoading(false)
      return
    }

    const result = await crearEmpresa(
      input,
      user.user_metadata?.nombre ?? '',
      user.email ?? ''
    )

    if (!result.ok || !result.empresaId) {
      setError(result.error ?? 'Error al crear empresa')
      setLoading(false)
      return
    }

    setEmpresaActiva(result.empresaId, ['admin'] as RolEmpresa[])
    navigate('/onboarding', { replace: true })
  }

  return (
    <AppLayout title="Crear empresa">
      <div className="py-4">
        <h1 className="text-xl font-bold text-slate-800 mb-1">Crea tu empresa</h1>
        <p className="text-sm text-slate-500 mb-5">
          Serás el administrador de la cuenta. Podrás invitar a tu equipo después.
        </p>

        {error && <Alert variant="error" className="mb-4">{error}</Alert>}

        <Card>
          <CrearEmpresaForm onSubmit={handleCrear} loading={loading} />
        </Card>
      </div>
    </AppLayout>
  )
}
