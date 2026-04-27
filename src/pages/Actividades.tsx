import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, X, ChevronLeft, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface Actividad {
  id: string
  nombre: string
  descripcion: string
  avance: number
  estado: string
}

interface Props {
  proyectoId: string
  proyectoNombre: string
  onBack: () => void
}

export default function Actividades({ proyectoId, proyectoNombre, onBack }: Props) {
  const [actividades, setActividades] = useState<Actividad[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ nombre: '', descripcion: '' })

  useEffect(() => {
    fetchActividades()
  }, [proyectoId])

  const fetchActividades = async () => {
    const { data } = await supabase
      .from('actividades')
      .select('*')
      .eq('proyecto_id', proyectoId)
      .order('created_at', { ascending: true })
    setActividades(data || [])
    setLoading(false)
  }

  const handleCrear = async () => {
    const { error } = await supabase.from('actividades').insert({
      ...form,
      proyecto_id: proyectoId,
      avance: 0,
      estado: 'pendiente',
    })
    if (!error) {
      setShowModal(false)
      setForm({ nombre: '', descripcion: '' })
      fetchActividades()
    }
  }

  const handleAvance = async (id: string, avance: number) => {
    const estado =
      avance === 100 ? 'completado' : avance > 0 ? 'en_progreso' : 'pendiente'
    await supabase.from('actividades').update({ avance, estado }).eq('id', id)
    fetchActividades()
  }

  const avanceTotal =
    actividades.length > 0
      ? Math.round(
          actividades.reduce((acc, a) => acc + a.avance, 0) / actividades.length
        )
      : 0

  const getEstadoIcon = (estado: string) => {
    if (estado === 'completado')
      return <CheckCircle size={16} className="text-green-400" />
    if (estado === 'en_progreso')
      return <Clock size={16} className="text-yellow-400" />
    return <AlertCircle size={16} className="text-gray-500" />
  }

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ChevronLeft size={18} />
        Volver a proyectos
      </button>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-white">{proyectoNombre}</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 transition-colors"
        >
          <Plus size={18} />
          Nueva actividad
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-400 text-sm">Avance general</span>
          <span className="text-white font-bold">{avanceTotal}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${avanceTotal}%` }}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : actividades.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <p className="text-gray-500">No hay actividades aún</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 transition-colors"
          >
            Agregar primera actividad
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {actividades.map((a) => (
            <div
              key={a.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getEstadoIcon(a.estado)}
                  <span className="text-white font-medium">{a.nombre}</span>
                </div>
                <span className="text-white font-bold">{a.avance}%</span>
              </div>
              {a.descripcion && (
                <p className="text-gray-500 text-sm mb-3">{a.descripcion}</p>
              )}
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={a.avance}
                onChange={(e) => handleAvance(a.id, parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    a.avance === 100
                      ? 'bg-green-500'
                      : a.avance > 0
                      ? 'bg-blue-500'
                      : 'bg-gray-600'
                  }`}
                  style={{ width: `${a.avance}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl">Nueva actividad</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Nombre *</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Excavación, Cimentación, Estructura..."
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Descripción de la actividad"
                  rows={3}
                />
              </div>
              <button
                onClick={handleCrear}
                disabled={!form.nombre}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-3 transition-colors"
              >
                Crear actividad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
