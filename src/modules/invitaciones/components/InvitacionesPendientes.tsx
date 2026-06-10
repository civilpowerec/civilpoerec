// CivilPowerEc — Invitaciones: InvitacionesPendientes
import { ROL_LABELS } from '@/types/roles'
import { Button } from '@/components/ui/Button'
import type { Invitacion } from '@/types/invitacion'
import { buildInvitacionLink } from '@/modules/invitaciones/services/invitacionService'

interface Props {
  invitaciones: Invitacion[]
  onCancelar: (id: string) => void
  cancelando: string | null
}

export function InvitacionesPendientes({ invitaciones, onCancelar, cancelando }: Props) {
  if (invitaciones.length === 0) {
    return (
      <p style={{ fontSize: '13px', color: '#55557a', textAlign: 'center', padding: '16px 0' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {invitaciones.map(inv => (
        <div
          key={inv.id}
          style={{
            background: '#0f0f1a',
            border: '1px solid #2a2a40',
            borderRadius: '10px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#eeeeff' }}>
                {inv.nombre ?? inv.email ?? 'Sin nombre'}
              </p>
              {inv.email && inv.nombre && (
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#9090b0' }}>{inv.email}</p>
              )}
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#f5c518',
              background: '#2a1f00',
              padding: '3px 8px',
              borderRadius: '20px',
            }}>
              PENDIENTE
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {inv.roles.map(rol => (
              <span key={rol} style={{
                fontSize: '10px',
                color: '#5b8def',
                background: '#0a1a35',
                border: '1px solid #1a3050',
                padding: '2px 8px',
                borderRadius: '20px',
              }}>
                {ROL_LABELS[rol] ?? rol}
              </span>
            ))}
          </div>

          <p style={{ margin: 0, fontSize: '10px', color: '#55557a' }}>
            Expira: {formatExpira(inv.expires_at)}
          </p>

          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <button
              onClick={() => copiarLink(inv.token)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid #2a2a40',
                background: '#161623',
                color: '#5b8def',
                cursor: 'pointer',
              }}
            >
              📋 Copiar link
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
