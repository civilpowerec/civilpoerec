// CivilPowerEc — Router central
// Sprint 1: auth, empresa, onboarding, proyecto
// Sprint 2: equipo, invitación, selector de rol

import { Routes, Route, Navigate } from 'react-router-dom'
import { RequireAuth } from '@/lib/guards/requireAuth'
import { RequireEmpresa } from '@/lib/guards/requireEmpresa'

// Auth
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { RegisterPage } from '@/modules/auth/pages/RegisterPage'
import { SeleccionarRolPage } from '@/modules/auth/pages/SeleccionarRolPage'

// Empresa
import { CrearEmpresaPage } from '@/modules/empresas/pages/CrearEmpresaPage'

// Onboarding
import { OnboardingPage } from '@/modules/onboarding/pages/OnboardingPage'
import { CrearProyectoPage } from '@/modules/proyectos/pages/CrearProyectoPage'
import { ProyectoCreadoPage } from '@/modules/onboarding/pages/ProyectoCreadoPage'

// Equipo — Sprint 2
import { EquipoPage } from '@/modules/equipo/pages/EquipoPage'

// Invitaciones — Sprint 2
import { AceptarInvitacionPage } from '@/modules/invitaciones/pages/AceptarInvitacionPage'

export function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Invitación — pública, no requiere empresa previa */}
      <Route path="/invitacion/:token" element={<AceptarInvitacionPage />} />

      {/* Crear empresa — requiere auth */}
      <Route
        path="/crear-empresa"
        element={
          <RequireAuth>
            <CrearEmpresaPage />
          </RequireAuth>
        }
      />

      {/* Selector de rol — requiere auth + empresa */}
      <Route
        path="/seleccionar-rol"
        element={
          <RequireAuth>
            <RequireEmpresa>
              <SeleccionarRolPage />
            </RequireEmpresa>
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

      {/* Equipo — Sprint 2, requiere auth + empresa */}
      <Route
        path="/equipo"
        element={
          <RequireAuth>
            <RequireEmpresa>
              <EquipoPage />
            </RequireEmpresa>
          </RequireAuth>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
