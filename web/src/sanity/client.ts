import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId} from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // In dev, skip the CDN so freshly-published edits appear immediately.
  useCdn: process.env.NODE_ENV === 'production',
})
