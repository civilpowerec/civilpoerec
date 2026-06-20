// CivilPowerEc — Equipo: EquipoPage
// Solo accesible para Admin. Muestra miembros e invitaciones pendientes.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { MiembrosList } from '@/modules/equipo/components/MiembrosList'
import { InvitarUsuarioForm } from '@/modules/invitaciones/components/InvitarUsuarioForm'
import { InvitacionesPendientes } from '@/modules/invitaciones/components/InvitacionesPendientes'
import { getMiembros } from '@/modules/equipo/services/equipoService'
import {
  crearInvitacion,
  cancelarInvitacion,
  getInvitacionesPendientes,
  buildInvitacionLink,
} from '@/modules/invitaciones/services/invitacionService'
import { useTenant } from '@/lib/tenant/useTenant'
import { can } from '@/lib/permissions/permissions'
import { supabase } from '@/lib/supabase/client'
import type { MiembroEquipo } from '@/types/equipo'
import type { Invitacion, CrearInvitacionInput } from '@/types/invitacion'

export function EquipoPage() {
  const navigate = useNavigate()
  const { empresaId, roles } = useTenant()

  const [miembros, setMiembros] = useState<MiembroEquipo[]>([])
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingInvitar, setLoadingInvitar] = useState(false)
  const [cancelando, setCancelando] = useState<string | null>(null)
  const [linkGenerado, setLinkGenerado] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  // Verificar que el usuario es Admin
  const esAdmin = roles.some(r => can(r, 'invitar_usuarios'))

  useEffect(() => {
    if (!empresaId) return

    // Si no es admin, redirigir
    if (!esAdmin && !loading) {
      navigate('/onboarding', { replace: true })
      return
    }

    async function cargar() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUserId(user?.id ?? null)

        const [miembrosData, invitacionesData] = await Promise.all([
          getMiembros(empresaId!),
          getInvitacionesPendientes(empresaId!),
        ])
        setMiembros(miembrosData)
        setInvitaciones(invitacionesData)
      } catch {
        setError('Error al cargar el equipo')
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [empresaId, esAdmin, loading, navigate])

  async function handleInvitar(input: CrearInvitacionInput) {
    if (!empresaId) return
    setLoadingInvitar(true)
    setLinkGenerado(null)
    setError('')

    const result = await crearInvitacion(empresaId, input)
    if (!result.ok || !result.token) {
      setError(result.error ?? 'Error al crear invitación')
      setLoadingInvitar(false)
      return
    }

    const link = buildInvitacionLink(result.token)
    setLinkGenerado(link)
    setMostrarFormulario(false)

    // Refrescar lista
    const nuevas = await getInvitacionesPendientes(empresaId)
    setInvitaciones(nuevas)
    setLoadingInvitar(false)
  }

  async function handleCancelar(id: string) {
    if (!empresaId) return
    setCancelando(id)
    await cancelarInvitacion(empresaId, id)
    const nuevas = await getInvitacionesPendientes(empresaId)
    setInvitaciones(nuevas)
    setCancelando(null)
  }

  async function copiarLink(link: string) {
    await navigator.clipboard.writeText(link)
  }

  if (loading) return <Spinner />

  if (!esAdmin) {
    return (
      <AppLayout title="Equipo">
        <Alert variant="error" style={{ marginTop: '24px' }}>
          No tienes permisos para ver esta sección.
        </Alert>
      </AppLayout>
    )
  }

  return (
    <AppLayout title="Equipo">
      <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#eeeeff' }}>
              Equipo
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#9090b0' }}>
              {miembros.length} miembro{miembros.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => { setMostrarFormulario(f => !f); setLinkGenerado(null) }}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              background: '#5b8def',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            + Invitar
          </button>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {/* Link generado */}
        {linkGenerado && (
          <div style={{
            background: '#082a1a',
            border: '1px solid #143a22',
            borderRadius: '10px',
            padding: '14px',
          }}>
            <p style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 600, color: '#2ecc8a' }}>
              ✅ Invitación creada — comparte este link
            </p>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <code style={{
                flex: 1,
                fontSize: '11px',
                color: '#9090b0',
                background: '#0f0f1a',
                padding: '8px',
                borderRadius: '6px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
              }}>
                {linkGenerado}
              </code>
              <button
                onClick={() => copiarLink(linkGenerado)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid #2a2a40',
                  background: '#161623',
                  color: '#5b8def',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                📋 Copiar
              </button>
            </div>
          </div>
        )}

        {/* Formulario de invitación */}
        {mostrarFormulario && (
          <Card>
            <p style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: 600, color: '#eeeeff' }}>
              Nueva invitación
            </p>
            <InvitarUsuarioForm onSubmit={handleInvitar} loading={loadingInvitar} />
          </Card>
        )}

        {/* Invitaciones pendientes */}
        {invitaciones.length > 0 && (
          <div>
            <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 600, color: '#9090b0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Invitaciones pendientes
            </p>
            <InvitacionesPendientes
              invitaciones={invitaciones}
              onCancelar={handleCancelar}
              cancelando={cancelando}
            />
          </div>
        )}

        {/* Lista de miembros */}
        <div>
          <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 600, color: '#9090b0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Miembros
          </p>
          <MiembrosList miembros={miembros} userId={userId} />
        </div>

      </div>
    </AppLayout>
  )
}
