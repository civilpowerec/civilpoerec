// CivilPowerEc — Equipo: MiembroCard
import { ROL_LABELS } from '@/types/roles'
import type { MiembroEquipo } from '@/types/equipo'

interface Props {
  miembro: MiembroEquipo
  esYo?: boolean
}

const ESTADO_COLORS = {
  activo:   { bg: '#082a1a', border: '#143a22', text: '#2ecc8a', label: 'Activo' },
  invitado: { bg: '#2a1f00', border: '#5a3a00', text: '#f5c518', label: 'Invitado' },
  inactivo: { bg: '#1e1e2e', border: '#2a2a40', text: '#55557a', label: 'Inactivo' },
}

export function MiembroCard({ miembro, esYo }: Props) {
  const estadoStyle = ESTADO_COLORS[miembro.estado] ?? ESTADO_COLORS.inactivo
  const iniciales = (miembro.nombre ?? miembro.email)
    .split(' ')
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div style={{
      background: '#0f0f1a',
      border: '1px solid #2a2a40',
      borderRadius: '10px',
      padding: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    }}>
      {/* Avatar */}
      <div style={{
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        background: '#1a2a4a',
        border: '1px solid #2a3a5a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: 700,
        color: '#5b8def',
        flexShrink: 0,
      }}>
        {iniciales || '?'}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#eeeeff' }}>
            {miembro.nombre ?? 'Sin nombre'}
          </p>
          {esYo && (
            <span style={{ fontSize: '9px', color: '#9090b0', background: '#1e1e2e', padding: '2px 6px', borderRadius: '20px' }}>
              Tú
            </span>
          )}
        </div>
        <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#9090b0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {miembro.email}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
          {miembro.roles.map(rol => (
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
      </div>

      {/* Estado */}
      <span style={{
        fontSize: '10px',
        fontWeight: 700,
        color: estadoStyle.text,
        background: estadoStyle.bg,
        border: `1px solid ${estadoStyle.border}`,
        padding: '3px 8px',
        borderRadius: '20px',
        flexShrink: 0,
      }}>
        {estadoStyle.label}
      </span>
    </div>
  )
}
