import {createPresetsRegistry} from '@sanity/presets'
import {defineField} from 'sanity'

import hero from './hero'
import jobPosting from './jobPosting'
import person from './person'
import siteSettings from './siteSettings'
import accordion from './blocks/accordion'
import aboutMission from './blocks/aboutMission'
import peopleGrid from './blocks/peopleGrid'
import videoTestimonials from './blocks/videoTestimonials'
import jobListings from './blocks/jobListings'
import pageHeader from './blocks/pageHeader'
import coreTeam from './blocks/coreTeam'
import expertNetwork from './blocks/expertNetwork'
import expertsCarousel from './blocks/expertsCarousel'
import ctaBanner from './blocks/ctaBanner'
import fellowsIntro from './blocks/fellowsIntro'
import fellowVideos from './blocks/fellowVideos'
import offerLedger from './blocks/offerLedger'
import manifestoHeader from './blocks/manifestoHeader'
import capabilities from './blocks/capabilities'
import whyPartner from './blocks/whyPartner'
import textSection from './blocks/textSection'
import diptych from './blocks/diptych'
import compareColumns from './blocks/compareColumns'
import comingSoonHero from './blocks/comingSoonHero'
import pathCards from './blocks/pathCards'
import fellowshipDetail from './blocks/fellowshipDetail'

const {defineCta, defineImage, definePage, defineRichText} = createPresetsRegistry({
  link: {to: ['page']},
})

const pageType = definePage({
  name: 'page',
  title: 'Page',
  pageBuilderBlocks: [
    'hero',
    'pageHeader',
    'aboutMission',
    'coreTeam',
    'expertNetwork',
    'expertsCarousel',
    'fellowsIntro',
    'fellowVideos',
    'offerLedger',
    'manifestoHeader',
    'capabilities',
    'whyPartner',
    'textSection',
    'diptych',
    'compareColumns',
    'comingSoonHero',
    'pathCards',
    'fellowshipDetail',
    'accordion',
    'richText',
    'imageBlock',
    'peopleGrid',
    'videoTestimonials',
    'jobListings',
    'ctaBanner',
    'cta',
  ],
})

// The preset's slug field already auto-generates from the page name (the
// "Generate" button — options.source = 'name'). We also make it REQUIRED so a
// page can never be published without a web address: an empty slug gives the
// page no URL and hides it from the auto-built navigation menu.
type PageField = {name?: string; options?: Record<string, unknown>}
const page = {
  ...pageType,
  fields: (pageType as unknown as {fields: PageField[]}).fields.map((field) =>
    field.name === 'slug'
      ? {
          ...field,
          options: {...(field.options ?? {}), source: 'name'},
          validation: (rule: {required: () => {error: (message: string) => unknown}}) =>
            rule
              .required()
              .error('Add a web address (slug) — click “Generate” to make one from the page name.'),
        }
      : field,
  ),
} as unknown as typeof pageType

export const schemaTypes = [
  page,
  hero,
  person,
  jobPosting,
  siteSettings,
  accordion,
  aboutMission,
  peopleGrid,
  videoTestimonials,
  jobListings,
  pageHeader,
  coreTeam,
  expertNetwork,
  expertsCarousel,
  ctaBanner,
  fellowsIntro,
  fellowVideos,
  offerLedger,
  manifestoHeader,
  capabilities,
  whyPartner,
  textSection,
  diptych,
  compareColumns,
  comingSoonHero,
  pathCards,
  fellowshipDetail,
  defineImage({name: 'imageBlock', title: 'Image'}),
  defineCta({
    name: 'cta',
    title: 'Call to action',
    fields: [
      defineField({
        name: 'text',
        title: 'Button text',
        type: 'string',
        validation: (rule) => rule.required(),
      }),
    ],
  }),
  defineRichText({name: 'richText', title: 'Rich text'}),
]
