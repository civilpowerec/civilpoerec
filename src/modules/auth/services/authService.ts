// CivilPowerEc — Auth Service
// Maneja autenticación con Supabase Auth.
// Solo auth — la creación de empresa va en empresaService.

import { supabase } from '@/lib/supabase/client'

export interface RegisterInput {
  nombre: string
  email: string
  password: string
}

export interface AuthResult {
  ok: boolean
  error?: string
}

// Registra un nuevo usuario en Supabase Auth
export async function register(input: RegisterInput): Promise<AuthResult> {
  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { nombre: input.nombre },
    },
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// Login con email y contraseña
export async function login(email: string, password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// Logout
export async function logout(): Promise<void> {
  await supabase.auth.signOut()
}

// Obtiene el usuario autenticado actual
export async function getUsuarioActual() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
