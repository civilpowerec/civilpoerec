// CivilPowerEc — Invitaciones: InvitarUsuarioForm
import { useState } from 'react'
import { FormField } from '@/components/forms/FormField'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { ROL_LABELS } from '@/types/roles'
import type { RolEmpresa } from '@/types/roles'
import type { CrearInvitacionInput } from '@/types/invitacion'

interface Props {
  onSubmit: (input: CrearInvitacionInput) => Promise<void>
  loading: boolean
}

const ROLES_DISPONIBLES: RolEmpresa[] = ['admin', 'qs', 'residente', 'oficina']

export function InvitarUsuarioForm({ onSubmit, loading }: Props) {
  const [email, setEmail] = useState('')
  const [nombre, setNombre] = useState('')
  const [roles, setRoles] = useState<RolEmpresa[]>([])
  const [error, setError] = useState('')

  function toggleRol(rol: RolEmpresa) {
    setRoles(prev =>
      prev.includes(rol) ? prev.filter(r => r !== rol) : [...prev, rol]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (roles.length === 0) {
      setError('Selecciona al menos un rol')
      return
    }

    await onSubmit({ email: email || undefined, nombre: nombre || undefined, roles })
    setEmail('')
    setNombre('')
    setRoles([])
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {error && <Alert variant="error">{error}</Alert>}

      <FormField label="Email (opcional)">
        <Input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="colaborador@empresa.com"
        />
      </FormField>

      <FormField label="Nombre (opcional)">
        <Input
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Juan Pérez"
        />
      </FormField>

      <FormField label="Roles" required>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
          {ROLES_DISPONIBLES.map(rol => (
            <button
              key={rol}
              type="button"
              onClick={() => toggleRol(rol)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                border: `1px solid ${roles.includes(rol) ? '#5b8def' : '#2a2a40'}`,
                background: roles.includes(rol) ? '#1a2a4a' : '#161623',
                color: roles.includes(rol) ? '#5b8def' : '#9090b0',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {ROL_LABELS[rol]}
            </button>
          ))}
        </div>
      </FormField>

      <Alert variant="info">
        El envío por email estará disponible próximamente. Copia el link para compartir por WhatsApp.
      </Alert>

      <Button type="submit" loading={loading}>
        Generar link de invitación
      </Button>
    </form>
  )
}
