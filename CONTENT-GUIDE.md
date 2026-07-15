# Content Guide — Editing the Website

**For anyone who edits content — no coding required.** This covers everything you
can change from the Sanity Studio: text, photos, videos, team members, job
postings, pages, and the menu.

If a term here is unfamiliar (what "Sanity" or a "block" is), skim
[ARCHITECTURE.md §2–3](./ARCHITECTURE.md#2-what-is-sanity-really) first — it's
written in plain language.

---

## 1. Logging in to the Studio

The Studio is the control panel where you edit content. There are two ways to
open it:

- **Locally** (if a developer set it up on your machine): run `pnpm dev` from the
  project folder and open **http://localhost:3333**. See [SETUP.md](./SETUP.md).
- **The hosted Studio** (once it's deployed): a URL ending in `.sanity.studio`.
  **[NEEDS REVIEW: the Studio does not appear to have a deployed public URL yet —
  confirm whether `sanity deploy` has been run and share the link here.]**

Either way, you sign in with the **Sanity account you were invited with**
(Google, GitHub, or email). If you can't get in, ask an admin to invite you to
project `xk0vwazc` at [sanity.io/manage](https://www.sanity.io/manage).

Once in, the left sidebar shows four areas: **Site Settings**, **Pages**,
**People**, **Job postings**.

---

## 2. The golden rule: Publish

Every change you make is a **draft** until you click the **Publish** button
(bottom-right of the editor). **Drafts are invisible on the live website** — only
published content shows up.

After you publish, the live site updates within about **a minute**. If you don't
see your change, wait a moment and refresh (see
[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)).

To undo unpublished work, use the document's menu (the "⋮" / revert options). If
you've already published, you can republish an earlier version from the
document's history.

---

## 3. Editing an existing page

1. Click **Pages** in the sidebar and choose the page (e.g. *Home*, *Fellows*).
2. The page is a stack of **sections** (blocks). Click any section to expand and
   edit its fields — headings, paragraphs, images, buttons.
3. To **reorder** sections, drag them by the handle. To **remove** one, use its
   "⋮" menu. To **add** one, scroll to the bottom of the content list and click
   **Add item**, then pick a section type.
4. Click **Publish**.

> **Tip:** Each section type has a friendly name in the "Add item" list (e.g.
> "Dropdown section," "CTA banner," "Video testimonials"). Add one and its fields
> will explain themselves.

---

## 4. Adding a new page

1. In **Pages**, click **Create** (top of the list). Choose **"Page — starter
   layout"** — it pre-fills a tidy starting scaffold (a header, an intro
   paragraph, an image, and a call-to-action) so you're not staring at a blank
   page.
2. Fill in the **Name** (e.g. "Partners") and the **Slug** — the slug is the web
   address, so "our-partners" makes the page live at `/our-partners`. Use
   lowercase words separated by hyphens.
3. Edit the sections as in §3, then **Publish**.
4. **It's added to the menu automatically.** Once published, the page appears in
   both the top menu and the footer on its own — at the end of the list, just
   before the **Apply** button. You don't need to touch the navigation. Visit
   Site Settings only if you want to *reorder* where it sits (see §8).

---

## 5. Adding or editing a team member

Team members appear automatically wherever the site lists people (the team
sections on the Home and Our Team pages). You don't edit those sections directly —
you edit the **People** list.

1. Click **People → Create**.
2. Fill in: **Name**, **Role** (both required), **Photo**, **Credentials** (a
   short semicolon-separated one-liner, e.g. *"Co-founder of X; Harvard PhD"*),
   **Bio**, **Order** (a number controlling left-to-right position in the team
   grid — lower numbers come first), and **LinkedIn** URL.
3. **Publish.** The person now shows up in the team sections automatically.

To remove someone from the site, delete (or unpublish) their Person document.

---

## 6. Adding or editing a job posting

Job postings appear automatically on the **Full-time Positions** page (newest
first).

1. Click **Job postings → Create**.
2. Fill in: **Title** (required), **Department**, **Description**, **Apply link**
   (the URL where people apply), and **Date posted**.
3. **Publish.** It appears in the job listings automatically.

Remove a role by deleting/unpublishing its Job Posting.

---

## 7. Adding a video testimonial

Video testimonials live on the **Fellows** page. Open **Pages → Fellows**, find
the video section, and click **Add item** inside it. For each testimonial you
provide a **Name**, a **Role/description**, an optional **Quote**, and the video
itself — in one of two ways:

- **Upload a video file** — drag in an `.mp4` (or `.mov`). **MP4 (H.264) is
  safest** — it plays in every browser. Some `.mov` files won't play in certain
  browsers.
- **…or paste a link** — a **YouTube** or **Vimeo** link, or a direct link to an
  `.mp4`. (Used only if you didn't upload a file.)

Each testimonial needs **at least one** of the two (file or link) or the Studio
will warn you. Then **Publish**.

> Video was chosen over written quotes on purpose — it's more personal and
> credible. Prefer real, in-person clips.

---

## 8. The navigation menu (it's mostly automatic)

**Every published page appears in the top menu and footer automatically** — you
don't add links by hand. New pages land at the end of the menu, just before the
**Apply** button. Deleting or unpublishing a page removes its link everywhere.

**Site Settings** is only for two things:

1. **Order.** Click **Site Settings → Navigation menu order**. Drag the listed
   pages into the arrangement you want. Any page you *don't* list still appears —
   it just goes at the end. So you only need to list the pages whose position you
   care about.
2. **The Apply button.** Under **Nav button**, set the label and destination for
   the solid button pinned at the end of the menu (leave it empty to hide it).

Then **Publish** Site Settings.

> **Heads-up:** removing a page from the order list does **not** hide it from the
> menu — it just moves to the end. To take a page off the site entirely,
> unpublish or delete the page itself. *(If you ever need to keep a published
> page out of the menu, that's a small code change — ask a developer.)*

---

## 9. Images — a few tips

- Uploaded images are stored and optimized automatically; you don't need to
  resize them first, but start from a reasonably high-quality original.
- Where a photo offers a **hotspot/crop** tool, use it to set the focal point so
  the image crops nicely on different screen sizes.
- Add **alt text**/captions where offered — it helps accessibility and SEO.

---

## What you can't do from the Studio (ask a developer)

- Change how a section *looks* (layout, colors, fonts) — that's code.
- Add a brand-new *type* of section — that's a code change
  ([DEVELOPMENT-GUIDE.md](./DEVELOPMENT-GUIDE.md)).
- Take the site live to a public web address — hosting isn't set up yet.

Something not showing up or looking wrong? See
[TROUBLESHOOTING.md](./TROUBLESHOOTING.md) — start with "is it published?"
