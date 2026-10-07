import Image from 'next/image'

/**
 * Plain, serialisable description of one hero image. Built on the server
 * (see hero.tsx) so the client-side carousel never touches the URL builder.
 */
export interface HeroPictureProps {
  src: string
  alt: string
  /** Base64 LQIP from Sanity, used as the blur placeholder. */
  blurDataURL?: string
  /** CSS `object-position` derived from the Sanity hotspot, so CSS cropping keeps the focal point. */
  objectPosition?: string
  /** Skip the Next.js optimizer. Required for GIFs: any transform flattens them to a still frame. */
  unoptimized?: boolean
  priority?: boolean
  className?: string
}

/** The hero is full-bleed, so it is always as wide as the viewport. */
export const HERO_SIZES = '100vw'

export function HeroPicture({
  src,
  alt,
  blurDataURL,
  objectPosition,
  unoptimized,
  priority,
  className,
}: HeroPictureProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={HERO_SIZES}
      priority={priority}
      unoptimized={unoptimized}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
      className={['object-cover', className].filter(Boolean).join(' ')}
      style={objectPosition ? {objectPosition} : undefined}
    />
  )
}

/**
 * Full-bleed box the hero media fills: 70% of the small viewport height on
 * phones (so the browser chrome doesn't hide it), the full dynamic viewport
 * height from the md breakpoint up.
 */
export function HeroFrame({children, ...rest}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...rest}
      className={[
        'relative h-[70svh] w-full overflow-hidden bg-foreground/5 md:h-dvh',
        rest.className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

/** Resolved profile picture for the overlay. Built server-side in hero.tsx. */
export interface HeroAvatarProps {
  src: string
  alt: string
  blurDataURL?: string
}

export interface HeroOverlayProps {
  /** Profile picture shown above the name. */
  avatar?: HeroAvatarProps | null
  /** Large line, typically the site owner's name. */
  heading?: string | null
  /** Titles or disciplines, shown under the name. */
  subheading?: string | null
  /** Short bio. Each non-empty line is rendered as its own paragraph. */
  body?: string | null
}

/**
 * Centered stack over the hero media, in the order profile picture, name, titles, bio,
 * with a soft scrim so it stays readable on any image. Renders nothing when
 * every field is empty.
 */
export function HeroOverlay({avatar, heading, subheading, body}: HeroOverlayProps) {
  const paragraphs = (body ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (!avatar && !heading && !subheading && paragraphs.length === 0) return null

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/40 px-6 text-center text-foreground sm:gap-5">
      {avatar && (
        <div className="mb-2 size-28 overflow-hidden rounded-full shadow-lg ring-2 ring-moss sm:size-40">
          <Image
            src={avatar.src}
            alt={avatar.alt}
            width={160}
            height={160}
            sizes="(min-width: 40rem) 10rem, 7rem"
            priority
            placeholder={avatar.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={avatar.blurDataURL}
            className="size-full object-cover"
          />
        </div>
      )}
      {heading && (
        <h2 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight drop-shadow-md sm:text-6xl lg:text-7xl">
          {heading}
        </h2>
      )}
      {subheading && (
        <p className="max-w-2xl text-balance text-lg text-foreground/90 drop-shadow sm:text-2xl lg:text-3xl">
          {subheading}
        </p>
      )}
      {paragraphs.length > 0 && (
        <div className="mt-2 flex max-w-xl flex-col gap-2 text-pretty text-base leading-7 text-foreground/85 drop-shadow sm:text-lg sm:leading-8">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  )
}
