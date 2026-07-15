# Setup — Getting Running Locally

Goal: go from a fresh clone to **both systems running and talking to each other**
in one sitting, with no guesswork. Expect ~10–15 minutes.

When you're done you'll have:
- The **Sanity Studio** open at `http://localhost:3333` (edit content here)
- The **frontend** open at `http://localhost:3000` (see the site)
- A content change in the Studio showing up on the site after a refresh

---

## 1. Prerequisites

| Tool | Version | Notes |
|---|---|---|
| **Node.js** | 20 LTS recommended (18.18+ minimum) | Next.js 15 / React 19 require a modern Node. Check with `node -v`. |
| **pnpm** | 8+ | The package manager for the whole repo. Install: `npm install -g pnpm` (or via Corepack). |
| **Git** | any recent | To clone the repo. |
| **A Sanity account** | — | Must be invited to project `xk0vwazc`. Ask a teammate/admin to add you at [sanity.io/manage](https://www.sanity.io/manage). |

You do **not** need to install the Sanity CLI globally — it comes in via the
project's dependencies and is run with `npx sanity …`.

---

## 2. Clone

```bash
git clone https://github.com/mrozinAF/af-website.git
cd af-website
```

---

## 3. Run the Sanity Studio (content control panel)

From the **repo root**:

```bash
pnpm install     # installs deps for BOTH the Studio and the frontend (pnpm workspace)
pnpm dev         # starts the Studio
```

> Because this is a pnpm workspace, that single `pnpm install` at the root also
> installs the frontend's dependencies in `web/` — you don't install twice.

- Open **http://localhost:3333**.
- Log in with the Sanity account that has access to project `xk0vwazc`
  (Google / GitHub / email — whatever you were invited with).
- You should see the content desk: **Site Settings**, **Pages**, **People**,
  **Job postings** (defined in [`structure.ts`](./structure.ts)).

If you see a login screen but can't get in, you haven't been added to the
project yet — ask an admin to invite you.

---

## 4. Run the frontend (the public site)

In a **second terminal**, from `web/`:

```bash
cd web
cp .env.example .env.local     # environment variables (all public values)
pnpm dev                       # starts Next.js  (deps already installed by the root `pnpm install`)
```

- Open **http://localhost:3000**.
- You should see the live site rendering content from Sanity.

The `.env.local` values (copied from [`web/.env.example`](./web/.env.example)):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=xk0vwazc
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-02-01
```

These are **public** (they only allow reading published content), so it's safe
to commit `.env.example` — but keep your real `.env.local` out of git (it's
already gitignored). The optional `SANITY_API_READ_TOKEN` is **not needed** for
normal local development; it only enables draft preview, which isn't wired up
today.

---

## 5. Confirm the two systems are talking

1. In the **Studio** (`:3333`), open **Pages → Home**, change a piece of text,
   and click **Publish**.
2. Refresh the **frontend** (`:3000`).
3. In development the frontend doesn't cache, so your change appears on the next
   refresh. (In production there's up to a ~60-second delay — see
   [`web/src/sanity/live.ts`](./web/src/sanity/live.ts).)

If the change shows up, everything is connected. 🎉 If it doesn't, see
[TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

> **First-connection gotcha (CORS).** If the frontend can't load content at all
> (blank/empty pages, network errors in the console mentioning CORS), the origin
> `http://localhost:3000` may need to be added to the project's allowed CORS
> origins at [sanity.io/manage](https://www.sanity.io/manage) → **API → CORS
> Origins**. **[NEEDS REVIEW: confirm whether `localhost:3000` is already an
> allowed origin on the project.]**

---

## 6. Useful commands

**Studio (repo root):**
```bash
pnpm dev                                             # run Studio locally (:3333)
pnpm run deploy                                      # deploy the hosted Studio
npx sanity schema deploy                             # push schema changes to the dataset
npx sanity exec scripts/seed.ts --with-user-token    # (re)seed placeholder content
```

**Frontend (`web/`):**
```bash
pnpm dev         # dev server (:3000)
pnpm build       # production build (also the best pre-ship error check)
pnpm start       # serve the production build
pnpm typecheck   # TypeScript check (tsc --noEmit)
pnpm lint        # next lint
```

---

## A note on package managers

**Use pnpm for everything. Never run `npm` or `yarn` in this repo.**

This is a **pnpm workspace**: `pnpm-workspace.yaml` lists `web` as a member, and
`pnpm-lock.yaml` (at the root) is the single source of truth for both the Studio
and the frontend. One `pnpm install` at the root installs everything;
`web/node_modules` is populated by pnpm as symlinks into the root store.

If you run `npm install` inside `web/`, npm will write a bogus `package-lock.json`
that installs nothing real and just adds noise — so `web/package-lock.json` and
`yarn.lock` are gitignored. (A stray one existed early on and was removed once we
confirmed pnpm was doing all the actual work.)

To run the frontend's scripts you can either `cd web && pnpm <script>`, or from
the repo root use `pnpm --filter af-web <script>` (the frontend's package name is
`af-web`).
