'use client'

import { useEffect, useState } from 'react'
import { SearchResult } from '../models/SearchResult'
import { createClient } from '@/lib/supabase'

type PlaceDetailsPanelProps = {
  place: SearchResult
  onClose: () => void
}

export default function PlaceDetailsPanel({ place, onClose }: PlaceDetailsPanelProps) {
  const [visited, setVisited] = useState(false)
  const [favorite, setFavorite] = useState(false)
  const [wishlist, setWishlist] = useState(false)
  const [visitedAt, setVisitedAt] = useState<string | null>(null)
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [showUnvisitConfirmation, setShowUnvisitConfirmation] = useState(false);

  const coordinates = place.center ?? place.geometry?.coordinates
  const supabase = createClient()

  type IconField = 'favorite' | 'visited' | 'wishlist';

  useEffect(() => {
    let cancelled = false;

    async function loadPreferences() {
      setLoadingPreferences(true);

      // Reset dei valori quando cambia il luogo
      setFavorite(false);
      setVisited(false);
      setWishlist(false);
      setVisitedAt(null);

      const wikidataId = place.properties?.wikidata;

      if (!wikidataId) {
        setLoadingPreferences(false);
        return;
      }

      try {
        // Recupera l'utente autenticato
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error('Errore recupero utente:', userError);
          return;
        }

        // Cerca il luogo nel database
        const { data: savedPlace, error: placeError } = await supabase
          .from('places')
          .select('id')
          .eq('external_provider', 'wikidata')
          .eq('external_id', wikidataId)
          .maybeSingle();

        if (placeError) {
          console.error('Errore recupero luogo:', placeError);
          return;
        }

        // Il luogo non è ancora presente nel database
        if (!savedPlace) return;

        // Recupera le preferenze dell'utente per quel luogo
        const { data: preferences, error: preferencesError } = await supabase
          .from('user_places')
          .select('favorite, visited, wishlist, visited_at')
          .eq('user_id', user.id)
          .eq('place_id', savedPlace.id)
          .maybeSingle();

        if (preferencesError) {
          console.error('Errore recupero preferenze:', preferencesError);
          return;
        }

        if (!cancelled && preferences) {
          setFavorite(preferences.favorite ?? false);
          setVisited(preferences.visited ?? false);
          setWishlist(preferences.wishlist ?? false);
          setVisitedAt(preferences.visited_at);
        }
      } catch (error) {
        console.error('Errore caricamento preferenze:', error);
      } finally {
        if (!cancelled) {
          setLoadingPreferences(false);
        }
      }
    }

    loadPreferences();

    return () => {
      cancelled = true;
    };
  }, [place.properties?.wikidata]);

  const handleIcons = async (field: IconField) => {
    const currentValue = { favorite, visited, wishlist }[field];
    const newValue = !currentValue;

    const updateState = (value: boolean) => {
      if (field === 'favorite') setFavorite(value);
      if (field === 'visited') setVisited(value);
      if (field === 'wishlist') setWishlist(value);
    };

    const wikidataId = place.properties?.wikidata

    if (!wikidataId) {
      console.error('Identificativo Wikidata non disponibile')
      return
    }

    let { data: savedPlace, error: placeError } = await supabase.from('places')
                                                                .select('id')
                                                                .eq('external_provider', 'wikidata').eq('external_id', wikidataId)
                                                                .maybeSingle()

    if (placeError) {
      console.error('Errore nel recupero del luogo:', placeError);
      return;
    }

    // Se il luogo non esiste, lo creiamo
    if (!savedPlace) {
      const { data: newPlace, error: insertError } = await supabase.from('places')
                                                                   .insert({
                                                                      title: place.text ?? place.text_it ?? wikidataId,
                                                                      external_provider: 'wikidata',
                                                                      external_id: wikidataId,
                                                                      latitude: coordinates?.[1] ?? null,
                                                                      longitude: coordinates?.[0] ?? null,
                                                                   }).select('id')
                                                                   .single();

      if (insertError || !newPlace) {
        console.error('Errore nella creazione del luogo:', insertError);
        return;
      }

      savedPlace = newPlace;
    }

    // Gestione della data di visita
    let newVisitedAt = visitedAt;
    if (field === 'visited') {
      newVisitedAt = newValue ? (visitedAt ?? getLocalDateTime()) : null;
      setVisitedAt(newVisitedAt);
    }

    updateState(newValue);

    // Salva il preferito/stato dell'utente
    const payload: { place_id: number; [key: string]: string | number | boolean | null; } = { place_id: savedPlace.id, [field]: newValue };
    if (field === 'visited')
      payload.visited_at = newVisitedAt;

    const { error } = await supabase.from('user_places')
                                    .upsert(payload, { onConflict: 'user_id,place_id' });

    if (error) {
      console.error(`Error updating ${field}:`, error);
      updateState(currentValue);

      if (field === 'visited')
        setVisitedAt(visitedAt);
    }
  };

  const getLocalDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;

    return new Date(now.getTime() - offset).toISOString().slice(0, 19);
  };

  const handleVisitedDateChange = async (date: string) => {
    setVisitedAt(date ? `${date} 00:00:00` : null);
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Utente non autenticato', userError);
      return;
    }

    const wikidataId = place.properties?.wikidata;
    if (!wikidataId)
      return;

    const { data: savedPlace, error: placeError } = await supabase.from('places')
                                                                  .select('id')
                                                                  .eq('external_provider', 'wikidata').eq('external_id', wikidataId)
                                                                  .maybeSingle();

    if (placeError || !savedPlace) {
      console.error('Errore nel recupero del luogo', placeError);
      return;
    }

    const { error } = await supabase.from('user_places')
                                    .update({ visited_at: date ? `${date} 00:00:00` : null })
                                    .eq('user_id', user.id).eq('place_id', savedPlace.id);

    if (error)
      console.error('Errore nel salvataggio della data', error);
  };

  return (
    <aside className="absolute right-5 top-5 bottom-5 z-30 flex w-[380px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
      {/* Header */}
      <div className="relative border-b border-slate-100 px-6 pt-6 pb-2">
        <button type="button" onClick={onClose} aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" >
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
        <div className="inline-flex items-center mt-3 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-700">
          {place.properties?.place_designation}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2">

        {/* Status */}
        <section className="my-1.5">
          {/* <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Your place
          </p> */}

          {loadingPreferences ? (
            <div className="py-6 text-center text-sm text-slate-500">
              Loading preferences...
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {/* Favorite */}
                <button type="button" onClick={() => handleIcons('favorite')}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${ favorite ? 'border-rose-200 bg-rose-50'
                                                                                                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'}`} >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${ favorite ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500' }`}>
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M20.8 8.8c0 5.4-8.8 10.2-8.8 10.2S3.2 14.2 3.2 8.8A4.8 4.8 0 0 1 8 4a5.2 5.2 0 0 1 4 2.1A5.2 5.2 0 0 1 16 4a4.8 4.8 0 0 1 4.8 4.8Z" />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Favorite
                      </p>

                      <p className="text-xs text-slate-500">
                        {favorite ? 'Added to your favorites' : 'Add this place to favorites'}
                      </p>
                    </div>

                    <div className={`h-5 w-5 rounded-full border-2 ${ favorite ? 'border-rose-500 bg-rose-500' : 'border-slate-300' }`}>
                      {favorite && (
                        <svg className="h-full w-full text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m5 10 3 3 7-7" />
                        </svg>
                      )}
                    </div>
                </button>

                {/* Visited */}
                <div className={`rounded-2xl border transition ${ visited ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white' }`}>
                  {/* Parte superiore: pulsante per attivare/disattivare */}
                  <button type="button" className="flex w-full items-center gap-4 p-4 text-left"
                    onClick={() => { if (visited)
                        setShowUnvisitConfirmation(true);
                      else
                        handleIcons('visited');
                    }}>

                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${ visited ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500' }`}>
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m5 12 4 4L19 6" />
                        </svg>
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          Visited
                        </p>
                        <p className="text-xs text-slate-500">
                          {visited ? 'You have visited this place' : 'Mark this place as visited'}
                        </p>
                      </div>

                      <div className={`h-5 w-5 rounded-full border-2 ${ visited ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300' }`}>
                        {visited && (
                          <svg className="h-full w-full text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="m5 10 3 3 7-7" />
                          </svg>
                        )}
                      </div>
                  </button>

                  {/* Parte inferiore: data della visita */}
                  <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${ visited ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0' }`}>
                    <div className="overflow-hidden">
                      <div className="flex items-center justify-between gap-3 px-4 py-3">
                        <label htmlFor="visited-at" className="flex-1 text-sm font-semibold text-slate-800">
                          Prima visita
                        </label>

                        <input id="visited-at" type="date" value={visitedAt?.slice(0, 10) ?? ''} tabIndex={visited ? 0 : -1} disabled={!visited}
                          className="w-1/2 min-w-0 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-700" 
                          onChange={(e) => { if (e.target.value) handleVisitedDateChange(e.target.value) }}/>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wishlist */}
                <button type="button" onClick={() => handleIcons('wishlist')}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${ wishlist ? 'border-blue-200 bg-blue-50'
                                                                                                                     : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50' }`}>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${ wishlist ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500' }`}>
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill={wishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" >
                        <path d="M6 3h12v18l-6-4-6 4V3Z" />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Wishlist
                      </p>

                      <p className="text-xs text-slate-500">
                        {wishlist ? 'Saved for a future trip' : 'Add this place to your wishlist'}
                      </p>
                    </div>

                    <div className={`h-5 w-5 rounded-full border-2 ${ wishlist ? 'border-blue-500 bg-blue-500' : 'border-slate-300' }`}>
                      {wishlist && (
                        <svg className="h-full w-full text-white" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m5 10 3 3 7-7" />
                        </svg>
                      )}
                    </div>
                </button>
              </div>
            </>
          )}

          
        </section>

        {/* News */}
        {place.country_info_src?.news && place.country_info_src.news.length > 0 && (
          <section className="mt-6 mb-4">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              News
            </p>

            <div className="rounded-2xl border border-red-300 bg-red-50 py-3 px-4">
              {/* <p className="text-xs text-slate-400">
                Latitude
              </p>  */}

              {place.country_info_src.news.length == 1 ? (
                <p className="font-mono text-sm font-medium text-slate-800">{place.country_info_src.news[0]}</p>
              ) : (
                <ul className="list-disc space-y-2 pl-5 font-mono font-medium text-sm text-slate-800">
                  {place.country_info_src.news.map((news, index) => (
                    <li key={`${news}-${index}`}>{news}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* Vaccines */}
        {place.country_info_src?.vaccines && (
          <section className="">
            <div className="rounded-2xl border border-yellow-300 bg-orange-50 py-3 px-4">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.16em] text-yellow-500">
                Vaccines
              </p>
              <p className="mt-1 font-mono text-sm text-slate-800">
                {place.country_info_src?.vaccines}
              </p>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-white py-4.5 px-6">
        <button type="button"
          className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99]">
            Organize a trip!
        </button>
      </div>

      {/* Confirmation popup */}
{showUnvisitConfirmation && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3l-8.5-14.1a2 2 0 0 0-3.4 0Z" />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-slate-900">
        Conferma rimozione
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Sicuro di voler cancellare il flag <strong>Visited</strong> e quindi
        eliminare la data della prima visita?
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setShowUnvisitConfirmation(false)}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          No
        </button>

        <button
          type="button"
          onClick={async () => {
            await handleIcons('visited');
            setShowUnvisitConfirmation(false);
          }}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Sì, elimina
        </button>
      </div>
    </div>
  </div>
)}
    </aside>
  )
}