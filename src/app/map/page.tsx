'use client'

import { useState } from 'react'

import Map from '@/app/components//Map'
import PlaceSearch from '@/app/components/PlaceSearch'
import PlaceDetailsPanel from '@/app/components/PlaceDetailsPanel'

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

export default function PlacesPage() {
  const [selectedPlace, setSelectedPlace] =
    useState<SearchResult | null>(null)

  return (
    <main className="relative h-[calc(100vh-4rem)] overflow-hidden">
      {/* Search */}
      <div className="absolute left-6 top-6 z-20">
        <PlaceSearch
          onSelect={(result) => {
            setSelectedPlace(result)
          }}
        />
      </div>

      {/* Map */}
      <Map selectedPlace={selectedPlace} />

      {/* Details */}
      {selectedPlace && (
        <PlaceDetailsPanel
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </main>
  )
}