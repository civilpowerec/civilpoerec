// CivilPowerEc — Onboarding: OnboardingPage

import { useEffect, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { ChecklistOnboarding } from '@/modules/onboarding/components/ChecklistOnboarding'
import { Spinner } from '@/components/ui/Spinner'
import { getChecklistOnboarding } from '@/lib/onboarding/onboarding'
import { empresaTieneProyectoActivo } from '@/modules/onboarding/services/onboardingService'
import { useTenant } from '@/lib/tenant/useTenant'
import type { OnboardingCompanyState } from '@/types/onboarding'

const DEFAULT_ONBOARDING_STATE: OnboardingCompanyState = {
  hasEmpresa: true,
  hasActiveProject: false,
  hasChosenBudgetMode: false,
  hasBudget: false,
  hasInvitedTeam: false,
  hasFirstOperation: false,
}

export function OnboardingPage() {
  const { empresaId } = useTenant()
  const [state, setState] = useState<OnboardingCompanyState>(
    DEFAULT_ONBOARDING_STATE
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function cargarEstado() {
      if (!empresaId) {
        setLoading(false)
        return
      }

      try {
        const hasActiveProject = await empresaTieneProyectoActivo(empresaId)

        if (!mounted) return

        setState({
          ...DEFAULT_ONBOARDING_STATE,
          hasActiveProject,
        })
      } catch (error) {
        console.error('Error cargando onboarding:', error)

        if (!mounted) return

        setState(DEFAULT_ONBOARDING_STATE)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    cargarEstado()

    return () => {
      mounted = false
    }
  }, [empresaId])

  if (loading) return <Spinner />

  const steps = getChecklistOnboarding(state)

  return (
    <AppLayout title="Configuración inicial">
      <div className="py-4">
        <h1 className="text-xl font-bold text-[#eeeeff] mb-1">
          Configura tu empresa
        </h1>

        <p className="text-xs text-[#9090b0] mb-5">
          Completa estos pasos para empezar a usar CivilPowerEc.
        </p>

        <ChecklistOnboarding steps={steps} />
      </div>
    </AppLayout>
  )
}