# Changelog

A plain-English log of what changed, when, and **why** — readable by anyone on
the team, not just developers. This is the human-friendly companion to git
history.

**How to use this file (required with every change):**
- Add a new dated section at the **top** (newest first).
- Format: `## [YYYY-MM-DD] — Name`, then bullet points grouped by kind of change.
- Under each group, add a short **Why:** line so future-you understands the
  reason, not just the what.
- Write for a teammate, not a compiler. "Fixed the header blur in Safari," not
  "add -webkit-backdrop-filter."

---

## [2026-07-17] — Mark Rozin

**Features**
- Added the **Events page** with a live **tournament scoreboard** section
  (stream, sponsor marquee, leaderboards, and bracket) driven by an external
  live data feed — the "Launch for Care Invitational" widget from the design —
  plus a small "Check out our Summer Camp!" callout. The standalone Summer Camp
  page was merged into Events and removed.
- **Why:** Brings the live event experience onto the site and consolidates
  Summer Camp (whose details now live on a separate website).

**Fixes**
- Page slugs now **auto-trim and normalise** (lowercase, spaces → hyphens), and
  a slug with stray spaces can no longer be published.
- **Why:** A trailing space in a slug had silently broken a page's URL.

**Tooling**
- Upgraded **Sanity Studio to 6.5.0** (from 6.3.0) to match the auto-update
  runtime, with a clean reinstall to fix a broken post-upgrade module state.
- **Why:** Keeps local versions in sync with what's served at runtime.

---

## [2026-07-15] — Mark Rozin

**Studio editor experience**
- The page **Slug** (web address) is now **required** and generated from the page
  name (the "Generate" button). A page can no longer be published without one.
- **Why:** A page saved without a slug has no URL and silently won't appear in
  the menu — this is what happened with a re-created Events page. Requiring it
  prevents the confusion entirely.
- Added four **page templates** editors can pick when creating a page — *Fellows
  Page*, *For Businesses Page*, *Info / Vision Page*, and *Coming Soon Page* —
  each pre-filled with the right sections (from the real pages) and placeholder
  text telling the editor what to write.
- Gave every content section a **plain-English name and a short description** in
  the Studio (e.g. "Call-to-Action Banner", "Team Grid (Automatic)") so
  non-technical editors can tell blocks apart.
- Documented which sections belong on each page type in CONTENT-GUIDE.md.
- **Why:** So editors can create good-looking pages themselves without a
  developer, and aren't faced with 25 cryptic, empty blocks.
- *Note:* the Studio can't yet limit the "Add item" list to only a page's
  relevant blocks — that would need separate page types (a larger change). For
  now the relevant sets are documented as a cheat-sheet.

**Features**
- The navigation menu (header **and** footer) now builds itself from the pages.
  Any published page appears automatically at the end of the menu; deleting a
  page removes its links everywhere. Site Settings now only controls the *order*
  and the pinned **Apply** button.
- **Why:** New pages weren't showing up in the menu because they had to be added
  by hand in Site Settings (this is how the Events page got "lost"). Now editors
  can't forget the step — it's automatic. Trade-off: every published page shows
  in the menu; hiding one without deleting it would need a small code change.

**Tooling / cleanup**
- Standardized on **pnpm** for the whole repo. Removed a stray
  `web/package-lock.json` and gitignored npm/yarn lockfiles in `web/`; updated
  the docs to use `pnpm` everywhere.
- **Why:** The repo looked like it mixed npm and pnpm, but the frontend was
  actually installed by pnpm all along (the npm lockfile was a leftover that
  installed nothing). Removing it prevents confusion and accidental `npm install`
  runs that would fight the workspace.

---

## [2026-07-14] — Mark Rozin

**Documentation**
- Added a full onboarding documentation set: `README`, `SETUP`, `ARCHITECTURE`,
  `CONTENT-GUIDE`, `DEVELOPMENT-GUIDE`, `TESTING`, `TROUBLESHOOTING`, and this
  `CHANGELOG`.
- Added `PROJECT_REPORT.md`, a leadership-facing overview of the revamp.
- **Why:** So anyone new can go from zero to confidently making changes without
  hand-holding, and so leadership has a non-technical summary of the project.

**Fixes & tooling**
- Fixed the sticky header's frosted-glass blur so it renders in Safari/WebKit
  (it was silently missing there).
- Added `web/headed.mjs`, a small helper that opens Firefox + WebKit windows for
  quick cross-browser checks.
- **Why:** The blur looked broken in Safari; the helper makes it easy to catch
  browser-specific issues like this before shipping.

---

## [2026-07-13] — Mark Rozin

**Site build**
- Built the entire public website: the Next.js frontend (`web/`) and all ~22
  Sanity content blocks that make up the pages — homepage, Our Team, Fellows,
  Full-time Positions, Summer Camp, plus the For Businesses and Vision layouts.
- Set up the content model: pages as stacks of reusable blocks, plus People, Job
  Postings, and Site Settings (navigation).
- Added `web/.env.example` so collaborators can configure the frontend easily.
- **Why:** This is the revamp itself — replacing the outdated, cluttered
  WordPress site with a cleaner, modern site driven by feedback from the Fellow
  survey, and splitting the crowded homepage into dedicated audience journeys.

---

## [2026-07-04] — Mark Rozin

**Project bootstrap**
- Initialized the Sanity Studio (the content control panel) for project
  `xk0vwazc`, dataset `production`.
- **Why:** The foundation everything else is built on — the CMS the whole site
  reads its content from.

---

<!--
Template for a new entry (copy this to the top):

## [YYYY-MM-DD] — Your Name

**<Group, e.g. Content / Fixes / Features / Docs>**
- What changed, in plain English.
- **Why:** The reason / the problem it solved.
-->
