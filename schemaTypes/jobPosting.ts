import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'jobPosting',
  title: 'Job Posting',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'applyLink',
      title: 'Apply link',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'datePosted',
      title: 'Date posted',
      type: 'date',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'department',
    },
  },
})
