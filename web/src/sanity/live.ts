import type {QueryParams} from 'next-sanity'

import {client} from './client'

/**
 * Lightweight fetch wrapper (next-sanity v9 has no defineLive).
 * Uses time-based revalidation so published edits appear within a minute.
 */
// In production, cache for 60s. In dev, never cache — so a publish in the
// Studio shows on the site with a single browser refresh (great for demos).
const DEFAULT_REVALIDATE = process.env.NODE_ENV === 'production' ? 60 : 0

export async function sanityFetch<T = unknown>({
  query,
  params = {},
  revalidate = DEFAULT_REVALIDATE,
}: {
  query: string
  params?: QueryParams
  revalidate?: number | false
  // Accepted for call-site parity; ignored (stega is disabled without a studioUrl).
  stega?: boolean
}): Promise<{data: T}> {
  const data = await client.fetch<T>(query, params, {
    next: {revalidate},
  })
  return {data}
}
