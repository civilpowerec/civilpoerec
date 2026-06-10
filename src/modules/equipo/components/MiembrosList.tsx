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
      <p style={{ fontSize: '13px', color: '#55557a', textAlign: 'center', padding: '16px 0' }}>
        Sin miembros registrados
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {miembros.map(m => (
        <MiembroCard key={m.id} miembro={m} esYo={m.user_id === userId} />
      ))}
    </div>
  )
}
