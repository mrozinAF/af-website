# Development Guide — Making Code Changes

For developers. Assumes you've read [ARCHITECTURE.md](./ARCHITECTURE.md) and have
the project running per [SETUP.md](./SETUP.md).

The recurring theme: content flows through **four layers** — schema → Studio →
GROQ query → React component — and most tasks mean touching some subset of them
in order.

---

## 1. Project conventions

- **Language:** TypeScript throughout. Schemas use `defineType` / `defineField`
  (and `defineArrayMember`); the frontend is React 19 function components (App
  Router, mostly server components — add `'use client'` only when you need
  browser APIs/interactivity).
- **Formatting (Prettier, configured in root `package.json`):** no semicolons,
  single quotes, `printWidth: 100`, `bracketSpacing: false`. Match it.
- **Path alias:** `@/` → `web/src/` (e.g. `import {client} from '@/sanity/client'`).
- **Studio schema** lives at the repo root (`schemaTypes/`); **frontend** lives in
  `web/`. They share nothing at runtime except the content shape.
- **Frontend types** are hand-maintained in
  [`web/src/sanity/types.ts`](./web/src/sanity/types.ts). Keep them in sync with
  the schema when you add fields. *(There is no automated Sanity TypeGen step
  wired up — see the note at the end.)*

---

## 2. The most common task: add a new block type

A "block" is a section editors can drop into a page. To add one, wire it in
**four places, in this order** — miss one and it silently won't render.

**① Schema** — create `schemaTypes/blocks/myBlock.ts`:

```ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'myBlock',            // the _type used everywhere else
  title: 'My block',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    // ...
  ],
  preview: {select: {title: 'heading'}},
})
```

**② Register** — in [`schemaTypes/index.ts`](./schemaTypes/index.ts), do all three:
```ts
import myBlock from './blocks/myBlock'          // (a) import
// (b) add 'myBlock' to the page's pageBuilderBlocks: [...] array
// (c) add `myBlock` to the exported `schemaTypes` array
```

**③ Query** — if the block has nested images, references, or CTAs, add a
projection in `PAGE_QUERY` in
[`web/src/sanity/queries.ts`](./web/src/sanity/queries.ts):
```groq
_type == "myBlock" => {
  ...,
  image{${IMAGE}},          // use the shared IMAGE / CTA / LINK fragments
},
```
Flat scalar fields (strings, numbers, booleans) come through automatically via
the leading `...` spread — you only need a projection for images/refs/arrays of
objects that themselves contain images or links.

**④ Component + switch** — create `web/src/components/blocks/MyBlock.tsx`, then
add a `case` to the switch in
[`web/src/components/PageBuilder.tsx`](./web/src/components/PageBuilder.tsx):
```tsx
case 'myBlock':
  return <MyBlock key={block._key} block={block} />
```
Add a matching type to `web/src/sanity/types.ts` and style it in
[`web/src/app/globals.css`](./web/src/app/globals.css).

**Then deploy the schema** so the hosted project knows about the new type:
```bash
npx sanity schema deploy
```

Verify against the checklist in [TESTING.md](./TESTING.md).

---

## 3. Add a new page template (starter scaffold)

Editors create pages from a **template** so they don't start blank. Templates are
defined in [`sanity.config.ts`](./sanity.config.ts) under `schema.templates`. The
existing `page-starter` template pre-fills a header + intro + image + CTA. To add
another, push a new entry onto that array with a `value.content[]` of pre-built
blocks (give each a stable `_key`). See the inline comment there for the pattern.

(Pages themselves are content, not code — editors create them in the Studio. You
only touch code to change the *starter scaffolds*.)

---

## 4. Modify an existing component

- Block components are in `web/src/components/blocks/`, one per block type. Find
  the one matching the `_type` (the switch in `PageBuilder.tsx` is the index).
- Shared pieces: `Header.tsx`, `Footer.tsx`, `CtaButton.tsx`,
  `SanityImage.tsx` (wraps `next/image` with the Sanity URL builder + LQIP),
  `PortableText.tsx` (rich-text rendering), `highlight.tsx` (accent-word
  highlighting).
