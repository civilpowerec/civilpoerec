// CivilPowerEc — Onboarding: ChecklistStep

interface Props {
  numero: number
  title: string
  description: string
  completed: boolean
  disabled: boolean
  onClick: () => void
}

export function ChecklistStep({
  numero,
  title,
  description,
  completed,
  disabled,
  onClick,
}: Props) {
  const activo = !completed && !disabled

  return (
    <div
      onClick={activo ? onClick : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        borderRadius: '12px',
        border: `1px solid ${completed ? '#143a22' : activo ? '#5b8def' : '#2a2a40'}`,
        background: completed ? '#082a1a' : '#0f0f1a',
        opacity: disabled ? 0.5 : 1,
        cursor: activo ? 'pointer' : 'default',
      }}
    >
      {/* Círculo */}
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontWeight: 700,
        fontSize: '14px',
        background: completed ? '#2ecc8a' : activo ? '#5b8def' : '#1e1e2e',
        color: completed ? '#07070f' : activo ? '#ffffff' : '#55557a',
      }}>
        {completed ? '✓' : numero}
      </div>

      {/* Texto */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontSize: '14px',
          fontWeight: 600,
          color: completed ? '#2ecc8a' : activo ? '#eeeeff' : '#55557a',
          lineHeight: 1.3,
        }}>
          {title}
        </p>
        <p style={{
          margin: '4px 0 0',
          fontSize: '12px',
          color: '#9090b0',
          lineHeight: 1.4,
        }}>
          {description}
        </p>
      </div>

      {/* Badge derecho */}
      {disabled && !completed && (
        <span style={{
          fontSize: '9px',
          fontWeight: 700,
          color: '#55557a',
          background: '#1e1e2e',
          padding: '4px 8px',
          borderRadius: '20px',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}>
          PRÓXIMAMENTE
        </span>
      )}
      {activo && (
        <span style={{ color: '#5b8def', fontSize: '20px', flexShrink: 0, lineHeight: 1 }}>
          ›
        </span>
      )}
    </div>
  )
}
