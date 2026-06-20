// CivilPowerEc — UI: Alert
import React from 'react'

type AlertVariant = 'error' | 'warning' | 'success' | 'info'

const variantStyles: Record<AlertVariant, string> = {
  error:   'bg-red-50 border-red-200 border-l-red-500 text-red-700',
  warning: 'bg-amber-50 border-amber-200 border-l-amber-500 text-amber-700',
  success: 'bg-emerald-50 border-emerald-200 border-l-emerald-500 text-emerald-700',
  info:    'bg-blue-50 border-blue-200 border-l-blue-500 text-blue-700',
}

interface AlertProps {
  variant?: AlertVariant
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Alert({ variant = 'error', children, className, style }: AlertProps) {
  return (
    <div
      className={`border border-l-[3px] rounded-lg px-3 py-2.5 text-sm font-medium ${variantStyles[variant]}${className ? ` ${className}` : ''}`}
      style={style}
    >
      {children}
    </div>
  )
}
