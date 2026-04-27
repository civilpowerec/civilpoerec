import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Building2, MapPin, Calendar, X } from 'lucide-react'
import Actividades from './Actividades'

interface Proyecto {
  id: string
  nombre: string
  descripcion: string
  ubicacion: string
  fecha_inicio: string
  fecha_fin: string
  estado: string
}

export default function Proyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [proyectoActivo, setProyectoActivo] = useState<Proyecto | null>(null)
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    ubicacion: '',
    fecha_inicio: '',
    fecha_fin: '',
  })

  useEffect(() => {
    fetchProyectos()
  }, [])

  const fetchProyectos = async () => {
    const { data } = await supabase.from('proyectos').select('*').order('created_at', { ascending: false })
    setProyectos(data || [])
    setLoading(false)
  }

  const handleCrear = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('proyectos').insert({
      ...form,
      user_id: user?.id,
    })
    if (!error) {
      setShowModal(false)
      setForm({ nombre: '', descripcion: '', ubicacion: '', fecha_inicio: '', fecha_fin: '' })
      fetchProyectos()
    }
  }

  if (proyectoActivo) {
    return (
      <Actividades
        proyectoId={proyectoActivo.id}
        proyectoNombre={proyectoActivo.nombre}
        onBack={() => setProyectoActivo(null)}
      />
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Mis proyectos</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 transition-colors"
        >
          <Plus size={18} />
          Nuevo proyecto
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : proyectos.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <Building2 c
          