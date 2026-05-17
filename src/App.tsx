// CivilPowerEc — App.tsx
// Intervención mínima en Sprint 1.
// Se agrega BrowserRouter, TenantProvider y el AppRouter nuevo.
// El código legacy de src/pages/ sigue funcionando por sus propias rutas.
//
// NOTA: Si el App.tsx original ya tenía BrowserRouter,
// este archivo lo reemplaza con un único BrowserRouter en la raíz.
// Verificar antes de reemplazar.

import { BrowserRouter } from 'react-router-dom'
import { TenantProvider } from '@/lib/tenant/TenantProvider'
import { AppRouter } from '@/router/index'

function App() {
  return (
    <BrowserRouter>
      <TenantProvider>
        <AppRouter />
      </TenantProvider>
    </BrowserRouter>
  )
}

export default App
