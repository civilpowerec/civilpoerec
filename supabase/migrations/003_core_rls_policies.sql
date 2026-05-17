-- CivilPowerEc — Migración 003: Políticas RLS
-- Activa RLS y define políticas para todas las tablas core.
-- Requiere que la migración 002 ya haya sido ejecutada.

-- ─────────────────────────────────────────────
-- EMPRESAS
-- ─────────────────────────────────────────────
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

-- SELECT: solo miembros activos de la empresa
CREATE POLICY "empresas_select"
ON empresas FOR SELECT
USING (public.user_belongs_to_empresa(id));

-- INSERT: solo el propio usuario puede crear su empresa
-- (el owner_user_id debe coincidir con el usuario autenticado)
CREATE POLICY "empresas_insert"
ON empresas FOR INSERT
WITH CHECK (owner_user_id = auth.uid());

-- UPDATE: solo Admin de la empresa puede editar
CREATE POLICY "empresas_update"
ON empresas FOR UPDATE
USING (
  public.user_has_role(id, 'admin')
  AND public.empresa_can_write(id)
);

-- ─────────────────────────────────────────────
-- MIEMBROS
-- ─────────────────────────────────────────────
ALTER TABLE miembros ENABLE ROW LEVEL SECURITY;

-- SELECT: solo miembros de la misma empresa
CREATE POLICY "miembros_select"
ON miembros FOR SELECT
USING (public.user_belongs_to_empresa(empresa_id));

-- INSERT: solo Admin puede invitar nuevos miembros
-- o el propio usuario si está creando su primer registro (onboarding)
CREATE POLICY "miembros_insert"
ON miembros FOR INSERT
WITH CHECK (
  public.user_has_role(empresa_id, 'admin')
  OR user_id = auth.uid()
);

-- UPDATE: solo Admin puede cambiar estado y roles
CREATE POLICY "miembros_update"
ON miembros FOR UPDATE
USING (public.user_has_role(empresa_id, 'admin'));

-- ─────────────────────────────────────────────
-- SUSCRIPCIONES
-- ─────────────────────────────────────────────
ALTER TABLE suscripciones ENABLE ROW LEVEL SECURITY;

-- SELECT: solo miembros activos de la empresa
CREATE POLICY "suscripciones_select"
ON suscripciones FOR SELECT
USING (public.user_belongs_to_empresa(empresa_id));

-- INSERT: solo en contexto de creación de empresa (admin)
CREATE POLICY "suscripciones_insert"
ON suscripciones FOR INSERT
WITH CHECK (public.user_has_role(empresa_id, 'admin'));

-- UPDATE: bloqueado desde cliente — solo super_admin via service role
-- No se crea política UPDATE aquí. Las actualizaciones de plan se hacen desde backend.

-- ─────────────────────────────────────────────
-- CLIENTES
-- ─────────────────────────────────────────────
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clientes_select"
ON clientes FOR SELECT
USING (public.user_belongs_to_empresa(empresa_id));

CREATE POLICY "clientes_insert"
ON clientes FOR INSERT
WITH CHECK (
  public.user_belongs_to_empresa(empresa_id)
  AND public.empresa_can_write(empresa_id)
);

CREATE POLICY "clientes_update"
ON clientes FOR UPDATE
USING (
  public.user_belongs_to_empresa(empresa_id)
  AND public.empresa_can_write(empresa_id)
);

-- ─────────────────────────────────────────────
-- CONTACTOS CLIENTE
-- ─────────────────────────────────────────────
ALTER TABLE contactos_cliente ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contactos_cliente_select"
ON contactos_cliente FOR SELECT
USING (public.user_belongs_to_empresa(empresa_id));

CREATE POLICY "contactos_cliente_insert"
ON contactos_cliente FOR INSERT
WITH CHECK (
  public.user_belongs_to_empresa(empresa_id)
  AND public.empresa_can_write(empresa_id)
);

CREATE POLICY "contactos_cliente_update"
ON contactos_cliente FOR UPDATE
USING (
  public.user_belongs_to_empresa(empresa_id)
  AND public.empresa_can_write(empresa_id)
);

-- ─────────────────────────────────────────────
-- PROYECTOS
-- ─────────────────────────────────────────────
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;

-- SELECT: Admin y Oficina ven todos los proyectos de la empresa
-- Residente y QS verán solo sus proyectos via proyecto_miembros (Sprint futuro)
-- Por ahora: cualquier miembro activo puede ver proyectos de su empresa
CREATE POLICY "proyectos_select"
ON proyectos FOR SELECT
USING (public.user_belongs_to_empresa(empresa_id));

-- INSERT: solo Admin puede crear proyectos
CREATE POLICY "proyectos_insert"
ON proyectos FOR INSERT
WITH CHECK (
  public.user_has_role(empresa_id, 'admin')
  AND public.empresa_can_write(empresa_id)
);

-- UPDATE: solo Admin puede editar proyectos
CREATE POLICY "proyectos_update"
ON proyectos FOR UPDATE
USING (
  public.user_has_role(empresa_id, 'admin')
  AND public.empresa_can_write(empresa_id)
);

-- ─────────────────────────────────────────────
-- PROYECTO MIEMBROS
-- ─────────────────────────────────────────────
ALTER TABLE proyecto_miembros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "proyecto_miembros_select"
ON proyecto_miembros FOR SELECT
USING (public.user_belongs_to_empresa(empresa_id));

CREATE POLICY "proyecto_miembros_insert"
ON proyecto_miembros FOR INSERT
WITH CHECK (
  public.user_has_role(empresa_id, 'admin')
  AND public.empresa_can_write(empresa_id)
);

CREATE POLICY "proyecto_miembros_update"
ON proyecto_miembros FOR UPDATE
USING (public.user_has_role(empresa_id, 'admin'));

-- ─────────────────────────────────────────────
-- AUDIT LOGS
-- ─────────────────────────────────────────────
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- SELECT: solo Admin puede ver audit logs
CREATE POLICY "audit_logs_select"
ON audit_logs FOR SELECT
USING (public.user_has_role(empresa_id, 'admin'));

-- INSERT: cualquier miembro activo puede insertar
-- (el audit log lo genera el sistema, no el usuario directamente)
CREATE POLICY "audit_logs_insert"
ON audit_logs FOR INSERT
WITH CHECK (public.user_belongs_to_empresa(empresa_id));

-- No se permiten UPDATE ni DELETE en audit_logs desde el cliente
