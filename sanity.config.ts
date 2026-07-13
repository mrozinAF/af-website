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
    ],
  },
})
