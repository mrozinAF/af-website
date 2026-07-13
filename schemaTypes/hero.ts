import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'accent',
      title: 'Highlighted words',
      type: 'string',
      description:
        'Optional: the trailing words of the heading to show in the accent colour (e.g. "AI era.").',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageBlock',
    }),
    defineField({
      name: 'cta',
      title: 'Call to action',
      type: 'cta',
    }),
  ],
})
