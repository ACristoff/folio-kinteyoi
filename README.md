# folio-kinteyoi

Portfolio site with content in [Sanity](https://www.sanity.io) and a [Next.js](https://nextjs.org) front end.

| Folder    | What it is                                                              | Dev URL               |
| --------- | ----------------------------------------------------------------------- | --------------------- |
| `studio/` | Standalone Sanity Studio (project `zh1m66oz`, dataset `production`)     | http://localhost:3333 |
| `web/`    | Next.js App Router site with Cache Components, reads content from Sanity | http://localhost:3000 |

Each folder manages its own dependencies. There is no workspace tooling at the root.

## Run locally

Use two terminals:

```bash
cd studio && npm run dev   # Sanity Studio
cd web && npm run dev      # Next.js site
```

If port 3000 is busy, Next picks another one (e.g. 3001). Allow it for CORS or Sanity Live cannot connect from the browser and cached pages will never refresh after content changes:

```bash
cd studio && npx sanity cors add http://localhost:3001 --credentials
```

## Environment variables

`web/.env.local` (gitignored, see `web/.env.example`):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=zh1m66oz
NEXT_PUBLIC_SANITY_DATASET=production
# Optional, server-only. Enables draft previews and the Studio's Presentation tool.
SANITY_API_READ_TOKEN=
```

Create the token with the **Viewer** role at <https://www.sanity.io/manage/project/zh1m66oz/api#tokens>. Without it the site only shows published content, which is fine for production.

## Content model

Schema lives in `studio/schemaTypes/`.

- `project` (documents/): title, slug, summary, cover image, role, technologies, links, publish date, rich-text body.
- `homePage` (documents/): singleton pinned to the `homePage` document ID by `studio/structure.ts`. Holds the `profileImage` shown in the site sidebar (`web/src/components/site-sidebar.tsx`) and the `hero`.
- `hero` (objects/): the full-width banner at the top of the home page. `variant` picks one of three shapes: a single hotspot-cropped `image`, a rotating banner of `slides` advancing every `interval` seconds, or an animated `gif`. `showProfile` (default on) puts the home page `profileImage` in a circle above the name, followed by `heading` (name), `subheading` (titles) and `body` (bio, one paragraph per line). GIFs are served untransformed (any CDN or Next.js resize would flatten them to a still frame), so keep them reasonably sized. Rendered by `web/src/components/hero.tsx`.

Sample hero media lives in `samples/hero/` (four 21:9 JPEGs, one animated GIF and a square profile placeholder, generated locally). To load them into a `homePage` draft with all three variants pre-filled:

```bash
cd studio && npx sanity exec scripts/seed-hero.ts --with-user-token
```

It refuses to overwrite an existing `homePage`; pass `--force` to replace the draft.

A sample profile picture lives in `samples/profile/profile.png` (512x512, generated locally). To upload it and set it as the `homePage` draft's `profileImage`:

```bash
cd studio && npx sanity exec scripts/seed-profile.ts --with-user-token
```

It leaves an existing profile picture alone; pass `--force` to replace it.

After changing the schema or any GROQ query in `web/src`:

```bash
cd studio && npm run typegen     # regenerates web/sanity.types.ts (also runs automatically during `sanity dev`)
cd studio && npx sanity schemas deploy   # publishes the schema so Sanity MCP / AI tooling can see it
```

## Data fetching in `web`

- `src/sanity/queries.ts` holds the GROQ queries, typed by TypeGen.
- `src/sanity/live.ts` sets up the Live Content API. Every read goes through `cachedSanity`, the app's single `'use cache'` boundary, so pages are cached until Sanity reports a change.
- Draft mode resolves `perspective`/`stega` outside the cache boundary and passes them in as props. See `src/app/page.tsx` for the pattern.

## Previews and Visual Editing

1. Add `SANITY_API_READ_TOKEN` to `web/.env.local`.
2. Start both dev servers and open the **Presentation** tool in the Studio. It loads the site from `http://localhost:3000` and enables draft mode via `/api/draft-mode/enable`.
3. For a deployed Studio, set `SANITY_STUDIO_PREVIEW_ORIGIN` to the production site URL and allow it for CORS:

```bash
cd studio && npx sanity cors add https://your-site.example --credentials
```

`http://localhost:3000` is already allowed.