- Client-side effects live in hooks: `useConstellation.ts` (the animated
  navy "constellation" background) and `useReveals.ts` (scroll reveal
  animations).
- **Styling is global CSS**, not CSS modules — everything is in
  `web/src/app/globals.css`, organized by section with comments (several tagged
  with the page they belong to). Keep new styles in the same commented structure.

---

## 5. Helpers you'll reuse (`web/src/sanity/`)

| File | Use it for |
|---|---|
| `client.ts` | The configured Sanity client. `useCdn` is on only in production. |
| `env.ts` | Reads + asserts the public env vars; `apiVersion` defaults to `2026-02-01`. |
| `queries.ts` | All GROQ. `PAGE_QUERY` (a page + every block), `OTHER_PAGE_SLUGS_QUERY` (static params), `NAV_QUERY` (menu). Shared fragments: `IMAGE`, `LINK`, `CTA`. |
| `live.ts` | `sanityFetch(...)` — the fetch wrapper (revalidate 60s prod / 0 dev). Use this, not `client.fetch`, in pages so caching stays consistent. |
| `image.ts` | `urlFor(source)` — build an image URL (sizes/crops). |
| `video.ts` | `toEmbedUrl()` (YouTube/Vimeo → embeddable) and `isDirectVideoLink()` (detects `.mp4/.mov/...`). |
| `link.ts` | `resolveLink(link)` → `{href, external, openInNewTab}`; internal `home` → `/`. |

Routing: [`app/page.tsx`](./web/src/app/page.tsx) is the home page (fetches slug
`home`, passes `variant="home"` so the first `hero` renders as the richer
`HeroHome`); [`app/[slug]/page.tsx`](./web/src/app/[slug]/page.tsx) renders every
other page and drives `generateStaticParams()`. The root
[`layout.tsx`](./web/src/app/layout.tsx) loads all fonts (as CSS variables) and
fetches the nav (falling back to `components/nav.ts` if Site Settings has none).

---

## 6. Block catalog

All blocks are `object` types in [`schemaTypes/blocks/`](./schemaTypes/blocks),
embedded in a page's `content[]`. Grouped by role; several are tagged in the
source with the page they were designed for.

### Reusable / generic
| `_type` | Purpose | Key fields |
|---|---|---|
| `pageHeader` | Centered title over the navy constellation field | `title`, `tagline`, `taglineHighlights[]` |
| `richText` | Portable Text prose (preset); supports inline links + `richTextImage` | `content[]` |
| `imageBlock` | Single image (preset) — **not** the raw `image` type; carries `altText`/`caption` | image + `altText`, `caption` |
| `accordion` | Collapsible Q&A dropdowns | `title`, `items[]{question, answer, openByDefault}` |
| `ctaBanner` | Navy CTA strip, up to two buttons | `heading`, `headingHighlights[]`, `body`, `anchorId`, `primaryCta`, `secondaryCta` |
| `cta` | A single button (preset) | `text`, `link` |
| `pathCards` | Routing cards that lift on hover | `items[]{kicker, title, text, cta, scrollTo}` |
| `textSection` | Eyebrow + heading + paragraphs | `eyebrow`, `heading`, `paragraphs[]` |

### Home
| `_type` | Purpose | Key fields |
|---|---|---|
| `hero` | Homepage hero (top-level type, not in `blocks/`); renders as `HeroHome` when first on `/` | `heading`, `accent`, `body`, `image`, `cta` |
| `aboutMission` | About + Mission editorial section | `mastheadLabel`, `beliefs[]{heading, paragraphs[]}`, `image`, `mission` |
| `coreTeam` | **Auto-lists all `person` docs** as cards (order by `order`, then created) | `title` |
| `expertNetwork` | Navy "Expert Network" panel | `heading`, `intro`, `supports[]{title, description}` |
| `expertsCarousel` | Carousel, 3 visible, arrows wrap | `heading`, `experts[]{name, bio, photo}` |

