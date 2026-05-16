import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, X, ChevronDown, ChevronUp, PlusCircle } from 'lucide-react'

interface Rubro {
  id: string
  nombre: string
  unidad: string
  cantidad_presupuestada: number
  categoria: string
}

interface Registro {
  id: string
  fecha: string
  cantidad_ejecutada: number
  observacion: string
}

interface Props {
  proyectoId: string
}

export default function Rubros({ proyectoId }: Props) {
  const [rubros, setRubros] = useState<Rubro[]>([])
  const [registros, setRegistros] = useState<Record<string, Registro[]>>({})
  const [loading, setLoading] = useState(true)
  const [showModalRubro, setShowModalRubro] = useState(false)
  const [showModalRegistro, setShowModalRegistro] = useState<string | null>(null)
  const [expandido, setExpandido] = useState<string | null>(null)
  const [formRubro, setFormRubro] = useState({ nombre: '', unidad: '', cantidad_presupuestada: '', categoria: '' })
  const [formRegistro, setFormRegistro] = useState({ cantidad_ejecutada: '', observacion: '', fecha: new Date().toISOString().split('T')[0] })

  useEffect(() => {
    fetchRubros()
  }, [proyectoId])

  const fetchRubros = async () => {
    const { data } = await supabase
      .from('rubros')
      .select('*')
      .eq('proyecto_id', proyectoId)
      .order('created_at', { ascending: true })
    setRubros(data || [])
    if (data) {
      for (const r of data) {
        await fetchRegistros(r.id)
      }
    }
    setLoading(false)
  }

  const fetchRegistros = async (rubroId: string) => {
    const { data } = await supabase
      .from('registros_avance')
      .select('*')
      .eq('rubro_id', rubroId)
      .order('fecha', { ascending: false })
    setRegistros((prev) => ({ ...prev, [rubroId]: data || [] }))
  }

  const handleCrearRubro = async () => {
    const { error } = await supabase.from('rubros').insert({
      ...formRubro,
      cantidad_presupuestada: parseFloat(formRubro.cantidad_presupuestada),
      proyecto_id: proyectoId,
    })
    if (!error) {
      setShowModalRubro(false)
      setFormRubro({ nombre: '', unidad: '', cantidad_presupuestada: '', categoria: '' })
      fetchRubros()
    }
  }

  const handleCrearRegistro = async (rubroId: string) => {
    const { error } = await supabase.from('registros_avance').insert({
      rubro_id: rubroId,
      proyecto_id: proyectoId,
      cantidad_ejecutada: parseFloat(formRegistro.cantidad_ejecutada),
      observacion: formRegistro.observacion,
      fecha: formRegistro.fecha,
    })
    if (!error) {
      setShowModalRegistro(null)
      setFormRegistro({ cantidad_ejecutada: '', observacion: '', fecha: new Date().toISOString().split('T')[0] })
      fetchRegistros(rubroId)
    }
  }

  const getAcumulado = (rubroId: string) => {
    return (registros[rubroId] || []).reduce((acc, r) => acc + r.cantidad_ejecutada, 0)
  }

  const getPorcentaje = (rubroId: string, presupuestado: number) => {
    const acumulado = getAcumulado(rubroId)
    return presupuestado > 0 ? Math.round((acumulado / presupuestado) * 100) : 0
  }

  const categorias = [...new Set(rubros.map((r) => r.categoria).filter(Boolean))]
  const rubrosSinCategoria = rubros.filter((r) => !r.categoria)

  const renderRubro = (rubro: Rubro) => {
    const acumulado = getAcumulado(rubro.id)
    const porcentaje = getPorcentaje(rubro.id, rubro.cantidad_presupuestada)
    const diferencia = rubro.cantidad_presupuestada - acumulado
    const sobreEjecutado = acumulado > rubro.cantidad_presupuestada

    return (
      <div key={rubro.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="text-white font-medium">{rubro.nombre}</h4>
              <p className="text-gray-500 text-xs mt-0.5">Unidad: {rubro.unidad}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowModalRegistro(rubro.id)}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded-lg transition-colors"
              >
                <PlusCircle size={12} />
                Registrar
              </button>
              <button
                onClick={() => setExpandido(expandido === rubro.id ? null : rubro.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {expandido === rubro.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3 text-center">
            <div className="bg-gray-800 rounded-lg p-2">
              <p className="text-gray-400 text-xs">Presupuesto</p>
              <p className="text-white font-bold text-sm">{rubro.cantidad_presupuestada} {rubro.unidad}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-2">
              <p className="text-gray-400 text-xs">Ejecutado</p>
              <p className={`font-bold text-sm ${sobreEjecutado ? 'text-red-400' : 'text-green-400'}`}>
                {acumulado} {rubro.unidad}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-2">
              <p className="text-gray-400 text-xs">Diferencia</p>
              <p className={`font-bold text-sm ${sobreEjecutado ? 'text-red-400' : 'text-blue-400'}`}>
                {sobreEjecutado ? '+' : ''}{Math.abs(diferencia).toFixed(1)} {rubro.unidad}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-400 text-xs">Avance</span>
            <span className={`text-xs font-bold ${sobreEjecutado ? 'text-red-400' : 'text-white'}`}>{porcentaje}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${sobreEjecutado ? 'bg-red-500' : porcentaje === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(porcentaje, 100)}%` }}
            />
          </div>
        </div>

        {expandido === rubro.id && (
          <div className="border-t border-gray-800 p-4">
            <p className="text-gray-400 text-xs mb-3">Registros de avance</p>
            {(registros[rubro.id] || []).length === 0 ? (
              <p className="text-gray-600 text-sm">Sin registros aún</p>
            ) : (
              <div className="space-y-2">
                {(registros[rubro.id] || []).map((reg) => (
                  <div key={reg.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2">
                    <div>
                      <p className="text-white text-sm font-medium">{reg.cantidad_ejecutada} {rubro.unidad}</p>
                      {reg.observacion && <p className="text-gray-400 text-xs">{reg.observacion}</p>}
                    </div>
                    <p className="text-gray-500 text-xs">{reg.fecha}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Rubros y avance</h3>
        <button
          onClick={() => setShowModalRubro(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-3 py-2 text-sm transition-colors"
        >
          <Plus size={16} />
          Nuevo rubro
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : rubros.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <p className="text-gray-500">No hay rubros — agrega las partidas del presupuesto</p>
          <button
            onClick={() => setShowModalRubro(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 transition-colors"
          >
            Agregar primer rubro
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {categorias.map((cat) => (
            <div key={cat}>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">{cat}</p>
              <div className="space-y-3">
                {rubros.filter((r) => r.categoria === cat).map(renderRubro)}
              </div>
            </div>
          ))}
          {rubrosSinCategoria.length > 0 && (
            <div className="space-y-3">
              {rubrosSinCategoria.map(renderRubro)}
            </div>
          )}
        </div>
      )}

      {showModalRubro && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl">Nuevo rubro</h3>
              <button onClick={() => setShowModalRubro(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Nombre *</label>
                <input
                  type="text"
                  value={formRubro.nombre}
                  onChange={(e) => setFormRubro({ ...formRubro, nombre: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Excavación, Fundición de zapatas..."
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Categoría</label>
                <input
                  type="text"
                  value={formRubro.categoria}
                  onChange={(e) => setFormRubro({ ...formRubro, categoria: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Fundiciones, Mampostería, Acabados..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Cantidad presupuestada *</label>
                  <input
                    type="number"
                    value={formRubro.cantidad_presupuestada}
                    onChange={(e) => setFormRubro({ ...formRubro, cantidad_presupuestada: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="80"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1 block">Unidad *</label>
                  <input
                    type="text"
                    value={formRubro.unidad}
                    onChange={(e) => setFormRubro({ ...formRubro, unidad: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    placeholder="m³, m², ml, u..."
                  />
                </div>
              </div>
              <button
                onClick={handleCrearRubro}
                disabled={!formRubro.nombre || !formRubro.cantidad_presupuestada || !formRubro.unidad}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-3 transition-colors"
              >
                Crear rubro
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalRegistro && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl">Registrar avance</h3>
              <button onClick={() => setShowModalRegistro(null)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Fecha</label>
                <input
                  type="date"
                  value={formRegistro.fecha}
                  onChange={(e) => setFormRegistro({ ...formRegistro, fecha: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Cantidad ejecutada hoy *</label>
                <input
                  type="number"
                  value={formRegistro.cantidad_ejecutada}
                  onChange={(e) => setFormRegistro({ ...formRegistro, cantidad_ejecutada: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Observación</label>
                <textarea
                  value={formRegistro.observacion}
                  onChange={(e) => setFormRegistro({ ...formRegistro, observacion: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Novedades del día..."
                  rows={3}
                />
              </div>
              <button
                onClick={() => handleCrearRegistro(showModalRegistro)}
                disabled={!formRegistro.cantidad_ejecutada}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-3 transition-colors"
              >
                Guardar registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
