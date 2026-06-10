// CivilPowerEc — Auth: RegisterPage
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { RegisterForm } from '@/modules/auth/components/RegisterForm'

export function RegisterPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 700, color: '#eeeeff' }}>
        Crear cuenta
      </h2>
      <p style={{ margin: '0 0 20px', fontSize: '12px', color: '#9090b0' }}>
        Después de registrarte crearás tu empresa.
      </p>
      <RegisterForm onSuccess={() => navigate('/crear-empresa', { replace: true })} />
    </AuthLayout>
  )
}
