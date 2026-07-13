import {defineArrayMember, defineField, defineType} from 'sanity'
import {OlistIcon} from '@sanity/icons'

/** Numbered 01–NN ledger of offers, with an optional wide image below. */
export default defineType({
  name: 'offerLedger',
  title: 'Offer ledger',
  type: 'object',
  icon: OlistIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', initialValue: 'For Fellows'}),
    defineField({name: 'heading', title: 'Heading', type: 'string', initialValue: 'What We Offer Fellows'}),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'offer',
          fields: [
            defineField({name: 'text', title: 'Text', type: 'text', rows: 2, validation: (r) => r.required()}),
            defineField({name: 'detail', title: 'Detail (optional sub-line)', type: 'text', rows: 2}),
          ],
          preview: {select: {title: 'text'}},
        }),
      ],
    }),
    defineField({name: 'image', title: 'Wide image', type: 'imageBlock'}),
  ],
  preview: {
    select: {title: 'heading', items: 'items'},
    prepare: ({title, items}) => ({
      title: title || 'Offer ledger',
      subtitle: `${Array.isArray(items) ? items.length : 0} items`,
    }),
  },
})
