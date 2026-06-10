-- CivilPowerEc — Migración 005: Corrección de miembros_insert RLS
-- Fecha: 2026-06-11
--
-- PROBLEMA CORREGIDO:
-- La política original contenía la condición abierta:
--   OR user_id = auth.uid()
-- Esto permitía que cualquier usuario autenticado se insertara como
-- miembro de cualquier empresa con roles arbitrarios, rompiendo el
-- aislamiento multi-tenant.
--
-- SOLUCIÓN:
-- La excepción de bootstrap queda acotada por cuatro condiciones
-- simultáneas que garantizan que solo el owner de la empresa puede
-- usarla, únicamente para crearse a sí mismo como primer Admin activo.
--
-- NOTA: accept_invitation (migración 004) es SECURITY DEFINER y opera
-- directamente en miembros sin pasar por esta política — no se ve
-- afectada por este cambio.

-- ─────────────────────────────────────────────
-- 1. Eliminar la política vulnerable
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "miembros_insert" ON public.miembros;

-- ─────────────────────────────────────────────
-- 2. Recrear la política con excepción acotada
-- ─────────────────────────────────────────────
CREATE POLICY "miembros_insert"
ON public.miembros FOR INSERT
WITH CHECK (
  -- Caso 1: Admin activo de la empresa gestionando su propio equipo.
  public.user_has_role(empresa_id, 'admin')

  OR

  -- Caso 2: Bootstrap inicial del owner durante onboarding.
  -- La excepción es válida únicamente cuando se cumplen las cuatro
  -- condiciones simultáneamente. No puede reutilizarse para obtener
  -- acceso a empresas ajenas ni para autoasignarse roles arbitrarios.
  (
    -- 2a. El usuario se inserta a sí mismo (no a otra persona).
    user_id = auth.uid()

    -- 2b. El único rol permitido en este bootstrap es 'admin'.
    -- Cualquier combinación distinta queda bloqueada.
    AND roles = ARRAY['admin']::text[]

    -- 2c. El estado debe ser 'activo' exactamente.
    AND estado = 'activo'

    -- 2d. La empresa a la que se une es propiedad del usuario autenticado.
    -- Impide el cross-tenant: no se puede usar esta excepción para
    -- entrar a una empresa que el usuario no creó.
    AND EXISTS (
      SELECT 1
      FROM public.empresas
      WHERE public.empresas.id = empresa_id
        AND public.empresas.owner_user_id = auth.uid()
    )
  )
);
