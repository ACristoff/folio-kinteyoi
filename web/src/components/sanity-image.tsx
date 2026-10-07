import Image from 'next/image'
import {toPixelArtSource, urlFor} from '@/sanity/image'
import type {PROJECTS_QUERY_RESULT} from '@/sanity.types'
import {PixelArtImage} from './pixel-art-image'

export type ProjectImage = NonNullable<PROJECTS_QUERY_RESULT[number]['coverImage']>

interface SanityImageProps {
  value: ProjectImage | null | undefined
  width?: number
  height?: number
  /** On the <img>; for pixel art, on the frame instead, so aspect, radius and hover classes still apply. */
  className?: string
  priority?: boolean
  sizes?: string
}

export function SanityImage({value, width = 1200, height, className, priority, sizes}: SanityImageProps) {
  if (!value?.asset) return null

  // Pixel art: the untouched file, enlarged by whole numbers and centred in the
  // same box the hotspot crop would otherwise fill.
  const pixel = value.pixelArt ? toPixelArtSource(value.asset) : null
  if (pixel) {
    return <PixelArtImage {...pixel} alt={value.alt || ''} fit="box" className={className} priority={priority} />
  }

  const renderedHeight = height ?? Math.round(width / 1.6)
  const lqip = value.asset.metadata?.lqip

  return (
    <Image
      className={className}
      src={urlFor(value).width(width).height(renderedHeight).fit('crop').auto('format').url()}
      alt={value.alt || ''}
      width={width}
      height={renderedHeight}
      priority={priority}
      sizes={sizes}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip ?? undefined}
    />
  )
}
