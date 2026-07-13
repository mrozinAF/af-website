import {defineQuery} from 'next-sanity'

// Keeps `image.asset._ref`, hotspot and crop intact for the URL builder,
// and adds LQIP + dimensions as sibling fields for next/image.
const IMAGE = /* groq */ `
  ...,
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions
`

const LINK = /* groq */ `
  ...,
  "internalSlug": reference->slug.current
`

const CTA = /* groq */ `
  ...,
  link{${LINK}}
`

// A single page with every page-builder block fully expanded.
export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    seo,
    content[]{
      ...,
      _type == "hero" => {
        ...,
        image{${IMAGE}},
        cta{${CTA}}
      },
      _type == "aboutMission" => {
        ...,
        image{${IMAGE}}
      },
      _type == "coreTeam" => {
        ...,
        "people": *[_type == "person"] | order(order asc, _createdAt asc){
          _id,
          name,
          role,
          credentials,
          bio,
          order,
          linkedIn,
          photo{${IMAGE}}
        }
      },
      _type == "expertsCarousel" => {
        ...,
        experts[]{
          _key,
          name,
          bio,
          photo{${IMAGE}}
        }
      },
      _type == "ctaBanner" => {
        ...,
        primaryCta{${CTA}},
        secondaryCta{${CTA}}
      },
      _type == "pathCards" => {
        ...,
        items[]{
          _key,
          kicker,
          title,
          text,
          scrollTo,
          cta{${CTA}}
        }
      },
      _type == "fellowshipDetail" => {
        ...,
        applyCta{${CTA}}
      },
      _type == "fellowsIntro" => {
        ...,
        recruitImage{${IMAGE}},
        doImage{${IMAGE}}
      },
      _type == "fellowVideos" => {
        ...,
        videos[]{
          _key,
          name,
          role,
          videoUrl,
          "videoFileUrl": videoFile.asset->url,
          "videoFileType": videoFile.asset->mimeType
        }
      },
      _type == "offerLedger" => {
        ...,
        image{${IMAGE}}
      },
      _type == "capabilities" => {
        ...,
        image{${IMAGE}}
      },
      _type == "accordion" => {
        ...,
        items[]{
          _key,
          question,
          answer,
          openByDefault
        }
      },
      _type == "richText" => {
        ...,
        content[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {${LINK}}
          },
          _type == "richTextImage" => {${IMAGE}}
        }
      },
      _type == "imageBlock" => {${IMAGE}},
      _type == "peopleGrid" => {
        ...,
        "people": *[_type == "person"] | order(_createdAt asc){
          _id,
          name,
          role,
          bio,
          linkedIn,
          photo{${IMAGE}}
        }
      },
      _type == "videoTestimonials" => {
        ...,
        videos[]{
          _key,
          name,
          role,
          videoUrl,
          quote,
          "videoFileUrl": videoFile.asset->url,
          "videoFileType": videoFile.asset->mimeType
        }
      },
      _type == "jobListings" => {
        ...,
        "jobs": *[_type == "jobPosting"] | order(datePosted desc){
          _id,
          title,
          department,
          description,
          applyLink,
          datePosted
        }
      },
      _type == "cta" => {${CTA}}
    }
  }
`)

// Slugs for static generation of the dynamic route (home is rendered separately).
export const OTHER_PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current) && slug.current != "home"].slug.current
`)

export const NAV_QUERY = defineQuery(`
  *[_id == "siteSettings"][0]{
    nav[]{
      label,
      "slug": page->slug.current
    },
    navCta{
      label,
      "slug": page->slug.current
    }
  }
`)
