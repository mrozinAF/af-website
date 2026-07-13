'use client'

import {useRef} from 'react'

import {useReveals} from '../useReveals'
import type {CompareColumnsBlock} from '@/sanity/types'

export default function CompareColumns({block}: {block: CompareColumnsBlock}) {
  const ref = useRef<HTMLElement | null>(null)
  useReveals(ref)
  const columns = block.columns ?? []

  return (
    <section ref={ref} className="compare">
      <div className="container">
        <div className="compare-grid">
          {columns.map((col) => (
            <div className={`compare-col compare-col--${col.tone || 'blue'}`} key={col._key}>
              <div className="compare-colhead" data-reveal>
                <span className="compare-diamond compare-diamond--lg" aria-hidden="true" />
                <span className="compare-label">{col.label}</span>
              </div>
              {(col.items ?? []).map((it, i) => (
                <div className="compare-item" key={it._key} data-reveal data-reveal-delay={80 + i * 60}>
                  <span className="compare-diamond" aria-hidden="true" />
                  <div>
                    <h3 className="compare-item-title">{it.title}</h3>
                    {it.description && <p className="compare-item-desc">{it.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
