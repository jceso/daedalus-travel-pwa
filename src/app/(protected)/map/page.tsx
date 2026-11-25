'use client'

import { useState } from 'react'
import Map from '@/app/components//Map'
import PlaceSearch from '@/app/components/PlaceSearch'
import PlaceDetailsPanel from '@/app/components/PlaceDetailsPanel'
import { SearchResult } from '../../models/SearchResult'

export default function PlacesPage() {
  const [selectedPlace, setSelectedPlace] = useState<SearchResult | null>(null)

  return (
    <main className="relative h-[calc(100vh-4rem)] overflow-hidden">
      {/* Search  md:left-6 md:top-6*/}
      <div className="absolute px-2 md:px-6 py-3.5 z-20 w-[80%] md:w-[30%]">
        <PlaceSearch onSelect={(result) => { setSelectedPlace(result) }} />
      </div>

      {/* Map */}
      <Map selectedPlace={selectedPlace} />

      {/* Details */}
      {selectedPlace && (
        <PlaceDetailsPanel place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
    </main>
  )
}