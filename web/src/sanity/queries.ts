import {defineQuery} from 'next-sanity'

const IMAGE_FIELDS = /* groq */ `
  asset->{
    _id,
    url,
    metadata {
      lqip,
      dimensions { width, height }
    }
  },
  alt,
  hotspot,
  crop,
  pixelArt
`

const IMAGE_PROJECTION = /* groq */ `{${IMAGE_FIELDS}}`

/** Just the sidebar's profile picture, fetched from the root layout on every page. */
export const PROFILE_QUERY = defineQuery(`
  *[_type == "homePage"][0]{
    profileImage ${IMAGE_PROJECTION}
  }
`)

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage"][0]{
    _id,
    profileImage ${IMAGE_PROJECTION},
    hero {
      variant,
      showProfile,
      heading,
      subheading,
      body,
      image ${IMAGE_PROJECTION},
      slides[]{ _key, ${IMAGE_FIELDS} },
      interval,
      gif ${IMAGE_PROJECTION}
    }
  }
`)

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]
  | order(publishedAt desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    role,
    technologies,
    publishedAt,
    coverImage ${IMAGE_PROJECTION}
  }
`)

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]{ "slug": slug.current }
`)

export const PROJECT_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    role,
    technologies,
    projectUrl,
    repoUrl,
    publishedAt,
    coverImage ${IMAGE_PROJECTION},
    body
  }
`)
