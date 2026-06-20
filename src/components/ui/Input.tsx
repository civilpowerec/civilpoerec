// CivilPowerEc — UI: Input
import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <input
      className={`
        w-full bg-white border rounded-lg px-3 py-2.5
        text-slate-800 text-sm outline-none transition-all
        placeholder:text-slate-400
        ${error
          ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
          : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10'
        }
        ${className}
      `}
      {...props}
    />
  )
}
