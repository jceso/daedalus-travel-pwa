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
    currency_origin: string   //infoPrimoPiano.Moneta.contenuto
    currency?: string
    vaccines_orig: string     //infoSicurezza.Vaccinazioni-obbligatorie.contenuto
    vaccines?: string
    terrorism_origin: string  //infoSicurezza.Rischio-terrorismo.contenuto
    terrorism?: string
    laws_origin: string       //infoSicurezza.Normative-locali-rilevanti.contenuto
    laws?: string

    info_news_url: string   //http://www.viaggiaresicuri.it/ultima_ora/DZA.json
    news?: string[]          //ultima_ora.titolo
  }

  currency_info_src?: {
    src_url: string           //https://api.frankfurter.dev/v2/rate/EUR/DZD
    rate: number
  }

  //https://api.frankfurter.dev/v2/currencies
  // [
  //   {
  //     "iso_code": "TRY",
  //     "name": "Turkish Lira"
  //   },
  //   {
  //     "iso_code": "DZD",
  //     "name": "Algerian Dinar"
  //   },
  //   {
  //     "iso_code": "EUR",
  //     "name": "Euro"
  //   }
  // ]
  // Se invece non puoi modificare l'API

  // Allora possiamo fare una cosa altrettanto pulita: creare un mapping automatico tra il nome italiano che ricevi e il codice ISO 4217, magari usando una libreria/database delle valute invece di mantenere a mano centinaia di valori.

  // E c'è un'ulteriore possibilità interessante: se la tua API contiene anche il paese a cui appartiene quel contenuto, possiamo sfruttare paese + valuta per risolvere automaticamente il codice, evitando praticamente del tutto il mapping manuale.

  // Se mi fai vedere un esempio completo dell'oggetto API relativo a una nazione (ad esempio quello della Turchia, compreso il campo che identifica la nazione), posso dirti qual è secondo me la soluzione più robusta per automatizzare tutto.
}