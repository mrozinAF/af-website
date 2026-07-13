import {defineArrayMember, defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons'

/** "What we do" — capability boxes on the left, a tall photo on the right. */
export default defineType({
  name: 'capabilities',
  title: 'Capabilities + photo',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', initialValue: 'What We Do'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'items',
      title: 'Capability boxes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'capability',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
            defineField({
              name: 'bullets',
              title: 'Bullets (optional)',
              type: 'array',
              of: [{type: 'string'}],
            }),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),
    defineField({name: 'image', title: 'Photo', type: 'imageBlock'}),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || 'Capabilities'}),
  },
})