### Fellows
| `_type` | Purpose | Key fields |
|---|---|---|
| `fellowsIntro` | Who we recruit / What Fellows Do + timeline | `recruitText`, `recruitImage`, `doParagraphs[]`, `doImage`, `timeline[]{label, title, text}` |
| `fellowVideos` | Navy portrait (9:12) video tiles | `eyebrow`, `heading`, `videos[]{name, role, videoFile, videoUrl}` |
| `videoTestimonials` | Videos + quotes (file **or** YouTube/Vimeo/mp4; ≥1 per item) | `title`, `intro`, `videos[]{name, role, videoFile, videoUrl, quote}` |
| `offerLedger` | Numbered 01–NN ledger + optional wide image | `heading`, `items[]{text, detail}`, `image` |
| `fellowshipDetail` | Terms / Eligibility / How to apply + apply button | `heading`, `intro`, `terms[]{name, when}`, `eligibility`, `how`, `applyCta`, `anchorId` |

### For Businesses
| `_type` | Purpose | Key fields |
|---|---|---|
| `manifestoHeader` | Multi-line manifesto over the constellation | `eyebrow`, `lines[]{text, accent}` |
| `capabilities` | "What we do" boxes + tall photo | `eyebrow`, `heading`, `items[]{title, text, bullets[]}`, `image` |
| `whyPartner` | Numbered rows with outlined numerals | `eyebrow`, `heading`, `rows[]{keyword, title, description}` |

### Vision
| `_type` | Purpose | Key fields |
|---|---|---|
| `diptych` | Two panels with a central "AF" node | `eyebrow`, `heading`, `centerLabel`, `panels[]{label, heading, text}` |
| `compareColumns` | Two diamond-bulleted columns (green/blue) | `columns[]{label, tone, items[]{title, description}}` |

### Summer Camp / Our Team / Careers
| `_type` | Purpose | Key fields |
|---|---|---|
| `comingSoonHero` | Full-height "coming soon" hero | `title`, `description`, `note` |
| `peopleGrid` | **Auto-lists all `person` docs** in a grid | `title`, `intro` |
| `jobListings` | **Auto-lists all `jobPosting` docs**, newest first | `title`, `intro`, `emptyMessage` |

**Documents:** `person`, `jobPosting`, `siteSettings` (singleton), plus the
`page` page-builder itself.

> **Consolidation candidate.** `coreTeam` vs `peopleGrid`, and `fellowVideos` vs
> `videoTestimonials`, are near-duplicates from different designs. If you merge
> them, update all four registration points (§2) and migrate any pages using the
> retired type.

---

## 7. Content utility scripts

Run with the Sanity CLI from the repo root (they use `getCliClient()`):

```bash
npx sanity exec scripts/<name>.ts --with-user-token
```

| Script | Does | Reuse? |
|---|---|---|
| `seed.ts` | Source-of-truth seeder: uploads team photos, creates people/jobs and the five core pages in one transaction with **stable IDs** (idempotent — safe to re-run). | Yes |
| `add-images.ts` | Decorates pages with **Lorem Picsum placeholder** photos. | Content helper |
| `fix-image-blocks.ts` | Migration: converts stray raw `image` entries to proper `imageBlock`. | One-off |
| `cleanup-category.ts` | Historical migration: removes a legacy `category` field (hardcodes a block `_key`). | One-off |
| `test-newpage.ts` | Demo: creates a page from the template + adds it to nav. | Throwaway |

> The `imageBlock()` helper in these scripts sets `_type: 'imageBlock'` **after**
> the asset spread on purpose — otherwise it gets overwritten to `'image'`.

---

## 8. Before you commit

Run these from `web/` and work through the checklist in
[TESTING.md](./TESTING.md):

```bash
pnpm typecheck   # tsc --noEmit
pnpm build       # catches build-time errors a dev server won't
pnpm lint        # next lint
```

Then **add an entry to [CHANGELOG.md](./CHANGELOG.md)** — plain English, not git
shorthand. This is required, not optional.

> **[NEEDS REVIEW — TypeGen not set up.]** Frontend types in
> `web/src/sanity/types.ts` are maintained by hand, so they can drift from the
> schema. Sanity's TypeGen (`sanity typegen`) could generate them from the schema
> + queries automatically. Worth adding; flagging so nobody assumes types are
> auto-generated today.
