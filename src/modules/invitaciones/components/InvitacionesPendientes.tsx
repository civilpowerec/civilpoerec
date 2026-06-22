// CivilPowerEc — Invitaciones: InvitacionesPendientes
import { ROL_LABELS } from '@/types/roles'
import { Button } from '@/components/ui/Button'
import type { Invitacion } from '@/types/invitacion'
import { buildInvitacionLink } from '@/modules/invitaciones/services/invitacionService'

interface Props {
  invitaciones: Invitacion[]
  onCancelar: (id: string) => void
  cancelando: string | null
  onRegenerarLink: (id: string) => Promise<void>
  regenerando: string | null
}

export function InvitacionesPendientes({ invitaciones, onCancelar, cancelando, onRegenerarLink, regenerando }: Props) {
  if (invitaciones.length === 0) {
    return (
      <p className="text-sm text-slate-400 text-center py-4">
        Sin invitaciones pendientes
      </p>
    )
  }

  async function copiarLink(token: string) {
    const link = buildInvitacionLink(token)
    await navigator.clipboard.writeText(link)
  }

  function formatExpira(fechaStr: string) {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString('es-EC', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  return (
    <div className="flex flex-col gap-2.5">
      {invitaciones.map(inv => (
        <div
          key={inv.id}
          className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col gap-2 shadow-sm"
        >
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {inv.nombre ?? inv.email ?? 'Sin nombre'}
              </p>
              {inv.email && inv.nombre && (
                <p className="text-xs text-slate-500 mt-0.5 truncate">{inv.email}</p>
              )}
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full flex-shrink-0">
              PENDIENTE
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {inv.roles.map(rol => (
              <span key={rol} className="text-[10px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                {ROL_LABELS[rol] ?? rol}
              </span>
            ))}
          </div>

          <p className="text-[10px] text-slate-400">
            Expira: {formatExpira(inv.expires_at)}
          </p>

          <div className="flex gap-2 mt-1">
            <button
              onClick={() => copiarLink(inv.token)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold border border-slate-300 bg-white text-blue-600 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              Copiar link
            </button>
            <button
              onClick={() => onRegenerarLink(inv.id)}
              disabled={regenerando === inv.id}
              className="flex-1 py-2 rounded-lg text-xs font-semibold border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {regenerando === inv.id ? 'Regenerando…' : 'Regenerar link'}
            </button>
            <Button
              variant="danger"
              size="sm"
              loading={cancelando === inv.id}
              onClick={() => onCancelar(inv.id)}
              style={{ flex: 1 }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
