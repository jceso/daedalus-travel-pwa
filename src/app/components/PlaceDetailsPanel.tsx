'use client'

import { useState } from 'react'

type SearchResult = {
  id: string
  type: string
  place_name?: string
  text?: string
  center?: [number, number]
  geometry?: {
    coordinates: [number, number]
  }
}

type PlaceDetailsPanelProps = {
  place: SearchResult
  onClose: () => void
}

export default function PlaceDetailsPanel({
  place,
  onClose,
}: PlaceDetailsPanelProps) {
  const [visited, setVisited] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [wishlist, setWishlist] = useState(false)

  const coordinates =
    place.center ?? place.geometry?.coordinates

  return (
    <aside className="absolute right-5 top-5 bottom-5 z-30 flex w-[380px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
      {/* Header */}
      <div className="relative border-b border-slate-100 px-6 pb-5 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
          aria-label="Close"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-xl text-white shadow-sm">
          📍
        </div>

        <div className="pr-10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">
            {place.text ?? 'Unknown place'}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {place.place_name ?? 'Location'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Type */}
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Place type
          </p>

          <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-700">
            {place.type}
          </div>
        </section>

        {/* Coordinates */}
        {coordinates && (
          <section className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Coordinates
            </p>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">
                    Latitude
                  </p>

                  <p className="mt-1 font-mono text-sm font-medium text-slate-800">
                    {coordinates[1].toFixed(5)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Longitude
                  </p>

                  <p className="mt-1 font-mono text-sm font-medium text-slate-800">
                    {coordinates[0].toFixed(5)}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Status */}
        <section className="mt-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Your place
          </p>

          <div className="space-y-2">
            {/* Visited */}
            <button
              type="button"
              onClick={() => setVisited(!visited)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                visited
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  visited
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  Visited
                </p>

                <p className="text-xs text-slate-500">
                  {visited
                    ? 'You have visited this place'
                    : 'Mark this place as visited'}
                </p>
              </div>

              <div
                className={`h-5 w-5 rounded-full border-2 ${
                  visited
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-slate-300'
                }`}
              >
                {visited && (
                  <svg
                    className="h-full w-full text-white"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m5 10 3 3 7-7" />
                  </svg>
                )}
              </div>
            </button>

            {/* Favorite */}
            <button
              type="button"
              onClick={() => setFavorite(!favorite)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                favorite
                  ? 'border-rose-200 bg-rose-50'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  favorite
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill={favorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.8 8.8c0 5.4-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.8A4.8 4.8 0 0 1 8 4a5.2 5.2 0 0 1 4 2.1A5.2 5.2 0 0 1 16 4a4.8 4.8 0 0 1 4.8 4.8Z" />
                </svg>
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  Favorite
                </p>

                <p className="text-xs text-slate-500">
                  {favorite
                    ? 'Added to your favorites'
                    : 'Add this place to favorites'}
                </p>
              </div>

              <div
                className={`h-5 w-5 rounded-full border-2 ${
                  favorite
                    ? 'border-rose-500 bg-rose-500'
                    : 'border-slate-300'
                }`}
              >
                {favorite && (
                  <svg
                    className="h-full w-full text-white"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m5 10 3 3 7-7" />
                  </svg>
                )}
              </div>
            </button>

            {/* Wishlist */}
            <button
              type="button"
              onClick={() => setWishlist(!wishlist)}
              className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                wishlist
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  wishlist
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill={wishlist ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 3h12v18l-6-4-6 4V3Z" />
                </svg>
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  Wishlist
                </p>

                <p className="text-xs text-slate-500">
                  {wishlist
                    ? 'Saved for a future trip'
                    : 'Add this place to your wishlist'}
                </p>
              </div>

              <div
                className={`h-5 w-5 rounded-full border-2 ${
                  wishlist
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-slate-300'
                }`}
              >
                {wishlist && (
                  <svg
                    className="h-full w-full text-white"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m5 10 3 3 7-7" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-white p-6">
        <button
          type="button"
          className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99]"
        >
          Save place
        </button>
      </div>
    </aside>
  )
}