'use client'

import {useRef} from 'react'
import {stegaClean} from 'next-sanity'

import {useReveals} from '../useReveals'
import {toEmbedUrl, isDirectVideoLink} from '@/sanity/video'
import type {FellowVideosBlock} from '@/sanity/types'

export default function FellowVideos({block}: {block: FellowVideosBlock}) {
  const ref = useRef<HTMLElement | null>(null)
  useReveals(ref)
  const videos = block.videos ?? []

  return (
    <section ref={ref} className="ftesti">
      <div className="container">
        <div className="ftesti-head">
          {block.eyebrow && (
            <div className="mono-eyebrow mono-eyebrow--onnavy" data-reveal>
              {block.eyebrow}
            </div>
          )}
          {block.heading && (
            <h2 className="ftesti-heading" data-reveal data-reveal-delay="60">
              {block.heading}
            </h2>
          )}
        </div>
        <div className="ftesti-grid">
          {videos.map((v, i) => {
            const fileSrc =
              stegaClean(v.videoFileUrl) ||
              (isDirectVideoLink(v.videoUrl) ? stegaClean(v.videoUrl) : null)
            const embed = fileSrc ? null : toEmbedUrl(v.videoUrl)
            return (
              <article className="ftesti-tile" key={v._key} data-reveal data-reveal-delay={i * 120}>
                <div className="ftesti-media">
                  {fileSrc ? (
                    <video controls playsInline preload="metadata">
                      <source src={fileSrc} type={v.videoFileType || undefined} />
                    </video>
                  ) : embed ? (
                    <iframe
                      src={embed}
                      title={`${v.name} testimonial`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <div className="ftesti-play" aria-hidden="true">
                      <span className="ftesti-tri" />
                    </div>
                  )}
                </div>
                <div className="ftesti-cap">
                  <div className="ftesti-name">{v.name}</div>
                  {v.role && <div className="ftesti-role">{v.role}</div>}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
