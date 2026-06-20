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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-3 shadow-sm">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 22V12L12 2l10 10v10" />
            <path d="M15 22v-6a3 3 0 0 0-6 0v6" />
          </svg>
        </div>
        <span className="text-sm font-bold text-slate-800">CivilPowerEc</span>
        {title && (
          <>
            <span className="text-slate-300">/</span>
            <span className="text-sm text-slate-500">{title}</span>
          </>
        )}
      </header>
      <main className="p-5 max-w-2xl mx-auto">
        {children}
      </main>
    </div>
  )
}
