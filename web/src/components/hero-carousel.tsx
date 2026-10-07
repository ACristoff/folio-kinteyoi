'use client'

import {useCallback, useEffect, useState} from 'react'
import {HeroFrame, HeroPicture, type HeroPictureProps} from './hero-picture'

export interface HeroCarouselProps {
  slides: Array<HeroPictureProps & {key: string}>
  /** Time each slide stays on screen before advancing. */
  intervalMs: number
  /** Rendered on top of the slides, e.g. the heading overlay. */
  overlay?: React.ReactNode
}

/**
 * Auto-advancing, cross-fading banner. Pauses while hovered or focused, and
 * does not auto-advance at all when the visitor prefers reduced motion.
 */
export function HeroCarousel({slides, intervalMs, overlay}: HeroCarouselProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const count = slides.length

  const goTo = useCallback((next: number) => setIndex(((next % count) + count) % count), [count])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (paused || reducedMotion || count < 2) return
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), intervalMs)
    return () => window.clearInterval(timer)
  }, [paused, reducedMotion, count, intervalMs])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured images"
      className="group/hero relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <HeroFrame aria-live={paused || reducedMotion ? 'polite' : 'off'}>
        {slides.map((slide, i) => {
          const active = i === index
          return (
            <div
              key={slide.key}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!active}
              className={[
                'absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none',
                active ? 'opacity-100' : 'pointer-events-none opacity-0',
              ].join(' ')}
            >
              <HeroPicture {...slide} priority={i === 0} />
            </div>
          )
        })}
        {overlay}
      </HeroFrame>

      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Previous slide"
        className={controlClass('left-3')}
      >
        <ChevronIcon direction="left" />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Next slide"
        className={controlClass('right-3')}
      >
        <ChevronIcon direction="right" />
      </button>

      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2" role="tablist" aria-label="Choose slide">
        {slides.map((slide, i) => (
          <button
            key={slide.key}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={[
              'h-2 w-2 rounded-full ring-1 ring-background/40 transition-colors',
              i === index ? 'bg-moss' : 'bg-foreground/40 hover:bg-foreground/70',
            ].join(' ')}
          />
        ))}
      </div>
    </section>
  )
}

function controlClass(position: string) {
  return [
    'absolute top-1/2 -translate-y-1/2 rounded-full bg-background/50 p-2 text-foreground opacity-0 transition-opacity',
    'hover:bg-background/70 hover:text-moss focus-visible:opacity-100 group-hover/hero:opacity-100',
    position,
  ].join(' ')
}

function ChevronIcon({direction}: {direction: 'left' | 'right'}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={direction === 'left' ? 'rotate-180' : undefined}
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  )
}
