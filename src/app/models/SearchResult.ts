export type SearchResult = {
  id: string
  type: string
  text?: string
  text_it?: string

  place_name?: string
  place_name_it?: string

  center?: [number, number]

  geometry?: {
    type: string
    coordinates: [number, number]
  }

  bbox?: [
    number,
    number,
    number,
    number
  ]

  properties?: {
    ref?: string
    country_code?: string
    wikidata?: string
    kind?: string
    place_designation?: string
    place_type_name?: string[]
  }

  context?: {
    id: string
    text: string
    text_it?: string
    country_code?: string
    wikidata?: string
    kind?: string
    language?: string
  }[]
}