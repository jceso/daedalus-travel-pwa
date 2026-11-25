import { NextResponse } from 'next/server'
import { Agent } from 'undici'

type RequestInitWithDispatcher = RequestInit & { dispatcher?: Agent }
const viaggiareSicuriAgent = new Agent({ connect: { rejectUnauthorized: false } })

export async function GET(_request: Request, { params }: { params: Promise<{ iso3: string }> }) {
  const { iso3 } = await params
  const code = iso3.toUpperCase()

  try {
    const [countryResponse, newsResponse] = await Promise.all([
      fetch(`https://www.viaggiaresicuri.it/schede_paese/${code}.json`,
        { dispatcher: viaggiareSicuriAgent, next: { revalidate: 3600 } } as RequestInitWithDispatcher),
      fetch(`https://www.viaggiaresicuri.it/ultima_ora/${code}.json`,
        { dispatcher: viaggiareSicuriAgent, next: { revalidate: 300 } } as RequestInitWithDispatcher)])

    console.log('COUNTRY STATUS:', countryResponse.status)
    console.log('NEWS STATUS:', newsResponse.status)

    const countryInfo = countryResponse.ok ? await countryResponse.json() : null
    const newsInfo = newsResponse.ok ? await newsResponse.json() : null

    return NextResponse.json({ countryInfo, newsInfo })
  } catch (error) {
    console.error('VIAGGIARE SICURI ERROR:', error)

    return NextResponse.json({ error: 'Unable to fetch country information',
        details: error instanceof Error ? error.message : String(error) }, { status: 502 })
  }
}