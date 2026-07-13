'use client'

import {useRef} from 'react'
import Link from 'next/link'

import {resolveLink} from '@/sanity/link'
import {useReveals} from '../useReveals'
import type {FellowshipDetailBlock, Cta} from '@/sanity/types'

function ApplyButton({cta}: {cta?: Cta}) {
  if (!cta) return null
  const r = resolveLink(cta.link)
  if (!r || !cta.text) return null
  if (r.external) {
    return (
      <a
        className="fd-btn"
        href={r.href}
        target={r.openInNewTab ? '_blank' : undefined}
        rel={r.openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {cta.text}
      </a>
    )
  }
  return (
    <Link className="fd-btn" href={r.href}>
      {cta.text}
    </Link>
  )
}

export default function FellowshipDetail({block}: {block: FellowshipDetailBlock}) {
  const ref = useRef<HTMLElement | null>(null)
  useReveals(ref)
  const terms = block.terms ?? []

  return (
    <section ref={ref} className="fd" id={block.anchorId || undefined}>
      <div className="fd-inner">
        <div className="fd-rule" />
        {block.eyebrow && (
          <div className="mono-eyebrow" data-reveal>
            {block.eyebrow}
          </div>
        )}
        {block.heading && (
          <h2 className="fd-heading" data-reveal data-reveal-delay="60">
            {block.heading}
          </h2>
        )}
        {block.intro && (
          <p className="fd-intro" data-reveal data-reveal-delay="120">
            {block.intro}
          </p>
        )}

        <div className="fd-blocks" data-reveal>
          <div className="fd-block">
            {block.termsLabel && <div className="fd-label">{block.termsLabel}</div>}
            {block.termsHeading && <h3 className="fd-block-heading">{block.termsHeading}</h3>}
            {terms.length > 0 && (
              <div className="fd-terms">
                {terms.map((t) => (
                  <div className="fd-term" key={t._key}>
                    <div className="fd-term-name">{t.name}</div>
                    {t.when && <div className="fd-term-when">{t.when}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="fd-block">
            {block.eligLabel && <div className="fd-label">{block.eligLabel}</div>}
            {block.eligHeading && <h3 className="fd-block-heading">{block.eligHeading}</h3>}
            {block.eligibility && <p className="fd-body">{block.eligibility}</p>}
          </div>

          <div className="fd-block fd-block--last">
            {block.howLabel && <div className="fd-label">{block.howLabel}</div>}
            {block.howHeading && <h3 className="fd-block-heading">{block.howHeading}</h3>}
            {block.how && <p className="fd-body">{block.how}</p>}
            <ApplyButton cta={block.applyCta} />
          </div>
        </div>
      </div>
    </section>
  )
}
