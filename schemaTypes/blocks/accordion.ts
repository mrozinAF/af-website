import {defineArrayMember, defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons'

/**
 * Accordion / dropdown block.
 * Renders a stack of collapsible items — the reader sees each question
 * (e.g. "What is Ascendance Foundry?") and clicks to reveal the answer.
 */
export default defineType({
  name: 'accordion',
  title: 'Dropdown section',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Section title',
      type: 'string',
      description: 'Optional heading shown above the dropdowns.',
    }),
    defineField({
      name: 'items',
      title: 'Dropdowns',
      type: 'array',
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'item',
          icon: HelpCircleIcon,
          fields: [
            defineField({
              name: 'question',
              title: 'Label',
              type: 'string',
              description: 'The clickable text, e.g. "What is Ascendance Foundry?"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Content',
              type: 'array',
              of: [defineArrayMember({type: 'block'})],
              description: 'The paragraph(s) revealed when the label is clicked.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'openByDefault',
              title: 'Open by default',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {title: 'question'},
            prepare({title}) {
              return {title: title || 'Untitled', subtitle: 'Dropdown'}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', items: 'items'},
    prepare({title, items}) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: title || 'Dropdown section',
        subtitle: `${count} dropdown${count === 1 ? '' : 's'}`,
      }
    },
  },
})
