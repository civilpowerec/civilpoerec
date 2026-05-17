// CivilPowerEc — UI: Select
import React from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
}

export function Select({ error, children, className = '', ...props }: SelectProps) {
  return (
    <select
      className={`
        w-full bg-[#161623] border rounded-[9px] px-3 py-[10px]
        text-[#eeeeff] text-sm outline-none transition-all appearance-none
        ${error
          ? 'border-[#f07070] bg-[#280a0a]'
          : 'border-[#2a2a40] focus:border-[#5b8def] focus:bg-[#1e1e2e]'
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  )
}
