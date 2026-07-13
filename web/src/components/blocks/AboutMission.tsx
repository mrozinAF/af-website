'use client'

import {useRef} from 'react'

import SanityImage from '../SanityImage'
import {useConstellation} from '../useConstellation'
import {useReveals} from '../useReveals'
import type {AboutMissionBlock} from '@/sanity/types'

function OrbitGlyph() {
  return (
    <svg width="168" height="132" viewBox="0 0 168 132" fill="none" className="about-orbit">
      <circle cx="84" cy="66" r="46" fill="none" stroke="#3b5bfc" strokeOpacity=".2" strokeWidth="1" />
      <circle cx="84" cy="66" r="24" fill="none" stroke="#3b5bfc" strokeOpacity=".15" strokeWidth="1" />
      <circle cx="84" cy="66" r="4.5" fill="#3b5bfc" />
      <g>
        <circle cx="84" cy="20" r="5" fill="#3b5bfc" />
        <circle cx="84" cy="112" r="3.5" fill="#4f6dff" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 84 66"
          to="360 84 66"
          dur="8s"
          repeatCount="indefinite"
        />
      </g>
      <g>
        <circle cx="84" cy="42" r="3.5" fill="#4f6dff" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="360 84 66"
          to="0 84 66"
          dur="5s"
          repeatCount="indefinite"
        />
      </g>
    </svg>
  )
}

export default function AboutMission({block}: {block: AboutMissionBlock}) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useConstellation(canvasRef, {
    density: 34000,
    link: 150,
    dot: 'rgba(59,91,252,0.36)',
    linkRgb: '59,91,252',
    baseAlpha: 0.12,
  })
  useReveals(sectionRef)

  const beliefs = block.beliefs ?? []

  return (
    <section ref={sectionRef} className="about" id="page-content">
      <div className="about-grid-layer" aria-hidden="true" />
      <canvas ref={canvasRef} className="about-canvas" aria-hidden="true" />

      <div className="container about-inner">
        <div className="about-masthead">
          <span className="about-mono" data-reveal>
            {block.mastheadLabel}
          </span>
          <span className="about-mono about-mono--muted" data-reveal>
            {block.est}
          </span>
          <span className="about-rule" data-reveal="draw" data-reveal-delay="150" />
        </div>

        <div className="about-beliefs">
          {beliefs.map((b, i) => (
            <div className="about-belief" key={b._key} data-reveal data-reveal-delay={60 + i * 80}>
              <div className="about-belief-index">
                <span className="about-num">{String(i + 1).padStart(2, '0')}</span>
                <span
                  className="about-hairline"
                  data-reveal="draw"
                  data-reveal-delay={260 + i * 80}
                />
              </div>
              <h3 className="about-belief-heading">{b.heading}</h3>
              {(b.paragraphs ?? []).map((p, pi) => (
                <p className="about-p" key={pi}>
                  {p}
                </p>
              ))}
              {i === 0 && (
                <div className="about-orbit-wrap">
                  <OrbitGlyph />
                </div>
              )}
            </div>
          ))}
        </div>

        {block.image?.asset?._ref && (
          <div className="about-figure" data-reveal="img" data-reveal-delay="80">
            <SanityImage image={block.image} sizes="(max-width: 1180px) 100vw, 1180px" />
            {block.caption && <div className="about-caption">{block.caption}</div>}
          </div>
        )}

        {block.mission && (
          <div className="about-mission" data-reveal data-reveal-delay="60">
            {block.missionLabel && <span className="about-mono about-mono--accent">{block.missionLabel}</span>}
            <p className="about-mission-text">{block.mission}</p>
          </div>
        )}
      </div>
    </section>
  )
}
