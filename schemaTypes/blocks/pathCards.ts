import {defineArrayMember, defineField, defineType} from 'sanity'
import {ThLargeIcon} from '@sanity/icons'

/** Three routing cards (Students / Careers / Companies) that lift on hover. */
export default defineType({
  name: 'pathCards',
  title: 'Path cards',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Cards',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'pathCard',
          fields: [
            defineField({name: 'kicker', title: 'Kicker (e.g. "Students")', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 2}),
            defineField({
              name: 'cta',
              title: 'Link (button text + destination)',
              type: 'cta',
              description: 'The link label (e.g. "How to apply") and where the whole card links to.',
            }),
            defineField({
              name: 'scrollTo',
              title: 'Scroll to section on this page (optional)',
              type: 'string',
              description:
                'If set, clicking the card scrolls to a section on this page with this Anchor ID (instead of following the link above). Keep the link label for the button text.',
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'kicker'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Path cards'})},
})
