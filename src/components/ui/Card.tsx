// CivilPowerEc — UI: Card
import React from 'react'

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#0f0f1a] border border-[#2a2a40] rounded-[14px] p-5 ${className}`}>
      {children}
    </div>
  )
}
