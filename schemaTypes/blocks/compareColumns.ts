import {defineArrayMember, defineField, defineType} from 'sanity'
import {SplitHorizontalIcon} from '@sanity/icons'

/** Two side-by-side columns of diamond-bulleted items (e.g. do well / miss). */
export default defineType({
  name: 'compareColumns',
  title: 'Compare columns',
  type: 'object',
  icon: SplitHorizontalIcon,
  fields: [
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      validation: (rule) => rule.max(2),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'column',
          fields: [
            defineField({name: 'label', title: 'Column label', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'tone',
              title: 'Accent colour',
              type: 'string',
              options: {list: [{title: 'Green', value: 'green'}, {title: 'Blue', value: 'blue'}], layout: 'radio'},
              initialValue: 'blue',
            }),
            defineField({
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'compareItem',
                  fields: [
                    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
                    defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
                  ],
                  preview: {select: {title: 'title'}},
                }),
              ],
            }),
          ],
          preview: {select: {title: 'label'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Compare columns'})},
})
