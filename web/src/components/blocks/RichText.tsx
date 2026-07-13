import PortableText from '../PortableText'
import type {RichTextBlock} from '@/sanity/types'

export default function RichText({block}: {block: RichTextBlock}) {
  return (
    <section className="section">
      <div className="container container--narrow">
        <PortableText value={block.content} />
      </div>
    </section>
  )
}
