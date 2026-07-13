'use client'

import {useRef} from 'react'

import SanityImage from '../SanityImage'
import {useReveals} from '../useReveals'
import type {FellowsIntroBlock} from '@/sanity/types'

export default function FellowsIntro({block}: {block: FellowsIntroBlock}) {
  const ref = useRef<HTMLElement | null>(null)
  useReveals(ref)

  return (
    <section ref={ref} className="fintro">
      <div className="fintro-grid-layer" aria-hidden="true" />
      <div className="container fintro-inner">
        {/* Who we recruit */}
        <div className="fintro-row fintro-row--recruit">
          <div className="fintro-copy fintro-copy--recruit">
            {block.recruitLabel && (
              <div className="mono-eyebrow" data-reveal>
                {block.recruitLabel}
              </div>
            )}
            {block.recruitText && (
              <p className="fintro-lead" data-reveal data-reveal-delay="70">
                {block.recruitText}
              </p>
            )}
          </div>
          <div className="fintro-media fintro-media--recruit" data-reveal data-reveal-delay="160">
            {block.recruitImage?.asset?._ref && (
              <SanityImage image={block.recruitImage} sizes="(max-width:900px) 100vw, 520px" />
            )}
          </div>
        </div>

        {/* What Fellows Do */}
        <div className="fintro-row fintro-row--do">
          <div className="fintro-do-left" data-reveal>
            <div className="fintro-media fintro-media--do">
              {block.doImage?.asset?._ref && (
                <SanityImage image={block.doImage} sizes="(max-width:900px) 100vw, 480px" />
              )}
            </div>
            {(block.timeline ?? []).length > 0 && (
              <div className="fintro-timeline">
                {block.timeline!.map((t) => (
                  <div className="fintro-phase" key={t._key}>
                    <div className="mono-label">{t.label}</div>
                    <h4 className="fintro-phase-title">{t.title}</h4>
                    {t.text && <p className="fintro-phase-text">{t.text}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="fintro-do-right">
            {block.doLabel && (
              <div className="mono-eyebrow" data-reveal>
                {block.doLabel}
              </div>
            )}
            {block.doHeading && (
              <h2 className="fintro-do-heading" data-reveal data-reveal-delay="60">
                {block.doHeading}
              </h2>
            )}
            {(block.doParagraphs ?? []).map((p, i) => (
              <p className="fintro-do-p" key={i} data-reveal data-reveal-delay={120 + i * 60}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
