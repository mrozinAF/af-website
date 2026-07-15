import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons'

/**
 * Job listings block — used on the Full-time positions page.
 * Automatically lists every `jobPosting` document with an intro above.
 */
export default defineType({
  name: 'jobListings',
  title: 'Job Listings (Automatic)',
  description: 'Automatically lists every Job Posting, newest first, with an intro above. Add or remove Job Postings to change what appears — you do not edit the roles here.',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Section title',
      type: 'string',
    }),
    defineField({
      name: 'intro',
      title: 'Intro text',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Text about the roles, shown above the list of open positions.',
    }),
    defineField({
      name: 'emptyMessage',
      title: 'Message when there are no openings',
      type: 'string',
      initialValue: 'There are no open positions right now — check back soon.',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Job listings', subtitle: 'Auto-lists all job postings'}
    },
  },
})
