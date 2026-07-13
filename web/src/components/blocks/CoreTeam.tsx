'use client'

import {useRef} from 'react'

import SanityImage from '../SanityImage'
import {useReveals} from '../useReveals'
import type {CoreTeamBlock} from '@/sanity/types'

export default function CoreTeam({block}: {block: CoreTeamBlock}) {
  const ref = useRef<HTMLElement | null>(null)
  useReveals(ref)
  const people = block.people ?? []

  return (
    <section ref={ref} className="coreteam">
      <div className="coreteam-grid-layer" aria-hidden="true" />
      <div className="container coreteam-inner">
        {block.title && <h2 className="section-heading" data-reveal>{block.title}</h2>}
        <div className="coreteam-grid">
          {people.map((p, i) => (
            <article
              className="tmcard"
              key={p._id}
              data-reveal
              data-reveal-delay={i * 120}
            >
              <div className="tmcard-photo">
                {p.photo?.asset?._ref && (
                  <SanityImage image={p.photo} alt={p.name} sizes="200px" />
                )}
                <svg className="tmcard-ring" viewBox="0 0 236 236" aria-hidden="true">
                  <circle
                    cx="118"
                    cy="118"
                    r="114"
                    fill="none"
                    stroke="#3b5bfc"
                    strokeOpacity=".26"
                    strokeWidth="1"
                    strokeDasharray="2 8"
                  />
                </svg>
              </div>
              {p.role && <span className="tmcard-role">{p.role}</span>}
              <h3 className="tmcard-name">{p.name}</h3>
              {p.credentials && <div className="tmcard-creds">{p.credentials}</div>}
              {p.bio && <p className="tmcard-bio">{p.bio}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
