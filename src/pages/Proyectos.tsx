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
    const { data } = await supabase
      .from('proyectos')
      .select('*')
      .order('created_at', { ascending: false })
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
          <Building2 className="text-gray-700 mx-auto mb-4" size={48} />
          <p className="text-gray-500">No tienes proyectos aún</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 transition-colors"
          >
            Crear primer proyecto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proyectos.map((p) => (
            <div
              key={p.id}
              onClick={() => setProyectoActivo(p)}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-blue-700 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-semibold text-lg">{p.nombre}</h3>
                <span className="bg-green-950 text-green-400 text-xs px-2 py-1 rounded-full">
                  {p.estado}
                </span>
              </div>
              {p.descripcion && (
                <p className="text-gray-400 text-sm mb-3">{p.descripcion}</p>
              )}
              <div className="space-y-1">
                {p.ubicacion && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPin size={14} />
                    {p.ubicacion}
                  </div>
                )}
                {p.fecha_inicio && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar size={14} />
                    {p.fecha_inicio} → {p.fecha_fin}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl">Nuevo proyecto</h3>
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
                  placeholder="Edificio Centro Norte"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Descripción del proyecto"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Ubicación</label>
                <input
                  type="text"
                  value={form.ubicacion}
                  onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Quito, Ecuador"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Fecha inicio</label>
                  <input
                    type="date"
                    value={form.fecha_inicio}
                    onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Fecha fin</label>
                  <input
                    type="date"
                    value={form.fecha_fin}
                    onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={handleCrear}
                disabled={!form.nombre}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-3 transition-colors"
              >
                Crear proyecto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
