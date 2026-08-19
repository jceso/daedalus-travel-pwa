'use client'

import { useEffect, useRef } from 'react'
import * as maptilersdk from '@maptiler/sdk'

import '@maptiler/sdk/dist/maptiler-sdk.css'

maptilersdk.config.apiKey =
  process.env.NEXT_PUBLIC_MAPTILER_API_KEY!

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

type MapProps = {
  selectedPlace: SearchResult | null
}

export default function Map({
  selectedPlace,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const map = useRef<maptilersdk.Map | null>(null)

  const marker = useRef<maptilersdk.Marker | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return
    if (map.current) return

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [12.4964, 41.9028],
      zoom: 5,
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  useEffect(() => {
    if (!map.current) return
    if (!selectedPlace) return

    const coordinates =
      selectedPlace.center ??
      selectedPlace.geometry?.coordinates

    if (!coordinates) return

    map.current.flyTo({
      center: coordinates,
      zoom: 12,
      duration: 1500,
    })

    marker.current?.remove()

    marker.current = new maptilersdk.Marker()
      .setLngLat(coordinates)
      .addTo(map.current)
  }, [selectedPlace])

  return (
    <div
      ref={mapContainer}
      className="h-full w-full"
    />
  )
}