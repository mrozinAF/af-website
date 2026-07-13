import {stegaClean} from 'next-sanity'

/** Convert a YouTube/Vimeo watch URL into an embeddable URL. */
export function toEmbedUrl(raw?: string): string | null {
  const url = stegaClean(raw)
  if (!url) return null
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
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

export function isDirectVideoLink(url?: string): boolean {
  const clean = stegaClean(url)
  return Boolean(clean && /\.(mp4|mov|webm|m4v|ogv)(\?|#|$)/i.test(clean))
}
