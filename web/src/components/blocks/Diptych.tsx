'use client'

import {useRef} from 'react'

import {useReveals} from '../useReveals'
import type {DiptychBlock} from '@/sanity/types'

export default function Diptych({block}: {block: DiptychBlock}) {
  const ref = useRef<HTMLElement | null>(null)
  useReveals(ref)
  const panels = block.panels ?? []

  return (
    <section ref={ref} className="diptych">
      <div className="container">
        <div className="diptych-head">
          {block.eyebrow && (
            <div className="mono-eyebrow mono-eyebrow--onnavy" data-reveal>
              {block.eyebrow}
            </div>
          )}
          {block.heading && (
            <h2 className="diptych-heading" data-reveal data-reveal-delay="60">
              {block.heading}
            </h2>
          )}
        </div>
        <div className="diptych-grid">
          {panels.map((p, i) => (
            <div
              className={`diptych-panel${i === 1 ? ' diptych-panel--alt' : ''}`}
              key={p._key}
              data-reveal
              data-reveal-delay={i * 160}
            >
              {p.label && <div className="diptych-label">{p.label}</div>}
              <h3 className="diptych-panel-heading">{p.heading}</h3>
              {p.text && <p className="diptych-panel-text">{p.text}</p>}
            </div>
          ))}
          {panels.length === 2 && (
            <div className="diptych-node" aria-hidden="true">
              <span>{block.centerLabel || 'AF'}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
