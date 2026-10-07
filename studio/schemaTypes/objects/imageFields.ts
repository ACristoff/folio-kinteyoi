import {defineField} from 'sanity'

/** Alt text. Required as a warning so editors are nudged without being blocked. */
export const altField = defineField({
  name: 'alt',
  type: 'string',
  title: 'Alternative text',
  validation: (rule) => rule.required().warning('Alt text is important for accessibility and SEO'),
})

/**
 * Marks an image as pixel art. The front end then serves the uploaded file
 * untouched (no resize, crop or format conversion) and enlarges it by whole
 * numbers with hard pixel edges, so a 64x64 sprite stays crisp at any size.
 * The hotspot is ignored for these images.
 */
export const pixelArtField = defineField({
  name: 'pixelArt',
  title: 'Pixel art',
  type: 'boolean',
  description:
    'Turn on for sprites and other pixel art. The file is shown exactly as uploaded and enlarged with sharp pixel edges instead of being smoothed, cropped or converted. Upload at native size (1 image pixel = 1 art pixel) as PNG or GIF.',
  initialValue: false,
})
