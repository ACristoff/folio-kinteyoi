import {createImageUrlBuilder} from '@sanity/image-url'
import {stegaClean} from 'next-sanity'
import {dataset, projectId} from './env'

const builder = createImageUrlBuilder({projectId, dataset})

export type SanityImageSource = Parameters<typeof builder.image>[0]

export const urlFor = (source: SanityImageSource) => builder.image(source)

/** The subset of a dereferenced image asset the queries project (see `IMAGE_FIELDS`). */
interface QueriedAsset {
  url?: string | null
  metadata?: {dimensions?: {width?: number | null; height?: number | null} | null} | null
}

export interface PixelArtSource {
  /** The untouched file: no crop, resize or format conversion. */
  src: string
  /** Native size in pixels. */
  width: number
  height: number
}

/**
 * What a pixel-art image needs to render crisply: the raw asset URL and its
 * native size. Returns null when the asset is missing either, so callers can
 * fall back to the regular pipeline.
 *
 * The URL comes from the asset, never from `urlFor(image)`: the builder turns a
 * hotspot or crop on the image object into a `rect=` parameter, and any such
 * transform resamples the pixels.
 */
export function toPixelArtSource(asset: QueriedAsset | null | undefined): PixelArtSource | null {
  const src = asset?.url ? stegaClean(asset.url) : null
  const {width, height} = asset?.metadata?.dimensions ?? {}
  if (!src || !width || !height) return null
  return {src, width, height}
}
