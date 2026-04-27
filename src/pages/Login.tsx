import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
    else setError('Revisa tu email para confirmar tu cuenta')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-2">CivilPowerEc</h1>
        <p className="text-gray-400 mb-8">Plataforma para construcción y arquitectura</p>

        {error && (
          <div className="bg-red-950 border border-red-800 text-red-300 rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1 block">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-3 transition-colors disabled:opacity-50"
          >
            {loading ? 'Cargando...' : 'Iniciar sesión'}
          </button>
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg px-4 py-3 transition-colors disabled:opacity-50"
          >
            Crear cuenta
          </button>
        </form>
      </div>
    </div>
  )
}