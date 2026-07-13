import {createReadStream} from 'node:fs'
import {join} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient()
const root = process.cwd()

// -- helpers ---------------------------------------------------------------
const key = () => Math.random().toString(36).slice(2, 12)

const pt = (paragraphs: string[]) =>
  paragraphs.map((text) => ({
    _key: key(),
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{_key: key(), _type: 'span', text, marks: []}],
  }))

const internalCta = (text: string, refId: string, level = 1) => ({
  _type: 'cta',
  text,
  level,
  link: {
    linkType: 'internal',
    reference: {_type: 'reference', _ref: refId},
    openInNewTab: false,
  },
})

async function uploadImage(filename: string) {
  const asset = await client.assets.upload(
    'image',
    createReadStream(join(root, filename)),
    {filename},
  )
  return {
    _type: 'image',
    asset: {_type: 'reference', _ref: asset._id},
  }
}

// -- page ids (stable so re-running is idempotent) -------------------------
const HOME_ID = 'd6016f48-8743-4a57-aae4-78ab0e66ba37' // existing Home doc
const OUR_TEAM_ID = 'page-our-team'
const FELLOWS_ID = 'page-fellows'
const JOBS_ID = 'page-full-time-positions'
const CAMP_ID = 'page-summer-camp'

const WHAT_IS_AF =
  'Ascendance Foundry (AF) is built on two beliefs: 1) apprenticeship belongs at the centre of education, and 2) winning with AI demands the fastest workforce retraining in history. AF is an AI consultancy and development firm built around the idea of apprenticeship. Our Ascendance Fellowship hires high performing students in cohorts and embeds them with client companies as forward deployed engineers.'

const FELLOWSHIP_DESC =
  'From day one, Fellows onboard directly with clients, scope the project alongside them, and work with executives and non-technical stakeholders to produce custom automations. As part of the program, Fellows receive structured mentorship through AI workshops, project reviews, weekly founder Q&As, and technical seminars led by industry experts, executives, and seasoned founders.'

const WHO_WE_WORK_WITH =
  'Our fellowships support a broad range of roles within companies, ranging from business functions, analytics, and software development. For larger initiatives, we build teams of Fellows and experts to deliver on projects ranging from strategic consulting to custom application development.'

