import PageBuilder from './PageBuilder'
import type {Page} from '@/sanity/types'

export default function PageView({page, variant}: {page: Page; variant?: 'home'}) {
  return (
    <>
      {(!page.content || page.content.length === 0) && (
        <section className="section">
          <div className="container container--narrow">
            <p className="empty-state">
              This page has no content yet. Add sections to “{page.name}” in the Studio.
            </p>
          </div>
        </section>
      )}
      <PageBuilder content={page.content} variant={variant} />
    </>
  )
}
