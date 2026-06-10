// CivilPowerEc — Invitaciones: AceptarInvitacionPage
// Ruta pública /invitacion/:token
// Usa RPC get_invitation_by_token — no SELECT directo a la tabla.
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { LoginForm } from '@/modules/auth/components/LoginForm'
import { RegisterForm } from '@/modules/auth/components/RegisterForm'
import { getInvitacionPorToken, aceptarInvitacion } from '@/modules/invitaciones/services/invitacionService'
import { useTenant } from '@/lib/tenant/useTenant'
import { supabase } from '@/lib/supabase/client'
import type { RolEmpresa } from '@/types/roles'
import type { UUID } from '@/types/database'

type Vista = 'login' | 'register'

// Datos mínimos de la invitación que necesita la pantalla
interface InvitacionVista {
  id: UUID
  empresa_id: UUID
  nombre: string | null
  email: string | null
  roles: RolEmpresa[]
}

const MENSAJES_ERROR: Record<string, string> = {
  token_invalido: 'Este link de invitación no es válido.',
  aceptada:       'Esta invitación ya fue aceptada.',
  cancelada:      'Esta invitación fue cancelada por el administrador.',
  expirada:       'Este link ha expirado. Pide uno nuevo al administrador.',
  no_autorizado:  'No tienes autorización para aceptar esta invitación.',
  error_interno:  'Ocurrió un error. Intenta de nuevo.',
}

export function AceptarInvitacionPage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { setEmpresaActiva } = useTenant()

  const [invitacion, setInvitacion] = useState<InvitacionVista | null>(null)
  const [estadoError, setEstadoError] = useState<string | null>(null)
  const [autenticado, setAutenticado] = useState(false)
  const [loading, setLoading] = useState(true)
  const [aceptando, setAceptando] = useState(false)
  const [vista, setVista] = useState<Vista>('login')

  useEffect(() => {
    if (!token) {
      setEstadoError('token_invalido')
      setLoading(false)
      return
    }

    async function inicializar() {
      // Verificar sesión actual
      const { data: { session } } = await supabase.auth.getSession()
      setAutenticado(!!session)

      // Buscar invitación via RPC — no SELECT directo
      const resultado = await getInvitacionPorToken(token!)

      if (!resultado.ok) {
        setEstadoError(resultado.error ?? 'token_invalido')
        setLoading(false)
        return
      }

      setInvitacion({
        id:         resultado.id!,
        empresa_id: resultado.empresa_id!,
        nombre:     resultado.nombre ?? null,
        email:      resultado.email ?? null,
        roles:      (resultado.roles ?? []) as RolEmpresa[],
      })
      setLoading(false)
    }

    inicializar()
  }, [token])

  // Si ya está autenticado y la invitación es válida, aceptar
  useEffect(() => {
    if (autenticado && invitacion && !aceptando) {
      handleAceptar()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autenticado, invitacion])

  async function handleAceptar() {
    if (!token || !invitacion) return
    setAceptando(true)

    const result = await aceptarInvitacion(token)

    if (!result.ok) {
      setEstadoError(result.error ?? 'error_interno')
      setAceptando(false)
      return
    }

    // Actualizar tenant con empresa y roles del invitado
    setEmpresaActiva(result.empresa_id!, result.roles as RolEmpresa[])

    // Si tiene múltiples roles → selector, si no → onboarding
    if ((result.roles?.length ?? 0) > 1) {
      navigate('/seleccionar-rol', { replace: true })
    } else {
      navigate('/onboarding', { replace: true })
    }
  }

  function handleAuthSuccess() {
    setAutenticado(true)
    // El useEffect de arriba dispara handleAceptar
  }

  if (loading) return <Spinner />

  if (estadoError) {
    return (
      <AuthLayout>
        <Alert variant="error">
          {MENSAJES_ERROR[estadoError] ?? MENSAJES_ERROR.error_interno}
        </Alert>
      </AuthLayout>
    )
  }

  if (aceptando) {
    return (
      <AuthLayout>
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Spinner />
          <p style={{ color: '#9090b0', marginTop: '12px', fontSize: '13px' }}>
            Aceptando invitación...
          </p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#eeeeff' }}>
          Te invitaron a unirte
        </p>
        {invitacion?.nombre && (
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#9090b0' }}>
            Como: {invitacion.nombre}
          </p>
        )}
      </div>

      {/* Tabs login/register */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#161623', borderRadius: '10px', padding: '4px' }}>
        {(['login', 'register'] as Vista[]).map(v => (
          <button
            key={v}
            onClick={() => setVista(v)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              background: vista === v ? '#0f0f1a' : 'transparent',
              color: vista === v ? '#eeeeff' : '#9090b0',
              cursor: 'pointer',
            }}
          >
            {v === 'login' ? 'Ya tengo cuenta' : 'Crear cuenta'}
          </button>
        ))}
      </div>

      {vista === 'login'
        ? <LoginForm onSuccess={handleAuthSuccess} mostrarLinkRegistro={false} />
        : <RegisterForm onSuccess={handleAuthSuccess} mostrarLinkLogin={false} />
      }
    </AuthLayout>
  )
}
