'use client'

import {useRef, useState} from 'react'

import SanityImage from '../SanityImage'
import {useReveals} from '../useReveals'
import type {CoreTeamBlock, Person} from '@/sanity/types'

// One team member card. Bio open/closed state is LOCAL to each card, so
// expanding one card never affects its rowmates (align-items:flex-start in CSS
// lets each card size to its own height).
function TeamCard({person, index}: {person: Person; index: number}) {
  const [open, setOpen] = useState(false)
  return (
    <article
      className="pf-card"
      data-open={open ? '1' : '0'}
      data-reveal
      data-reveal-delay={index * 120}
    >
      <div className="pf-photo">
        {person.photo?.asset?._ref && (
          <SanityImage image={person.photo} alt={person.name} sizes="124px" />
        )}
        <svg className="pf-ring" viewBox="0 0 148 148" aria-hidden="true">
          <circle
            cx="74"
            cy="74"
            r="72"
            fill="none"
            stroke="#3b5bfc"
            strokeOpacity=".26"
            strokeWidth="1"
            strokeDasharray="2 8"
          />
        </svg>
      </div>
      {person.role && <span className="pf-role">{person.role}</span>}
      <h3 className="pf-name">{person.name}</h3>
      {person.credentials && <div className="pf-creds">{person.credentials}</div>}
      {person.bio && (
        <>
          <button
            type="button"
            className="pf-toggle"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="pf-toggle-txt" />
            <i aria-hidden="true">▾</i>
          </button>
          <div className="pf-bio">
            <p className="pf-bio-text">{person.bio}</p>
          </div>
        </>
      )}
    </article>
  )
}

export default function CoreTeam({block}: {block: CoreTeamBlock}) {
  const ref = useRef<HTMLElement | null>(null)
  useReveals(ref)
  // Auto-lists every Person; the flex row rewraps as members are added/removed.
  const people = block.people ?? []

  return (
    <section ref={ref} className="coreteam">
      <div className="coreteam-grid-layer" aria-hidden="true" />
      <div className="container coreteam-inner">
        {block.title && (
          <h2 className="section-heading" data-reveal>
            {block.title}
          </h2>
        )}
        <div className="pf-grid">
          {people.map((person, i) => (
            <TeamCard key={person._id} person={person} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
