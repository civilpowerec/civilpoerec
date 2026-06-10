-- CivilPowerEc — Migración 004: Invitaciones
-- Crea tabla invitaciones, RPC get_invitation_by_token,
-- RPC accept_invitation (con validación auth.uid) y políticas RLS.

-- ─────────────────────────────────────────────
-- TABLA INVITACIONES
-- ─────────────────────────────────────────────
CREATE TABLE invitaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  email text,
  nombre text,
  roles text[] NOT NULL DEFAULT '{}',
  token text NOT NULL UNIQUE,
  estado text NOT NULL DEFAULT 'pendiente',
  -- pendiente | aceptada | expirada | cancelada
  invitado_por uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_invitaciones_empresa ON invitaciones(empresa_id);
CREATE INDEX idx_invitaciones_token ON invitaciones(token);
CREATE INDEX idx_invitaciones_estado ON invitaciones(estado);

-- ─────────────────────────────────────────────
-- RLS — INVITACIONES
-- ─────────────────────────────────────────────
ALTER TABLE invitaciones ENABLE ROW LEVEL SECURITY;

-- SELECT: solo miembros activos de la empresa
-- El acceso público por token se hace via RPC get_invitation_by_token
CREATE POLICY "invitaciones_select"
ON invitaciones FOR SELECT
USING (public.user_belongs_to_empresa(empresa_id));

-- INSERT: solo Admin puede crear invitaciones
CREATE POLICY "invitaciones_insert"
ON invitaciones FOR INSERT
WITH CHECK (
  public.user_has_role(empresa_id, 'admin')
  AND public.empresa_can_write(empresa_id)
);

-- UPDATE: solo Admin puede cancelar — aceptación se hace via RPC
CREATE POLICY "invitaciones_update"
ON invitaciones FOR UPDATE
USING (public.user_has_role(empresa_id, 'admin'));

-- ─────────────────────────────────────────────
-- RPC: get_invitation_by_token
-- Consulta pública por token — SECURITY DEFINER para bypassear RLS.
-- El invitado todavía no es miembro, no puede hacer SELECT directo.
-- Devuelve solo datos mínimos necesarios para mostrar la pantalla.
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_invitation_by_token(p_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inv invitaciones%ROWTYPE;
BEGIN
  -- Buscar por token
  SELECT * INTO v_inv
  FROM invitaciones
  WHERE token = p_token;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'token_invalido');
  END IF;

  -- Si no está pendiente, devolver el estado como error
  IF v_inv.estado != 'pendiente' THEN
    RETURN jsonb_build_object('ok', false, 'error', v_inv.estado);
  END IF;

  -- Si expiró (pero sigue marcada como pendiente), marcar y devolver error
  IF v_inv.expires_at < now() THEN
    UPDATE invitaciones
    SET estado = 'expirada', updated_at = now()
    WHERE id = v_inv.id;

    RETURN jsonb_build_object('ok', false, 'error', 'expirada');
  END IF;

  -- Devolver solo los datos mínimos necesarios para la pantalla
  RETURN jsonb_build_object(
    'ok',         true,
    'id',         v_inv.id,
    'empresa_id', v_inv.empresa_id,
    'nombre',     v_inv.nombre,
    'email',      v_inv.email,
    'roles',      v_inv.roles,
    'estado',     v_inv.estado,
    'expires_at', v_inv.expires_at
  );
END;
$$;

-- ─────────────────────────────────────────────
-- RPC: accept_invitation
-- Operación atómica SECURITY DEFINER para aceptar una invitación.
-- SEGURIDAD: valida que p_user_id === auth.uid() dentro de SQL.
-- No confía en el user_id enviado desde el cliente.
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.accept_invitation(
  p_token text,
  p_user_id uuid,
  p_nombre text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invitacion invitaciones%ROWTYPE;
  v_miembro_existe boolean;
BEGIN
  -- 0. Validar que el caller es quien dice ser
  -- No confiar en p_user_id del cliente — verificar contra auth.uid()
  IF p_user_id IS DISTINCT FROM auth.uid() THEN
    RETURN jsonb_build_object('ok', false, 'error', 'no_autorizado');
  END IF;

  -- 1. Buscar invitación por token
  SELECT * INTO v_invitacion
  FROM invitaciones
  WHERE token = p_token;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'token_invalido');
  END IF;

  -- 2. Validar estado pendiente
  -- No aceptar cancelada, ya aceptada ni expirada
  IF v_invitacion.estado != 'pendiente' THEN
    RETURN jsonb_build_object('ok', false, 'error', v_invitacion.estado);
  END IF;

  -- 3. Validar que no haya expirado
  IF v_invitacion.expires_at < now() THEN
    UPDATE invitaciones
    SET estado = 'expirada', updated_at = now()
    WHERE id = v_invitacion.id;

    RETURN jsonb_build_object('ok', false, 'error', 'expirada');
  END IF;

  -- 4. Crear o actualizar miembro
  -- Solo en la empresa de la invitación — no puede cambiar de empresa
  SELECT EXISTS (
    SELECT 1 FROM miembros
    WHERE empresa_id = v_invitacion.empresa_id
      AND user_id = p_user_id
  ) INTO v_miembro_existe;

  IF v_miembro_existe THEN
    -- Actualizar: solo roles y estado — no permite cambiar empresa
    UPDATE miembros
    SET
      roles      = v_invitacion.roles,  -- roles exactos de la invitación
      estado     = 'activo',
      nombre     = COALESCE(p_nombre, nombre),
      email      = COALESCE(v_invitacion.email, email),
      updated_at = now()
    WHERE empresa_id = v_invitacion.empresa_id
      AND user_id    = p_user_id;
  ELSE
    -- Crear nuevo miembro con roles exactos de la invitación
    INSERT INTO miembros (
      empresa_id,
      user_id,
      nombre,
      email,
      roles,
      estado
    ) VALUES (
      v_invitacion.empresa_id,
      p_user_id,
      COALESCE(p_nombre, v_invitacion.nombre, ''),
      COALESCE(v_invitacion.email, ''),
      v_invitacion.roles,
      'activo'
    );
  END IF;

  -- 5. Marcar invitación como aceptada
  UPDATE invitaciones
  SET
    estado      = 'aceptada',
    accepted_by = p_user_id,
    accepted_at = now(),
    updated_at  = now()
  WHERE id = v_invitacion.id;

  -- 6. Audit log
  INSERT INTO audit_logs (
    empresa_id,
    user_id,
    accion,
    tabla,
    registro_id,
    valor_nuevo
  ) VALUES (
    v_invitacion.empresa_id,
    p_user_id,
    'invitar_miembro',
    'invitaciones',
    v_invitacion.id,
    jsonb_build_object(
      'roles',  v_invitacion.roles,
      'accion', 'aceptada'
    )
  );

  RETURN jsonb_build_object(
    'ok',         true,
    'empresa_id', v_invitacion.empresa_id,
    'roles',      v_invitacion.roles
  );

EXCEPTION WHEN OTHERS THEN
  -- Rollback automático — ninguna operación parcial queda aplicada
  RETURN jsonb_build_object('ok', false, 'error', 'error_interno');
END;
$$;
