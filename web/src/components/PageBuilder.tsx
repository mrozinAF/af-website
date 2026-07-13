import Hero from './blocks/Hero'
import HeroHome from './blocks/HeroHome'
import AboutMission from './blocks/AboutMission'
import PageHeader from './blocks/PageHeader'
import CoreTeam from './blocks/CoreTeam'
import ExpertNetwork from './blocks/ExpertNetwork'
import ExpertsCarousel from './blocks/ExpertsCarousel'
import CtaBanner from './blocks/CtaBanner'
import FellowsIntro from './blocks/FellowsIntro'
import FellowVideos from './blocks/FellowVideos'
import OfferLedger from './blocks/OfferLedger'
import ManifestoHeader from './blocks/ManifestoHeader'
import Capabilities from './blocks/Capabilities'
import WhyPartner from './blocks/WhyPartner'
import TextSection from './blocks/TextSection'
import Diptych from './blocks/Diptych'
import CompareColumns from './blocks/CompareColumns'
import ComingSoonHero from './blocks/ComingSoonHero'
import PathCards from './blocks/PathCards'
import FellowshipDetail from './blocks/FellowshipDetail'
import Accordion from './blocks/Accordion'
import RichText from './blocks/RichText'
import ImageBlock from './blocks/ImageBlock'
import PeopleGrid from './blocks/PeopleGrid'
import VideoTestimonials from './blocks/VideoTestimonials'
import JobListings from './blocks/JobListings'
import CtaButton from './CtaButton'
import type {PageBlock} from '@/sanity/types'

export default function PageBuilder({
  content,
  variant,
}: {
  content?: PageBlock[]
  variant?: 'home'
}) {
  if (!Array.isArray(content) || content.length === 0) return null

  return (
    <>
      {content.map((block, i) => {
        switch (block._type) {
          case 'hero':
            return variant === 'home' && i === 0 ? (
              <HeroHome key={block._key} block={block} />
            ) : (
              <Hero key={block._key} block={block} isFirst={i === 0} />
            )
          case 'aboutMission':
            return <AboutMission key={block._key} block={block} />
          case 'pageHeader':
            return <PageHeader key={block._key} block={block} />
          case 'coreTeam':
            return <CoreTeam key={block._key} block={block} />
          case 'expertNetwork':
            return <ExpertNetwork key={block._key} block={block} />
          case 'expertsCarousel':
            return <ExpertsCarousel key={block._key} block={block} />
          case 'ctaBanner':
            return <CtaBanner key={block._key} block={block} />
          case 'fellowsIntro':
            return <FellowsIntro key={block._key} block={block} />
          case 'fellowVideos':
            return <FellowVideos key={block._key} block={block} />
          case 'offerLedger':
            return <OfferLedger key={block._key} block={block} />
          case 'manifestoHeader':
            return <ManifestoHeader key={block._key} block={block} />
          case 'capabilities':
            return <Capabilities key={block._key} block={block} />
          case 'whyPartner':
            return <WhyPartner key={block._key} block={block} />
          case 'textSection':
            return <TextSection key={block._key} block={block} />
          case 'diptych':
            return <Diptych key={block._key} block={block} />
          case 'compareColumns':
            return <CompareColumns key={block._key} block={block} />
          case 'comingSoonHero':
            return <ComingSoonHero key={block._key} block={block} />
          case 'pathCards':
            return <PathCards key={block._key} block={block} />
          case 'fellowshipDetail':
            return <FellowshipDetail key={block._key} block={block} />
          case 'accordion':
            return <Accordion key={block._key} block={block} />
          case 'richText':
            return <RichText key={block._key} block={block} />
          case 'imageBlock':
            return <ImageBlock key={block._key} block={block} />
          case 'peopleGrid':
            return <PeopleGrid key={block._key} block={block} />
          case 'videoTestimonials':
            return <VideoTestimonials key={block._key} block={block} />
          case 'jobListings':
            return <JobListings key={block._key} block={block} />
          case 'cta':
            return (
              <section key={block._key} className="section section--cta">
                <div className="container container--narrow">
                  <CtaButton cta={block} />
                </div>
              </section>
            )
          default:
            return null
        }
      })}
    </>
  )
}
