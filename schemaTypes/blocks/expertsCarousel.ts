import {defineArrayMember, defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

/** Experts carousel — 3 visible at a time, arrows page through all with wraparound. */
export default defineType({
  name: 'expertsCarousel',
  title: 'Experts carousel',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'Meet some of our Experts',
    }),
    defineField({
      name: 'experts',
      title: 'Experts',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'expert',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'bio', title: 'Bio', type: 'text', rows: 3}),
            defineField({name: 'photo', title: 'Photo', type: 'image', options: {hotspot: true}}),
          ],
          preview: {select: {title: 'name', media: 'photo'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading', experts: 'experts'},
    prepare: ({title, experts}) => ({
      title: title || 'Experts carousel',
      subtitle: `${Array.isArray(experts) ? experts.length : 0} experts`,
    }),
  },
})
