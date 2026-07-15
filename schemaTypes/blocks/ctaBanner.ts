import {defineField, defineType} from 'sanity'
import {RocketIcon} from '@sanity/icons'

/** Navy call-to-action strip with a heading and up to two buttons. */
export default defineType({
  name: 'ctaBanner',
  title: 'Call-to-Action Banner',
  description: 'A bold navy strip with a heading and up to two buttons, prompting the reader to act (e.g. "Apply now"). Usually placed at the bottom of a page.',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headingHighlights',
      title: 'Highlighted words',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Words/phrases in the heading to show in the accent colour.',
    }),
    defineField({
      name: 'field',
      title: 'Show constellation field',
      type: 'boolean',
      initialValue: false,
      description: 'Adds the animated particle field behind this banner.',
    }),
    defineField({name: 'body', title: 'Body (optional)', type: 'text', rows: 2}),
    defineField({
      name: 'anchorId',
      title: 'Anchor ID (optional)',
      type: 'string',
      description: 'A short id (e.g. "companies") so other blocks can scroll to this banner.',
    }),
    defineField({name: 'primaryCta', title: 'Primary button', type: 'cta'}),
    defineField({name: 'secondaryCta', title: 'Secondary button', type: 'cta'}),
  ],
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || 'CTA banner'}),
  },
})
