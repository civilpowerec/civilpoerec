// CivilPowerEc — Tipos: Onboarding

export type TipoPersona = 'natural' | 'juridica'

export type TipoIdentificacion = 'ruc' | 'cedula' | 'pasaporte'

export type TipoProyecto =
  | 'residencial_unifamiliar'
  | 'residencial_multifamiliar'
  | 'comercial'
  | 'institucional'
  | 'industrial'
  | 'infraestructura'
  | 'remodelacion'
  | 'otro'

export type OnboardingStatus =
  | 'empresa_creada'
  | 'proyecto_creado'
  | 'presupuesto_elegido'
  | 'presupuesto_creado'
  | 'equipo_invitado'
  | 'completo'

export type OnboardingStep =
  | 'create_project'
  | 'choose_budget_mode'
  | 'invite_team'
  | 'create_first_operation'
  | 'complete'

export interface OnboardingCompanyState {
  hasEmpresa: boolean
  hasActiveProject: boolean
  hasChosenBudgetMode: boolean
  hasBudget: boolean
  hasInvitedTeam: boolean
  hasFirstOperation: boolean
}

export interface OnboardingChecklistStep {
  id: OnboardingStep
  title: string
  description: string
  completed: boolean
  disabled: boolean
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  'create_project',
  'choose_budget_mode',
  'invite_team',
  'create_first_operation',
  'complete',
]