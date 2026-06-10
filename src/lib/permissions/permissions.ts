// CivilPowerEc — Permisos centralizados

import type { Rol, AccionPermiso } from '@/types/roles'

export const MATRIZ_PERMISOS: Record<AccionPermiso, Rol[]> = {
  crear_empresa: ['super_admin'],
  editar_empresa: ['admin'],
  invitar_usuarios: ['admin'],
  cambiar_roles: ['admin'],

  crear_proyecto: ['admin'],
  editar_proyecto: ['admin'],

  crear_presupuesto_inicial: ['admin', 'qs'],
  editar_rubros: ['qs'],
  ver_presupuesto: ['admin', 'qs', 'residente', 'oficina'],

  crear_item_aprobado: ['qs'],
  proponer_item: ['residente'],
  revisar_propuesta_item: ['qs'],

  registrar_diario: ['residente'],

  crear_pedido: ['residente', 'oficina'],
  aprobar_pedido: ['oficina'],

  crear_po: ['oficina'],
  actualizar_estado_po: ['oficina'],
  marcar_material_recibido: ['residente', 'oficina'],

  registrar_factura: ['oficina'],
  distribuir_factura: ['admin', 'qs', 'oficina'],
  clasificar_gasto_sin_clasificar: ['admin', 'qs', 'oficina'],

  registrar_asistencia: ['residente'],
  subir_foto: ['admin', 'qs', 'residente', 'oficina'],

  ver_dashboard_financiero: ['admin', 'qs', 'oficina'],

  gestionar_trial: ['super_admin'],
  cambiar_plan_empresa: ['super_admin'],
  poner_empresa_solo_lectura: ['super_admin'],
  bloquear_empresa: ['super_admin'],
}

export function can(rol: Rol, accion: AccionPermiso): boolean {
  return MATRIZ_PERMISOS[accion]?.includes(rol) ?? false
}

export function canAny(roles: Rol[], accion: AccionPermiso): boolean {
  return roles.some((rol) => can(rol, accion))
}

export function getRolesForAction(accion: AccionPermiso): Rol[] {
  return MATRIZ_PERMISOS[accion] ?? []
}

export function getActionsForRole(rol: Rol): AccionPermiso[] {
  return Object.entries(MATRIZ_PERMISOS)
    .filter(([, roles]) => roles.includes(rol))
    .map(([accion]) => accion as AccionPermiso)
}

export function puedeInvitarUsuarios(roles: Rol[]): boolean {
  return canAny(roles, 'invitar_usuarios')
}

export function puedeCrearProyecto(roles: Rol[]): boolean {
  return canAny(roles, 'crear_proyecto')
}

export function puedeVerDashboardFinanciero(roles: Rol[]): boolean {
  return canAny(roles, 'ver_dashboard_financiero')
}

export function puedeGestionarTrial(roles: Rol[]): boolean {
  return canAny(roles, 'gestionar_trial')
}