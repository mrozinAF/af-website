import {defineArrayMember, defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons'

/** Navy "why partner" section — big outlined numerals with keyword rows. */
export default defineType({
  name: 'whyPartner',
  title: 'Why partner (numbered rows)',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'reason',
          fields: [
            defineField({name: 'keyword', title: 'Keyword label', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'title', subtitle: 'keyword'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || 'Why partner'}),
  },
})
