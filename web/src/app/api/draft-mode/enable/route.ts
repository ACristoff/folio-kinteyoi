import {defineEnableDraftMode} from 'next-sanity/draft-mode'
import {client} from '@/sanity/client'

const token = process.env.SANITY_API_READ_TOKEN

// Only wire up the handler when a token exists so the build succeeds without one.
const draftModeHandler = token
  ? defineEnableDraftMode({client: client.withConfig({token})})
  : undefined

export async function GET(request: Request) {
  if (!draftModeHandler) {
    return new Response(
      'Draft mode is not configured. Add a Viewer token as SANITY_API_READ_TOKEN in web/.env.local.',
      {status: 500},
    )
  }
  return draftModeHandler.GET(request)
}
