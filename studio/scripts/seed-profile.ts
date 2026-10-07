/**
 * Uploads the sample profile picture from ../samples/profile and sets it as
 * `profileImage` on the `homePage` DRAFT, so it shows up in the site sidebar
 * once you publish.
 *
 * Usage (from the studio folder):
 *   npx sanity exec scripts/seed-profile.ts --with-user-token
 *
 * Safe by default: it refuses to run if the draft already has a profile
 * picture. Pass --force to replace it. If there is a published homePage but no
 * draft, the draft is created as a copy of the published document first so
 * publishing it later keeps the hero intact.
 */
import {createReadStream} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-07'})
const SAMPLE = fileURLToPath(new URL('../../samples/profile/profile.png', import.meta.url))
const PUBLISHED_ID = 'homePage'
const DRAFT_ID = 'drafts.homePage'
const force = process.argv.includes('--force')

type HomePage = {_id: string; _type: 'homePage'; profileImage?: {asset?: {_ref: string}}} & Record<string, unknown>

async function main() {
  const docs = await client.fetch<HomePage[]>(`*[_id in [$published, $draft]]`, {
    published: PUBLISHED_ID,
    draft: DRAFT_ID,
  })
  const draft = docs.find((doc) => doc._id === DRAFT_ID)
  const published = docs.find((doc) => doc._id === PUBLISHED_ID)

  if (draft?.profileImage?.asset && !force) {
    console.log('The homePage draft already has a profile picture. Re-run with --force to replace it.')
    return
  }

  const asset = await client.assets.upload('image', createReadStream(SAMPLE), {filename: 'profile.png'})
  console.log(`uploaded profile.png -> ${asset._id}`)

  const profileImage = {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
    alt: 'Sample profile picture: white K on a teal and indigo circle',
  }

  // Start from the existing draft, else a copy of the published document, else an empty one.
  const {_rev: _ignored, ...base} = (draft ?? published ?? {_type: 'homePage'}) as HomePage & {_rev?: string}
  const doc = await client.createOrReplace({...base, _id: DRAFT_ID, _type: 'homePage', profileImage})
  console.log(`updated ${doc._id}. Open the Studio > Home page to review and publish.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
