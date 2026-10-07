import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

/**
 * Singleton: there is exactly one home page, pinned to the `homePage` document
 * ID by the Studio structure (see ../../structure.ts).
 */
export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'profileImage',
      title: 'Profile picture',
      type: 'image',
      description:
        'Shown at the top of the site sidebar, cropped to a circle. Use a square image for best results.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Describe the picture, e.g. "Portrait of Kinteyoi".',
          validation: (rule) => rule.required().warning('Alt text is important for accessibility and SEO'),
        }),
      ],
    }),
    defineField({
      name: 'hero',
      type: 'hero',
      description: 'Full-width banner at the top of the home page.',
    }),
  ],
  preview: {
    select: {media: 'profileImage'},
    prepare: ({media}) => ({title: 'Home page', media}),
  },
})
