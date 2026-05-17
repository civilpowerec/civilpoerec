// CivilPowerEc — UI: Label
import React from 'react'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export function Label({ required, children, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`block text-[11px] font-medium text-[#9090b0] mb-1 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-[#f07070] ml-1">*</span>}
    </label>
  )
}
