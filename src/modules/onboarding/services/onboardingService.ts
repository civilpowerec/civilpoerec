// CivilPowerEc — Onboarding Service
// Consultas Supabase relacionadas con el estado del onboarding.
// La lógica pura del checklist vive en src/lib/onboarding/onboarding.ts
// Este archivo es el único lugar donde se consulta Supabase para onboarding.

import { supabase } from '@/lib/supabase/client'
import type { UUID } from '@/types/database'
import type { OnboardingStatus } from '@/types/onboarding'

// Actualiza el estado del onboarding en la empresa
export async function actualizarOnboardingStatus(
  empresaId: UUID,
  status: OnboardingStatus
): Promise<void> {
  const completado = status === 'completo'

  const { error } = await supabase
    .from('empresas')
    .update({
      onboarding_status: status,
      onboarding_completed: completado,
      onboarding_completed_at: completado ? new Date().toISOString() : null,
    })
    .eq('id', empresaId)

  if (error) throw error
}

// Obtiene el estado actual del onboarding
export async function getOnboardingStatus(
  empresaId: UUID
): Promise<OnboardingStatus | null> {
  const { data, error } = await supabase
    .from('empresas')
    .select('onboarding_status')
    .eq('id', empresaId)
    .single()

  if (error) throw error
  return (data?.onboarding_status as OnboardingStatus) ?? null
}

// Verifica si la empresa tiene al menos un proyecto activo.
// Usada por OnboardingPage para saber si el paso create_project está completado.
export async function empresaTieneProyectoActivo(empresaId: UUID): Promise<boolean> {
  const { count, error } = await supabase
    .from('proyectos')
    .select('id', { count: 'exact', head: true })
    .eq('empresa_id', empresaId)
    .eq('estado', 'activo')
    .limit(1)

  if (error) return false
  return (count ?? 0) > 0
}