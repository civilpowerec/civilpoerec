import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { LogOut, Building2 } from 'lucide-react'
import Proyectos from './Proyectos'

export default function Dashboard() {
  const [email, setEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email || '')
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="text-blue-500" size={24} />
          <span className="text-white font-bold text-lg">CivilPowerEc</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </nav>

      <main>
        <Proyectos />
      </main>
    </div>
  )
}