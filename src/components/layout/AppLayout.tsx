// CivilPowerEc — Layout: AppLayout
// Layout base para pantallas autenticadas (onboarding, proyecto, etc.)
// El sidebar/nav completo se implementará en sprints futuros.

import React from 'react'

interface AppLayoutProps {
  children: React.ReactNode
  title?: string
}

export function AppLayout({ children, title }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#07070f]">
      <header className="bg-[#0f0f1a] border-b border-[#2a2a40] px-5 py-4 flex items-center gap-3">
        <div className="w-7 h-7 bg-[#5b8def] rounded-[7px] flex items-center justify-center text-sm">
          🏗️
        </div>
        <span className="text-sm font-bold text-[#eeeeff]">CivilPowerEc</span>
        {title && (
          <>
            <span className="text-[#2a2a40]">/</span>
            <span className="text-sm text-[#9090b0]">{title}</span>
          </>
        )}
      </header>
      <main className="p-5 max-w-2xl mx-auto">
        {children}
      </main>
    </div>
  )
}
