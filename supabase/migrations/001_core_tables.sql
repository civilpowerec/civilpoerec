-- CivilPowerEc — Migración 001: Tablas core Sprint 1
-- Ejecutar DESPUÉS de eliminar manualmente tablas viejas si existen.
-- Ver MIGRATION_NOTES_SPRINT1.md antes de correr esta migración.

-- ─────────────────────────────────────────────
-- EMPRESAS
-- ─────────────────────────────────────────────
CREATE TABLE empresas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid REFERENCES auth.users(id),
  nombre text NOT NULL,
  tipo_persona text NOT NULL DEFAULT 'juridica',
  -- juridica | natural
  nombre_representante text,
  tipo_identificacion text NOT NULL DEFAULT 'ruc',
  -- ruc | cedula | pasaporte
  numero_identificacion text,
  tipo_proyectos text[] DEFAULT '{}',
  -- residencial_unifamiliar | residencial_multifamiliar | comercial
  -- institucional | industrial | infraestructura | remodelacion | otro
  telefono text NOT NULL,
  email text,
  direccion text,
  ciudad text NOT NULL,
  provincia text,
  pais text NOT NULL DEFAULT 'Ecuador',
  logo_url text,
  plan text NOT NULL DEFAULT 'trial',
  beta boolean NOT NULL DEFAULT false,
  features jsonb NOT NULL DEFAULT '{}'::jsonb,
  onboarding_status text NOT NULL DEFAULT 'empresa_creada',
  -- empresa_creada | proyecto_creado | presupuesto_configurado
  -- equipo_invitado | completado
  onboarding_completed boolean NOT NULL DEFAULT false,
  onboarding_completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- MIEMBROS
-- ─────────────────────────────────────────────
CREATE TABLE miembros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre text,
  email text NOT NULL,
  roles text[] NOT NULL DEFAULT '{}',
  estado text NOT NULL DEFAULT 'invitado',
  -- invitado | activo | inactivo
  es_admin_secundario boolean NOT NULL DEFAULT false,
  admin_secundario_designado_at timestamptz,
  admin_secundario_designado_por uuid REFERENCES auth.users(id),
  admin_secundario_confirmado boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (empresa_id, user_id)
);

-- ─────────────────────────────────────────────
-- SUSCRIPCIONES
-- ─────────────────────────────────────────────
CREATE TABLE suscripciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'trial',
  estado text NOT NULL DEFAULT 'trial',
  -- trial | activa | solo_lectura | vencida | cancelada | bloqueada
  fecha_inicio date NOT NULL DEFAULT current_date,
  fecha_fin date,
  trial_ends_at timestamptz NOT NULL DEFAULT (now() + interval '21 days'),
  proveedor_pago text,
  external_subscription_id text,
  notas_admin text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- CLIENTES
-- ─────────────────────────────────────────────
CREATE TABLE clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  tipo text NOT NULL DEFAULT 'empresa',
  -- empresa | persona_natural
  nombre text NOT NULL,
  ruc text,
  telefono_empresa text,
  email_empresa text,
  ciudad_principal text,
  notas text,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- CONTACTOS DE CLIENTE
-- ─────────────────────────────────────────────
CREATE TABLE contactos_cliente (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  cliente_id uuid NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  cargo text,
  telefono text,
  email text,
  ciudad text,
  provincia text,
  es_principal boolean NOT NULL DEFAULT false,
  notas text,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- PROYECTOS
-- ─────────────────────────────────────────────
CREATE TABLE proyectos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  cliente_id uuid REFERENCES clientes(id) ON DELETE SET NULL,
  contacto_id uuid REFERENCES contactos_cliente(id) ON DELETE SET NULL,
  nombre text NOT NULL,
  descripcion text,
  ubicacion text NOT NULL,
  ciudad text,
  provincia text,
  tipo_obra text NOT NULL,
  -- residencial_unifamiliar | residencial_multifamiliar | comercial
  -- institucional | industrial | infraestructura | remodelacion | otro
  fecha_inicio date NOT NULL,
  fecha_fin date,
  estado text NOT NULL DEFAULT 'activo',
  -- activo | pausado | finalizado | archivado
  budget_mode text NOT NULL DEFAULT 'pendiente',
  -- pendiente | completo | minimo | sin_control_saldo
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- MIEMBROS DE PROYECTO
-- ─────────────────────────────────────────────
CREATE TABLE proyecto_miembros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  proyecto_id uuid NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rol text NOT NULL,
  -- residente | qs | fiscalizador
  activo boolean NOT NULL DEFAULT true,
  asignado_por uuid REFERENCES auth.users(id),
  asignado_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (proyecto_id, user_id, rol)
);

-- ─────────────────────────────────────────────
-- AUDIT LOGS
-- ─────────────────────────────────────────────
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  accion text NOT NULL,
  tabla text NOT NULL,
  registro_id uuid,
  valor_anterior jsonb,
  valor_nuevo jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- ÍNDICES ÚTILES
-- ─────────────────────────────────────────────
CREATE INDEX idx_miembros_empresa_user ON miembros(empresa_id, user_id);
CREATE INDEX idx_miembros_user ON miembros(user_id);
CREATE INDEX idx_proyectos_empresa ON proyectos(empresa_id);
CREATE INDEX idx_proyecto_miembros_proyecto ON proyecto_miembros(proyecto_id);
CREATE INDEX idx_proyecto_miembros_user ON proyecto_miembros(user_id);
CREATE INDEX idx_audit_logs_empresa ON audit_logs(empresa_id);
CREATE INDEX idx_suscripciones_empresa ON suscripciones(empresa_id);
