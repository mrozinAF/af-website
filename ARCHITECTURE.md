# Architecture — How the Two Systems Fit Together

This is the conceptual map. Read it before the content or development guides —
once the mental model clicks, everything else is much easier to follow.

For step-by-step "how do I add a block" mechanics and the full block catalog, see
[DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md).

---

## 1. The big picture: two systems, one content API

```
   ┌─────────────────────┐         ┌──────────────────────┐         ┌─────────────────────┐
   │   Sanity Studio      │  write  │   Sanity (hosted)    │  read   │   Next.js frontend   │
   │   (repo root)        │ ──────▶ │   content database   │ ◀────── │   (web/)             │
   │                      │         │   + asset CDN        │  (GROQ) │                      │
   │  Editors edit here   │         │   project xk0vwazc   │         │  Visitors see this   │
   │  localhost:3333      │         │   dataset "production"│        │  localhost:3000      │
   └─────────────────────┘         └──────────────────────┘         └─────────────────────┘
```

The two apps in this repo never talk to each other directly. They both talk to
**Sanity's hosted content database** in the middle:

- The **Studio** is a writing tool. Editors log in and change content; it saves
  to the database.
- The **frontend** is a reading tool. When someone visits a page, it asks the
  database "give me the content for this page" and renders whatever comes back.

This separation is the whole point (see §5). It means an editor can change the
homepage headline and it appears on the live site **without anyone deploying
code**.

---

## 2. What is Sanity, really?

Sanity is a **headless CMS**. Two words worth unpacking:

- **CMS (content management system):** a place to store and edit content — text,
  images, videos, structured data like team members and job postings.
- **Headless:** it has *no built-in website*. It stores content and hands it out
  via an API, but it doesn't decide how that content looks. The "head" (the
  visible website) is our separate Next.js frontend.

Compare to the old WordPress site, where content and design were welded together
inside one system and one set of templates. Here they're fully decoupled:
**content lives in Sanity; presentation lives in the frontend code.** That's why
editors can't accidentally break the design, and why we're not boxed in by
prebuilt templates.

