// CivilPowerEc — Equipo: MiembroCard
import { ROL_LABELS } from '@/types/roles'
import type { MiembroEquipo } from '@/types/equipo'

interface Props {
  miembro: MiembroEquipo
  esYo?: boolean
}

const ESTADO_CLASSES = {
  activo:   { badge: 'bg-emerald-50 border border-emerald-200 text-emerald-700', label: 'Activo' },
  invitado: { badge: 'bg-amber-50 border border-amber-200 text-amber-700',       label: 'Invitado' },
  inactivo: { badge: 'bg-slate-100 border border-slate-200 text-slate-500',       label: 'Inactivo' },
}

export function MiembroCard({ miembro, esYo }: Props) {
  const estadoStyle = ESTADO_CLASSES[miembro.estado] ?? ESTADO_CLASSES.inactivo
  const iniciales = (miembro.nombre ?? miembro.email)
    .split(' ')
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-3 shadow-sm">
      <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-sm font-bold text-blue-600 flex-shrink-0">
        {iniciales || '?'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-slate-800 truncate">
            {miembro.nombre ?? 'Sin nombre'}
          </p>
          {esYo && (
            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
              Tú
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 truncate mt-0.5">
          {miembro.email}
        </p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {miembro.roles.map(rol => (
            <span key={rol} className="text-[10px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
              {ROL_LABELS[rol] ?? rol}
            </span>
          ))}
        </div>
      </div>

      <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${estadoStyle.badge}`}>
        {estadoStyle.label}
      </span>
    </div>
  )
}
