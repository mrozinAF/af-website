import {stegaClean} from 'next-sanity'

import type {VideoTestimonialsBlock} from '@/sanity/types'

/** Convert a YouTube/Vimeo watch URL into an embeddable URL. */
function toEmbedUrl(raw?: string): string | null {
  const url = stegaClean(raw)
  if (!url) return null
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
    }
    if (host.endsWith('youtube.com')) {
      if (u.pathname.startsWith('/embed/')) return url
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
    }
    if (host.endsWith('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean)[0]
      if (id) return `https://player.vimeo.com/video/${id}`
    }
    return url
  } catch {
    return null
  }
}

/** Is this a direct video file link (rather than a YouTube/Vimeo page)? */
function isDirectVideoLink(url?: string): boolean {
  const clean = stegaClean(url)
  return Boolean(clean && /\.(mp4|mov|webm|m4v|ogv)(\?|#|$)/i.test(clean))
}

export default function VideoTestimonials({block}: {block: VideoTestimonialsBlock}) {
  const videos = block.videos ?? []
  return (
    <section className="section">
      <div className="container">
        {block.title && <h2 className="section-title">{block.title}</h2>}
        {block.intro && <p className="section-intro">{block.intro}</p>}
        <div className="testimonial-grid">
          {videos.map((video) => {
            // Prefer an uploaded file / direct link (HTML5 video); fall back to an embed.
            const fileSrc =
              stegaClean(video.videoFileUrl) ||
              (isDirectVideoLink(video.videoUrl) ? stegaClean(video.videoUrl) : null)
            const embed = fileSrc ? null : toEmbedUrl(video.videoUrl)
            return (
              <article key={video._key} className="testimonial-card">
                {fileSrc ? (
                  <div className="testimonial-video">
                    <video controls playsInline preload="metadata">
                      <source src={fileSrc} type={video.videoFileType || undefined} />
                      Your browser can’t play this video.
                    </video>
                  </div>
                ) : embed ? (
                  <div className="testimonial-video">
                    <iframe
                      src={embed}
                      title={`${video.name} testimonial`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                ) : null}
                {video.quote && <blockquote className="testimonial-quote">{video.quote}</blockquote>}
                <div className="testimonial-meta">
                  <span className="testimonial-name">{video.name}</span>
                  {video.role && <span className="testimonial-role">{video.role}</span>}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
