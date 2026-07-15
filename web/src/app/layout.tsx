import type {Metadata} from 'next'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {NAV_LINKS as DEFAULT_LINKS, type NavLink} from '@/components/nav'
import {sanityFetch} from '@/sanity/live'
import {NAV_QUERY} from '@/sanity/queries'
import {
  manrope,
  mont,
  alteHaas,
  nexa,
  coolvetica,
  modernRomance,
  outfit,
  newsreader,
  familjen,
  plexMono,
} from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Ascendance Foundry',
    template: '%s | Ascendance Foundry',
  },
  description:
    'Ascendance Foundry is an AI consultancy and development firm built around apprenticeship.',
}

type NavItem = {label?: string; slug?: string}
type NavData = {
  settings?: {nav?: NavItem[]; navCta?: NavItem} | null
  pages?: NavItem[]
} | null

const toLink = (n?: NavItem): NavLink | null =>
  n?.label && n?.slug
    ? {href: n.slug === 'home' ? '/' : `/${n.slug}`, label: n.label}
    : null

// The menu builds itself from the pages: the editor's curated order first, then
// any page not already listed auto-appended at the end (oldest→newest). The CTA
// page (Apply) is excluded here and pinned separately by the Header/Footer.
// Deleted pages fall out automatically — their links resolve to no slug.
async function getNav(): Promise<{links: NavLink[]; cta: NavLink | null}> {
  try {
    const {data} = await sanityFetch({query: NAV_QUERY})
    const d = data as NavData
    const cta = toLink(d?.settings?.navCta)
    const ctaSlug = d?.settings?.navCta?.slug

    const curated = (d?.settings?.nav ?? []).filter(
      (n): n is NavItem & {slug: string} =>
        typeof n?.slug === 'string' && n.slug !== ctaSlug,
    )
    const listed = new Set(curated.map((n) => n.slug))
    const appended = (d?.pages ?? []).filter(
      (p): p is NavItem & {slug: string} =>
        typeof p?.slug === 'string' && p.slug !== ctaSlug && !listed.has(p.slug),
    )

    const links = [...curated, ...appended].map(toLink).filter(Boolean) as NavLink[]
    return {links: links.length ? links : DEFAULT_LINKS, cta}
  } catch {
    return {links: DEFAULT_LINKS, cta: null}
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const {links, cta} = await getNav()
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${mont.variable} ${alteHaas.variable} ${nexa.variable} ${coolvetica.variable} ${modernRomance.variable} ${outfit.variable} ${newsreader.variable} ${familjen.variable} ${plexMono.variable}`}
    >
      <body>
        <Header links={links} cta={cta} />
        <main className="site-main">{children}</main>
        <Footer links={links} cta={cta} />
      </body>
    </html>
  )
}
