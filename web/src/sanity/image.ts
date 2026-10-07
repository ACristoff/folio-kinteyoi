import {createImageUrlBuilder} from '@sanity/image-url'
import {dataset, projectId} from './env'

const builder = createImageUrlBuilder({projectId, dataset})

export type SanityImageSource = Parameters<typeof builder.image>[0]

export const urlFor = (source: SanityImageSource) => builder.image(source)
