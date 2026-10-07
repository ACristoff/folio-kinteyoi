import {defineArrayMember, defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'
import {altField, pixelArtField} from '../objects/imageFields'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 3,
      description: 'Short description shown in the project list and in search results.',
      validation: (rule) => rule.max(200).warning('Keep it under 200 characters for best SEO'),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: {hotspot: true},
      fields: [altField, pixelArtField],
    }),
    defineField({
      name: 'role',
      type: 'string',
      description: 'Your role on the project, e.g. "Design & front-end development".',
    }),
    defineField({
      name: 'technologies',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'projectUrl',
      title: 'Live URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({scheme: ['http', 'https']}).error('Must be a valid URL starting with http:// or https://'),
    }),
    defineField({
      name: 'repoUrl',
      title: 'Repository URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({scheme: ['http', 'https']}).error('Must be a valid URL starting with http:// or https://'),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'date',
      description: 'Used to order projects, newest first.',
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [altField, pixelArtField, defineField({name: 'caption', type: 'string'})],
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Published at, newest first',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'role', media: 'coverImage'},
  },
})
