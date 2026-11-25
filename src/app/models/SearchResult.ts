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

  iso3?: string
  iso4217?: string
  country_info_src?: {
    src_url: string           //https://www.viaggiaresicuri.it/schede_paese/DZA.json
    passport_origin: string   //infoRequisitiIngresso.Passaporto.contenuto
    passport?: string
    visa_origin: string       //infoRequisitiIngresso.Visto-di-ingresso.contenuto
    visa?: string
    vaccines_orig: string     //infoSituazioneSanitaria.Vaccinazioni-obbligatorie.contenuto
    vaccines?: string
    terrorism_origin: string  //infoSicurezza.Rischio-terrorismo.contenuto
    terrorism?: string
    laws_origin: string       //infoSicurezza.Normative-locali-rilevanti.contenuto
    laws?: string

    info_news_url: string     //http://www.viaggiaresicuri.it/ultima_ora/DZA.json
    news?: string[]           //ultima_ora.titolo
  }

  currency_info_src?: {
    src_url: string           //https://api.frankfurter.dev/v2/rate/EUR/DZD
    rate: number
  }
}


// export type SearchResult = {
//   id: string
//   type: string
//   text?: string
//   text_it?: string

//   coordinates: {
//     latitude: number
//     longitude: number
//   }

//   address?: string
//   address_it?: string
//   country_code2?: string
//   country_code3?: string
//   currency_code?: string
//   wikidata?: string

//   context?: {
//    id: string
//    text: string
//    text_it?: string
//    country_code?: string
//    wikidata?: string
//    kind?: string
//    language?: string
//   }[]
  
//   country_info_src?: {
//     src_url: string           //https://www.viaggiaresicuri.it/schede_paese/DZA.json
//     passport_origin: string   //infoRequisitiIngresso.Passaporto.contenuto
//     passport?: string
//     visa_origin: string       //infoRequisitiIngresso.Visto-di-ingresso.contenuto
//     visa?: string
//     //currency_origin: string   //infoPrimoPiano.Moneta.contenuto
//     //currency?: string
//     vaccines_orig: string     //infoSituazioneSanitaria.Vaccinazioni-obbligatorie.contenuto
//     vaccines?: string
//     terrorism_origin: string  //infoSicurezza.Rischio-terrorismo.contenuto
//     terrorism?: string
//     laws_origin: string       //infoSicurezza.Normative-locali-rilevanti.contenuto
//     laws?: string

//     info_news_url: string   //http://www.viaggiaresicuri.it/ultima_ora/DZA.json
//     news?: string[]          //ultima_ora.titolo
//   }

//   currency_info_src?: {
//     src_url: string           //https://api.frankfurter.dev/v2/rate/EUR/DZD
//     rate: number
//   }
// }