// CivilPowerEc — Auth: RegisterPage
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { RegisterForm } from '@/modules/auth/components/RegisterForm'

export function RegisterPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <h2 className="text-lg font-bold text-slate-800 mb-1">Crear cuenta</h2>
      <p className="text-sm text-slate-500 mb-6">Después de registrarte crearás tu empresa.</p>
      <RegisterForm onSuccess={() => navigate('/crear-empresa', { replace: true })} />
    </AuthLayout>
  )
}
