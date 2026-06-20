import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { LogOut, Building2, LayoutDashboard, Users, BarChart3, Camera } from 'lucide-react'
import Proyectos from './Proyectos'

type Vista = 'proyectos'

export default function Dashboard() {
  const [email, setEmail] = useState('')
  const [vista] = useState<Vista>('proyectos')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email || '')
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <aside className="w-16 md:w-56 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          <Building2 className="text-blue-500 shrink-0" size={24} />
          <span className="text-white font-bold text-sm hidden md:block">CivilPowerEc</span>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">
            <LayoutDashboard size={18} className="shrink-0" />
            <span className="hidden md:block">Proyectos</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-sm transition-colors">
            <BarChart3 size={18} className="shrink-0" />
            <span className="hidden md:block">Avances</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-sm transition-colors">
            <Users size={18} className="shrink-0" />
            <span className="hidden md:block">Personal</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-sm transition-colors">
            <Camera size={18} className="shrink-0" />
            <span className="hidden md:block">Fotos</span>
          </button>
        </nav>
        <div className="p-2 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-sm transition-colors"
          >
            <LogOut size={18} className="shrink-0" />
            <span className="hidden md:block truncate">{email}</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {vista === 'proyectos' && <Proyectos />}
      </main>
    </div>
  )
}
