import Link from 'next/link'

import type {NavLink} from './nav'

export default function Footer({links, cta}: {links: NavLink[]; cta?: NavLink | null}) {
  const allLinks = cta?.href && cta?.label ? [...links, cta] : links
  return (
    <footer className="site-footer">
      <div className="container footer-bar">
        <Link href="/" className="footer-brand" aria-label="Ascendance Foundry home">
          <span className="footer-tile">AF</span>
          <span className="footer-name">Ascendance Foundry</span>
        </Link>
        <nav className="footer-links">
          {allLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
