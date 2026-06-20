import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { Camera, X, Upload, Loader } from 'lucide-react'

interface Foto {
  id: string
  url: string
  descripcion: string
  fecha: string
  rubro_id: string
}

interface Rubro {
  id: string
  nombre: string
}

interface Props {
  proyectoId: string
}

export default function Fotos({ proyectoId }: Props) {
  const [fotos, setFotos] = useState<Foto[]>([])
  const [rubros, setRubros] = useState<Rubro[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [fotoSeleccionada, setFotoSeleccionada] = useState<string | null>(null)
  const [form, setForm] = useState({ descripcion: '', fecha: new Date().toISOString().split('T')[0], rubro_id: '' })
  const [preview, setPreview] = useState<string | null>(null)
  const [archivo, setArchivo] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchFotos()
    fetchRubros()
  }, [proyectoId])

  const fetchFotos = async () => {
    const { data } = await supabase
      .from('fotos')
      .select('*')
      .eq('proyecto_id', proyectoId)
      .order('fecha', { ascending: false })
    setFotos(data || [])
    setLoading(false)
  }

  const fetchRubros = async () => {
    const { data } = await supabase
      .from('rubros')
      .select('id, nombre')
      .eq('proyecto_id', proyectoId)
    setRubros(data || [])
  }

  const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setArchivo(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubir = async () => {
    if (!archivo) return
    setUploading(true)

    const ext = archivo.name.split('.').pop()
    const fileName = `${proyectoId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('fotos-obra')
      .upload(fileName, archivo)

    if (uploadError) {
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('fotos-obra').getPublicUrl(fileName)

    await supabase.from('fotos').insert({
      proyecto_id: proyectoId,
      url: urlData.publicUrl,
      descripcion: form.descripcion,
      fecha: form.fecha,
      rubro_id: form.rubro_id || null,
    })

    setUploading(false)
    setShowModal(false)
    setArchivo(null)
    setPreview(null)
    setForm({ descripcion: '', fecha: new Date().toISOString().split('T')[0], rubro_id: '' })
    fetchFotos()
  }

  const fotosPorFecha = fotos.reduce((acc, foto) => {
    if (!acc[foto.fecha]) acc[foto.fecha] = []
    acc[foto.fecha].push(foto)
    return acc
  }, {} as Record<string, Foto[]>)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Registro fotográfico</h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-3 py-2 text-sm transition-colors"
        >
          <Camera size={16} />
          Subir foto
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : fotos.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <Camera className="text-gray-700 mx-auto mb-4" size={48} />
          <p className="text-gray-500">No hay fotos registradas</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 transition-colors"
          >
            Subir primera foto
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(fotosPorFecha).map(([fecha, fotosDia]) => (
            <div key={fecha}>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">{fecha}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {fotosDia.map((foto) => (
                  <div
                    key={foto.id}
                    className="relative group cursor-pointer rounded-xl overflow-hidden aspect-square bg-gray-900 border border-gray-800"
                    onClick={() => setFotoSeleccionada(foto.url)}
                  >
                    <img
                      src={foto.url}
                      alt={foto.descripcion}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {foto.descripcion && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs truncate">{foto.descripcion}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {fotoSeleccionada && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
          onClick={() => setFotoSeleccionada(null)}
        >
          <button className="absolute top-4 right-4 text-white hover:text-gray-300">
            <X size={24} />
          </button>
          <img src={fotoSeleccionada} alt="" className="max-w-full max-h-full rounded-xl object-contain" />
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl">Subir foto</h3>
              <button
                onClick={() => { setShowModal(false); setPreview(null); setArchivo(null) }}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {preview ? (
                  <img src={preview} alt="" className="mx-auto max-h-40 rounded-lg object-contain" />
                ) : (
                  <div>
                    <Upload className="mx-auto text-gray-500 mb-2" size={32} />
                    <p className="text-gray-400 text-sm">Toca para seleccionar foto</p>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleArchivo}
                  className="hidden"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Fecha</label>
                <input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Rubro asociado</label>
                <select
                  value={form.rubro_id}
                  onChange={(e) => setForm({ ...form, rubro_id: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">General / Sin rubro</option>
                  {rubros.map((r) => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Descripción</label>
                <input
                  type="text"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Avance de zapatas eje A..."
                />
              </div>
              <button
                onClick={handleSubir}
                disabled={!archivo || uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-3 transition-colors flex items-center justify-center gap-2"
              >
                {uploading ? <><Loader size={16} className="animate-spin" /> Subiendo...</> : 'Guardar foto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
