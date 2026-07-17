import {defineField, defineType} from 'sanity'
import {SquareIcon} from '@sanity/icons'

/** Full-height "coming soon" hero over the constellation field. */
export default defineType({
  name: 'comingSoonHero',
  title: 'Coming Soon Hero',
  description: 'A full-height "coming soon" banner over the animated navy background, with a title, short description, and an optional boxed note. Use for pages that are not ready yet.',
  type: 'object',
  icon: SquareIcon,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({
      name: 'note',
      title: 'Boxed note',
      type: 'string',
      description: 'Small bordered note, e.g. "Full details & registration coming soon".',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({title: title || 'Coming-soon hero'}),
  },
})
