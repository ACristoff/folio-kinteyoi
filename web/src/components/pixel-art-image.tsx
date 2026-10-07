import Image from 'next/image'
import type {CSSProperties} from 'react'

export interface PixelArtImageProps {
  /** The untouched asset file, with no CDN transforms (see `rawAssetUrl` in sanity/image.ts). */
  src: string
  alt: string
  /** Native size of the file in pixels. Drives the whole-number scaling in CSS. */
  width: number
  height: number
  /**
   * `inline`: the frame is as wide as its parent and as tall as the scaled image (body text).
   * `box`: the frame fills a parent-sized box in both directions (cards, hero). Give the frame
   * a definite size through `className`: an aspect ratio, a fixed height or `absolute inset-0`.
   */
  fit?: 'inline' | 'box'
  /** Applied to the frame, not the <img>. */
  className?: string
  priority?: boolean
}

/**
 * Pixel art, shown the way the artist drew it. The file is served as uploaded
 * (`unoptimized` keeps Next.js from re-encoding and resampling it), enlarged by a
 * whole-number factor and drawn with hard pixel edges. Styles live in globals.css
 * under `.pixel-art-frame`.
 */
export function PixelArtImage({src, alt, width, height, fit = 'inline', className, priority}: PixelArtImageProps) {
  const style = {'--pixel-w': width, '--pixel-h': height} as CSSProperties
  return (
    <div
      className={['pixel-art-frame', fit === 'box' && 'pixel-art-frame-box', 'bg-foreground/5', className]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized
        priority={priority}
        className="pixel-art"
      />
    </div>
  )
}
