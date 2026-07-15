# Ascendance Foundry Website

The marketing website for Ascendance Foundry. This repository holds **two
applications that work together**:

- **Sanity Studio** (repo root) — the content management system (CMS) where the
  team edits every word, photo, and video on the site. Think of it as the
  "control panel."
- **Next.js frontend** (`web/`) — the public website that visitors see. It reads
  content from Sanity and renders the pages.

Content lives in Sanity; the frontend just displays it. Editors change the site
without touching code; developers change how it looks and behaves.

---

## New here? Read the docs in this order

Each doc closes one gap between "just cloned the repo" and "confidently shipping
changes." Follow them in order.

| # | Doc | Answers |
|---|-----|---------|
| 1 | **[SETUP.md](./SETUP.md)** | How do I get it running on my machine? |
| 2 | **[ARCHITECTURE.md](./ARCHITECTURE.md)** | What am I looking at? How do the two systems fit together? |
| 3 | **[CONTENT-GUIDE.md](./CONTENT-GUIDE.md)** | How do I edit content (pages, people, jobs, videos)? *No code required.* |
| 4 | **[DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md)** | How do I change the code — add a block, page, or component? |
| 5 | **[TESTING.md](./TESTING.md)** | What do I check before shipping so I don't break anything? |
| 6 | **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | Something's broken — how do I fix it? |
| 7 | **[CHANGELOG.md](./CHANGELOG.md)** | What changed, when, and why? *(Update this with every change.)* |

Non-technical? You only need **CONTENT-GUIDE.md** (and **SETUP** if you want to
run the Studio locally). Developers should read all of them.

There is also a leadership-facing project overview in
[PROJECT_REPORT.md](./PROJECT_REPORT.md).

---

## The 30-second version

```bash
# Install everything once — this is a pnpm workspace, so one install
# at the repo root covers BOTH the Studio and the frontend.
pnpm install

# 1. Studio (content control panel) — from repo root
pnpm dev                     # → http://localhost:3333

# 2. Frontend (public site) — from web/
cd web
cp .env.example .env.local
pnpm dev                     # → http://localhost:3000
```

Full, foolproof steps (including prerequisites and gotchas) are in
[SETUP.md](./SETUP.md).

---

## Key facts

- **Sanity project:** `xk0vwazc` · **dataset:** `production`
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Studio:** Sanity v6 (auto-updates enabled)
- **Repo:** pnpm workspace — Studio at the root, frontend in `web/`. **Use pnpm
  everywhere** (a single `pnpm install` at the root installs both). Don't run
  `npm`/`yarn` in this repo.
