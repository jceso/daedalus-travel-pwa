'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })

    if (error) {
      console.error('Errore Supabase login:', error)

      setError(error.message)
      setLoading(false)
      return
    }

    console.log('Login effettuato:', data.user.id)

    router.push('/')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Bentornato
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Accedi al tuo account Daedalus Travel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input id="email" name="email" type="email" autoComplete="email" required value={email}
              onChange={(event) => setEmail(event.target.value)} placeholder="Email"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />

            <div>
              <div className="relative">
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required
                  value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />
              
                <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                    {showPassword ? (       // Occhio barrato
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                        <path d="M3 3l18 18" />
                        <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                        <path d="M9.88 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 8a11.8 11.8 0 0 1-4.08 5.09" />
                        <path d="M6.61 6.61C4.62 7.83 3.12 9.63 2 12c1.73 4.89 6 8 10 8a10.94 10.94 0 0 0 4.24-.88" />
                      </svg>
                    ) : (                   // Occhio
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                        <path d="M2.06 12.35a1 1 0 0 1 0-.7C3.7 7.84 7.46 5 12 5s8.3 2.84 9.94 6.65a1 1 0 0 1 0 .7C20.3 16.16 16.54 19 12 19s-8.3-2.84-9.94-6.65Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                </button>
              </div>

              <div className="mt-2 text-right">
                <Link href="/forgot-password" className="text-sm text-slate-500 hover:text-slate-900 hover:underline">
                  Password dimenticata?
                </Link>
              </div>
            </div>

            {error && (
              <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Accesso in corso...' : 'Accedi'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />

            <span className="text-xs text-slate-400">OPPURE</span>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <p className="text-center text-sm text-slate-600">
            Non hai ancora un account?{' '}
            <Link href="/signup" className="font-semibold text-slate-900 hover:underline">Registrati</Link>
          </p>
        </div>
      </div>
    </main>
  )
}