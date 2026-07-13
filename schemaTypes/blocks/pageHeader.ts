import {defineField, defineType} from 'sanity'
import {SquareIcon} from '@sanity/icons'

/**
 * Interior page header — a large centered title over the navy constellation
 * field (used on Our Team, and reusable for other interior pages).
 */
export default defineType({
  name: 'pageHeader',
  title: 'Page header (constellation)',
  type: 'object',
  icon: SquareIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline (optional)',
      type: 'string',
      description: 'Optional line under the title.',
    }),
    defineField({
      name: 'taglineHighlights',
      title: 'Tagline highlighted words',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Words/phrases in the tagline to show in the accent colour (e.g. "AF", "AI-First.").',
      hidden: ({parent}) => !parent?.tagline,
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare: ({title}) => ({title: title || 'Page header', subtitle: 'Constellation header'}),
  },
})
