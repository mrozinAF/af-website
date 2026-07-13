import SanityImage from '../SanityImage'
import type {PeopleGridBlock} from '@/sanity/types'

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

export default function PeopleGrid({block}: {block: PeopleGridBlock}) {
  const people = block.people ?? []
  return (
    <section className="section">
      <div className="container">
        {block.title && <h2 className="section-title">{block.title}</h2>}
        {block.intro && <p className="section-intro">{block.intro}</p>}
        <div className="people-grid">
          {people.map((person) => (
            <article key={person._id} className="person-card">
              {person.photo?.asset?._ref && (
                <div className="person-photo">
                  <SanityImage
                    image={person.photo}
                    alt={person.name}
                    sizes="200px"
                  />
                </div>
              )}
              <h3 className="person-name">{person.name}</h3>
              {person.role && <p className="person-role">{person.role}</p>}
              {person.bio && <p className="person-bio">{person.bio}</p>}
              {person.linkedIn && (
                <a
                  className="person-linkedin"
                  href={person.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${person.name} on LinkedIn`}
                >
                  <LinkedInIcon />
                  <span>LinkedIn</span>
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
