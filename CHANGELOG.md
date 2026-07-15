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

## [2026-07-15] — Mark Rozin

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
