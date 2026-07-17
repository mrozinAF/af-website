import {defineArrayMember, defineField, defineType} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons'

/**
 * About + Mission editorial section (from the homepage design).
 * A masthead label, two "beliefs" columns, a wide image, and a mission statement.
 */
export default defineType({
  name: 'aboutMission',
  title: 'About & Mission Section',
  description: 'A two-column editorial section pairing your beliefs with a mission statement and a wide photo. Use near the top of a page to introduce what the company stands for.',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'mastheadLabel',
      title: 'Masthead label',
      type: 'string',
      initialValue: 'What is Ascendance Foundry',
    }),
    defineField({
      name: 'est',
      title: 'Right-hand label',
      type: 'string',
      initialValue: 'EST. 2025',
    }),
    defineField({
      name: 'beliefs',
      title: 'Beliefs (two columns)',
      type: 'array',
      validation: (rule) => rule.max(2),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'belief',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'paragraphs',
              title: 'Paragraphs',
              type: 'array',
              of: [defineArrayMember({type: 'text'})],
            }),
          ],
          preview: {
            select: {title: 'heading'},
            prepare: ({title}) => ({title: title || 'Belief'}),
          },
        }),
      ],
    }),
    defineField({
      name: 'image',
      title: 'Wide image',
      type: 'imageBlock',
    }),
    defineField({
      name: 'caption',
      title: 'Image caption',
      type: 'string',
      initialValue: 'FIG. 01 — FELLOWS AT WORK',
    }),
    defineField({
      name: 'missionLabel',
      title: 'Mission eyebrow',
      type: 'string',
      initialValue: 'Our Mission',
    }),
    defineField({
      name: 'mission',
      title: 'Mission statement',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    prepare: () => ({title: 'About + Mission'}),
  },
})
