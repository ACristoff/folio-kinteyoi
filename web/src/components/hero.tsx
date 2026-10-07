import {stegaClean, type StegaBranded, type StegaCleaned} from 'next-sanity'
import type {HOME_PAGE_QUERY_RESULT} from '@/sanity.types'
import {urlFor} from '@/sanity/image'
import {HeroCarousel} from './hero-carousel'
import {
  HeroFrame,
  HeroOverlay,
  HeroPicture,
  type HeroAvatarProps,
  type HeroPictureProps,
} from './hero-picture'

type CleanHomePage = NonNullable<HOME_PAGE_QUERY_RESULT>
type CleanHeroValue = NonNullable<CleanHomePage['hero']>
type CleanProfileImage = NonNullable<CleanHomePage['profileImage']>
/** Accepts both plain results (`stega: false`) and stega-branded ones (draft mode), like `InferValue`. */
export type HeroValue = StegaCleaned<CleanHeroValue> | StegaBranded<CleanHeroValue>
export type HeroProfileImage = StegaCleaned<CleanProfileImage> | StegaBranded<CleanProfileImage>
type HeroImage = NonNullable<HeroValue['image']>
type HeroSlide = NonNullable<HeroValue['slides']>[number]

/**
 * Width requested from the Sanity CDN; the native aspect ratio is kept. The hero
 * box ranges from portrait on phones to full-screen on desktop, so cropping is
 * done in CSS (object-cover) with the hotspot steering object-position.
 */
const HERO_WIDTH = 2400
/** Largest size the profile picture renders at (10rem), doubled for 2x screens. */
const AVATAR_SIZE = 320

/**
 * Home page hero, driven by the `hero` object on the `homePage` singleton.
 * Renders a single image, a rotating banner or an animated GIF, full width of
 * the viewport (70svh on phones, full screen from md up), with optional centered
 * name, titles and bio on top.
 * Returns nothing when no usable media is set.
 */
export function Hero({
  value,
  profile,
}: {
  value: HeroValue | null | undefined
  /** The home page profile picture, shown above the name unless `showProfile` is off. */
  profile?: HeroProfileImage | null
}) {
  if (!value) return null

  // Heading text is rendered as-is (stega characters keep it clickable in Visual Editing).
  const overlay = (
    <HeroOverlay
      avatar={value.showProfile === false ? null : toAvatar(profile)}
      heading={value.heading}
      subheading={value.subheading}
      body={value.body}
    />
  )

  // `variant` is compared against literals, so strip Visual Editing's stega characters first.
  switch (stegaClean(value.variant)) {
    case 'image': {
      const picture = toPicture(value.image)
      if (!picture) return null
      return (
        <HeroFrame>
          <HeroPicture {...picture} priority />
          {overlay}
        </HeroFrame>
      )
    }

    case 'carousel': {
      const slides = (value.slides ?? []).flatMap((slide) => {
        const picture = toPicture(slide)
        return picture ? [{...picture, key: slide._key}] : []
      })
      if (slides.length === 0) return null
      if (slides.length === 1) {
        return (
          <HeroFrame>
            <HeroPicture {...slides[0]} priority />
            {overlay}
          </HeroFrame>
        )
      }
      return (
        <HeroCarousel slides={slides} intervalMs={(value.interval ?? 5) * 1000} overlay={overlay} />
      )
    }

    case 'gif': {
      const url = value.gif?.asset?.url
      if (!url) return null
      // The raw asset URL, untouched: any CDN or Next.js transform would flatten the animation.
      return (
        <HeroFrame>
          <HeroPicture
            src={url}
            alt={value.gif?.alt || ''}
            objectPosition={toObjectPosition(value.gif?.hotspot)}
            unoptimized
            priority
          />
          {overlay}
        </HeroFrame>
      )
    }

    default:
      return null
  }
}

/** Build the serialisable props for one Sanity image, or null when it has no asset. */
function toPicture(image: HeroImage | HeroSlide | null | undefined): HeroPictureProps | null {
  if (!image?.asset) return null
  return {
    src: urlFor(image).width(HERO_WIDTH).fit('max').auto('format').url(),
    alt: image.alt || '',
    blurDataURL: image.asset.metadata?.lqip ?? undefined,
    objectPosition: toObjectPosition(image.hotspot),
  }
}

/** Square, hotspot-aware crop for the circular profile picture, or null when unset. */
function toAvatar(image: HeroProfileImage | null | undefined): HeroAvatarProps | null {
  if (!image?.asset) return null
  return {
    src: urlFor(image).width(AVATAR_SIZE).height(AVATAR_SIZE).fit('crop').auto('format').url(),
    alt: image.alt || '',
    blurDataURL: image.asset.metadata?.lqip ?? undefined,
  }
}

/** Sanity hotspots are 0..1 fractions; CSS object-position takes percentages. */
function toObjectPosition(hotspot: {x?: number; y?: number} | null | undefined): string | undefined {
  if (hotspot?.x == null || hotspot?.y == null) return undefined
  return `${(hotspot.x * 100).toFixed(2)}% ${(hotspot.y * 100).toFixed(2)}%`
}
