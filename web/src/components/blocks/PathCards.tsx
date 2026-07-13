'use client'

import {useRef} from 'react'
import Link from 'next/link'

import {resolveLink} from '@/sanity/link'
import {useReveals} from '../useReveals'
import type {PathCardsBlock} from '@/sanity/types'

export default function PathCards({block}: {block: PathCardsBlock}) {
  const ref = useRef<HTMLElement | null>(null)
  useReveals(ref)
  const items = block.items ?? []

  return (
    <section ref={ref} className="paths">
      <div className="paths-grid-layer" aria-hidden="true" />
      <div className="container paths-grid">
        {items.map((it, i) => {
          const r = resolveLink(it.cta?.link)
          const label = it.cta?.text
          const inner = (
            <>
              {it.kicker && <div className="path-kicker">{it.kicker}</div>}
              <h3 className="path-title">{it.title}</h3>
              {it.text && <p className="path-text">{it.text}</p>}
              {label && (
                <span className="path-link">
                  {label} <span aria-hidden="true">→</span>
                </span>
              )}
            </>
          )
          const cls = 'path-card'
          const dataProps = {'data-reveal': true, 'data-reveal-delay': String(i * 100)}
          // In-page scroll takes precedence over the link destination.
          if (it.scrollTo) {
            return (
              <a className={cls} key={it._key} href={`#${it.scrollTo}`} {...dataProps}>
                {inner}
              </a>
            )
          }
          if (!r) {
            return (
              <div className={cls} key={it._key} {...dataProps}>
                {inner}
              </div>
            )
          }
          return r.external ? (
            <a
              className={cls}
              key={it._key}
              href={r.href}
              target={r.openInNewTab ? '_blank' : undefined}
              rel={r.openInNewTab ? 'noopener noreferrer' : undefined}
              {...dataProps}
            >
              {inner}
            </a>
          ) : (
            <Link className={cls} key={it._key} href={r.href} {...dataProps}>
              {inner}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
