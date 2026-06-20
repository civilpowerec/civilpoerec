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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
        <div className="flex flex-wrap gap-2 mt-1">
          {ROLES_DISPONIBLES.map(rol => (
            <button
              key={rol}
              type="button"
              onClick={() => toggleRol(rol)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${roles.includes(rol) ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-300 bg-white text-slate-500 hover:border-slate-400'}`}
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
