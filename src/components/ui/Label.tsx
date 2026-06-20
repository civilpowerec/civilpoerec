// CivilPowerEc — UI: Label
import React from 'react'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export function Label({ required, children, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`block text-xs font-semibold text-slate-600 mb-1 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}
