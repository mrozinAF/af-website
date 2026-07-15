import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

/**
 * Core team cards — auto-lists every `person` document as a vertical card
 * (photo with dashed ring, role, name, credentials, bio).
 */
export default defineType({
  name: 'coreTeam',
  title: 'Team Cards (Automatic)',
  description: 'Automatically shows every Person as a photo card with their role, name, credentials, and bio. Add or remove People to change who appears — you do not edit this block directly.',
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
