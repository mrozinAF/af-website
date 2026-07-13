'use client'

import {useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

import type {NavLink} from './nav'

export default function Header({links, cta}: {links: NavLink[]; cta?: NavLink | null}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="Ascendance Foundry" width={220} height={40} priority />
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`site-nav${open ? ' is-open' : ''}`}>
          {links.map((link) => {
            const active =
              link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? 'is-active' : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            )
          })}
          {cta?.href && cta?.label && (
            <Link href={cta.href} className="site-cta" onClick={() => setOpen(false)}>
              {cta.label}
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
