// CivilPowerEc — Onboarding: ProyectoCreadoPage
// Pantalla de confirmación después de crear el primer proyecto.
// No redirige al dashboard legacy.
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'

export function ProyectoCreadoPage() {
  const navigate = useNavigate()

  return (
    <AppLayout title="Proyecto creado">
      <div className="py-8 text-center">
        <div className="text-5xl mb-4">🏗️</div>
        <h1 className="text-xl font-bold text-[#eeeeff] mb-2">
          ¡Proyecto creado exitosamente!
        </h1>
        <p className="text-sm text-[#9090b0] mb-8 max-w-sm mx-auto">
          Tu primer proyecto está listo. Los módulos de diario de obra,
          pedidos y presupuesto estarán disponibles en los próximos sprints.
        </p>

        <div className="bg-[#0f0f1a] border border-[#2a2a40] rounded-[12px] p-4 mb-6 text-left">
          <p className="text-xs font-semibold text-[#9090b0] mb-3 uppercase tracking-wider">
            Próximos pasos disponibles
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-sm text-[#55557a]">
              <span className="text-[#2a2a40]">○</span> Invitar a tu equipo
            </div>
            <div className="flex items-center gap-3 text-sm text-[#55557a]">
              <span className="text-[#2a2a40]">○</span> Cargar presupuesto base
            </div>
            <div className="flex items-center gap-3 text-sm text-[#55557a]">
              <span className="text-[#2a2a40]">○</span> Registrar diario de obra
            </div>
          </div>
        </div>

        <Button onClick={() => navigate('/onboarding')} size="lg">
          Ver checklist completo
        </Button>
      </div>
    </AppLayout>
  )
}
