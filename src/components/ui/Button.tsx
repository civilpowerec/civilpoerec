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
  primary: 'bg-[#5b8def] hover:bg-[#3a6fd4] text-white',
  ghost:   'bg-[#161623] hover:bg-[#1e1e2e] text-[#9090b0] border border-[#2a2a40]',
  danger:  'bg-[#280a0a] hover:bg-[#3a0f0f] text-[#f07070] border border-[#5a1a1a]',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-2 text-xs min-h-[36px]',
  md: 'px-4 py-3 text-sm min-h-[44px]',
  lg: 'px-6 py-4 text-base min-h-[52px]',
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
        rounded-[10px] font-semibold transition-all
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
