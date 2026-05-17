-- CivilPowerEc — Migración 002: Funciones RLS
-- Funciones helper para Row Level Security.
-- Deben ejecutarse ANTES de las políticas RLS (migración 003).

-- ─────────────────────────────────────────────
-- FUNCIÓN: user_belongs_to_empresa
-- Verifica si el usuario autenticado es miembro activo de la empresa.
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.user_belongs_to_empresa(target_empresa_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM miembros
    WHERE miembros.empresa_id = target_empresa_id
      AND miembros.user_id = auth.uid()
      AND miembros.estado = 'activo'
  );
$$;

-- ─────────────────────────────────────────────
-- FUNCIÓN: user_has_role
-- Verifica si el usuario autenticado tiene un rol específico en la empresa.
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.user_has_role(target_empresa_id uuid, required_role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM miembros
    WHERE miembros.empresa_id = target_empresa_id
      AND miembros.user_id = auth.uid()
      AND miembros.estado = 'activo'
      AND required_role = ANY(miembros.roles)
  );
$$;

-- ─────────────────────────────────────────────
-- FUNCIÓN: empresa_can_write
-- Verifica si la empresa tiene suscripción activa o trial vigente.
-- Toda acción de escritura debe validar esta función.
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.empresa_can_write(target_empresa_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM suscripciones
    WHERE suscripciones.empresa_id = target_empresa_id
      AND suscripciones.estado IN ('trial', 'activa')
      AND (
        suscripciones.estado = 'activa'
        OR suscripciones.trial_ends_at > now()
      )
  );
$$;
