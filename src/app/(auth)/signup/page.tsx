'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError(null)
    setSuccess(false)

    if (password.length < 8) {
      setError('La password deve contenere almeno 8 caratteri.')
      return
    }

    if (password !== confirmPassword) {
      setError('Le password non coincidono.')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // Se la conferma email è disattivata, l'utente
    // potrebbe avere già una sessione attiva.
    if (data.session) {
      router.push('/')
      router.refresh()
      return
    }

    setSuccess(true)
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Crea un account
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Inizia a organizzare i tuoi viaggi con Daedalus Travel
            </p>
          </div>

          {success ? (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
              <p className="font-semibold">
                Registrazione completata!
              </p>

              <p className="mt-2">
                Ti abbiamo inviato un'email di conferma.
                Controlla la tua casella di posta per attivare
                il tuo account.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">

              <input id="email" name="email" type="email" autoComplete="email" required value={email}
                onChange={(event) => setEmail(event.target.value)} placeholder="Email"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />

              <input id="password" name="password" type="password" autoComplete="new-password" required value={password}
                onChange={(event) => setPassword(event.target.value)} placeholder="Password"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />

              <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Conferma password"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200" />

              {error && (
                <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? 'Registrazione in corso...' : 'Registrati'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-slate-600">
            Hai già un account?{' '}
            <Link href="/login" className="font-semibold text-slate-900 hover:underline">
              Accedi
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}