import {draftMode} from 'next/headers'
import type {StegaBranded, StegaCleaned} from 'next-sanity'
import {Suspense} from 'react'
import type {PROFILE_QUERY_RESULT} from '@/sanity.types'
import {toPixelArtSource, urlFor} from '@/sanity/image'
import {cachedSanity, getDynamicFetchOptions, type DynamicFetchOptions} from '@/sanity/live'
import {PROFILE_QUERY} from '@/sanity/queries'
import {Sidebar, type SidebarProfile} from './sidebar'

/** Largest size the avatar is rendered at, doubled for 2x screens. */
const AVATAR_SIZE = 192

/**
 * Server wrapper that loads the profile picture from the `homePage` singleton
 * and hands a plain, serialisable description of it to the client `Sidebar`.
 * Follows the same draft-mode pattern as `app/page.tsx`.
 */
export async function SiteSidebar() {
  const {isEnabled: isDraftMode} = await draftMode()

  if (isDraftMode) {
    return (
      <Suspense fallback={<Sidebar profile={null} />}>
        <DynamicSidebar />
      </Suspense>
    )
  }

  return <SidebarWithProfile perspective="published" stega={false} />
}

async function DynamicSidebar() {
  const options = await getDynamicFetchOptions()
  return <SidebarWithProfile {...options} />
}

async function SidebarWithProfile(options: DynamicFetchOptions) {
  const {data} = await cachedSanity({query: PROFILE_QUERY, ...options})
  return <Sidebar profile={toProfile(data?.profileImage)} />
}

type CleanProfileImage = NonNullable<NonNullable<PROFILE_QUERY_RESULT>['profileImage']>
/** Accepts both plain results (`stega: false`) and stega-branded ones (draft mode). */
type ProfileImage = StegaCleaned<CleanProfileImage> | StegaBranded<CleanProfileImage>

function toProfile(image: ProfileImage | null | undefined): SidebarProfile | null {
  if (!image?.asset) return null
  const alt = image.alt || ''

  const pixel = image.pixelArt ? toPixelArtSource(image.asset) : null
  if (pixel) return {src: pixel.src, alt, pixelArt: true}

  return {
    src: urlFor(image).width(AVATAR_SIZE).height(AVATAR_SIZE).fit('crop').auto('format').url(),
    alt,
    lqip: image.asset.metadata?.lqip ?? undefined,
  }
}
