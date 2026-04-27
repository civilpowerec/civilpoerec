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
    const estado = avance === 100 ? 'completado' : avance > 0 ? 'en_progreso' : 'pendiente'
    await supabase.from('actividades').update({ avance, estado }).eq('id', id)
    fetchActividades()
  }

  const avanceTotal = actividades.length > 0
    ? Math.round(actividades.reduce((acc, a) => acc + a.avance, 0) / actividades.length)
    : 0

  const getEstadoIcon = (estado: string) => {
    if (estado === 'completado') return <CheckCircle size={16} className="text-green-400" />
    if (estado === 'en_progreso') return <Clock size={16} className="text-yellow-400" />
    return <AlertCircle size={16} className="text-gray-500" />
  }

  return (
    <div className="p-6">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
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
        <p