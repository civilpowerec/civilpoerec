// CivilPowerEc — UI: Button
import React from 'react'

type Variant = 'primary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer',
  ghost:   'bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 cursor-pointer',
  danger:  'bg-red-50 hover:bg-red-100 text-red-600 border border-red-300 cursor-pointer',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-2 text-xs min-h-[36px]',
  md: 'px-4 py-2.5 text-sm min-h-[44px]',
  lg: 'px-6 py-3 text-sm min-h-[48px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        w-full flex items-center justify-center gap-2
        rounded-lg font-semibold transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  )
}
