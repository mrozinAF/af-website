import SanityImage from '../SanityImage'
import type {ImageBlock as ImageBlockType} from '@/sanity/types'

export default function ImageBlock({block}: {block: ImageBlockType}) {
  if (!block.asset?._ref) return null
  return (
    <section className="section">
      <div className="container container--narrow">
        <figure className="image-block">
          <div className="image-frame">
            <SanityImage image={block} sizes="(max-width: 900px) 100vw, 900px" />
          </div>
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      </div>
    </section>
  )
}
