// CivilPowerEc — Onboarding: ChecklistOnboarding
// Sprint 2: invite_team activado y redirige a /equipo

import { useNavigate } from 'react-router-dom'
import { ChecklistStep } from './ChecklistStep'

interface StepInput {
  id: string
  completed: boolean
}

interface Props {
  steps: StepInput[]
}

// IDs en inglés — no cambiar
const PASOS = [
  {
    id: 'create_project',
    title: 'Crear primer proyecto',
    description: 'Agrega tu primer proyecto de obra para empezar a usar CivilPowerEc.',
    ruta: '/onboarding/proyecto',
    disponible: true,
  },
  {
    id: 'choose_budget_mode',
    title: 'Elegir modo de presupuesto',
    description: 'Define si trabajarás con presupuesto completo, básico o sin control de saldo.',
    ruta: '/onboarding/presupuesto',
    disponible: false, // Sprint 3
  },
  {
    id: 'invite_team',
    title: 'Invitar a tu equipo',
    description: 'Invita a tus residentes, QS y personal de oficina.',
    ruta: '/equipo',
    disponible: true, // Activado en Sprint 2
  },
  {
    id: 'create_first_operation',
    title: 'Registrar primer avance de obra',
    description: 'Registra el primer avance de obra del día en tu proyecto activo.',
    ruta: '/diario',
    disponible: false, // Sprint 4
  },
]

export function ChecklistOnboarding({ steps }: Props) {
  const navigate = useNavigate()

  const pasosFinales = PASOS.map(paso => {
    const match = steps.find(s => s.id === paso.id)
    return { ...paso, completed: match?.completed ?? false }
  })

  const completados = pasosFinales.filter(p => p.completed).length
  const total = pasosFinales.length
  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0

  return (
    <div>
      <div className="flex justify-between mb-3">
        <span className="text-xs text-slate-500">
          {completados} de {total} pasos completados
        </span>
        <span className="text-xs font-semibold text-blue-600">
          {porcentaje}%
        </span>
      </div>

      <div className="w-full h-1.5 bg-slate-200 rounded-full mb-5 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${porcentaje}%` }}
        />
      </div>

      <div className="flex flex-col gap-3">
        {pasosFinales.map((paso, index) => (
          <ChecklistStep
            key={paso.id}
            numero={index + 1}
            title={paso.title}
            description={paso.description}
            completed={paso.completed}
            disabled={!paso.disponible}
            onClick={() => {
              if (paso.disponible && !paso.completed) navigate(paso.ruta)
            }}
          />
        ))}
      </div>
    </div>
  )
}
