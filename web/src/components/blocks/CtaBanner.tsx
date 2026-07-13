'use client'

import {useRef} from 'react'
import Link from 'next/link'

import {resolveLink} from '@/sanity/link'
import {useConstellation} from '../useConstellation'
import {highlight} from '../highlight'
import type {CtaBannerBlock, Cta} from '@/sanity/types'

function BannerCta({cta, variant}: {cta?: Cta; variant: 'solid' | 'outline'}) {
  if (!cta) return null
  const r = resolveLink(cta.link)
  if (!r || !cta.text) return null
  const cls = `ctab-btn ctab-btn--${variant}`
  const inner = (
    <>
      {cta.text}
      <span aria-hidden="true">→</span>
    </>
  )
  return r.external ? (
    <a
      href={r.href}
      className={cls}
      target={r.openInNewTab ? '_blank' : undefined}
      rel={r.openInNewTab ? 'noopener noreferrer' : undefined}
    >
      {inner}
    </a>
  ) : (
    <Link href={r.href} className={cls}>
      {inner}
    </Link>
  )
}

export default function CtaBanner({block}: {block: CtaBannerBlock}) {
  const hostRef = useRef<HTMLElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  useConstellation(canvasRef, {reactive: Boolean(block.field), hostRef})

  return (
    <section
      ref={hostRef}
      id={block.anchorId || undefined}
      className={`ctab${block.field ? ' ctab--field' : ''}`}
    >
      {block.field && <canvas ref={canvasRef} className="ctab-canvas" aria-hidden="true" />}
      <div className="container ctab-inner">
        <h2 className="ctab-heading">
          {highlight(block.heading, block.headingHighlights, 'ctab-accent')}
        </h2>
        {block.body && <p className="ctab-body">{block.body}</p>}
        <div className="ctab-actions">
          <BannerCta cta={block.primaryCta} variant="solid" />
          <BannerCta cta={block.secondaryCta} variant="outline" />
        </div>
      </div>
    </section>
  )
}
