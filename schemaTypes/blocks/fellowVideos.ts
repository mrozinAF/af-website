import {defineArrayMember, defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'

/**
 * Fellows video testimonials — navy section with portrait (9:12) video tiles.
 * Each tile shows a play affordance until a real video is added.
 */
export default defineType({
  name: 'fellowVideos',
  title: 'Fellow Video Testimonials',
  description: 'A navy section of tall (portrait) video tiles from Fellows. Each tile takes an uploaded video or a link. Use on the Fellows page to build credibility.',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', initialValue: 'Testimonials'}),
    defineField({name: 'heading', title: 'Heading', type: 'string', initialValue: 'Hear from our Fellows'}),
    defineField({
      name: 'videos',
      title: 'Testimonials',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'fellowVideo',
          fields: [
            defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'role', title: 'Role', type: 'string'}),
            defineField({
              name: 'videoFile',
              title: 'Upload a video (optional)',
              type: 'file',
              options: {accept: 'video/*'},
            }),
            defineField({
              name: 'videoUrl',
              title: '…or a video link (optional)',
              type: 'url',
              validation: (r) => r.uri({scheme: ['http', 'https']}),
            }),
          ],
          preview: {select: {title: 'name', subtitle: 'role'}},
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading', videos: 'videos'},
    prepare: ({title, videos}) => ({
      title: title || 'Fellow videos',
      subtitle: `${Array.isArray(videos) ? videos.length : 0} tiles`,
    }),
  },
})
