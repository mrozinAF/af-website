import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {client} from '@/sanity/client'
import {sanityFetch} from '@/sanity/live'
import {PAGE_QUERY, OTHER_PAGE_SLUGS_QUERY} from '@/sanity/queries'
import type {Page} from '@/sanity/types'
import PageView from '@/components/PageView'

type Props = {params: Promise<{slug: string}>}

export async function generateStaticParams() {
  const slugs = await client
    .withConfig({useCdn: false})
    .fetch(OTHER_PAGE_SLUGS_QUERY)
  return (slugs ?? []).map((slug: string) => ({slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data} = await sanityFetch({query: PAGE_QUERY, params: {slug}, stega: false})
  const page = data as Page | null
  if (!page) return {}
  return {
    title: page.seo?.title || page.name,
    description: page.seo?.description,
  }
}

export default async function DynamicPage({params}: Props) {
  const {slug} = await params
  const {data} = await sanityFetch({query: PAGE_QUERY, params: {slug}})
  const page = data as Page | null
  if (!page) notFound()
  return <PageView page={page} />
}
