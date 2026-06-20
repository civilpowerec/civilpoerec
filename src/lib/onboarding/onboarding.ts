// CivilPowerEc — Helpers puros de onboarding

import type {
  OnboardingStep,
  OnboardingCompanyState,
  OnboardingChecklistStep,
} from '@/types/onboarding'

export function getNextOnboardingStep(
  company: OnboardingCompanyState
): OnboardingStep {
  if (!company.hasActiveProject) {
    return 'create_project'
  }

  if (!company.hasChosenBudgetMode) {
    return 'choose_budget_mode'
  }

  if (!company.hasInvitedTeam) {
    return 'invite_team'
  }

  if (!company.hasFirstOperation) {
    return 'create_first_operation'
  }

  return 'complete'
}

export function isOnboardingComplete(company: OnboardingCompanyState): boolean {
  return getNextOnboardingStep(company) === 'complete'
}

export function canAccessOperationalModules(
  company: OnboardingCompanyState
): boolean {
  return company.hasActiveProject
}

export function getChecklistOnboarding(
  company: OnboardingCompanyState
): OnboardingChecklistStep[] {
  return [
    {
      id: 'create_project',
      title: 'Crear primer proyecto',
      description: 'Crea tu primera obra para empezar a trabajar.',
      completed: company.hasActiveProject,
      disabled: false,
    },
    {
      id: 'choose_budget_mode',
      title: 'Elegir modo de presupuesto',
      description:
        'Define si usarás presupuesto completo, mínimo o sin control de saldo.',
      completed: company.hasChosenBudgetMode,
      disabled: !company.hasActiveProject,
    },
    {
      id: 'invite_team',
      title: 'Invitar equipo',
      description: 'Invita residente, oficina o QS cuando estés listo.',
      completed: company.hasInvitedTeam,
      disabled: !company.hasActiveProject,
    },
    {
      id: 'create_first_operation',
      title: 'Crear primer pedido o registro de diario',
      description: 'Empieza a registrar actividad real del proyecto.',
      completed: company.hasFirstOperation,
      disabled: !company.hasActiveProject,
    },
  ]
}