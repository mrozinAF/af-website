# Troubleshooting — When Something Goes Wrong

Start with the mental model, then jump to the specific symptom.

---

## The debugging mental model: content → query → component

Almost every "it's not showing up / it's wrong" bug lives in one of three layers.
Check them in this order — it saves the most time:

1. **Content** — Is the data actually in Sanity, and **published**? (Drafts don't
   show on the site.) Open the Studio and confirm the field is filled and the
   document is published. *Most problems stop here.*
2. **Query** — Is [`PAGE_QUERY`](./web/src/sanity/queries.ts) fetching the field?
   Flat fields ride the `...` spread; **images, references, and object arrays
   need an explicit projection.** A field that's blank on the site but filled in
   the Studio is very often a missing projection.
3. **Component** — Is the block handled in
   [`PageBuilder.tsx`](./web/src/components/PageBuilder.tsx) and does the
   component actually render that field? A block with no `case` renders nothing
   (the switch falls through to `null`).

A quick way to see raw data: use the Studio's **Vision** tool (GROQ playground)
to run the query and inspect exactly what comes back.

---

## Symptom → fix

### "Missing environment variable: NEXT_PUBLIC_SANITY_…" (frontend won't start)
[`web/src/sanity/env.ts`](./web/src/sanity/env.ts) throws when a required var is
absent. You didn't create the env file.
```bash
cd web && cp .env.example .env.local
```
Restart `pnpm dev`. See [SETUP.md](./SETUP.md#4-run-the-frontend-the-public-site).

### The frontend loads but shows no content / network or CORS errors
The browser is being blocked from reading the Sanity API. Add your local origin
to the project's allowed CORS origins at
[sanity.io/manage](https://www.sanity.io/manage) → **API → CORS Origins**
(`http://localhost:3000`). Also double-check `projectId`/`dataset` in
`.env.local` match `xk0vwazc` / `production`.
> **[NEEDS REVIEW: confirm `http://localhost:3000` is an allowed CORS origin.]**

### Can't log in to the Studio
Your Sanity account hasn't been granted access to project `xk0vwazc`. Ask an
admin to invite you. (Logging in with the wrong Google/GitHub identity is a
common cause — check which account you're signed in as.)

### I published a change but the site still shows the old content
- **Published, or just saved as a draft?** Re-check for the green Published state.
- **Caching.** In production the frontend caches for ~60s
  ([`live.ts`](./web/src/sanity/live.ts)); wait a minute and hard-refresh. In dev
  there's no cache, so if it's still stale in dev the issue is content or query,
  not caching.

### Images don't load / are broken
- The image must come from `cdn.sanity.io` — only that host is allowed in
  [`web/next.config.ts`](./web/next.config.ts). A different host silently fails.
- **`imageBlock` vs raw `image`.** Blocks expect the `imageBlock` type (with
  `altText`/`caption`). Content saved as a bare `image` won't render correctly —
  this is exactly what `scripts/fix-image-blocks.ts` repairs.
- Confirm the asset actually uploaded (check it in the Studio).

### A video won't play
- Prefer **MP4 (H.264)** — some `.mov` files won't play in certain browsers
  (Chrome/Firefox especially).
- For links, only **YouTube/Vimeo/direct-mp4** are normalized
  ([`video.ts`](./web/src/sanity/video.ts)). Other providers won't embed.
- Each testimonial needs a file **or** a URL; if both are empty the Studio blocks
  publishing.

### I added a block but it doesn't appear on the page
You almost certainly missed one of the **four** wiring steps. Re-check against
[DEVELOPMENT-GUIDE.md §2](./DEVELOPMENT-GUIDE.md#2-the-most-common-task-add-a-new-block-type):
schema → register in `index.ts` (all three sub-steps) → query projection →
`PageBuilder` case + component. Then `npx sanity schema deploy`.

### Studio doesn't show a new/changed field
Schema changes need to be pushed to the hosted project:
```bash
npx sanity schema deploy
```
Also restart `pnpm dev` if the Studio was already running.

### A new page returns 404 on the frontend
- Confirm the page is **published** and its **slug** is set.
- The dynamic route pre-generates slugs via `OTHER_PAGE_SLUGS_QUERY`; a brand-new
  page may need the dev server restarted (or a rebuild in production) to be
  picked up.
- Remember the page also needs adding to the nav in **Site Settings** to be
  linked (it's still reachable directly by URL without that).

### Dependencies / lockfile behaving oddly
Use **pnpm for everything** — this is a pnpm workspace. Run `pnpm install` at the
repo root (it installs both the Studio and `web/`). If you accidentally ran
`npm install` in `web/` and it created a `package-lock.json`, delete it (it's
gitignored and installs nothing real) and re-run `pnpm install` at the root. See
[SETUP.md → package managers](./SETUP.md#a-note-on-package-managers).

### TypeScript errors after adding a field
Frontend types are hand-maintained in
[`web/src/sanity/types.ts`](./web/src/sanity/types.ts) — update them to match the
schema. (There's no automated TypeGen yet.)

---

## Known issues / limitations

- **No draft preview.** The site shows published content only (`next-sanity` v9;
  see [ARCHITECTURE.md §6](./ARCHITECTURE.md#6-notable-constraints-know-these-before-you-go-deep)).
- **No automated tests** ([TESTING.md](./TESTING.md)).
- **No frontend hosting configured** — the site isn't deployed to a public URL
  yet; `pnpm run deploy` deploys the *Studio*, not the site.
- **Near-duplicate blocks** (`coreTeam`/`peopleGrid`, `fellowVideos`/`videoTestimonials`)
  can cause "which one is this page using?" confusion.

Still stuck? Reproduce it in the Studio's Vision GROQ playground to isolate
content-vs-code, and check the browser console + the terminal running `pnpm dev`
for the actual error.
