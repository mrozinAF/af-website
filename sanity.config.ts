import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'AF Website',

  projectId: 'xk0vwazc',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // "Create → Page — starter layout" pre-fills a tidy, on-brand scaffold
    // (header → intro text → image → call to action) for non-technical editors.
    templates: (prev) => [
      ...prev,
      {
        id: 'page-starter',
        title: 'Page — starter layout',
        schemaType: 'page',
        value: {
          content: [
            {_type: 'pageHeader', _key: 'starterHeader', title: 'New page title'},
            {
              _type: 'richText',
              _key: 'starterText',
              content: [
                {
                  _type: 'block',
                  _key: 'starterBlock',
                  style: 'normal',
                  markDefs: [],
                  children: [
                    {
                      _type: 'span',
                      _key: 'starterSpan',
                      marks: [],
                      text: 'Write your introduction here. Use the “Add item” button below to add more sections — images, dropdowns, calls to action, and more.',
                    },
                  ],
                },
              ],
            },
            {_type: 'imageBlock', _key: 'starterImage'},
            {_type: 'ctaBanner', _key: 'starterCta', heading: 'Ready to get started?'},
          ],
        },
      },

      // Page-type templates. Each pre-fills the right blocks in the right order,
      // with placeholder text in every field so a non-technical editor knows
      // exactly what to replace. Based on the real Fellows / For Businesses /
      // Vision / Summer Camp pages. See CONTENT-GUIDE.md → "Create a new page".
      {
        id: 'page-fellows',
        title: 'Fellows Page',
        description:
          'For a fellowship/programme page: header, intro, video testimonials, an offer list, and a call-to-action. Based on the Fellows page.',
        schemaType: 'page',
        value: {
          name: 'New Fellows page',
          content: [
            {
              _type: 'pageHeader',
              _key: 'fp_header',
              title: 'Our Fellows',
              tagline: 'A one-line tagline under the title — say who this page is for.',
            },
            {
              _type: 'fellowsIntro',
              _key: 'fp_intro',
              recruitLabel: 'Who we recruit',
              recruitText:
                'Describe the kind of people you recruit — their background, drive, and what makes a great Fellow.',
              doLabel: 'What Fellows Do',
              doHeading: 'Forward-deployed, from day one.',
              doParagraphs: [
                'Explain what Fellows actually do day to day — where they work, who they work with, and the kind of projects they ship.',
              ],
              timeline: [
                {
                  _key: 'fp_ph1',
                  label: 'Weeks 1–2',
                  title: 'Onboarding',
                  text: 'What happens first — e.g. onboarding with the client and scoping the project together.',
                },
                {
                  _key: 'fp_ph2',
                  label: 'Weeks 3+',
                  title: 'Build & ship',
                  text: 'What happens next — e.g. building and shipping custom work alongside the client team.',
                },
              ],
            },
            {
              _type: 'fellowVideos',
              _key: 'fp_videos',
              eyebrow: 'Testimonials',
              heading: 'Hear from our Fellows',
              videos: [
                {_key: 'fp_v1', name: 'Fellow name', role: 'Cohort 2026'},
                {_key: 'fp_v2', name: 'Fellow name', role: 'Cohort 2026'},
              ],
            },
            {
              _type: 'offerLedger',
              _key: 'fp_offer',
              eyebrow: 'For Fellows',
              heading: 'What We Offer Fellows',
              items: [
                {
                  _key: 'fp_o1',
                  text: 'First thing you offer — e.g. real client work from day one.',
                  detail: 'Optional extra detail about this offer.',
                },
                {
                  _key: 'fp_o2',
                  text: 'Second thing you offer — e.g. structured mentorship and weekly founder Q&As.',
                },
                {
                  _key: 'fp_o3',
                  text: 'Third thing you offer — e.g. a direct path to full-time roles.',
                },
              ],
            },
            {
              _type: 'ctaBanner',
              _key: 'fp_cta',
              heading: 'Ready to apply?',
              body: 'A short line encouraging the reader to take the next step.',
              primaryCta: {_type: 'cta', text: 'Apply now'},
            },
          ],
        },
      },
      {
        id: 'page-for-businesses',
        title: 'For Businesses Page',
        description:
          'For a client/partner page: a bold manifesto opener, your capabilities, reasons to partner, and a call-to-action. Based on the For Businesses page.',
        schemaType: 'page',
        value: {
          name: 'New For Businesses page',
          content: [
            {
              _type: 'manifestoHeader',
              _key: 'bp_manifesto',
              eyebrow: 'For Businesses',
              lines: [
                {_key: 'bp_l1', text: 'First line of your opening statement.', accent: false},
                {_key: 'bp_l2', text: 'A line worth highlighting.', accent: true},
                {_key: 'bp_l3', text: 'A closing line.', accent: false},
              ],
            },
            {
              _type: 'capabilities',
              _key: 'bp_caps',
              eyebrow: 'What We Do',
              heading: 'A short heading for your capabilities.',
              items: [
                {
                  _key: 'bp_c1',
                  title: 'Capability one',
                  text: 'Describe this capability in a sentence or two.',
                  bullets: ['Optional supporting point', 'Optional supporting point'],
                },
                {
                  _key: 'bp_c2',
                  title: 'Capability two',
                  text: 'Describe this capability in a sentence or two.',
                },
                {
                  _key: 'bp_c3',
                  title: 'Capability three',
                  text: 'Describe this capability in a sentence or two.',
                },
              ],
            },
            {
              _type: 'whyPartner',
              _key: 'bp_why',
              eyebrow: 'Why Partner With Us',
              heading: 'A short heading for why companies work with you.',
              rows: [
                {
                  _key: 'bp_r1',
                  keyword: 'Speed',
                  title: 'Reason one',
                  description: 'Explain this reason for partnering.',
                },
                {
                  _key: 'bp_r2',
                  keyword: 'Talent',
                  title: 'Reason two',
                  description: 'Explain this reason for partnering.',
                },
                {
                  _key: 'bp_r3',
                  keyword: 'Results',
                  title: 'Reason three',
                  description: 'Explain this reason for partnering.',
                },
              ],
            },
            {
              _type: 'ctaBanner',
              _key: 'bp_cta',
              heading: 'Let’s work together',
              body: 'A short line inviting companies to get in touch.',
              primaryCta: {_type: 'cta', text: 'Get in touch'},
            },
          ],
        },
      },
      {
        id: 'page-info-vision',
        title: 'Info / Vision Page',
        description:
          'A clean, simple layout: a header, one or two text sections, and a call-to-action. Good for a Vision, About, or general information page.',
        schemaType: 'page',
        value: {
          name: 'New info page',
          content: [
            {
              _type: 'pageHeader',
              _key: 'ip_header',
              title: 'Page title',
              tagline: 'An optional one-line tagline under the title.',
            },
            {
              _type: 'textSection',
              _key: 'ip_text1',
              eyebrow: 'Section label',
              heading: 'First section heading',
              paragraphs: [
                'Write the first section of body text here. Add as many paragraphs as you need.',
              ],
            },
            {
              _type: 'textSection',
              _key: 'ip_text2',
              eyebrow: 'Section label',
              heading: 'Second section heading',
              paragraphs: [
                'Write the second section here, or delete this block if you only need one.',
              ],
            },
            {
              _type: 'ctaBanner',
              _key: 'ip_cta',
              heading: 'A closing call to action',
              body: 'A short line prompting the reader to do something next.',
              primaryCta: {_type: 'cta', text: 'Button text'},
            },
          ],
        },
      },
      {
        id: 'page-coming-soon',
        title: 'Coming Soon Page',
        description:
          'A single full-screen "coming soon" banner with a title, a short line, and an optional note. Based on the Summer Camp page.',
        schemaType: 'page',
        value: {
          name: 'New coming soon page',
          content: [
            {
              _type: 'comingSoonHero',
              _key: 'cs_hero',
              title: 'Coming soon',
              description:
                'A short line telling visitors what’s coming and when to check back.',
              note: 'Optional boxed note — e.g. “Applications open August 2026.”',
            },
          ],
        },
      },
    ],
  },
})
