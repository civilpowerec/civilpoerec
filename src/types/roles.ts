// CivilPowerEc — Tipos: Roles y Permisos

export type RolEmpresa = 'admin' | 'qs' | 'residente' | 'oficina'

export type RolPlataforma = 'super_admin' | 'support' | 'billing_admin'

export type Rol = RolEmpresa | RolPlataforma

export type AccionPermiso =
  | 'crear_empresa'
  | 'editar_empresa'
  | 'invitar_usuarios'
  | 'cambiar_roles'
  | 'crear_proyecto'
  | 'editar_proyecto'
  | 'crear_presupuesto_inicial'
  | 'editar_rubros'
  | 'ver_presupuesto'
  | 'crear_item_aprobado'
  | 'proponer_item'
  | 'revisar_propuesta_item'
  | 'registrar_diario'
  | 'crear_pedido'
  | 'aprobar_pedido'
  | 'crear_po'
  | 'actualizar_estado_po'
  | 'marcar_material_recibido'
  | 'registrar_factura'
  | 'distribuir_factura'
  | 'clasificar_gasto_sin_clasificar'
  | 'registrar_asistencia'
  | 'subir_foto'
  | 'ver_dashboard_financiero'
  | 'gestionar_trial'
  | 'cambiar_plan_empresa'
  | 'poner_empresa_solo_lectura'
  | 'bloquear_empresa'

export const ROL_LABELS: Record<Rol, string> = {
  admin: 'Administrador',
  qs: 'Quantity Surveyor',
  residente: 'Residente de obra',
  oficina: 'Oficina',
  super_admin: 'Super Admin',
  support: 'Soporte',
  billing_admin: 'Administración de pagos',
}

export const ROLES_EMPRESA: RolEmpresa[] = [
  'admin',
  'qs',
  'residente',
  'oficina',
]

export const ROLES_PLATAFORMA: RolPlataforma[] = [
  'super_admin',
  'support',
  'billing_admin',
]