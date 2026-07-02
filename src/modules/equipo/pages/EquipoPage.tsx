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
  regenerarLinkInvitacion,
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
  const { empresaId, roles, loading: tenantLoading } = useTenant()

  const [miembros, setMiembros] = useState<MiembroEquipo[]>([])
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingInvitar, setLoadingInvitar] = useState(false)
  const [cancelando, setCancelando] = useState<string | null>(null)
  const [regenerando, setRegenerando] = useState<string | null>(null)
  const [linkGenerado, setLinkGenerado] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  // Verificar que el usuario es Admin
  const esAdmin = roles.some(r => can(r, 'invitar_usuarios'))

  // Guard de autorización: espera a que el tenant (empresaId + roles) esté
  // resuelto antes de decidir. No usa el loading local de datos de la página.
  useEffect(() => {
    if (tenantLoading || !empresaId) return

    if (!esAdmin) {
      navigate('/onboarding', { replace: true })
    }
  }, [tenantLoading, empresaId, esAdmin, navigate])

  // Carga de datos: solo cuando el tenant está listo y el usuario es admin.
  useEffect(() => {
    if (tenantLoading || !empresaId || !esAdmin) return

    let mounted = true

    async function cargar() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!mounted) return
        setUserId(user?.id ?? null)

        const [miembrosData, invitacionesData] = await Promise.all([
          getMiembros(empresaId!),
          getInvitacionesPendientes(empresaId!),
        ])
        if (!mounted) return
        setMiembros(miembrosData)
        setInvitaciones(invitacionesData)
      } catch {
        if (mounted) setError('Error al cargar el equipo')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    cargar()

    return () => {
      mounted = false
    }
  }, [tenantLoading, empresaId, esAdmin])

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

  async function handleRegenerarLink(id: string) {
    if (!empresaId) return
    setRegenerando(id)
    setLinkGenerado(null)
    setError('')
    const result = await regenerarLinkInvitacion(empresaId, id)
    if (!result.ok || !result.token) {
      setError(result.error ?? 'Error al regenerar link')
      setRegenerando(null)
      return
    }
    const link = buildInvitacionLink(result.token)
    setLinkGenerado(link)
    const nuevas = await getInvitacionesPendientes(empresaId)
    setInvitaciones(nuevas)
    setRegenerando(null)
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
      <div className="py-4 flex flex-col gap-6">

        <div className="flex justify-between items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Equipo</h1>
            <p className="text-xs text-slate-500 mt-1">
              {miembros.length} miembro{miembros.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => { setMostrarFormulario(f => !f); setLinkGenerado(null) }}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors flex-shrink-0"
          >
            + Invitar
          </button>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {/* Link generado */}
        {linkGenerado && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-emerald-700 mb-2">
              Invitación creada — comparte este link
            </p>
            <div className="flex gap-2 items-center">
              <code className="flex-1 text-[11px] text-slate-500 bg-white border border-slate-200 px-2 py-2 rounded-lg overflow-hidden text-ellipsis whitespace-nowrap block min-w-0">
                {linkGenerado}
              </code>
              <button
                onClick={() => copiarLink(linkGenerado)}
                className="px-3 py-2 rounded-lg text-xs font-semibold border border-slate-300 bg-white text-blue-600 hover:bg-slate-50 cursor-pointer transition-colors flex-shrink-0"
              >
                Copiar
              </button>
            </div>
          </div>
        )}

        {/* Formulario de invitación */}
        {mostrarFormulario && (
          <Card>
            <p className="text-sm font-semibold text-slate-800 mb-3">Nueva invitación</p>
            <InvitarUsuarioForm onSubmit={handleInvitar} loading={loadingInvitar} />
          </Card>
        )}

        {/* Invitaciones pendientes */}
        {invitaciones.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2.5">
              Invitaciones pendientes
            </p>
            <InvitacionesPendientes
              invitaciones={invitaciones}
              onCancelar={handleCancelar}
              cancelando={cancelando}
              onRegenerarLink={handleRegenerarLink}
              regenerando={regenerando}
            />
          </div>
        )}

        {/* Lista de miembros */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2.5">
            Miembros
          </p>
          <MiembrosList miembros={miembros} userId={userId} />
        </div>

      </div>
    </AppLayout>
  )
}
