import {defineArrayMember, defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'

/**
 * Video testimonials block — used on the Fellows page.
 * Each testimonial embeds a YouTube/Vimeo video plus an optional quote.
 */
export default defineType({
  name: 'videoTestimonials',
  title: 'Video testimonials',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Section title',
      type: 'string',
    }),
    defineField({
      name: 'intro',
      title: 'Intro text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'videos',
      title: 'Testimonials',
      type: 'array',
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'testimonial',
          icon: PlayIcon,
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'role',
              title: 'Role / description',
              type: 'string',
            }),
            defineField({
              name: 'videoFile',
              title: 'Upload a video file',
              type: 'file',
              description:
                'Drag in a video (e.g. an iPhone .mp4 or .mov). MP4 (H.264) plays everywhere; .mov may not play in some browsers, so MP4 is safest.',
              options: {accept: 'video/*'},
            }),
            defineField({
              name: 'videoUrl',
              title: '…or paste a video link',
              type: 'url',
              description: 'A YouTube or Vimeo link, or a direct link to an .mp4 file. Used only if no file is uploaded above.',
              validation: (rule) => rule.uri({scheme: ['http', 'https']}),
            }),
            defineField({
              name: 'quote',
              title: 'Quote',
              type: 'text',
              rows: 3,
            }),
          ],
          validation: (rule) =>
            rule.custom((item?: {videoFile?: unknown; videoUrl?: unknown}) => {
              if (!item?.videoFile && !item?.videoUrl) {
                return 'Add a video: upload a file or paste a link.'
              }
              return true
            }),
          preview: {
            select: {title: 'name', subtitle: 'role'},
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', videos: 'videos'},
    prepare({title, videos}) {
      const count = Array.isArray(videos) ? videos.length : 0
      return {
        title: title || 'Video testimonials',
        subtitle: `${count} video${count === 1 ? '' : 's'}`,
      }
    },
  },
})
