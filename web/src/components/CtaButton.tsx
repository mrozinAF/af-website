import Link from 'next/link'

import {resolveLink} from '@/sanity/link'
import type {Cta} from '@/sanity/types'

type Props = {
  cta?: Cta
  className?: string
}

/** Renders a CTA as a styled button/link. Secondary style for level >= 2. */
export default function CtaButton({cta, className}: Props) {
  if (!cta) return null
  const resolved = resolveLink(cta.link)
  const label = cta.text
  if (!resolved || !label) return null

  const variant = (cta.level ?? 1) >= 2 ? 'button button--secondary' : 'button'
  const classes = [variant, className].filter(Boolean).join(' ')

  if (resolved.external) {
    return (
      <a
        href={resolved.href}
        className={classes}
        target={resolved.openInNewTab ? '_blank' : undefined}
        rel={resolved.openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {label}
      </a>
    )
  }

  return (
    <Link href={resolved.href} className={classes}>
      {label}
    </Link>
  )
}
