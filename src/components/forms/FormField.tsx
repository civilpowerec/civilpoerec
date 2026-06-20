// CivilPowerEc — Forms: FormField
// Envuelve Label + Input/Select + mensaje de error en un solo componente.
import React from 'react'
import { Label } from '@/components/ui/Label'

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
}

export function FormField({ label, required, error, hint, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1 mb-3">
      <Label required={required}>{label}</Label>
      {children}
      {hint && !error && (
        <span className="text-[10px] text-[#55557a]">{hint}</span>
      )}
      {error && (
        <span className="text-[10px] text-[#f07070]">{error}</span>
      )}
    </div>
  )
}
