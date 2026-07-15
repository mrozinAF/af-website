import {defineArrayMember, defineField, defineType} from 'sanity'
import {TextIcon} from '@sanity/icons'

/** Simple centered-column text section: eyebrow + heading + paragraphs. */
export default defineType({
  name: 'textSection',
  title: 'Text Section',
  description: 'A simple centred column of text: a small eyebrow label, a heading, and one or more paragraphs. Use for straightforward written content.',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'paragraphs',
      title: 'Paragraphs',
      type: 'array',
      of: [defineArrayMember({type: 'text'})],
    }),
  ],
  preview: {
    select: {title: 'heading', eyebrow: 'eyebrow'},
    prepare: ({title, eyebrow}) => ({title: title || 'Text section', subtitle: eyebrow}),
  },
})
