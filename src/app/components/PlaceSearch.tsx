'use client'

import { useEffect, useRef, useState } from 'react'

type SearchResult = {
  id: string
  type: string
  place_name?: string
  text?: string
  center?: [number, number]
  geometry?: {
    coordinates: [number, number]
  }
  properties?: {
    [key: string]: unknown
  }
}

type PlaceSearchProps = {
  onSelect: (result: SearchResult) => void
}

const TYPE_PRIORITY: Record<string, number> = {
  city: 100,
  town: 90,
  village: 80,
  municipality: 70,
  county: 60,
  region: 50,
  country: 40,
  state: 30,
  locality: 20,
  place: 10,
  poi: 0,
}

function getPriority(result: SearchResult) {
  return TYPE_PRIORITY[result.type] ?? -1
}

function sortResults(results: SearchResult[]) {
  return [...results].sort((a, b) => {
    return getPriority(b) - getPriority(a)
  })
}

export default function PlaceSearch({
  onSelect,
}: PlaceSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const abortController = useRef<AbortController | null>(null)

  useEffect(() => {
    const value = query.trim()

    if (value.length < 2) {
      abortController.current?.abort()
      return
    }

    const timeout = setTimeout(async () => {
      abortController.current?.abort()

      const controller = new AbortController()
      abortController.current = controller

      try {
        setLoading(true)

        const apiKey =
          process.env.NEXT_PUBLIC_MAPTILER_API_KEY

        if (!apiKey) {
          throw new Error(
            'NEXT_PUBLIC_MAPTILER_API_KEY is not defined'
          )
        }

        const params = new URLSearchParams({
          key: apiKey,
          limit: '10',
          language: 'it',
        })

        const response = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(
            value
          )}.json?${params.toString()}`,
          {
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error(
            `MapTiler request failed: ${response.status}`
          )
        }

        const data = await response.json()

        if (!controller.signal.aborted) {
          const sortedResults = sortResults(
            data.features ?? []
          ).slice(0, 5)

          setResults(sortedResults)
        }
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === 'AbortError'
        ) {
          return
        }

        console.error(
          'MAPTILER GEOCODING ERROR:',
          error
        )

        if (!controller.signal.aborted) {
          setResults([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }, 300)

    return () => {
      clearTimeout(timeout)
    }
  }, [query])

  function handleSelect(result: SearchResult) {
    setQuery(result.place_name ?? result.text ?? '')
    setResults([])
    onSelect(result)
  }

  function handleClear() {
    setQuery('')
    setResults([])
    setLoading(false)

    abortController.current?.abort()
  }

  function getResultLabel(type: string) {
    switch (type) {
      case 'city':
        return 'City'

      case 'town':
        return 'Town'

      case 'village':
        return 'Village'

      case 'municipality':
        return 'Municipality'

      case 'country':
        return 'Country'

      case 'region':
        return 'Region'

      case 'county':
        return 'County'

      case 'poi':
        return 'Point of interest'

      default:
        return 'Place'
    }
  }

  return (
    <div className="relative w-full max-w-xl">
      {/* Search input */}
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
        <svg
          className="h-5 w-5 shrink-0 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
          />

          <path d="m20 20-3.5-3.5" />
        </svg>

        <input
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Search a city, country or place..."
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
        />

        {loading && (
          <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
        )}

        {!loading && query && (
          <button
            type="button"
            onClick={handleClear}
            className="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {results.map((result) => (
            <button
              key={result.id}
              type="button"
              onClick={() => handleSelect(result)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
            >
              {/* Icon */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                {result.type === 'country' ? (
                  <span className="text-sm">🌍</span>
                ) : result.type === 'region' ? (
                  <span className="text-sm">◈</span>
                ) : result.type === 'poi' ? (
                  <span className="text-sm">📍</span>
                ) : (
                  <svg
                    className="h-4 w-4 text-slate-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle
                      cx="12"
                      cy="10"
                      r="2.5"
                    />
                  </svg>
                )}
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-900">
                  {result.text}
                </div>

                <div className="truncate text-xs text-slate-500">
                  {result.place_name}
                </div>
              </div>

              {/* Type */}
              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {getResultLabel(result.type)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}