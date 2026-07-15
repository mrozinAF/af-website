# Testing — What to Check Before Shipping

The honest state of testing on this project, and a checklist that catches most
regressions. Skipping this is the classic "it worked on my machine" mistake.

> **[CONFIRMED] There is no automated test suite.** There are no `*.test.*` /
> `*.spec.*` files and no `playwright.config`. `playwright` is installed as a dev
> dependency and used only by [`web/headed.mjs`](./web/headed.mjs) — a manual
> helper that opens Firefox + WebKit windows so you can eyeball the site (it does
> not assert anything). Until real tests exist, "testing" here means **automated
> checks that catch build/type errors + a manual checklist.** Adding a small
> Playwright smoke suite is a recommended next step (see the end).

---

## 1. Automated checks (fast, run every time)

From `web/`:

```bash
pnpm typecheck   # tsc --noEmit — catches type mismatches (e.g. block prop shapes)
pnpm build       # a full production build — catches errors `pnpm dev` hides
pnpm lint        # next lint
```

`pnpm build` is the highest-value check: it compiles every route and will fail
on things the dev server tolerates. **A change isn't ready if the build fails.**

For Studio/schema changes, run at the repo root:
```bash
npx sanity schema deploy    # will error if the schema is invalid
```

---

## 2. Manual regression checklist

Run the site (`pnpm dev` in `web/`) and walk through this. Do the full list
for anything structural (a new/changed block, query, or shared component); do the
relevant rows for a small content-only change.

**Pages load (no errors, content present):**
- [ ] Home `/`
- [ ] Our Team `/our-team`
- [ ] Fellows `/fellows`
- [ ] Full-time Positions `/full-time-positions`
- [ ] Summer Camp `/summer-camp`
- [ ] For Businesses and Vision *(confirm their real slugs — see note)*
- [ ] A bad URL (e.g. `/nope`) shows the not-found page, not a crash.

**Navigation & structure:**
- [ ] Header menu links go to the right pages; the "Apply"-style nav button works.
- [ ] Footer links work.
- [ ] The menu reflects **Site Settings** (or the fallback in `nav.ts`).

**Interactions (the things most likely to silently break):**
- [ ] Accordion / dropdown sections expand and collapse.
- [ ] Experts carousel arrows page through and wrap around.
- [ ] Video testimonials: an **uploaded MP4** plays, and a **YouTube/Vimeo**
      embed plays.
- [ ] CTA buttons link correctly (internal pages *and* external links; external
      open in a new tab).
- [ ] Scroll-reveal animations and the constellation background render (don't
      jank or throw).

**Media & polish:**
- [ ] Images load (from `cdn.sanity.io`) and are reasonably sharp / not distorted.
- [ ] Team photos and person details are correct.

**Responsive & cross-browser:**
- [ ] Resize to mobile width — layout holds, nothing overflows, mobile menu works.
- [ ] Check **Safari/WebKit** specifically — the header uses `backdrop-filter`,
      which needed a `-webkit-` fix (see CHANGELOG). `node web/headed.mjs` opens
      Firefox + WebKit for a quick look (needs the dev server running).

**Content freshness (if you touched queries or `live.ts`):**
- [ ] Publish an edit in the Studio → it appears on the site (instant in dev;
      ≤ ~60s in production).

> **[NEEDS REVIEW — For Businesses / Vision slugs]** These pages are built in
> code but aren't created by the seed script, so their exact slugs live in the
> CMS. Confirm the real URLs and pin them into this checklist.

---

## 3. What "done" looks like

A change is shippable when **all** of these are true:

1. `pnpm typecheck` and `pnpm build` pass (and `schema deploy` if the
   schema changed).
2. The relevant rows of the manual checklist pass — including a mobile width and
   a Safari/WebKit glance for any visual change.
3. No new console errors in the browser on the affected pages.
4. You added a plain-English entry to [CHANGELOG.md](./CHANGELOG.md).

---

## 4. Recommended next step (not yet done)

A tiny **Playwright smoke test** would convert most of §2 into something you run
in one command: load each page, assert the header/footer render, click the
accordion, and confirm a video element is present. `headed.mjs` already proves
Playwright is installed and can drive the site — it just doesn't assert anything
yet. **[NEEDS REVIEW: decide whether to invest in this; it's the single biggest
reliability upgrade available here.]**
