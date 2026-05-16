import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import Rubros from './Rubros'
import Personal from './Personal'
import Fotos from './Fotos'

interface Proyecto {
  id: string
  nombre: string
  descripcion: string
  ubicacion: string
  fecha_inicio: string
  fecha_fin: string
  estado: string
}

interface Props {
  proyecto: Proyecto
  onBack: () => void
}

type Tab = 'rubros' | 'personal' | 'fotos'

export default function ProyectoDetalle({ proyecto, onBack }: Props) {
  const [tab, setTab] = useState<Tab>('rubros')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'rubros', label: 'Control de avance' },
    { id: 'personal', label: 'Personal' },
    { id: 'fotos', label: 'Fotos' },
  ]

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
      >
        <ChevronLeft size={18} />
        Volver a proyectos
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">{proyecto.nombre}</h2>
        {proyecto.ubicacion && (
          <p className="text-gray-400 text-sm mt-1">{proyecto.ubicacion}</p>
        )}
      </div>

      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 mb-6 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'rubros' && <Rubros proyectoId={proyecto.id} />}
      {tab === 'personal' && <Personal proyectoId={proyecto.id} />}
      {tab === 'fotos' && <Fotos proyectoId={proyecto.id} />}
    </div>
  )
}
