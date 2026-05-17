// CivilPowerEc — Auth: RegisterPage
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { FormField } from '@/components/forms/FormField'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { register } from '@/modules/auth/services/authService'

export function RegisterPage() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await register({ nombre, email, password })
    if (!result.ok) {
      setError(result.error ?? 'Error al crear cuenta')
      setLoading(false)
      return
    }

    navigate('/crear-empresa', { replace: true })
  }

  return (
    <AuthLayout>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-[#eeeeff] mb-1">Crear cuenta</h2>
        <p className="text-xs text-[#9090b0] -mt-2">
          Después de registrarte crearás tu empresa.
        </p>

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

        <FormField
          label="Contraseña"
          required
          hint="Mínimo 8 caracteres"
        >
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
          Continuar
        </Button>

        <p className="text-center text-xs text-[#55557a]">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-[#5b8def] hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
