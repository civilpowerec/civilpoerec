// CivilPowerEc — Layout: AuthLayout
// Layout para pantallas de auth (login, register, crear empresa)

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#5b8def] rounded-[14px] flex items-center justify-center text-2xl mx-auto mb-3">
            🏗️
          </div>
          <h1 className="text-xl font-bold text-[#eeeeff]">CivilPowerEc</h1>
          <p className="text-xs text-[#55557a] mt-1">Plataforma de construcción</p>
        </div>
        {children}
      </div>
    </div>
  )
}
