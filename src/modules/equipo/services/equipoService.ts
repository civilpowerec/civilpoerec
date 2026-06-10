// CivilPowerEc — Equipo Service
// Consultas Supabase para gestión de miembros del equipo.

import { supabase } from '@/lib/supabase/client'
import type { UUID } from '@/types/database'
import type { MiembroEquipo } from '@/types/equipo'

// Obtiene todos los miembros de una empresa
export async function getMiembros(empresaId: UUID): Promise<MiembroEquipo[]> {
  const { data } = await supabase
    .from('miembros')
    .select('*')
    .eq('empresa_id', empresaId)
    .order('created_at', { ascending: true })

  return (data ?? []) as MiembroEquipo[]
}

// Obtiene miembros activos de una empresa
export async function getMiembrosActivos(empresaId: UUID): Promise<MiembroEquipo[]> {
  const { data } = await supabase
    .from('miembros')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('estado', 'activo')
    .order('created_at', { ascending: true })

  return (data ?? []) as MiembroEquipo[]
}
