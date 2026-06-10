// CivilPowerEc — Auth: RoleSelector
import { ROL_LABELS } from '@/types/roles'
import type { RolEmpresa } from '@/types/roles'

interface Props {
  roles: RolEmpresa[]
  onSelect: (rol: RolEmpresa) => void
}

const ROL_ICONS: Record<RolEmpresa, string> = {
  admin: '⚙️',
  qs: '📊',
  residente: '🏗️',
  oficina: '📋',
}

const ROL_DESCRIPCIONES: Record<RolEmpresa, string> = {
  admin: 'Gestión completa de la empresa y el equipo',
  qs: 'Presupuesto, ítems y control de costos',
  residente: 'Diario de obra, pedidos y asistencia',
  oficina: 'Pedidos, POs, facturas y proveedores',
}

export function RoleSelector({ roles, onSelect }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {roles.map(rol => (
        <button
          key={rol}
          onClick={() => onSelect(rol)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #2a2a40',
            background: '#0f0f1a',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.15s',
            width: '100%',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#5b8def'
            ;(e.currentTarget as HTMLButtonElement).style.background = '#161623'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2a40'
            ;(e.currentTarget as HTMLButtonElement).style.background = '#0f0f1a'
          }}
        >
          <span style={{ fontSize: '28px', flexShrink: 0 }}>{ROL_ICONS[rol]}</span>
          <div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#eeeeff' }}>
              {ROL_LABELS[rol]}
            </p>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#9090b0' }}>
              {ROL_DESCRIPCIONES[rol]}
            </p>
          </div>
          <span style={{ marginLeft: 'auto', color: '#5b8def', fontSize: '20px', flexShrink: 0 }}>›</span>
        </button>
      ))}
    </div>
  )
}
