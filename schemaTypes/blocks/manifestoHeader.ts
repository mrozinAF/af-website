import {defineArrayMember, defineField, defineType} from 'sanity'
import {SquareIcon} from '@sanity/icons'

/** Multi-line manifesto header over the constellation field (For Businesses). */
export default defineType({
  name: 'manifestoHeader',
  title: 'Manifesto Header',
  description: 'A large multi-line statement over the animated navy background, with selected lines highlighted in the accent colour. Use as a bold page opener.',
  type: 'object',
  icon: SquareIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'lines',
      title: 'Lines',
      type: 'array',
      description: 'Each line of the headline. Toggle "accent" to colour a line.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'line',
          fields: [
            defineField({name: 'text', title: 'Text', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'accent', title: 'Accent colour', type: 'boolean', initialValue: false}),
          ],
          preview: {
            select: {title: 'text', accent: 'accent'},
            prepare: ({title, accent}) => ({title, subtitle: accent ? 'Accent' : undefined}),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {eyebrow: 'eyebrow'},
    prepare: ({eyebrow}) => ({title: 'Manifesto header', subtitle: eyebrow}),
  },
})
