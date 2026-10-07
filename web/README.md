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
| `src/sanity/image.ts`             | `urlFor` image URL builder                                     |
| `sanity.types.ts`                 | Generated. Run `npm run typegen` in `../studio` to refresh     |
| `src/app/page.tsx`                | Project list                                                   |
| `src/app/projects/[slug]/page.tsx`| Project detail                                                 |
| `src/app/api/draft-mode/*`        | Enable/disable draft mode for the Presentation tool            |

See the root README for the full setup.
