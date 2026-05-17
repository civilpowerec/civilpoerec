// CivilPowerEc — UI: Spinner
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6'
  return (
    <div className="flex items-center justify-center min-h-[120px]">
      <div className={`${sizeClass} border-2 border-[#2a2a40] border-t-[#5b8def] rounded-full animate-spin`} />
    </div>
  )
}
