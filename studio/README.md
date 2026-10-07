# Sanity Studio

Standalone Studio for project `zh1m66oz`, dataset `production`. The Next.js site lives in `../web`.

```bash
npm run dev        # http://localhost:3333
npm run typegen    # extract schema + generate ../web/sanity.types.ts
npm run deploy     # host the Studio on sanity.studio
npx sanity schemas deploy   # publish the schema to the Content Lake (needed for MCP/AI tooling)
```

- Schema types: `schemaTypes/` (register new types in `schemaTypes/index.ts`).
- Presentation tool: `presentation/resolve.ts` maps documents to front-end URLs. Preview origin defaults to `http://localhost:3000`; override with `SANITY_STUDIO_PREVIEW_ORIGIN`.
- TypeGen config: `sanity.cli.ts`.

See the root README for the full setup.
