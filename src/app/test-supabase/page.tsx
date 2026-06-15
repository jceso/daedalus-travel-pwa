'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabase() {
  const [status, setStatus] = useState('testing...')
  const [data, setData] = useState<unknown>(null)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    async function test() {
      const { data, error } = await supabase
        .from('places')
        .select('*')

      if (error) {
        console.error('SUPABASE ERROR:', error)
        setStatus('❌ errore Supabase')
        setError(error)
        return
      }

      console.log('SUPABASE DATA:', data)
      setData(data)
      setStatus('✅ connessione OK')
    }

    test()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h1>Supabase Test</h1>

      <p>{status}</p>

      <h2>Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>

      <h2>Error</h2>
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  )
}