import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons'

/** Fellowship application detail — intro + Terms / Eligibility / How to apply. */
export default defineType({
  name: 'fellowshipDetail',
  title: 'Fellowship detail',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'anchorId',
      title: 'Anchor ID (optional)',
      type: 'string',
      description: 'A short id (e.g. "fellowship") so other blocks can scroll to this section.',
    }),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 3}),

    defineField({name: 'termsLabel', title: 'Terms — label', type: 'string', initialValue: 'Terms'}),
    defineField({name: 'termsHeading', title: 'Terms — heading', type: 'string'}),
    defineField({
      name: 'terms',
      title: 'Terms — cohort boxes',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'term',
          fields: [
            defineField({name: 'name', title: 'Name (e.g. "Summer")', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'when', title: 'When (e.g. "Early May")', type: 'string'}),
          ],
          preview: {select: {title: 'name', subtitle: 'when'}},
        }),
      ],
    }),

    defineField({name: 'eligLabel', title: 'Eligibility — label', type: 'string', initialValue: 'Eligibility'}),
    defineField({name: 'eligHeading', title: 'Eligibility — heading', type: 'string'}),
    defineField({name: 'eligibility', title: 'Eligibility — text', type: 'text', rows: 5}),

    defineField({name: 'howLabel', title: 'How to apply — label', type: 'string', initialValue: 'How to apply'}),
    defineField({name: 'howHeading', title: 'How to apply — heading', type: 'string'}),
    defineField({name: 'how', title: 'How to apply — text', type: 'text', rows: 3}),
    defineField({name: 'applyCta', title: 'Apply button', type: 'cta'}),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || 'Fellowship detail'}),
  },
})
