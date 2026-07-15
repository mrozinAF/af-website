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
      title: 'Navigation menu order',
      type: 'array',
      description:
        'Every page shows in the top menu and footer automatically. This list only sets the ORDER: drag to arrange the pages you care about. Any page not listed here appears at the end (newest last), just before the Apply button. Note: removing a page here does NOT hide it — it just moves to the end. To take a page off the site, unpublish or delete the page itself.',
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
