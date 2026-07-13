'use client'

import {useRef} from 'react'

import {useReveals} from '../useReveals'
import type {ExpertNetworkBlock} from '@/sanity/types'

export default function ExpertNetwork({block}: {block: ExpertNetworkBlock}) {
  const ref = useRef<HTMLElement | null>(null)
  useReveals(ref)
  const supports = block.supports ?? []

  return (
    <section ref={ref} className="network">
      <div className="network-inner">
        {block.heading && (
          <h2 className="network-heading" data-reveal>
            {block.heading}
          </h2>
        )}
        {block.intro && (
          <p className="network-intro" data-reveal data-reveal-delay="70">
            {block.intro}
          </p>
        )}
        <div className="network-grid">
          {supports.map((s, i) => (
            <div className="network-box" key={s._key} data-reveal data-reveal-delay={100 + i * 90}>
              <div className="network-box-head">
                <h3 className="network-box-title">{s.title}</h3>
              </div>
              {s.description && <p className="network-box-desc">{s.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
