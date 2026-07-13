import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

/**
 * Core team cards — auto-lists every `person` document as a vertical card
 * (photo with dashed ring, role, name, credentials, bio).
 */
export default defineType({
  name: 'coreTeam',
  title: 'Core team cards',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Section title (optional)',
      type: 'string',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Core team cards', subtitle: 'Lists all Person documents'}),
  },
})
