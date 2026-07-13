import SanityImage from '../SanityImage'
import CtaButton from '../CtaButton'
import type {HeroBlock} from '@/sanity/types'

export default function Hero({block, isFirst}: {block: HeroBlock; isFirst?: boolean}) {
  const hasImage = Boolean(block.image?.asset?._ref)
  return (
    <section className={`hero${hasImage ? ' hero--with-image' : ''}`}>
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="hero-eyebrow" aria-hidden="true" />
          {block.heading && <h1 className="hero-heading">{block.heading}</h1>}
          {block.body && <p className="hero-body">{block.body}</p>}
          {block.cta && <CtaButton cta={block.cta} className="hero-cta" />}
        </div>
        {hasImage && (
          <div className="hero-media">
            <div className="hero-media-frame">
              <SanityImage
                image={block.image}
                sizes="(max-width: 900px) 100vw, 520px"
                priority={isFirst}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
