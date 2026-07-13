import type {ReactNode} from 'react'

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Wrap any highlight phrase found in `text` with an accent span. */
export function highlight(
  text: string,
  phrases: string[] | undefined,
  className: string,
): ReactNode {
  const terms = (phrases ?? []).map((p) => p.trim()).filter(Boolean)
  if (terms.length === 0) return text
  terms.sort((a, b) => b.length - a.length) // longest first
  const re = new RegExp(`(${terms.map(escapeRe).join('|')})`, 'g')
  return text.split(re).map((part, i) =>
    terms.includes(part) ? (
      <span key={i} className={className}>
        {part}
      </span>
    ) : (
      part
    ),
  )
}
