import Image from 'next/image'
import {PortableText, type PortableTextComponents} from 'next-sanity'
import type {PROJECT_QUERY_RESULT} from '@/sanity.types'
import {urlFor} from '@/sanity/image'
import {PixelArtImage} from './pixel-art-image'

type Body = NonNullable<NonNullable<PROJECT_QUERY_RESULT>['body']>
type BodyImage = Extract<Body[number], {_type: 'image'}>

/** Sanity image asset ids embed the dimensions: image-<hash>-<width>x<height>-<ext>. */
function dimensionsFromRef(ref: string | undefined) {
  const match = ref ? /-(\d+)x(\d+)-/.exec(ref) : null
  return match ? {width: Number(match[1]), height: Number(match[2])} : {width: 1200, height: 800}
}

const components: PortableTextComponents = {
  types: {
    image: ({value}: {value: BodyImage}) => {
      if (!value?.asset?._ref) return null
      const {width, height} = dimensionsFromRef(value.asset._ref)
      return (
        <figure className="my-8">
          {value.pixelArt ? (
            // Body images are not dereferenced, so the untouched file URL is built from the
            // asset reference alone: passing the image object would add the hotspot crop.
            <PixelArtImage
              src={urlFor(value.asset).url()}
              alt={value.alt || ''}
              width={width}
              height={height}
              className="rounded-lg"
            />
          ) : (
            <Image
              src={urlFor(value).width(1200).fit('max').auto('format').url()}
              alt={value.alt || ''}
              width={width}
              height={height}
              sizes="(min-width: 768px) 48rem, 100vw"
              className="h-auto w-full rounded-lg"
            />
          )}
          {value.caption && (
            <figcaption className="mt-2 text-sm text-foreground/60">{value.caption}</figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h2: ({children}) => (
      <h2 className="mt-10 mb-4 text-2xl font-semibold tracking-tight">{children}</h2>
    ),
    h3: ({children}) => <h3 className="mt-8 mb-3 text-xl font-semibold tracking-tight">{children}</h3>,
    blockquote: ({children}) => (
      <blockquote className="my-6 border-l-2 border-crimson pl-4 italic text-foreground/75">
        {children}
      </blockquote>
    ),
    normal: ({children}) => <p className="my-4 text-lg leading-8">{children}</p>,
  },
  list: {
    bullet: ({children}) => <ul className="my-4 list-disc space-y-2 pl-6 text-lg leading-8">{children}</ul>,
    number: ({children}) => <ol className="my-4 list-decimal space-y-2 pl-6 text-lg leading-8">{children}</ol>,
  },
  marks: {
    link: ({children, value}) => (
      <a
        href={value?.href}
        rel="noopener noreferrer"
        target={value?.href?.startsWith('/') ? undefined : '_blank'}
        className="underline decoration-crimson underline-offset-4 transition-colors hover:text-moss"
      >
        {children}
      </a>
    ),
  },
}

export function ProjectBody({value}: {value: Body}) {
  return (
    <div className="text-foreground/90">
      <PortableText value={value} components={components} />
    </div>
  )
}
