'use client'

import {useRef} from 'react'

import {useConstellation} from '../useConstellation'
import type {ComingSoonHeroBlock} from '@/sanity/types'

export default function ComingSoonHero({block}: {block: ComingSoonHeroBlock}) {
  const hostRef = useRef<HTMLElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useConstellation(canvasRef, {reactive: true, hostRef})

  return (
    <section ref={hostRef} className="soon">
      <canvas ref={canvasRef} className="soon-canvas" aria-hidden="true" />
      <div className="container soon-inner">
        <h1 className="soon-title">{block.title}</h1>
        {block.description && <p className="soon-desc">{block.description}</p>}
        {block.note && <span className="soon-note">{block.note}</span>}
      </div>
    </section>
  )
}
