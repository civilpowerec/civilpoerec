// CivilPowerEc — UI: Alert
import React from 'react'

type AlertVariant = 'error' | 'warning' | 'success' | 'info'

const variantStyles: Record<AlertVariant, string> = {
  error:   'bg-[#280a0a] border-[#5a1a1a] border-l-[#f07070] text-[#f07070]',
  warning: 'bg-[#2a1f00] border-[#5a3a00] border-l-[#f5c518] text-[#f5c518]',
  success: 'bg-[#082a1a] border-[#143a22] border-l-[#2ecc8a] text-[#2ecc8a]',
  info:    'bg-[#0a1a35] border-[#1a3050] border-l-[#5b8def] text-[#5b8def]',
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
      className={`border border-l-[3px] rounded-[9px] px-3 py-[10px] text-sm font-medium ${variantStyles[variant]}${className ? ` ${className}` : ''}`}
      style={style}
    >
      {children}
    </div>
  )
}
