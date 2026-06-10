// CivilPowerEc — Auth: LoginForm
// Componente reutilizable — usado en LoginPage y AceptarInvitacionPage.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FormField } from '@/components/forms/FormField'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { login } from '@/modules/auth/services/authService'

interface Props {
  // Si onSuccess está presente, no redirige — delega al padre
  onSuccess?: () => void
  mostrarLinkRegistro?: boolean
}

export function LoginForm({ onSuccess, mostrarLinkRegistro = true }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    if (!result.ok) {
      setError(result.error ?? 'Error al iniciar sesión')
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

      <FormField label="Contraseña" required>
        <Input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </FormField>

      <Button type="submit" loading={loading} size="lg">
        Iniciar sesión
      </Button>

      {mostrarLinkRegistro && (
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#55557a' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={{ color: '#5b8def' }}>Crear empresa nueva</Link>
        </p>
      )}
    </form>
  )
}
