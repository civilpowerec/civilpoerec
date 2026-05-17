// CivilPowerEc — Proyecto Service
// Gestiona la creación y consulta de proyectos.

import { supabase } from '@/lib/supabase/client'
import { registrarAudit } from '@/lib/audit/audit'
import type { CrearProyectoInput, Proyecto } from '@/types/proyecto'
import type { UUID } from '@/types/database'

export interface CrearProyectoResult {
  ok: boolean
  proyectoId?: UUID
  error?: string
}

// Crea un proyecto dentro de una empresa
export async function crearProyecto(
  empresaId: UUID,
  input: CrearProyectoInput
): Promise<CrearProyectoResult> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Usuario no autenticado' }

  const { data: proyecto, error } = await supabase
    .from('proyectos')
    .insert({
      empresa_id: empresaId,
      cliente_id: input.cliente_id ?? null,
      contacto_id: input.contacto_id ?? null,
      nombre: input.nombre,
      descripcion: input.descripcion ?? null,
      ubicacion: input.ubicacion,
      ciudad: input.ciudad ?? null,
      provincia: input.provincia ?? null,
      tipo_obra: input.tipo_obra,
      fecha_inicio: input.fecha_inicio,
      fecha_fin: input.fecha_fin ?? null,
      estado: 'activo',
      budget_mode: 'pendiente',
    })
    .select('id')
    .single()

  if (error || !proyecto) {
    return { ok: false, error: error?.message ?? 'Error al crear proyecto' }
  }

  await registrarAudit({
    empresaId,
    accion: 'crear_proyecto',
    tabla: 'proyectos',
    registroId: proyecto.id,
    valorNuevo: { nombre: input.nombre, tipo_obra: input.tipo_obra },
  })

  return { ok: true, proyectoId: proyecto.id }
}

// Verifica si la empresa tiene al menos un proyecto activo
export async function tieneProyectoActivo(empresaId: UUID): Promise<boolean> {
  const { count } = await supabase
    .from('proyectos')
    .select('id', { count: 'exact', head: true })
    .eq('empresa_id', empresaId)
    .eq('estado', 'activo')

  return (count ?? 0) > 0
}

// Obtiene todos los proyectos activos de una empresa
export async function getProyectosActivos(empresaId: UUID): Promise<Proyecto[]> {
  const { data } = await supabase
    .from('proyectos')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('estado', 'activo')
    .order('created_at', { ascending: false })

  return (data ?? []) as Proyecto[]
}
