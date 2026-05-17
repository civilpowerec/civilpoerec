// CivilPowerEc — Router central
// Define todas las rutas nuevas del flujo Sprint 1.
// Las rutas legacy de src/pages/ no se tocan aquí.

import { Routes, Route, Navigate } from 'react-router-dom'
import { RequireAuth } from '@/lib/guards/requireAuth'
import { RequireEmpresa } from '@/lib/guards/requireEmpresa'

// Auth
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { RegisterPage } from '@/modules/auth/pages/RegisterPage'

// Empresa
import { CrearEmpresaPage } from '@/modules/empresas/pages/CrearEmpresaPage'

// Onboarding
import { OnboardingPage } from '@/modules/onboarding/pages/OnboardingPage'
import { CrearProyectoPage } from '@/modules/proyectos/pages/CrearProyectoPage'

// Pantalla temporal post-proyecto
import { ProyectoCreadoPage } from '@/modules/onboarding/pages/ProyectoCreadoPage'

export function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Crear empresa — requiere auth */}
      <Route
        path="/crear-empresa"
        element={
          <RequireAuth>
            <CrearEmpresaPage />
          </RequireAuth>
        }
      />

      {/* Onboarding — requiere auth + empresa */}
      <Route
        path="/onboarding"
        element={
          <RequireAuth>
            <RequireEmpresa>
              <OnboardingPage />
            </RequireEmpresa>
          </RequireAuth>
        }
      />

      {/* Crear primer proyecto — requiere auth + empresa */}
      <Route
        path="/onboarding/proyecto"
        element={
          <RequireAuth>
            <RequireEmpresa>
              <CrearProyectoPage />
            </RequireEmpresa>
          </RequireAuth>
        }
      />

      {/* Proyecto creado — confirmación */}
      <Route
        path="/onboarding/proyecto-creado"
        element={
          <RequireAuth>
            <RequireEmpresa>
              <ProyectoCreadoPage />
            </RequireEmpresa>
          </RequireAuth>
        }
      />

      {/* Fallback — redirige a login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
