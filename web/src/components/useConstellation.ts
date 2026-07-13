import {useEffect, type RefObject} from 'react'

type Options = {
  /** Higher = fewer nodes. Hero/header: 24000, light: 34000. */
  density?: number
  link?: number
  dot?: string
  /** "r,g,b" for link strokes. */
  linkRgb?: string
  baseAlpha?: number
  /** Cursor repel + link brighten (hero/header). */
  reactive?: boolean
  /** Element to track the cursor over (defaults to the canvas). */
  hostRef?: RefObject<HTMLElement | null>
}

/** Shared drifting-node constellation field (ported from the design handoff). */
export function useConstellation(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  opts: Options = {},
) {
  const {
    density = 24000,
    link = 132,
    dot = 'rgba(185,205,255,0.72)',
    linkRgb = '130,160,255',
    baseAlpha = 0.16,
    reactive = false,
    hostRef,
  } = opts

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const host = reactive ? hostRef?.current ?? canvas : null

    let raf = 0
    let removeHost: (() => void) | null = null

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!w || !h) return false
      canvas.width = w * dpr
      canvas.height = h * dpr
      const ctx = canvas.getContext('2d')
      if (!ctx) return false
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const N = Math.round((w * h) / density)
      const nodes = Array.from({length: N}, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.26,
        vy: (Math.random() - 0.5) * 0.26,
        r: 0.8 + Math.random() * 1.7,
      }))
      const state = {mx: -9999, my: -9999}

      if (reactive && host) {
        const mv = (e: MouseEvent) => {
          const r = canvas.getBoundingClientRect()
          state.mx = e.clientX - r.left
          state.my = e.clientY - r.top
        }
        const lv = () => {
          state.mx = -9999
          state.my = -9999
        }
        host.addEventListener('mousemove', mv)
        host.addEventListener('mouseleave', lv)
        removeHost = () => {
          host.removeEventListener('mousemove', mv)
          host.removeEventListener('mouseleave', lv)
        }
      }

      const draw = () => {
        ctx.clearRect(0, 0, w, h)
        for (const n of nodes) {
          n.x += n.vx
          n.y += n.vy
          if (reactive) {
            const dx = state.mx - n.x
            const dy = state.my - n.y
            const d = Math.hypot(dx, dy)
            if (d < 190 && d > 0.5) {
              const f = (1 - d / 190) * -1.2
              n.x += (dx / d) * f
              n.y += (dy / d) * f
            }
          }
          if (n.x < 0 || n.x > w) n.vx *= -1
          if (n.y < 0 || n.y > h) n.vy *= -1
          n.x = Math.max(0, Math.min(w, n.x))
          n.y = Math.max(0, Math.min(h, n.y))
        }
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x
            const dy = nodes[i].y - nodes[j].y
            const d = Math.hypot(dx, dy)
            if (d < link) {
              let a = baseAlpha * (1 - d / link)
              if (reactive && state.mx > -9000) {
                const mxp = (nodes[i].x + nodes[j].x) / 2
                const myp = (nodes[i].y + nodes[j].y) / 2
                const md = Math.hypot(state.mx - mxp, state.my - myp)
                if (md < 180) a += 0.5 * (1 - md / 180)
              }
              ctx.strokeStyle = `rgba(${linkRgb},${a})`
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(nodes[i].x, nodes[i].y)
              ctx.lineTo(nodes[j].x, nodes[j].y)
              ctx.stroke()
            }
          }
        }
        for (const n of nodes) {
          ctx.fillStyle = dot
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
          ctx.fill()
        }
        raf = requestAnimationFrame(draw)
      }
      raf = requestAnimationFrame(draw)
      return true
    }

    // Retry until the canvas has real dimensions (may mount below the fold).
    let tries = 0
    const boot = () => {
      if (!build() && tries++ < 120) raf = requestAnimationFrame(boot)
    }
    boot()

    let t: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        cancelAnimationFrame(raf)
        removeHost?.()
        removeHost = null
        build()
      }, 150)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      removeHost?.()
      window.removeEventListener('resize', onResize)
      clearTimeout(t)
    }
  }, [canvasRef, density, link, dot, linkRgb, baseAlpha, reactive, hostRef])
}
