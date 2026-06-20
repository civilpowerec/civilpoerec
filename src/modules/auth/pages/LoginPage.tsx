// CivilPowerEc — Auth: LoginPage
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { LoginForm } from '@/modules/auth/components/LoginForm'
import { getEmpresaDelUsuario } from '@/modules/empresas/services/empresaService'
import { useTenant } from '@/lib/tenant/useTenant'
import type { RolEmpresa } from '@/types/roles'
import { ROL_ACTIVO_KEY } from '@/modules/auth/pages/SeleccionarRolPage'

export function LoginPage() {
  const navigate = useNavigate()
  const { setEmpresaActiva } = useTenant()

  async function handleSuccess() {
    const empresa = await getEmpresaDelUsuario()
    if (!empresa) {
      navigate('/crear-empresa', { replace: true })
      return
    }

    setEmpresaActiva(empresa.empresaId, empresa.roles as RolEmpresa[])

    if (empresa.roles.length > 1) {
      navigate('/seleccionar-rol', { replace: true })
      return
    }

    if (empresa.roles.length === 1) {
      sessionStorage.setItem(ROL_ACTIVO_KEY, empresa.roles[0])
    }

    navigate('/onboarding', { replace: true })
  }

  return (
    <AuthLayout>
      <h2 className="text-lg font-bold text-slate-800 mb-1">Iniciar sesión</h2>
      <p className="text-sm text-slate-500 mb-6">Accede a tu cuenta de empresa</p>
      <LoginForm onSuccess={handleSuccess} />
    </AuthLayout>
  )
}