Sanity has three parts we use:
- **The Studio** — the editing UI (this repo's root). We customize it with a
  **schema** (see §3).
- **The content database** — hosted by Sanity; holds our documents.
- **The asset CDN** (`cdn.sanity.io`) — hosts uploaded images/videos and can
  resize/optimize images on the fly.

---

## 3. The content model: documents and the page-builder

Everything an editor creates is a **document**. There are four types
(defined in [`schemaTypes/`](./schemaTypes)):

| Document | What it is |
|---|---|
| **`page`** | A page on the site. This is the important one — see below. |
| **`person`** | A team member or fellow (name, role, photo, bio, …). |
| **`jobPosting`** | An open role (title, department, apply link, …). |
| **`siteSettings`** | A single settings document holding the navigation menu. |

### The page-builder pattern

Here's the key idea that shapes the whole project. A **`page` is not a fixed
template.** Instead, each page has an ordered list of **blocks** (Sanity calls it
a page-builder). An editor stacks blocks like Lego to compose a page:

```
page "Fellows"
 └─ content[]
     ├─ pageHeader          "Fellows"
     ├─ fellowsIntro        who we recruit / what fellows do
     ├─ videoTestimonials   fellow videos
     ├─ offerLedger         what we offer
     └─ ctaBanner           "Apply now"
```

There are ~22 block types — some reusable everywhere (rich text, images,
call-to-action banners, accordions), some purpose-built for a specific page
(the homepage hero, the fellowship detail block, the "coming soon" hero). The
full catalog is in [DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md#block-catalog).

Some blocks are **automatic lists**: the `coreTeam` and `peopleGrid` blocks show
*every* `person` document; `jobListings` shows *every* `jobPosting`. Editors
change what appears by adding/removing those documents — not by editing the
block. This is why "add a team member" (in [CONTENT-GUIDE.md](./CONTENT-GUIDE.md))
is just creating a Person.

### The schema

The **schema** (the files in `schemaTypes/`) is the developer-authored
definition of all these document and block types — what fields they have, what's
required, how they preview in the Studio. It's the contract between the two
systems: the Studio builds its editing forms from it, and the frontend expects
content to match its shape. **Change the schema → run
`npx sanity schema deploy`** so the hosted project knows about it.

---

## 4. How a piece of content becomes a page (the request flow)

When a visitor opens `/fellows`, here's the journey — all in the frontend
(`web/`):

1. **Route.** Next.js matches [`web/src/app/[slug]/page.tsx`](./web/src/app/[slug]/page.tsx)
   (the homepage `/` is the separate [`app/page.tsx`](./web/src/app/page.tsx)).
2. **Fetch.** It calls `sanityFetch(PAGE_QUERY, {slug: 'fellows'})`. `PAGE_QUERY`
   is a **GROQ** query (Sanity's query language) in
   [`web/src/sanity/queries.ts`](./web/src/sanity/queries.ts). It pulls the page
   and expands every block — resolving images, linked pages, and the auto-lists
   of people/jobs.
3. **Render.** The page hands the block array to
   [`PageBuilder`](./web/src/components/PageBuilder.tsx), a single `switch` that
   maps each `block._type` (e.g. `"fellowsIntro"`) to a matching React component
   in [`web/src/components/blocks/`](./web/src/components/blocks). Each component
   knows how to draw its block.
4. **Display.** The assembled page is sent to the browser. Images come from the
   Sanity CDN; fonts and styles come from the frontend.

So a field flows: **Schema defines it → editor fills it in the Studio → GROQ
query fetches it → a block component renders it.** Those are the exact four
places a developer touches when adding something new (see the DEV guide).

### Freshness / caching

The frontend uses a lightweight fetch wrapper
([`web/src/sanity/live.ts`](./web/src/sanity/live.ts)) with time-based
revalidation: **published edits appear on the live site within ~60 seconds** (in
local development there's no caching, so a refresh is instant). This is a
deliberate simplification — see §6.

---

## 5. Why the project is structured this way

- **Headless + page-builder = editor freedom without design risk.** Non-technical
  staff compose and edit pages themselves; they physically cannot break the
  layout, because layout is code they never touch. This directly answers the old
  site's biggest complaint.
- **Custom blocks instead of generic templates.** Because we author our own
  schema, a "video testimonial" or "fellowship detail" is a real, purpose-shaped
  thing — not a generic text box bent to fit. Content structure matches how AF's
  content actually works.
- **Monorepo, two folders.** Studio and frontend live together so they version
  together, but they're independent apps with independent dependencies. The
  schema (`schemaTypes/`) is the shared contract.
- **Two audiences, separate pages.** The page-builder made it cheap to split the
  crowded old homepage into dedicated journeys (Fellows vs. For Businesses, plus
  Vision and Summer Camp) — each just a different stack of blocks.

---

## 6. Notable constraints (know these before you go deep)

- **`next-sanity` is v9.** The newer live-preview/Visual-Editing toolkit
  (`defineLive`/`SanityLive`) arrived in v11, so it's **not available**. Our
  `live.ts` is a hand-rolled substitute. Full draft preview would need a version
  upgrade plus a read token.
- **No draft preview today.** The site shows *published* content only. Drafts in
  the Studio are invisible to the frontend until published.
- **Two near-duplicate block families exist** (`coreTeam`/`peopleGrid` for
  people, `fellowVideos`/`videoTestimonials` for videos) — leftovers from
  different page designs. Noted in the DEV guide as a consolidation candidate.
- **No frontend hosting is configured yet** — see [CHANGELOG.md](./CHANGELOG.md)
  and the project report. `pnpm run deploy` at the root deploys the *Studio*, not
  the website.

---

## Where to go next

- Editors → [CONTENT-GUIDE.md](./CONTENT-GUIDE.md)
- Developers → [DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md)
- Before shipping → [TESTING.md](./TESTING.md)
- When stuck → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
