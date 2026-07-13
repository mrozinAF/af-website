import {defineArrayMember, defineField, defineType} from 'sanity'
import {TextIcon} from '@sanity/icons'

/** Simple centered-column text section: eyebrow + heading + paragraphs. */
export default defineType({
  name: 'textSection',
  title: 'Text section (eyebrow + heading + paragraphs)',
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
