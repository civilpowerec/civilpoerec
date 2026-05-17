// CivilPowerEc — Onboarding: ChecklistOnboarding
// IDs en inglés. Labels y descripciones definidos aquí — no dependen de datos externos.

import { useNavigate } from 'react-router-dom'
import { ChecklistStep } from './ChecklistStep'

// Contrato de entrada
interface StepInput {
  id: string
  completed: boolean
}

interface Props {
  steps: StepInput[]
}

// Definición canónica de los 4 pasos — siempre visibles con sus textos
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
    disponible: false,
  },
  {
    id: 'invite_team',
    title: 'Invitar a tu equipo',
    description: 'Invita a tus residentes, QS y personal de oficina.',
    ruta: '/onboarding/equipo',
    disponible: false,
  },
  {
    id: 'create_first_operation',
    title: 'Registrar primer avance de obra',
    description: 'Registra el primer avance de obra del día en tu proyecto activo.',
    ruta: '/diario',
    disponible: false,
  },
]

export function ChecklistOnboarding({ steps }: Props) {
  const navigate = useNavigate()

  // Enriquecer definición canónica con estado completed que viene de Supabase
  const pasosFinales = PASOS.map(paso => {
    const match = steps.find(s => s.id === paso.id)
    return {
      ...paso,
      completed: match?.completed ?? false,
    }
  })

  const completados = pasosFinales.filter(p => p.completed).length
  const total = pasosFinales.length
  const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0

  return (
    <div>
      {/* Encabezado de progreso */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '12px', color: '#9090b0' }}>
          {completados} de {total} pasos completados
        </span>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#5b8def' }}>
          {porcentaje}%
        </span>
      </div>

      {/* Barra de progreso */}
      <div style={{
        width: '100%',
        height: '6px',
        background: '#1e1e2e',
        borderRadius: '999px',
        marginBottom: '20px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${porcentaje}%`,
          height: '100%',
          background: '#5b8def',
          borderRadius: '999px',
          transition: 'width 0.5s ease',
        }} />
      </div>

      {/* Lista de pasos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {pasosFinales.map((paso, index) => (
          <ChecklistStep
            key={paso.id}
            numero={index + 1}
            title={paso.title}
            description={paso.description}
            completed={paso.completed}
            disabled={!paso.disponible}
            onClick={() => {
              if (paso.disponible && !paso.completed) {
                navigate(paso.ruta)
              }
            }}
          />
        ))}
      </div>
    </div>
  )
}
