// CivilPowerEc — Proyectos: CrearProyectoForm
import { useState } from 'react'
import { FormField } from '@/components/forms/FormField'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { CrearProyectoInput } from '@/types/proyecto'
import type { TipoProyecto } from '@/types/onboarding'
import { TIPO_PROYECTO_LABELS, PROVINCIAS_ECUADOR } from '@/lib/constants/index'

interface Props {
  onSubmit: (input: CrearProyectoInput) => void
  loading: boolean
}

const TIPOS: TipoProyecto[] = [
  'residencial_unifamiliar', 'residencial_multifamiliar', 'comercial',
  'institucional', 'industrial', 'infraestructura', 'remodelacion', 'otro',
]

export function CrearProyectoForm({ onSubmit, loading }: Props) {
  const [nombre, setNombre] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [tipoObra, setTipoObra] = useState<TipoProyecto | ''>('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [provincia, setProvincia] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validar(): boolean {
    const e: Record<string, string> = {}
    if (!nombre.trim()) e.nombre = 'El nombre es requerido'
    if (!ubicacion.trim()) e.ubicacion = 'La ubicación es requerida'
    if (!tipoObra) e.tipoObra = 'Selecciona el tipo de obra'
    if (!fechaInicio) e.fechaInicio = 'La fecha de inicio es requerida'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validar()) return
    onSubmit({
      nombre,
      ubicacion,
      tipo_obra: tipoObra as TipoProyecto,
      fecha_inicio: fechaInicio,
      ciudad: ciudad || undefined,
      provincia: provincia || undefined,
      fecha_fin: fechaFin || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1">
      <FormField label="Nombre del proyecto" required error={errors.nombre}>
        <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Edificio Norte" error={errors.nombre} />
      </FormField>

      <FormField label="Ubicación" required error={errors.ubicacion}>
        <Input value={ubicacion} onChange={e => setUbicacion(e.target.value)} placeholder="Av. República del Salvador N36-84" error={errors.ubicacion} />
      </FormField>

      <FormField label="Tipo de obra" required error={errors.tipoObra}>
        <Select value={tipoObra} onChange={e => setTipoObra(e.target.value as TipoProyecto)} error={errors.tipoObra}>
          <option value="">Seleccionar tipo</option>
          {TIPOS.map(t => <option key={t} value={t}>{TIPO_PROYECTO_LABELS[t]}</option>)}
        </Select>
      </FormField>

      <FormField label="Fecha de inicio" required error={errors.fechaInicio}>
        <Input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} error={errors.fechaInicio} />
      </FormField>

      <FormField label="Ciudad">
        <Input value={ciudad} onChange={e => setCiudad(e.target.value)} placeholder="Quito" />
      </FormField>

      <FormField label="Provincia">
        <Select value={provincia} onChange={e => setProvincia(e.target.value)}>
          <option value="">Seleccionar (opcional)</option>
          {PROVINCIAS_ECUADOR.map(p => <option key={p} value={p}>{p}</option>)}
        </Select>
      </FormField>

      <FormField label="Fecha estimada de fin">
        <Input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
      </FormField>

      <Button type="submit" loading={loading} size="lg" className="mt-3">
        Crear proyecto
      </Button>
    </form>
  )
}
