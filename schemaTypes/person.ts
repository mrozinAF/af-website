import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'credentials',
      title: 'Credentials',
      type: 'text',
      rows: 2,
      description: 'Semicolon-separated one-liner (e.g. "Co-founder of X; Board member at Y; Harvard PhD").',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Controls the left-to-right order in the team grid.',
    }),
    defineField({
      name: 'linkedIn',
      title: 'LinkedIn',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'photo',
    },
  },
})
