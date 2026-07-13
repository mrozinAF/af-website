'use client'

import {useEffect, useRef, useState} from 'react'

import SanityImage from '../SanityImage'
import type {ExpertsCarouselBlock} from '@/sanity/types'

const GAP = 32

export default function ExpertsCarousel({block}: {block: ExpertsCarouselBlock}) {
  const experts = block.experts ?? []
  const N = experts.length

  const vpRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(3)
  const [cardW, setCardW] = useState(0)
  const [index, setIndex] = useState(0)
  const [anim, setAnim] = useState(true)

  useEffect(() => {
    const vp = vpRef.current
    if (!vp) return
    const measure = () => {
      const w = vp.clientWidth
      if (!w) return
      const v = w < 640 ? 1 : w < 980 ? 2 : 3
      setVisible(v)
      setCardW((w - GAP * (v - 1)) / v)
    }
    let tries = 0
    const boot = () => {
      if (!vp.clientWidth && tries++ < 120) requestAnimationFrame(boot)
      else measure()
    }
    boot()
    const ro = new ResizeObserver(measure)
    ro.observe(vp)
    return () => ro.disconnect()
  }, [])

  // Re-enable transition on the frame after a no-transition snap.
  useEffect(() => {
    if (anim) return
    const id = requestAnimationFrame(() => setAnim(true))
    return () => cancelAnimationFrame(id)
  }, [anim])

  const loopable = N > visible
  const display = loopable ? [...experts, ...experts.slice(0, visible)] : experts
  const step = cardW + GAP
  const tx = -index * step

  const next = () => {
    if (!loopable) return
    if (index < N) setIndex((i) => i + 1)
  }
  const prev = () => {
    if (!loopable) return
    if (index <= 0) {
      setAnim(false)
      setIndex(N)
      requestAnimationFrame(() => {
        setAnim(true)
        setIndex(N - 1)
      })
    } else setIndex((i) => i - 1)
  }
  const onEnd = () => {
    if (index >= N) {
      setAnim(false)
      setIndex(0)
    }
  }

  return (
    <section className="experts">
      <div className="container">
        <div className="experts-head">
          <h2 className="experts-heading">{block.heading}</h2>
          {loopable && (
            <div className="experts-arrows">
              <button type="button" className="experts-arrow" aria-label="Previous experts" onClick={prev}>
                <i className="experts-chev experts-chev--l" />
              </button>
              <button type="button" className="experts-arrow" aria-label="Next experts" onClick={next}>
                <i className="experts-chev experts-chev--r" />
              </button>
            </div>
          )}
        </div>

        <div className="experts-vp" ref={vpRef}>
          <div
            className="experts-track"
            style={{
              transform: `translateX(${tx}px)`,
              transition: anim ? 'transform .55s cubic-bezier(.2,.7,.2,1)' : 'none',
            }}
            onTransitionEnd={onEnd}
          >
            {display.map((e, i) => (
              <article className="expcard" key={`${e._key}-${i}`} style={{flex: `0 0 ${cardW || 0}px`}}>
                <div className="expcard-photo">
                  {e.photo?.asset?._ref && <SanityImage image={e.photo} alt={e.name} sizes="150px" />}
                </div>
                <h3 className="expcard-name">{e.name}</h3>
                {e.bio && <p className="expcard-bio">{e.bio}</p>}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
