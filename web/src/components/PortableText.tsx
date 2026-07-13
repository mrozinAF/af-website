import {PortableText as BasePortableText, type PortableTextComponents} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/react'
import Link from 'next/link'

import {resolveLink} from '@/sanity/link'
import SanityImage from './SanityImage'
import CtaButton from './CtaButton'

const components: PortableTextComponents = {
  types: {
    richTextImage: ({value}) => (
      <figure className="rt-figure">
        <SanityImage image={value} sizes="(max-width: 800px) 100vw, 800px" />
        {value?.caption && <figcaption>{value.caption}</figcaption>}
      </figure>
    ),
    cta: ({value}) => <CtaButton cta={value} className="rt-cta" />,
  },
  marks: {
    link: ({value, children}) => {
      const resolved = resolveLink(value)
      if (!resolved) return <>{children}</>
      if (resolved.external) {
        return (
          <a
            href={resolved.href}
            target={resolved.openInNewTab ? '_blank' : undefined}
            rel={resolved.openInNewTab ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        )
      }
      return <Link href={resolved.href}>{children}</Link>
    },
  },
}

export default function PortableText({value}: {value?: PortableTextBlock[]}) {
  if (!value || value.length === 0) return null
  return (
    <div className="rich-text">
      <BasePortableText value={value} components={components} />
    </div>
  )
}
