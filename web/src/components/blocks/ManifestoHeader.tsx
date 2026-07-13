'use client'

import {useRef} from 'react'

import {useConstellation} from '../useConstellation'
import type {ManifestoHeaderBlock} from '@/sanity/types'

export default function ManifestoHeader({block}: {block: ManifestoHeaderBlock}) {
  const hostRef = useRef<HTMLElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useConstellation(canvasRef, {reactive: true, hostRef})
  const lines = block.lines ?? []

  return (
    <section ref={hostRef} className="pagehead pagehead--manifesto">
      <canvas ref={canvasRef} className="pagehead-canvas" aria-hidden="true" />
      <div className="container pagehead-inner">
        {block.eyebrow && (
          <div className="mono-eyebrow mono-eyebrow--onnavy pagehead-eyebrow">{block.eyebrow}</div>
        )}
        <h1 className="pagehead-title pagehead-title--manifesto">
          {lines.map((l, i) => (
            <span
              key={l._key}
              className={`pagehead-line${l.accent ? ' is-accent' : ''}`}
              style={{animationDelay: `${0.1 + i * 0.13}s`}}
            >
              {l.text}
            </span>
          ))}
        </h1>
      </div>
    </section>
  )
}
