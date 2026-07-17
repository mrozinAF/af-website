import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

/**
 * People grid block.
 * Automatically lists every `person` document with their photo, name,
 * role and bio. Add or remove Person documents to change who appears.
 */
export default defineType({
  name: 'peopleGrid',
  title: 'Team Grid (Automatic)',
  description: 'Automatically shows every Person in a grid with photo, name, role, and bio. Add or remove People to change who appears — you do not edit this block directly.',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Section title',
      type: 'string',
      description: 'Optional heading shown above the grid.',
    }),
    defineField({
      name: 'intro',
      title: 'Intro text',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {
        title: title || 'People grid',
        subtitle: 'Lists all Person documents',
      }
    },
  },
})
