'use client'

import {useRef} from 'react'

import SanityImage from '../SanityImage'
import {useReveals} from '../useReveals'
import type {CapabilitiesBlock} from '@/sanity/types'

export default function Capabilities({block}: {block: CapabilitiesBlock}) {
  const ref = useRef<HTMLElement | null>(null)
  useReveals(ref)
  const items = block.items ?? []

  return (
    <section ref={ref} className="capsec">
      <div className="capsec-grid-layer" aria-hidden="true" />
      <div className="container capsec-inner">
        <div className="capsec-head">
          {block.eyebrow && (
            <div className="mono-eyebrow" data-reveal>
              {block.eyebrow}
            </div>
          )}
          {block.heading && (
            <h2 className="capsec-heading" data-reveal data-reveal-delay="60">
              {block.heading}
            </h2>
          )}
        </div>
        <div className="capsec-grid">
          <div className="capsec-boxes">
            {items.map((it, i) => (
              <div className="biz-card" key={it._key} data-reveal data-reveal-delay={i * 120}>
                <h3 className="biz-card-title">{it.title}</h3>
                {it.text && <p className="biz-card-text">{it.text}</p>}
                {(it.bullets ?? []).length > 0 && (
                  <div className="biz-bullets">
                    {it.bullets!.map((b, bi) => (
                      <div className="biz-bullet" key={bi}>
                        <span className="biz-diamond" aria-hidden="true" />
                        {b}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="capsec-media" data-reveal data-reveal-delay="160">
            {block.image?.asset?._ref && (
              <SanityImage image={block.image} sizes="(max-width:900px) 100vw, 420px" />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
