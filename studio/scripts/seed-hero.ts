/**
 * Uploads the sample hero media from ../samples/hero and creates a DRAFT
 * `homePage` document that has all three hero variants filled in, so you can
 * switch the "Variant" radio in the Studio and see each one immediately.
 *
 * Usage (from the studio folder):
 *   npx sanity exec scripts/seed-hero.ts --with-user-token
 *
 * Safe by default: it refuses to run if a homePage draft or published
 * document already exists. Pass --force to overwrite the draft anyway.
 * Nothing is published; delete the draft and the five assets to undo.
 */
import {createReadStream} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-10-07'})
const SAMPLES = fileURLToPath(new URL('../../samples/hero', import.meta.url))
const DRAFT_ID = 'drafts.homePage'
const force = process.argv.includes('--force')

async function upload(filename: string) {
  const asset = await client.assets.upload('image', createReadStream(path.join(SAMPLES, filename)), {
    filename,
  })
  console.log(`uploaded ${filename} -> ${asset._id}`)
  return {_type: 'reference' as const, _ref: asset._id}
}

async function main() {
  const existing = await client.fetch<string[]>(`*[_id in ["homePage", "drafts.homePage"]]._id`)
  if (existing.length > 0 && !force) {
    console.log(`Found ${existing.join(', ')}. Not touching it. Re-run with --force to overwrite the draft.`)
    return
  }

  const [image, slide1, slide2, slide3, gif, profile] = await Promise.all([
    upload('static-hero.jpg'),
    upload('slide-01.jpg'),
    upload('slide-02.jpg'),
    upload('slide-03.jpg'),
    upload('animated-hero.gif'),
    upload('profile.jpg'),
  ])

  const alt = (text: string) => ({alt: text})
  const doc = await client.createOrReplace({
    _id: DRAFT_ID,
    _type: 'homePage',
    profileImage: {_type: 'image', asset: profile, alt: 'Sample profile picture'},
    hero: {
      _type: 'hero',
      variant: 'carousel',
      showProfile: true,
      heading: 'Selected Work',
      subheading: 'Design, code and the space in between',
      body: [
        'I design and build interfaces that feel calm, fast and considered.',
        'Currently taking on select freelance work and open to collaborations.',
      ].join('\n'),
      image: {_type: 'image', asset: image, ...alt('Teal and indigo gradient sample')},
      slides: [
        {_type: 'image', _key: 'slide1', asset: slide1, ...alt('Sample slide one')},
        {_type: 'image', _key: 'slide2', asset: slide2, ...alt('Sample slide two')},
        {_type: 'image', _key: 'slide3', asset: slide3, ...alt('Sample slide three')},
      ],
      interval: 4,
      gif: {_type: 'image', asset: gif, ...alt('Animated gradient sample')},
    },
  })
  console.log(`created ${doc._id}. Open the Studio > Home page to review and publish.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
