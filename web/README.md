# web

Next.js 16 (App Router, Cache Components) front end for the portfolio. Content comes from the Sanity Studio in `../studio`.

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

Copy `.env.example` to `.env.local` and fill in the values. `SANITY_API_READ_TOKEN` is optional and only needed for draft previews.

## Where things are

| Path                              | Purpose                                                        |
| --------------------------------- | -------------------------------------------------------------- |
| `src/sanity/env.ts`               | Project id, dataset, pinned API version                        |
| `src/sanity/client.ts`            | `createClient` from `next-sanity`                              |
| `src/sanity/live.ts`              | `defineLive`, the `cachedSanity` cache boundary, draft helpers |
| `src/sanity/queries.ts`           | GROQ queries (`defineQuery`), typed by TypeGen                 |
| `src/sanity/image.ts`             | `urlFor` image URL builder, `toPixelArtSource` for pixel art   |
| `src/components/pixel-art-image.tsx` | Untouched file, whole-number scaled with hard pixel edges   |
| `sanity.types.ts`                 | Generated. Run `npm run typegen` in `../studio` to refresh     |
| `src/app/page.tsx`                | Project list                                                   |
| `src/app/projects/[slug]/page.tsx`| Project detail                                                 |
| `src/app/api/draft-mode/*`        | Enable/disable draft mode for the Presentation tool            |

See the root README for the full setup.

## Pixel art

Every image in the Studio has a **Pixel art** toggle. When it is on, the front end
skips the Sanity CDN transforms and the Next.js image optimizer (both resample and
re-encode, which blurs pixel edges), serves the uploaded PNG or GIF as-is, and draws it
with `image-rendering: pixelated`. `PixelArtImage` then enlarges it by the largest
whole number that fits its box, so every source pixel is the same size on screen, and
centres it on a flat background instead of cropping. Upload pixel art at native size.
