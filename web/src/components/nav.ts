export type NavLink = {href: string; label: string}

// Fallback menu, used only if Site Settings has no navigation configured.
export const NAV_LINKS: NavLink[] = [
  {href: '/', label: 'Home'},
  {href: '/our-team', label: 'Our Team'},
  {href: '/fellows', label: 'Fellows'},
  {href: '/full-time-positions', label: 'Full-time Positions'},
  {href: '/summer-camp', label: 'Summer Camp'},
]
