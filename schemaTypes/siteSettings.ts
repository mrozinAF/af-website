import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons'

/**
 * Site-wide settings — currently the navigation menu shown in the header
 * and footer. A singleton (only one of these documents exists).
 */
export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'nav',
      title: 'Navigation menu',
      type: 'array',
      description: 'The links in the top menu and footer. Drag to reorder; each points at a page.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navItem',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'page',
              title: 'Page',
              type: 'reference',
              to: [{type: 'page'}],
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {title: 'label', slug: 'page.slug.current'},
            prepare: ({title, slug}) => ({
              title: title || 'Untitled',
              subtitle: slug ? (slug === 'home' ? '/' : `/${slug}`) : 'No page selected',
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'navCta',
      title: 'Nav button (e.g. Apply)',
      type: 'object',
      description: 'The solid button shown at the end of the menu. Leave empty to hide it.',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({name: 'page', title: 'Page', type: 'reference', to: [{type: 'page'}]}),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Site Settings'})},
})
