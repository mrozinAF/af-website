'use client'

import {useRef} from 'react'

import {useReveals} from '../useReveals'
import type {WhyPartnerBlock} from '@/sanity/types'

function CornerCurves() {
  return (
    <svg
      className="whyp-curves"
      aria-hidden="true"
      width="460"
      height="360"
      viewBox="0 0 460 360"
      preserveAspectRatio="none"
    >
      <g fill="none" strokeWidth="1">
        <path d="M120 0 C 200 170, 290 260, 460 300" stroke="rgba(127,151,255,.30)" />
        <path d="M180 0 C 250 150, 330 210, 460 250" stroke="rgba(127,151,255,.24)" />
        <path d="M240 0 C 300 130, 370 175, 460 205" stroke="rgba(127,151,255,.18)" />
        <path d="M300 0 C 350 105, 405 140, 460 165" stroke="rgba(127,151,255,.13)" />
        <path d="M360 0 C 395 80, 430 110, 460 130" stroke="rgba(127,151,255,.09)" />
      </g>
    </svg>
  )
}

export default function WhyPartner({block}: {block: WhyPartnerBlock}) {
  const ref = useRef<HTMLElement | null>(null)
  useReveals(ref)
  const rows = block.rows ?? []

  return (
    <section ref={ref} className="whyp">
      <CornerCurves />
      <div className="container whyp-inner">
        <div className="whyp-head">
          {block.eyebrow && (
            <div className="mono-eyebrow mono-eyebrow--onnavy" data-reveal>
              {block.eyebrow}
            </div>
          )}
          {block.heading && (
            <h2 className="whyp-heading" data-reveal data-reveal-delay="60">
              {block.heading}
            </h2>
          )}
        </div>
        <div className="whyp-rows">
          {rows.map((r, i) => (
            <div className="whyp-row" key={r._key} data-reveal data-reveal-delay={i * 140}>
              <div className="whyp-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="whyp-body">
                {r.keyword && <div className="whyp-keyword">{r.keyword}</div>}
                <h3 className="whyp-title">{r.title}</h3>
                {r.description && <p className="whyp-desc">{r.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
