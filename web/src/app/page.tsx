import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {sanityFetch} from '@/sanity/live'
import {PAGE_QUERY} from '@/sanity/queries'
import type {Page} from '@/sanity/types'
import PageView from '@/components/PageView'

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({
    query: PAGE_QUERY,
    params: {slug: 'home'},
    stega: false,
  })
  const page = data as Page | null
  if (!page) return {}
  return {
    title: page.seo?.title || 'Home',
    description: page.seo?.description,
  }
}

export default async function HomePage() {
  const {data} = await sanityFetch({query: PAGE_QUERY, params: {slug: 'home'}})
  const page = data as Page | null
  if (!page) notFound()
  return (
    <div className="route-home">
      <PageView page={page} variant="home" />
    </div>
  )
}
