import Image from 'next/image'
import {urlFor} from '@/sanity/image'
import type {PROJECTS_QUERY_RESULT} from '@/sanity.types'

export type ProjectImage = NonNullable<PROJECTS_QUERY_RESULT[number]['coverImage']>

interface SanityImageProps {
  value: ProjectImage | null | undefined
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
}

export function SanityImage({value, width = 1200, height, className, priority, sizes}: SanityImageProps) {
  if (!value?.asset) return null

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
