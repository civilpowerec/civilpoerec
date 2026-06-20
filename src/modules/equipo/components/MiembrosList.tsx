// CivilPowerEc — Equipo: MiembrosList
import { MiembroCard } from './MiembroCard'
import type { MiembroEquipo } from '@/types/equipo'

interface Props {
  miembros: MiembroEquipo[]
  userId: string | null
}

export function MiembrosList({ miembros, userId }: Props) {
  if (miembros.length === 0) {
    return (
      <p className="text-sm text-slate-400 text-center py-4">
        Sin miembros registrados
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {miembros.map(m => (
        <MiembroCard key={m.id} miembro={m} esYo={m.user_id === userId} />
      ))}
    </div>
  )
}
