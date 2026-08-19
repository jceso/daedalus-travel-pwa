'use client'

import Link from 'next/link'

const stats = [
  {
    label: 'Places visited',
    value: '42',
    change: '+6 this year',
    icon: '📍',
  },
  {
    label: 'Cities',
    value: '28',
    change: '+4 this year',
    icon: '🏙️',
  },
  {
    label: 'Countries',
    value: '11',
    change: '+2 this year',
    icon: '🌍',
  },
  {
    label: 'Planned trips',
    value: '4',
    change: '2 upcoming',
    icon: '✈️',
  },
]

const places = [
  {
    name: 'Positano',
    country: 'Italy',
    status: 'Visited',
    category: 'Coast',
    emoji: '🌊',
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    status: 'Want to visit',
    category: 'Culture',
    emoji: '⛩️',
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    status: 'Favorite',
    category: 'City',
    emoji: '🏛️',
  },
  {
    name: 'Reykjavík',
    country: 'Iceland',
    status: 'Want to visit',
    category: 'Nature',
    emoji: '❄️',
  },
]

const trips = [
  {
    title: 'Japan Adventure',
    dates: '12 – 25 October 2026',
    places: ['Tokyo', 'Kyoto', 'Osaka'],
    color: 'from-rose-100 to-orange-50',
    icon: '🇯🇵',
  },
  {
    title: 'Portugal Road Trip',
    dates: '4 – 11 December 2026',
    places: ['Lisbon', 'Porto', 'Sintra'],
    color: 'from-blue-100 to-cyan-50',
    icon: '🇵🇹',
  },
]

const recentActivity = [
  {
    action: 'Visited',
    place: 'Amalfi',
    country: 'Italy',
    date: '2 days ago',
    icon: '📍',
  },
  {
    action: 'Added to wishlist',
    place: 'Kyoto',
    country: 'Japan',
    date: '5 days ago',
    icon: '♡',
  },
  {
    action: 'Created trip',
    place: 'Japan Adventure',
    country: 'Japan',
    date: '1 week ago',
    icon: '✈️',
  },
]

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Your world,
                <br />
                <span className="text-slate-400">
                  one place at a time.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500">
                Keep track of the places you&apos;ve discovered, save the ones
                you&apos;re dreaming about, and organize your next adventures.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/places"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                Explore places
              </Link>

              <Link
                href="/trips"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                + Plan a trip
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Your travel overview
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                A snapshot of your travel history
              </p>
            </div>

            <span className="text-xs font-medium text-slate-400">
              2026
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg">
                    {stat.icon}
                  </span>

                  <span className="text-xs font-medium text-emerald-600">
                    {stat.change}
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-3xl font-bold tracking-tight text-slate-950">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-400">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Places */}
          <section className="lg:col-span-2">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Places
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Your recently saved destinations
                </p>
              </div>

              <Link
                href="/places"
                className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
              >
                View all →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {places.map((place) => (
                <Link
                  href="/places"
                  key={place.name}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex h-32 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 text-5xl">
                    {place.emoji}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-700">
                          {place.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          {place.country}
                        </p>
                      </div>

                      <span className="text-slate-300 transition group-hover:text-slate-500">
                        →
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                        {place.category}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          place.status === 'Visited'
                            ? 'bg-emerald-50 text-emerald-700'
                            : place.status === 'Favorite'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {place.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Chart */}
          <section>
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900">
                Travel footprint
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Cities and countries discovered
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold tracking-tight text-slate-950">
                    11
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    countries visited
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full border-8 border-slate-900 bg-white text-xs font-bold text-slate-900">
                  39%
                </div>
              </div>

              {/* Simple CSS chart */}
              <div className="mt-8">
                <div className="flex h-40 items-end gap-3">
                  {[42, 65, 52, 78, 58, 88, 72, 96].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="group flex flex-1 flex-col items-center justify-end gap-2"
                      >
                        <div
                          className="w-full rounded-t-lg bg-slate-900 transition group-hover:bg-slate-700"
                          style={{ height: `${height}%` }}
                        />

                        <span className="text-[9px] text-slate-400">
                          {2019 + index}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
                <div>
                  <p className="text-lg font-bold text-slate-900">28</p>
                  <p className="text-[10px] text-slate-400">
                    cities visited
                  </p>
                </div>

                <div>
                  <p className="text-lg font-bold text-slate-900">6</p>
                  <p className="text-[10px] text-slate-400">
                    this year
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Trips */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Upcoming trips
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Adventures you&apos;ve planned
              </p>
            </div>

            <Link
              href="/trips"
              className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
            >
              Manage trips →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {trips.map((trip) => (
              <Link
                href="/trips"
                key={trip.title}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${trip.color} p-6 transition hover:-translate-y-0.5 hover:shadow-md`}
              >
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <span className="text-3xl">{trip.icon}</span>

                    <h3 className="mt-5 text-xl font-bold tracking-tight text-slate-950">
                      {trip.title}
                    </h3>

                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {trip.dates}
                    </p>
                  </div>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-slate-600 transition group-hover:bg-white">
                    →
                  </span>
                </div>

                <div className="relative z-10 mt-8 flex flex-wrap gap-2">
                  {trip.places.map((place) => (
                    <span
                      key={place}
                      className="rounded-full bg-white/70 px-3 py-1.5 text-[10px] font-semibold text-slate-600"
                    >
                      {place}
                    </span>
                  ))}
                </div>

                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
              </Link>
            ))}
          </div>
        </section>

        {/* Activity + quick actions */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Activity */}
          <section className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900">
                Recent activity
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Your latest travel updates
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {recentActivity.map((activity, index) => (
                <div
                  key={`${activity.place}-${activity.date}`}
                  className={`flex items-center gap-4 p-5 ${
                    index !== recentActivity.length - 1
                      ? 'border-b border-slate-100'
                      : ''
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                    {activity.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">
                        {activity.action}
                      </span>{' '}
                      {activity.place}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {activity.country}
                    </p>
                  </div>

                  <span className="text-xs text-slate-400">
                    {activity.date}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Quick actions */}
          <section>
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-900">
                Quick actions
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Keep your travel archive updated
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/places"
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-lg text-white">
                  +
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">
                    Add a place
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Save somewhere you&apos;ve discovered
                  </p>
                </div>

                <span className="text-slate-300 transition group-hover:text-slate-600">
                  →
                </span>
              </Link>

              <Link
                href="/trips"
                className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-lg">
                  ✈️
                </div>

                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">
                    Plan a trip
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Build your next adventure
                  </p>
                </div>

                <span className="text-slate-300 transition group-hover:text-slate-600">
                  →
                </span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}