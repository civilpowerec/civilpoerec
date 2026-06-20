// CivilPowerEc — Onboarding: ChecklistStep

interface Props {
  numero: number
  title: string
  description: string
  completed: boolean
  disabled: boolean
  onClick: () => void
}

export function ChecklistStep({
  numero,
  title,
  description,
  completed,
  disabled,
  onClick,
}: Props) {
  const activo = !completed && !disabled

  const borderClass = completed ? 'border-emerald-200' : activo ? 'border-blue-400' : 'border-slate-200'
  const bgClass = completed ? 'bg-emerald-50' : 'bg-white'

  return (
    <div
      onClick={activo ? onClick : undefined}
      className={`flex items-center gap-4 p-4 rounded-xl border shadow-sm ${borderClass} ${bgClass} ${disabled ? 'opacity-50' : ''} ${activo ? 'cursor-pointer hover:shadow' : 'cursor-default'} transition-shadow`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${completed ? 'bg-emerald-500 text-white' : activo ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
        {completed ? '✓' : numero}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold leading-snug ${completed ? 'text-emerald-700' : activo ? 'text-slate-800' : 'text-slate-400'}`}>
          {title}
        </p>
        <p className="text-xs text-slate-500 mt-1 leading-snug">
          {description}
        </p>
      </div>

      {disabled && !completed && (
        <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full flex-shrink-0 whitespace-nowrap">
          PRÓXIMAMENTE
        </span>
      )}
      {activo && (
        <span className="text-blue-500 text-xl flex-shrink-0 leading-none">›</span>
      )}
    </div>
  )
}
