import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { LogOut, Building2 } from 'lucide-react'

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

      <main className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Mis proyectos</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
          <Building2 className="text-gray-700 mx-auto mb-4" size={48} />
          <p className="text-gray-500">No tienes proyectos aún</p>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 transition-colors">
            Crear primer proyecto
          </button>
        </div>
      </main>
    </div>
  )
}