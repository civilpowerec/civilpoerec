// CivilPowerEc — Proyectos: CrearProyectoPage
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { CrearProyectoForm } from '@/modules/proyectos/components/CrearProyectoForm'
import { crearProyecto } from '@/modules/proyectos/services/proyectoService'
import { actualizarOnboardingStatus } from '@/modules/onboarding/services/onboardingService'
import { useTenant } from '@/lib/tenant/useTenant'
import type { CrearProyectoInput } from '@/types/proyecto'

export function CrearProyectoPage() {
  const navigate = useNavigate()
  const { empresaId } = useTenant()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCrear(input: CrearProyectoInput) {
    if (!empresaId) return
    setError('')
    setLoading(true)

    const result = await crearProyecto(empresaId, input)
    if (!result.ok) {
      setError(result.error ?? 'Error al crear proyecto')
      setLoading(false)
      return
    }

    // Actualizar estado de onboarding
    await actualizarOnboardingStatus(empresaId, 'proyecto_creado')

    // Redirigir al onboarding con checklist actualizado
    navigate('/onboarding', { replace: true })
  }

  return (
    <AppLayout title="Nuevo proyecto">
      <div className="py-4">
        <button
          onClick={() => navigate('/onboarding')}
          className="flex items-center gap-1 text-xs text-[#9090b0] hover:text-[#eeeeff] mb-4 transition-colors"
        >
          ← Volver
        </button>

        <h1 className="text-xl font-bold text-[#eeeeff] mb-1">Crear primer proyecto</h1>
        <p className="text-xs text-[#9090b0] mb-5">
          Podrás agregar más detalles (cliente, presupuesto) después.
        </p>

        {error && <Alert variant="error" className="mb-4">{error}</Alert>}

        <Card>
          <CrearProyectoForm onSubmit={handleCrear} loading={loading} />
        </Card>
      </div>
    </AppLayout>
  )
}
