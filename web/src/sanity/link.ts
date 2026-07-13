import {stegaClean} from 'next-sanity'

import type {Cta} from './types'

type ResolvedLink = {
  href: string
  external: boolean
  openInNewTab: boolean
}

/** Turn a CTA/link object into an href + target metadata. */
export function resolveLink(link?: Cta['link']): ResolvedLink | null {
  if (!link) return null
  const type = stegaClean(link.linkType) || 'internal'

  if (type === 'external') {
    const url = stegaClean(link.url)
    if (!url) return null
    return {href: url, external: true, openInNewTab: link.openInNewTab ?? true}
  }

  const slug = stegaClean(link.internalSlug)
  if (!slug) return null
  return {
    href: slug === 'home' ? '/' : `/${slug}`,
    external: false,
    openInNewTab: link.openInNewTab ?? false,
  }
}
