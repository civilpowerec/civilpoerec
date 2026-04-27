import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      setConnected(true)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">CivilPowerEc 🏗️</h1>
        <p className={`text-lg ${connected ? 'text-green-400' : 'text-yellow-400'}`}>
          {connected ? '✅ Supabase conectado' : '⏳ Conectando...'}
        </p>
      </div>
    </div>
  )
}

export default App