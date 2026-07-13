'use client'

import {useRef} from 'react'

import {useConstellation} from '../useConstellation'
import {highlight} from '../highlight'
import type {PageHeaderBlock} from '@/sanity/types'

export default function PageHeader({block}: {block: PageHeaderBlock}) {
  const hostRef = useRef<HTMLElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useConstellation(canvasRef, {reactive: true, hostRef})

  return (
    <section ref={hostRef} className="pagehead">
      <canvas ref={canvasRef} className="pagehead-canvas" aria-hidden="true" />
      <div className="container pagehead-inner">
        <h1 className="pagehead-title">{block.title}</h1>
        {block.tagline && (
          <p className="pagehead-tagline">
            {highlight(block.tagline, block.taglineHighlights, 'pagehead-accent')}
          </p>
        )}
      </div>
    </section>
  )
}
