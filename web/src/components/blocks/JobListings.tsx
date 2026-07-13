import PortableText from '../PortableText'
import type {JobListingsBlock} from '@/sanity/types'

export default function JobListings({block}: {block: JobListingsBlock}) {
  const jobs = block.jobs ?? []
  return (
    <section className="section">
      <div className="container container--narrow">
        {block.title && <h2 className="section-title">{block.title}</h2>}
        {block.intro && (
          <div className="section-intro">
            <PortableText value={block.intro} />
          </div>
        )}
        {jobs.length === 0 ? (
          <p className="jobs-empty">
            {block.emptyMessage || 'There are no open positions right now — check back soon.'}
          </p>
        ) : (
          <ul className="jobs-list">
            {jobs.map((job) => (
              <li key={job._id} className="job-card">
                <div className="job-head">
                  <h3 className="job-title">{job.title}</h3>
                  {job.department && <span className="job-dept">{job.department}</span>}
                </div>
                {job.description && <p className="job-desc">{job.description}</p>}
                {job.applyLink && (
                  <a
                    className="button button--secondary job-apply"
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply now
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
