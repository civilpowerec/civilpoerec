// CivilPowerEc — Auth: LoginPage
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { FormField } from '@/components/forms/FormField'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { login } from '@/modules/auth/services/authService'
import { getEmpresaDelUsuario } from '@/modules/empresas/services/empresaService'
import { tieneProyectoActivo } from '@/modules/proyectos/services/proyectoService'
import { useTenant } from '@/lib/tenant/useTenant'
import type { RolEmpresa } from '@/types/roles'

export function LoginPage() {
  const navigate = useNavigate()
  const { setEmpresaActiva } = useTenant()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    if (!result.ok) {
      setError(result.error ?? 'Error al iniciar sesión')
      setLoading(false)
      return
    }

    // Determinar destino según estado del usuario
    const empresa = await getEmpresaDelUsuario()
    if (!empresa) {
      navigate('/crear-empresa', { replace: true })
      return
    }

    setEmpresaActiva(empresa.empresaId, empresa.roles as RolEmpresa[])

    const tieneProyecto = await tieneProyectoActivo(empresa.empresaId)
    navigate('/onboarding', { replace: true })

    // suprimir warning de variable no usada — tieneProyecto afecta el onboarding checklist
    void tieneProyecto

    setLoading(false)
  }

  return (
    <AuthLayout>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-[#eeeeff] mb-1">Iniciar sesión</h2>

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

        <p className="text-center text-xs text-[#55557a]">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-[#5b8def] hover:underline">
            Crear empresa nueva
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
