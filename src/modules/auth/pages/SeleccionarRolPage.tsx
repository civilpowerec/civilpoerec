// CivilPowerEc — Auth: SeleccionarRolPage
// Se muestra cuando el usuario tiene 2+ roles en una empresa.
// El rol seleccionado se guarda en sessionStorage.
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { RoleSelector } from '@/modules/auth/components/RoleSelector'
import { useTenant } from '@/lib/tenant/useTenant'
import type { RolEmpresa } from '@/types/roles'

export const ROL_ACTIVO_KEY = 'civilpowerec_rol_activo'

export function SeleccionarRolPage() {
  const navigate = useNavigate()
  const { roles } = useTenant()

  // Si tiene un solo rol, redirigir directo
  if (roles.length === 1) {
    sessionStorage.setItem(ROL_ACTIVO_KEY, roles[0])
    navigate('/onboarding', { replace: true })
    return null
  }

  function handleSeleccionar(rol: RolEmpresa) {
    sessionStorage.setItem(ROL_ACTIVO_KEY, rol)
    navigate('/onboarding', { replace: true })
  }

  return (
    <AuthLayout>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#eeeeff' }}>
          ¿Con qué rol quieres entrar?
        </h2>
        <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#9090b0' }}>
          Tienes múltiples roles asignados. Elige cómo quieres trabajar hoy.
        </p>
      </div>
      <RoleSelector roles={roles as RolEmpresa[]} onSelect={handleSeleccionar} />
    </AuthLayout>
  )
}
