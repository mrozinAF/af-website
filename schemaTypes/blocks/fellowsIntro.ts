import {defineArrayMember, defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons'

/**
 * Fellows intro — "Who we recruit" (text + image) and "What Fellows Do"
 * (image + heading + paragraphs) with a two-phase timeline under the image.
 */
export default defineType({
  name: 'fellowsIntro',
  title: 'Fellows Intro (Recruit + What They Do)',
  description: 'The Fellows-page introduction: a "who we recruit" block and a "what Fellows do" block with a short two-phase timeline. Use once near the top of the Fellows page.',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    defineField({name: 'recruitLabel', title: 'Recruit eyebrow', type: 'string', initialValue: 'Who we recruit'}),
    defineField({name: 'recruitText', title: 'Recruit paragraph', type: 'text', rows: 4}),
    defineField({name: 'recruitImage', title: 'Recruit image', type: 'imageBlock'}),
    defineField({name: 'doLabel', title: 'Do eyebrow', type: 'string', initialValue: 'What Fellows Do'}),
    defineField({name: 'doHeading', title: 'Do heading', type: 'string', initialValue: 'Forward-deployed, from day one.'}),
    defineField({
      name: 'doParagraphs',
      title: 'Do paragraphs',
      type: 'array',
      of: [defineArrayMember({type: 'text'})],
    }),
    defineField({name: 'doImage', title: 'Do image', type: 'imageBlock'}),
    defineField({
      name: 'timeline',
      title: 'Timeline phases',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'phase',
          fields: [
            defineField({name: 'label', title: 'Label (e.g. "Week 1–2")', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'title', subtitle: 'label'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Fellows intro'})},
})
