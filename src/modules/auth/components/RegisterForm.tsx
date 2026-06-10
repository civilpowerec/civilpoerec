// CivilPowerEc — Auth: RegisterForm
// Componente reutilizable — usado en RegisterPage y AceptarInvitacionPage.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FormField } from '@/components/forms/FormField'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { register } from '@/modules/auth/services/authService'

interface Props {
  onSuccess?: () => void
  mostrarLinkLogin?: boolean
}

export function RegisterForm({ onSuccess, mostrarLinkLogin = true }: Props) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await register({ nombre, email, password })
    if (!result.ok) {
      setError(result.error ?? 'Error al crear cuenta')
      setLoading(false)
      return
    }

    if (onSuccess) {
      onSuccess()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {error && <Alert variant="error">{error}</Alert>}

      <FormField label="Tu nombre" required>
        <Input
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="Juan Pérez"
          required
        />
      </FormField>

      <FormField label="Email" required>
        <Input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tu@email.com"
          autoComplete="email"
          required
        />
      </FormField>

      <FormField label="Contraseña" required hint="Mínimo 8 caracteres">
        <Input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </FormField>

      <Button type="submit" loading={loading} size="lg">
        Crear cuenta
      </Button>

      {mostrarLinkLogin && (
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#55557a' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: '#5b8def' }}>Iniciar sesión</Link>
        </p>
      )}
    </form>
  )
}
