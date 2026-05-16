import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, X, UserCheck, UserX } from 'lucide-react'

interface Trabajador {
  id: string
  nombre: string
  rol: string
  cuadrilla: string
}

interface Asistencia {
  id: string
  trabajador_id: string
  fecha: string
  presente: boolean
  hora_entrada: string
  hora_salida: string
}

interface Props {
  proyectoId: string
}

export default function Personal({ proyectoId }: Props) {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([])
  const [asistencia, setAsistencia] = useState<Asistencia[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [form, setForm] = useState({ nombre: '', rol: '', cuadrilla: '' })

  useEffect(() => {
    fetchTrabajadores()
  }, [proyectoId])

  useEffect(() => {
    fetchAsistencia()
  }, [fecha, proyectoId])

  const fetchTrabajadores = async () => {
    const { data } = await supabase
      .from('trabajadores')
      .select('*')
      .eq('proyecto_id', proyectoId)
      .order('cuadrilla', { ascending: true })
    setTrabajadores(data || [])
    setLoading(false)
  }

  const fetchAsistencia = async () => {
    const { data } = await supabase
      .from('asistencia')
      .select('*')
      .eq('proyecto_id', proyectoId)
      .eq('fecha', fecha)
    setAsistencia(data || [])
  }

  const handleCrearTrabajador = async () => {
    const { error } = await supabase.from('trabajadores').insert({
      ...form,
      proyecto_id: proyectoId,
    })
    if (!error) {
      setShowModal(false)
      setForm({ nombre: '', rol: '', cuadrilla: '' })
      fetchTrabajadores()
    }
  }

  const toggleAsistencia = async (trabajadorId: string, presente: boolean) => {
    const existente = asistencia.find((a) => a.trabajador_id === trabajadorId)
    if (existente) {
      await supabase.from('asistencia').update({ presente }).eq('id', existente.id)
    } else {
      await supabase.from('asistencia').insert({
        trabajador_id: trabajadorId,
        proyecto_id: proyectoId,
        fecha,
        presente,
      })
    }
    fetchAsistencia()
  }

  const getAsistenciaTrabajador = (trabajadorId: string) => {
    return asistencia.find((a) => a.trabajador_id === trabajadorId)
  }

  const presentes = asistencia.filter((a) => a.presente).length
  const cuadrillas = [...new Set(trabajadores.map((t) => t.cuadrilla).filter(Boolean))]
  const sinCuadrilla = trabajadores.filter((t) => !t.cuadrilla)

  const renderTrabajador = (t: Trabajador) => {
    const reg = getAsistenciaTrabajador(t.id)
    const presente = reg?.presente

    return (
      <div key={t.id} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div>
          <p className="text-white font-medium">{t.nombre}</p>
          <p className="text-gray-500 text-sm">{t.rol}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleAsistencia(t.id, true)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              presente === true
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-green-900 hover:text-green-400'
            }`}
          >
            <UserCheck size={14} />
            Presente
          </button>
          <button
            onClick={() => toggleAsistencia(t.id, false)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              presente === false
                ? 'bg-red-700 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-red-900 hover:text-red-400'
            }`}
          >
            <UserX size={14} />
            Ausente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-white font-semibold">Personal</h3>
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5">
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="bg-transparent text-gray-300 text-sm focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-3 py-2 text-sm transition-colors"
        >
          <Plus size={16} />
          Agregar trabajador
        </button>
      </div>

      {trabajadores.length > 0 && (
        <div className="flex items-center gap-4 mb-4 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{presentes}</p>
            <p className="text-gray-400 text-xs">Presentes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{trabajadores.length - presentes}</p>
            <p className="text-gray-400 text-xs">Ausentes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{trabajadores.length}</p>
            <p className="text-gray-400 text-xs">Total</p>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : trabajadores.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <p className="text-gray-500">No hay trabajadores registrados</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 transition-colors"
          >
            Agregar primer trabajador
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cuadrillas.map((cuadrilla) => (
            <div key={cuadrilla}>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Cuadrilla: {cuadrilla}</p>
              <div className="space-y-2">
                {trabajadores.filter((t) => t.cuadrilla === cuadrilla).map(renderTrabajador)}
              </div>
            </div>
          ))}
          {sinCuadrilla.length > 0 && (
            <div className="space-y-2">{sinCuadrilla.map(renderTrabajador)}</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl">Nuevo trabajador</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
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
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Rol *</label>
                <input
                  type="text"
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Albañil, Fierrero, Carpintero..."
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Cuadrilla</label>
                <input
                  type="text"
                  value={form.cuadrilla}
                  onChange={(e) => setForm({ ...form, cuadrilla: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Cuadrilla A, Cuadrilla B..."
                />
              </div>
              <button
                onClick={handleCrearTrabajador}
                disabled={!form.nombre || !form.rol}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-3 transition-colors"
              >
                Agregar trabajador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
