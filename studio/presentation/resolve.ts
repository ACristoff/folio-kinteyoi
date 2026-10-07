import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    homePage: defineLocations({
      locations: [{title: 'Home page', href: '/'}],
    }),
    project: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Untitled', href: `/projects/${doc?.slug}`},
          {title: 'Projects index', href: '/'},
        ],
      }),
    }),
  },
}
