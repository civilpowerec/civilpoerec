// CivilPowerEc — Empresas: CrearEmpresaForm
import { useState } from 'react'
import { FormField } from '@/components/forms/FormField'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { validarIdentificacion } from '@/types/empresa'
import type { CrearEmpresaInput } from '@/types/empresa'
import type { TipoPersona, TipoIdentificacion, TipoProyecto } from '@/types/onboarding'
import { TIPO_PROYECTO_LABELS, PROVINCIAS_ECUADOR } from '@/lib/constants/index'

interface Props {
  onSubmit: (input: CrearEmpresaInput) => void
  loading: boolean
}

const TIPOS_OBRA: TipoProyecto[] = [
  'residencial_unifamiliar', 'residencial_multifamiliar', 'comercial',
  'institucional', 'industrial', 'infraestructura', 'remodelacion', 'otro',
]

export function CrearEmpresaForm({ onSubmit, loading }: Props) {
  const [nombre, setNombre] = useState('')
  const [tipoPersona, setTipoPersona] = useState<TipoPersona>('juridica')
  const [nombreRepresentante, setNombreRepresentante] = useState('')
  const [tipoId, setTipoId] = useState<TipoIdentificacion>('ruc')
  const [numeroId, setNumeroId] = useState('')
  const [telefono, setTelefono] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [provincia, setProvincia] = useState('')
  const [tiposObra, setTiposObra] = useState<TipoProyecto[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  function toggleTipoObra(tipo: TipoProyecto) {
    setTiposObra(prev =>
      prev.includes(tipo) ? prev.filter(t => t !== tipo) : [...prev, tipo]
    )
  }

  function validar(): boolean {
    const e: Record<string, string> = {}

    if (!nombre.trim()) e.nombre = 'El nombre es requerido'
    if (!nombreRepresentante.trim()) e.nombreRepresentante = 'El nombre del representante es requerido'

    const validId = validarIdentificacion(tipoId, numeroId)
    if (!validId.valido) e.numeroId = validId.mensaje ?? 'Identificación inválida'

    if (!telefono.trim()) e.telefono = 'El teléfono es requerido'
    if (!ciudad.trim()) e.ciudad = 'La ciudad es requerida'
    if (!provincia) e.provincia = 'La provincia es requerida'
    if (tiposObra.length === 0) e.tiposObra = 'Selecciona al menos un tipo de proyecto'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return

    onSubmit({
      nombre,
      tipo_persona: tipoPersona,
      nombre_representante: nombreRepresentante,
      tipo_identificacion: tipoId,
      numero_identificacion: numeroId,
      tipo_proyectos: tiposObra,
      telefono,
      ciudad,
      provincia,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1">

      <FormField label="Nombre de la empresa" required error={errors.nombre}>
        <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Constructora XYZ S.A." error={errors.nombre} />
      </FormField>

      <FormField label="Tipo de persona" required>
        <Select value={tipoPersona} onChange={e => setTipoPersona(e.target.value as TipoPersona)}>
          <option value="juridica">Persona Jurídica</option>
          <option value="natural">Persona Natural</option>
        </Select>
      </FormField>

      <FormField label="Nombre del representante" required error={errors.nombreRepresentante}>
        <Input value={nombreRepresentante} onChange={e => setNombreRepresentante(e.target.value)} placeholder="Juan Pérez" error={errors.nombreRepresentante} />
      </FormField>

      <FormField label="Tipo de identificación" required>
        <Select value={tipoId} onChange={e => {
          setTipoId(e.target.value as TipoIdentificacion)
          setNumeroId('')
          setErrors(prev => ({ ...prev, numeroId: '' }))
        }}>
          {tipoPersona === 'juridica' && <option value="ruc">RUC</option>}
          <option value="cedula">Cédula</option>
          <option value="pasaporte">Pasaporte</option>
        </Select>
      </FormField>

      <FormField
        label="Número de identificación"
        required
        error={errors.numeroId}
        hint={tipoId === 'ruc' ? '13 dígitos' : tipoId === 'cedula' ? '10 dígitos' : '5-20 caracteres'}
      >
        <Input
          value={numeroId}
          onChange={e => setNumeroId(e.target.value)}
          placeholder={tipoId === 'ruc' ? '1790XXXXXXXXX001' : tipoId === 'cedula' ? '1712345678' : 'AB123456'}
          error={errors.numeroId}
        />
      </FormField>

      <FormField label="Teléfono" required error={errors.telefono}>
        <Input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="0999999999" error={errors.telefono} />
      </FormField>

      <FormField label="Ciudad" required error={errors.ciudad}>
        <Input value={ciudad} onChange={e => setCiudad(e.target.value)} placeholder="Quito" error={errors.ciudad} />
      </FormField>

      <FormField label="Provincia" required error={errors.provincia}>
        <Select value={provincia} onChange={e => setProvincia(e.target.value)} error={errors.provincia}>
          <option value="">Seleccionar provincia</option>
          {PROVINCIAS_ECUADOR.map(p => <option key={p} value={p}>{p}</option>)}
        </Select>
      </FormField>

      <FormField label="Tipo de proyectos que manejas" required error={errors.tiposObra}>
        <div className="flex flex-wrap gap-2 mt-1">
          {TIPOS_OBRA.map(tipo => (
            <button
              key={tipo}
              type="button"
              onClick={() => toggleTipoObra(tipo)}
              className={`
                px-3 py-1.5 rounded-[20px] text-xs font-medium border transition-all
                ${tiposObra.includes(tipo)
                  ? 'bg-[#1a2a4a] border-[#5b8def] text-[#5b8def]'
                  : 'bg-[#161623] border-[#2a2a40] text-[#9090b0] hover:border-[#5b8def]'
                }
              `}
            >
              {TIPO_PROYECTO_LABELS[tipo]}
            </button>
          ))}
        </div>
      </FormField>

      <Button type="submit" loading={loading} size="lg" className="mt-3">
        Crear empresa
      </Button>
    </form>
  )
}
