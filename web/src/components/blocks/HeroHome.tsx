'use client'

import {useRef} from 'react'

import {useConstellation} from '../useConstellation'
import type {HeroBlock} from '@/sanity/types'

export default function HeroHome({block}: {block: HeroBlock}) {
  const hostRef = useRef<HTMLElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useConstellation(canvasRef, {reactive: true, hostRef})

  const heading = block.heading ?? ''
  const accent = block.accent?.trim() ?? ''
  const words = heading.split(/\s+/).filter(Boolean)
  const accentCount =
    accent && heading.trim().endsWith(accent)
      ? accent.split(/\s+/).filter(Boolean).length
      : 0

  return (
    <section ref={hostRef} className="hero-x">
      <canvas ref={canvasRef} className="hero-x-canvas" aria-hidden="true" />
      <div className="hero-x-content">
        <h1 className="hero-x-heading">
          {words.map((word, i) => {
            const isAccent = i >= words.length - accentCount
            return (
              <span
                key={i}
                className={`hero-x-word${isAccent ? ' is-accent' : ''}`}
                style={{animationDelay: `${0.15 + i * 0.12}s`}}
              >
                {word}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            )
          })}
        </h1>
        {block.body && <p className="hero-x-sub">{block.body}</p>}
      </div>
      <button
        type="button"
        className="hero-x-scroll"
        aria-label="Scroll down"
        onClick={() =>
          hostRef.current?.nextElementSibling?.scrollIntoView({behavior: 'smooth'})
        }
      >
        <span className="hero-x-chevron" />
      </button>
    </section>
  )
}
