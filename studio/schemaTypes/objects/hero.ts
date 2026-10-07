import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

export const HERO_VARIANTS = [
  {title: 'Single image', value: 'image'},
  {title: 'Rotating banner', value: 'carousel'},
  {title: 'Animated GIF', value: 'gif'},
]

type HeroParent = {variant?: string} | undefined

const altField = defineField({
  name: 'alt',
  type: 'string',
  title: 'Alternative text',
  validation: (rule) => rule.required().warning('Alt text is important for accessibility and SEO'),
})

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'variant',
      type: 'string',
      options: {list: HERO_VARIANTS, layout: 'radio', direction: 'horizontal'},
      initialValue: 'image',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'showProfile',
      title: 'Show profile picture',
      type: 'boolean',
      description: 'Shows the home page profile picture above the name.',
      initialValue: true,
    }),
    defineField({
      name: 'heading',
      title: 'Name',
      type: 'string',
      description: 'Optional. The large line centered on the hero.',
    }),
    defineField({
      name: 'subheading',
      title: 'Titles / disciplines',
      type: 'string',
      description: 'Optional. Shown under the name, e.g. "Designer & front-end developer".',
    }),
    defineField({
      name: 'body',
      title: 'Bio',
      type: 'text',
      rows: 3,
      description: 'Optional. A couple of sentences under the titles. Each line becomes its own paragraph.',
      validation: (rule) => rule.max(320).warning('Keep it short; this sits on top of an image.'),
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: {hotspot: true},
      fields: [altField],
      hidden: ({parent}) => (parent as HeroParent)?.variant !== 'image',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as HeroParent
          if (parent?.variant === 'image' && !value?.asset) return 'Pick an image for the hero'
          return true
        }),
    }),
    defineField({
      name: 'slides',
      type: 'array',
      description: 'Shown one at a time, in this order. Drag to reorder.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [altField],
        }),
      ],
      options: {layout: 'grid'},
      hidden: ({parent}) => (parent as HeroParent)?.variant !== 'carousel',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as HeroParent
          if (parent?.variant === 'carousel' && (!value || value.length < 2)) {
            return 'A rotating banner needs at least two slides'
          }
          return true
        }),
    }),
    defineField({
      name: 'interval',
      title: 'Seconds per slide',
      type: 'number',
      initialValue: 5,
      hidden: ({parent}) => (parent as HeroParent)?.variant !== 'carousel',
      validation: (rule) => rule.integer().min(2).max(30),
    }),
    defineField({
      name: 'gif',
      title: 'Animated GIF',
      type: 'image',
      description:
        'Served exactly as uploaded so the animation is preserved (no resizing or cropping). Keep the file size reasonable.',
      options: {accept: 'image/gif', hotspot: false},
      fields: [altField],
      hidden: ({parent}) => (parent as HeroParent)?.variant !== 'gif',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as HeroParent
          if (parent?.variant === 'gif' && !value?.asset) return 'Upload a GIF for the hero'
          return true
        }),
    }),
  ],
  preview: {
    select: {heading: 'heading', variant: 'variant', image: 'image', firstSlide: 'slides.0', gif: 'gif'},
    prepare: ({heading, variant, image, firstSlide, gif}) => {
      const variantTitle = HERO_VARIANTS.find((option) => option.value === variant)?.title ?? 'Hero'
      return {
        title: heading || variantTitle,
        subtitle: heading ? variantTitle : undefined,
        media: variant === 'carousel' ? firstSlide : variant === 'gif' ? gif : image,
      }
    },
  },
})
