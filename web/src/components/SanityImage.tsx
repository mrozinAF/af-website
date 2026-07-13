import Image from 'next/image'

import {urlFor} from '@/sanity/image'
import type {SanityImage as SanityImageType} from '@/sanity/types'

type Props = {
  image?: SanityImageType
  /** Falls back to altText on the image, then empty string. */
  alt?: string
  className?: string
  sizes?: string
  priority?: boolean
}

/**
 * Renders a Sanity image with next/image, using stored dimensions and LQIP
 * when available. Returns null when there is no asset.
 */
export default function SanityImage({image, alt, className, sizes, priority}: Props) {
  if (!image?.asset?._ref) return null

  const width = image.dimensions?.width ?? 1200
  const height = image.dimensions?.height ?? 800
  const src = urlFor(image).width(Math.min(width, 1600)).auto('format').url()

  return (
    <Image
      src={src}
      alt={alt ?? image.altText ?? ''}
      width={width}
      height={height}
      className={className}
      sizes={sizes ?? '100vw'}
      placeholder={image.lqip ? 'blur' : 'empty'}
      blurDataURL={image.lqip}
      priority={priority}
    />
  )
}
