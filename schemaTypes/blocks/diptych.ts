import {defineArrayMember, defineField, defineType} from 'sanity'
import {SplitHorizontalIcon} from '@sanity/icons'

/** Two joined panels with a central AF node (navy). */
export default defineType({
  name: 'diptych',
  title: 'Two-Panel Split',
  description: 'Two joined panels with a central "AF" node between them. Use to present two related ideas side by side.',
  type: 'object',
  icon: SplitHorizontalIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'centerLabel', title: 'Center node label', type: 'string', initialValue: 'AF'}),
    defineField({
      name: 'panels',
      title: 'Panels',
      type: 'array',
      validation: (rule) => rule.max(2),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'panel',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'heading', title: 'Heading', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'heading', subtitle: 'label'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || 'Diptych'}),
  },
})
