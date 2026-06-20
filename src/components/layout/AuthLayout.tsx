// CivilPowerEc — Layout: AuthLayout
// Layout para pantallas de auth (login, register, crear empresa)

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 22V12L12 2l10 10v10" />
              <path d="M15 22v-6a3 3 0 0 0-6 0v6" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800">CivilPowerEc</h1>
          <p className="text-sm text-slate-500 mt-1">Plataforma de construcción</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-8 py-8">
          {children}
        </div>
      </div>
    </div>
  )
}
