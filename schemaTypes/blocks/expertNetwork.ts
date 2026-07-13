import {defineArrayMember, defineField, defineType} from 'sanity'
import {UlistIcon} from '@sanity/icons'

/** Navy "Expert Network" panel — heading, intro, and boxed supports. */
export default defineType({
  name: 'expertNetwork',
  title: 'Expert Network panel',
  type: 'object',
  icon: UlistIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'The Expert Network',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'supports',
      title: 'Supports',
      type: 'array',
      validation: (rule) => rule.max(4),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'support',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
          ],
          preview: {select: {title: 'title'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || 'Expert Network'}),
  },
})