async function run() {
  console.log('Uploading team photos…')
  const [ianPhoto, ethanPhoto, andrewPhoto] = await Promise.all([
    uploadImage('ian.png'),
    uploadImage('ethan.png'),
    uploadImage('andrew_z.png'),
  ])

  console.log('Creating people…')
  const people = [
    {
      _id: 'person-ian',
      _type: 'person',
      name: 'Ian',
      role: 'Co-Founder',
      bio: 'Add a short bio here — background, focus areas, and what Ian leads at Ascendance Foundry.',
      photo: {...ianPhoto, _type: 'image'},
    },
    {
      _id: 'person-ethan',
      _type: 'person',
      name: 'Ethan',
      role: 'Co-Founder',
      bio: 'Add a short bio here — background, focus areas, and what Ethan leads at Ascendance Foundry.',
      photo: {...ethanPhoto, _type: 'image'},
    },
    {
      _id: 'person-andrew',
      _type: 'person',
      name: 'Andrew',
      role: 'Co-Founder',
      bio: 'Add a short bio here — background, focus areas, and what Andrew leads at Ascendance Foundry.',
      photo: {...andrewPhoto, _type: 'image'},
    },
  ]

  console.log('Creating job postings…')
  const jobs = [
    {
      _id: 'job-forward-deployed-engineer',
      _type: 'jobPosting',
      title: 'Forward Deployed Engineer',
      department: 'Engineering',
      description:
        'Work embedded with client companies to scope, build, and ship custom AI automations alongside their teams. Placeholder description — edit in the Studio.',
      datePosted: '2026-07-01',
    },
    {
      _id: 'job-ai-consultant',
      _type: 'jobPosting',
      title: 'AI Solutions Consultant',
      department: 'Consulting',
      description:
        'Partner with executives and non-technical stakeholders to identify high-impact AI opportunities. Placeholder description — edit in the Studio.',
      datePosted: '2026-06-15',
    },
  ]

  console.log('Creating pages…')
  const pages = [
    {
      _id: HOME_ID,
      _type: 'page',
      name: 'Home',
      slug: {_type: 'slug', current: 'home'},
      content: [
        {
          _key: key(),
          _type: 'hero',
          heading: 'Apprenticeship at the centre of education',
          body: 'Ascendance Foundry is an AI consultancy and development firm built around apprenticeship — powering the fastest workforce retraining in history.',
          cta: internalCta('Meet our team', OUR_TEAM_ID),
        },
        {
          _key: key(),
          _type: 'accordion',
          title: 'Learn more',
          items: [
            {
              _key: key(),
              question: 'What is Ascendance Foundry?',
              openByDefault: true,
              answer: pt([WHAT_IS_AF]),
            },
            {
              _key: key(),
              question: 'What is the Ascendance Fellowship?',
              openByDefault: false,
              answer: pt([FELLOWSHIP_DESC]),
            },
            {
              _key: key(),
              question: 'Who do we work with?',
              openByDefault: false,
              answer: pt([WHO_WE_WORK_WITH]),
            },
          ],
        },
      ],
    },
    {
      _id: OUR_TEAM_ID,
      _type: 'page',
      name: 'Our Team',
      slug: {_type: 'slug', current: 'our-team'},
      content: [
        {
          _key: key(),
          _type: 'hero',
          heading: 'Our Team',
          body: 'The people building Ascendance Foundry.',
        },
        {
          _key: key(),
          _type: 'peopleGrid',
          title: 'Meet the team',
        },
      ],
    },
    {
      _id: FELLOWS_ID,
      _type: 'page',
      name: 'Fellows',
      slug: {_type: 'slug', current: 'fellows'},
      content: [
        {
          _key: key(),
          _type: 'hero',
          heading: 'Our Fellows',
          body: 'High-performing students embedded with client companies as forward deployed engineers.',
        },
        {
          _key: key(),
          _type: 'accordion',
          title: 'About the fellowship',
          items: [
            {
              _key: key(),
              question: 'What do Fellows do?',
              openByDefault: true,
              answer: pt([FELLOWSHIP_DESC]),
            },
          ],
        },
        {
          _key: key(),
          _type: 'videoTestimonials',
          title: 'Hear from our Fellows',
          intro: 'Replace these placeholder videos with real testimonials in the Studio.',
          videos: [
            {
              _key: key(),
              name: 'Fellow Name',
              role: 'Cohort 2025',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              quote: 'Add a short quote from this Fellow here.',
            },
            {
              _key: key(),
              name: 'Fellow Name',
              role: 'Cohort 2025',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              quote: 'Add a short quote from this Fellow here.',
            },
          ],
        },
      ],
    },
    {
      _id: JOBS_ID,
      _type: 'page',
      name: 'Full-time Positions',
      slug: {_type: 'slug', current: 'full-time-positions'},
      content: [
        {
          _key: key(),
          _type: 'hero',
          heading: 'Full-time Positions',
          body: 'Join the team building AF.',
        },
        {
          _key: key(),
          _type: 'jobListings',
          title: 'Open roles',
          intro: pt([
            'We hire people who want to work at the frontier of AI and apprenticeship. Below are our current openings — placeholder text, edit in the Studio.',
          ]),
          emptyMessage: 'There are no open positions right now — check back soon.',
        },
      ],
    },
    {
      _id: CAMP_ID,
      _type: 'page',
      name: 'Summer Camp',
      slug: {_type: 'slug', current: 'summer-camp'},
      content: [
        {
          _key: key(),
          _type: 'hero',
          heading: 'Summer Camp',
          body: 'An intensive program introducing students to AI and apprenticeship.',
        },
        {
          _key: key(),
          _type: 'accordion',
          title: 'Frequently asked questions',
          items: [
            {
              _key: key(),
              question: 'What is the Summer Camp?',
              openByDefault: true,
              answer: pt([
                'Add a description of the Summer Camp here — who it is for, what participants do, and how to apply.',
              ]),
            },
          ],
        },
      ],
    },
  ]

  const tx = client.transaction()
  ;[...people, ...jobs, ...pages].forEach((doc) => tx.createOrReplace(doc as never))
  await tx.commit()
  console.log('✔ Seed complete:', people.length, 'people,', jobs.length, 'jobs,', pages.length, 'pages.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
