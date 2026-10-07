'use client'

import {useVisualEditingEnvironment} from 'next-sanity/hooks'

export function DisableDraftMode() {
  const environment = useVisualEditingEnvironment()
  // Only show when previewing drafts outside the Presentation Tool, which has its own controls.
  if (environment !== 'standalone') return null

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed right-4 bottom-4 rounded-full bg-crimson px-4 py-2 text-sm font-medium text-foreground shadow-lg transition-colors hover:bg-crimson/80"
    >
      Disable Draft Mode
    </a>
  )
}
