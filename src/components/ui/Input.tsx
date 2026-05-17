// CivilPowerEc — UI: Input
import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <input
      className={`
        w-full bg-[#161623] border rounded-[9px] px-3 py-[10px]
        text-[#eeeeff] text-sm outline-none transition-all
        placeholder:text-[#55557a]
        ${error
          ? 'border-[#f07070] bg-[#280a0a]'
          : 'border-[#2a2a40] focus:border-[#5b8def] focus:bg-[#1e1e2e]'
        }
        ${className}
      `}
      {...props}
    />
  )
}
