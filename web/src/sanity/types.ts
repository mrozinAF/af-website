import type {PortableTextBlock} from '@portabletext/react'

export type SanityImage = {
  _type: string
  asset?: {_ref: string; _type: string}
  hotspot?: {x: number; y: number}
  crop?: unknown
  altText?: string
  caption?: string
  lqip?: string
  dimensions?: {width: number; height: number; aspectRatio: number}
}

export type Cta = {
  _type: 'cta'
  _key?: string
  text?: string
  level?: number
  link?: {
    linkType?: 'internal' | 'external'
    url?: string
    openInNewTab?: boolean
    internalSlug?: string
  }
}

export type HeroBlock = {
  _type: 'hero'
  _key: string
  heading?: string
  accent?: string
  body?: string
  image?: SanityImage
  cta?: Cta
}

export type AccordionItem = {
  _key: string
  question: string
  answer: PortableTextBlock[]
  openByDefault?: boolean
}

export type AccordionBlock = {
  _type: 'accordion'
  _key: string
  title?: string
  items?: AccordionItem[]
}

export type Belief = {
  _key: string
  heading: string
  paragraphs?: string[]
}

export type AboutMissionBlock = {
  _type: 'aboutMission'
  _key: string
  mastheadLabel?: string
  est?: string
  beliefs?: Belief[]
  image?: SanityImage
  caption?: string
  missionLabel?: string
  mission?: string
}

export type RichTextBlock = {
  _type: 'richText'
  _key: string
  content?: PortableTextBlock[]
}

export type ImageBlock = SanityImage & {
  _type: 'imageBlock'
  _key: string
}

export type Person = {
  _id: string
  name: string
  role?: string
  credentials?: string
  bio?: string
  order?: number
  linkedIn?: string
  photo?: SanityImage
}

export type PageHeaderBlock = {
  _type: 'pageHeader'
  _key: string
  title: string
  tagline?: string
  taglineHighlights?: string[]
}

export type FellowsIntroBlock = {
  _type: 'fellowsIntro'
  _key: string
  recruitLabel?: string
  recruitText?: string
  recruitImage?: SanityImage
  doLabel?: string
  doHeading?: string
  doParagraphs?: string[]
  doImage?: SanityImage
  timeline?: {_key: string; label: string; title: string; text?: string}[]
}

export type FellowVideosBlock = {
  _type: 'fellowVideos'
  _key: string
  eyebrow?: string
  heading?: string
  videos?: {
    _key: string
    name: string
    role?: string
    videoUrl?: string
    videoFileUrl?: string
    videoFileType?: string
  }[]
}

export type OfferLedgerBlock = {
  _type: 'offerLedger'
  _key: string
  eyebrow?: string
  heading?: string
  items?: {_key: string; text: string; detail?: string}[]
  image?: SanityImage
}

export type CoreTeamBlock = {
  _type: 'coreTeam'
  _key: string
  title?: string
  people?: Person[]
}

export type ExpertNetworkBlock = {
  _type: 'expertNetwork'
  _key: string
  heading?: string
  intro?: string
  supports?: {_key: string; title: string; description?: string}[]
}

export type Expert = {
  _key: string
  name: string
  bio?: string
  photo?: SanityImage
}

export type ExpertsCarouselBlock = {
  _type: 'expertsCarousel'
  _key: string
  heading?: string
  experts?: Expert[]
}

export type CtaBannerBlock = {
  _type: 'ctaBanner'
  _key: string
  heading: string
  headingHighlights?: string[]
  field?: boolean
  body?: string
  anchorId?: string
  primaryCta?: Cta
  secondaryCta?: Cta
}

export type PathCardsBlock = {
  _type: 'pathCards'
  _key: string
  items?: {_key: string; kicker?: string; title: string; text?: string; cta?: Cta; scrollTo?: string}[]
}

export type FellowshipDetailBlock = {
  _type: 'fellowshipDetail'
  _key: string
  anchorId?: string
  eyebrow?: string
  heading?: string
  intro?: string
  termsLabel?: string
  termsHeading?: string
  terms?: {_key: string; name: string; when?: string}[]
  eligLabel?: string
  eligHeading?: string
  eligibility?: string
  howLabel?: string
  howHeading?: string
  how?: string
  applyCta?: Cta
}

export type ManifestoHeaderBlock = {
  _type: 'manifestoHeader'
  _key: string
  eyebrow?: string
  lines?: {_key: string; text: string; accent?: boolean}[]
}

export type CapabilitiesBlock = {
  _type: 'capabilities'
  _key: string
  eyebrow?: string
  heading?: string
  items?: {_key: string; title: string; text?: string; bullets?: string[]}[]
  image?: SanityImage
}

export type WhyPartnerBlock = {
  _type: 'whyPartner'
  _key: string
  eyebrow?: string
  heading?: string
  rows?: {_key: string; keyword?: string; title: string; description?: string}[]
}

export type ComingSoonHeroBlock = {
  _type: 'comingSoonHero'
  _key: string
  title: string
  description?: string
  note?: string
}

export type TextSectionBlock = {
  _type: 'textSection'
  _key: string
  eyebrow?: string
  heading?: string
  paragraphs?: string[]
}

export type DiptychBlock = {
  _type: 'diptych'
  _key: string
  eyebrow?: string
  heading?: string
  centerLabel?: string
  panels?: {_key: string; label?: string; heading: string; text?: string}[]
}

export type CompareColumnsBlock = {
  _type: 'compareColumns'
  _key: string
  columns?: {
    _key: string
    label: string
    tone?: 'green' | 'blue'
    items?: {_key: string; title: string; description?: string}[]
  }[]
}

export type PeopleGridBlock = {
  _type: 'peopleGrid'
  _key: string
  title?: string
  intro?: string
  people?: Person[]
}

export type Testimonial = {
  _key: string
  name: string
  role?: string
  videoUrl?: string
  videoFileUrl?: string
  videoFileType?: string
  quote?: string
}

export type VideoTestimonialsBlock = {
  _type: 'videoTestimonials'
  _key: string
  title?: string
  intro?: string
  videos?: Testimonial[]
}

export type Job = {
  _id: string
  title: string
  department?: string
  description?: string
  applyLink?: string
  datePosted?: string
}

export type JobListingsBlock = {
  _type: 'jobListings'
  _key: string
  title?: string
  intro?: PortableTextBlock[]
  emptyMessage?: string
  jobs?: Job[]
}

export type CtaBlock = Cta & {_key: string}

export type PageBlock =
  | HeroBlock
  | PageHeaderBlock
  | CoreTeamBlock
  | ExpertNetworkBlock
  | ExpertsCarouselBlock
  | FellowsIntroBlock
  | FellowVideosBlock
  | OfferLedgerBlock
  | ManifestoHeaderBlock
  | CapabilitiesBlock
  | WhyPartnerBlock
  | ComingSoonHeroBlock
  | TextSectionBlock
  | DiptychBlock
  | CompareColumnsBlock
  | PathCardsBlock
  | FellowshipDetailBlock
  | CtaBannerBlock
  | AboutMissionBlock
  | AccordionBlock
  | RichTextBlock
  | ImageBlock
  | PeopleGridBlock
  | VideoTestimonialsBlock
  | JobListingsBlock
  | CtaBlock

export type Page = {
  _id: string
  name: string
  slug: string
  seo?: {title?: string; description?: string; ogImage?: SanityImage}
  content?: PageBlock[]
}
