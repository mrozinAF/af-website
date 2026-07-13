'use client'

import {useRef} from 'react'

import SanityImage from '../SanityImage'
import {useReveals} from '../useReveals'
import type {OfferLedgerBlock} from '@/sanity/types'

export default function OfferLedger({block}: {block: OfferLedgerBlock}) {
  const ref = useRef<HTMLElement | null>(null)
  useReveals(ref)
  const items = block.items ?? []

  return (
    <section ref={ref} className="offer">
      <div className="container">
        <div className="offer-head">
          {block.eyebrow && (
            <div className="mono-eyebrow" data-reveal>
              {block.eyebrow}
            </div>
          )}
          {block.heading && (
            <h2 className="offer-heading" data-reveal data-reveal-delay="60">
              {block.heading}
            </h2>
          )}
        </div>
        <div className="offer-list">
          {items.map((it, i) => (
            <div className="offer-row" key={it._key} data-reveal data-reveal-delay={i * 80}>
              <span className="offer-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="offer-body">
                <div className="offer-text">{it.text}</div>
                {it.detail && <p className="offer-detail">{it.detail}</p>}
              </div>
            </div>
          ))}
        </div>
        {block.image?.asset?._ref && (
          <div className="offer-figure" data-reveal data-reveal-delay="120">
            <SanityImage image={block.image} sizes="(max-width:1180px) 100vw, 1180px" />
          </div>
        )}
      </div>
    </section>
  )
}
