import {cookies, draftMode} from 'next/headers'
import {
  defineLive,
  resolvePerspectiveFromCookies,
  resolveVariantFromCookies,
  type LivePerspective,
  type StrictDefinedFetchType,
} from 'next-sanity/live'
import {client} from './client'

// Server-only. Without it only published content is fetched; drafts and the
// Presentation tool need a Viewer token in SANITY_API_READ_TOKEN.
const token = process.env.SANITY_API_READ_TOKEN

export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  strict: true,
})

/**
 * The app's one shared 'use cache' boundary. `sanityFetch` calls
 * `cacheTag`/`cacheLife` internally but does not create the boundary itself,
 * so every data read goes through this wrapper. Sanity Live revalidates the
 * tags on content changes.
 */
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  'use cache'
  return sanityFetch(options)
}

export interface DynamicFetchOptions {
  perspective: LivePerspective
  variant?: string
  // A non-literal `boolean` brands `sanityFetch` data as possibly stega-encoded.
  stega: boolean
}

/**
 * Resolve draft-mode dependent options outside 'use cache' boundaries, then
 * pass them into cached components as props so they become part of the cache key.
 */
export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const {isEnabled: isDraftMode} = await draftMode()
  if (!isDraftMode) {
    return {perspective: 'published', stega: false}
  }

  const jar = await cookies()
  const perspective = await resolvePerspectiveFromCookies({cookies: jar})
  const variant = await resolveVariantFromCookies({cookies: jar})
  return {perspective: perspective ?? 'drafts', variant, stega: true}
}
