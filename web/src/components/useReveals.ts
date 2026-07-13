import {useEffect, type RefObject} from 'react'

/** Reveal [data-reveal] descendants once as they scroll into view. */
export function useReveals(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((el) => el.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement
            if (el.dataset.revealDelay) el.style.transitionDelay = `${el.dataset.revealDelay}ms`
            el.classList.add('is-in')
            io.unobserve(el)
          }
        })
      },
      {threshold: 0.14, rootMargin: '0px 0px -8% 0px'},
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [rootRef])
}
