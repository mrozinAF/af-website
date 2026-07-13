'use client'

import {useRef} from 'react'

import {useReveals} from '../useReveals'
import type {TextSectionBlock} from '@/sanity/types'

export default function TextSection({block}: {block: TextSectionBlock}) {
  const ref = useRef<HTMLElement | null>(null)
  useReveals(ref)

  return (
    <section ref={ref} className="textsec">
      <div className="textsec-grid-layer" aria-hidden="true" />
      <div className="textsec-inner">
        {block.eyebrow && (
          <div className="mono-eyebrow" data-reveal>
            {block.eyebrow}
          </div>
        )}
        {block.heading && (
          <h2 className="textsec-heading" data-reveal data-reveal-delay="60">
            {block.heading}
          </h2>
        )}
        {(block.paragraphs ?? []).map((p, i) => (
          <p className="textsec-p" key={i} data-reveal data-reveal-delay={120 + i * 60}>
            {p}
          </p>
        ))}
      </div>
    </section>
  )
}
