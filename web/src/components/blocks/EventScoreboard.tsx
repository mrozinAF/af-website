'use client'

import {useEffect, useRef} from 'react'
import type {EventScoreboardBlock} from '@/sanity/types'

// Faithful port of the "Launch for Care Invitational" live scoreboard widget
// from the Claude Design mockup (Ascendance Events.dc.html). Self-contained: it
// pulls live scores from an external Google Apps Script feed and refreshes
// every few seconds. Fonts are mapped to the site's font CSS variables.
// Event-specific config (sponsors, phases, panel definitions) is baked in here;
// the feed URL, video, logo and stream toggle come from the Studio block.
// [NEEDS REVIEW] The sponsor logos and data feed point at the external
// ascendancefoundry.com / Google Apps Script endpoints from the original design.

const DEFAULTS = {
  dataEndpoint:
    'https://script.google.com/macros/s/AKfycbzEsuWKoUG1WGXJ6_yYxGUYV3ZMNDL2-Iq8e3bAiOlzRyUECId2z7ockca3N2NSTaBW7g/exec',
  videoId: 'A-m6RraMuWE',
  brandLogoUrl:
    'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/LaunchforCare_Logos-Black.png',
}

const SPONSORS: {name: string; url: string}[] = [
  {name: 'Lakeridge Health Foundation', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/LHF_Web.png'},
  {name: 'Vaillancourt', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/Vaillancourt-logo.png'},
  {name: 'Snyder', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/snyder_logo.png'},
  {name: 'Hammer Head', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/NEWHammer-Head-Transparent-scaled.png'},
  {name: 'Larry Harding', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/Larry-Harding.png'},
  {name: 'Hot Water', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/HOT-WATER.png'},
  {name: 'HMA', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/HMA_Logo.png'},
  {name: 'COBT', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/COBT-Logo-for-ligh59A606.png'},
  {name: 'BMO', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/bmo.png'},
  {name: 'Baker Tilly', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/BakerTilly.png'},
  {name: 'Al Stevens', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/AI-Stevens-Logo.png'},
  {name: 'Brooklin', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/Image-scaled.png'},
  {name: 'Home Hardware', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/homehardware.png'},
  {name: 'Gus Brown Hyundai', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/Gus-Brown-Hyundai-Logo-scaled.png'},
  {name: 'CKGE-FM', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/CKGE-FM.png'},
  {name: 'AIM Golf Academy', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/AIM-Golf-Academy-scaled.png'},
  {name: 'Park N Fly', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/PARKNFLY.png'},
  {name: 'Gerdau', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/Logomarca-Gerdau-Shape-the-future-vertical.png'},
  {name: 'AF', url: 'https://www.ascendancefoundry.com/wp-content/uploads/2026/07/AF-Logo-with-words.png'},
]
const SPONSOR_PX_PER_SEC = 45
const POLL_MS = 5000

const BAR_DEFS: Record<string, {title: string; view: string}> = {
  oncourseLB: {title: 'On-Course Leaderboard', view: 'leaderboard'},
  oncourseHoles: {title: 'On-Course Qualifying', view: 'oncourseholes'},
  r16pts: {title: 'Round of 16 Leaderboard', view: 'r16points'},
  r16sets: {title: 'Round of 16 — Set Results', view: 'r16sets'},
  bracket: {title: 'Tournament Bracket', view: 'bracket'},
}
const ORDERS: Record<string, string[]> = {
  prelim: ['oncourseLB', 'oncourseHoles', 'r16pts', 'r16sets', 'bracket'],
  r16: ['r16pts', 'r16sets', 'bracket', 'oncourseLB', 'oncourseHoles'],
  finals: ['bracket', 'oncourseLB', 'oncourseHoles', 'r16pts', 'r16sets'],
  champion: ['bracket', 'r16pts', 'oncourseLB', 'r16sets', 'oncourseHoles'],
}
const PHASE_STATES: Record<string, Record<string, string>> = {
  prelim: {oncourseLB: 'live', oncourseHoles: 'live', r16pts: 'upcoming', r16sets: 'upcoming', bracket: 'upcoming'},
  r16: {oncourseLB: 'finished', oncourseHoles: 'finished', r16pts: 'live', r16sets: 'live', bracket: 'upcoming'},
  finals: {oncourseLB: 'finished', oncourseHoles: 'finished', r16pts: 'finished', r16sets: 'finished', bracket: 'live'},
  champion: {oncourseLB: 'finished', oncourseHoles: 'finished', r16pts: 'finished', r16sets: 'finished', bracket: 'finished'},
}
const DEFAULT_PHASE = 'prelim'

const CSS = `
#lfc-board.lfc-light{ --bg:#FFFFFF; --surface:#F3F6FF; --row-alt:#EEF1F8; --text:#141C3F; --dim:#8592BD; --accent:#3B5BFC; --secondary:#2C7A94; --line:rgba(20,30,70,.12); --seed:#3B5BFC; --header-band:#141C3F; --header-text:#FFFFFF; --pill-live:#3B5BFC; --pill-finished:#8592BD; --pill-upcoming:#6E7CC4; --card:#FFFFFF; }
#lfc-board{ font-family:var(--font-familjen),system-ui,sans-serif; background:var(--bg); color:var(--text); max-width:1000px; margin:0 auto; padding:14px; border-radius:16px; border:1px solid var(--line); }
#lfc-board .dsp{ font-family:var(--font-outfit),system-ui,sans-serif; font-weight:600; letter-spacing:-.01em; }
#lfc-board .lfc-top{ display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px; flex-wrap:wrap; }
#lfc-board .lfc-brand{ font-size:24px; color:var(--accent); }
#lfc-board .lfc-brandwrap{ display:flex; align-items:center; gap:12px; min-width:0; padding-left:16px; }
#lfc-board .lfc-logo{ height:44px; width:auto; flex-shrink:0; display:block; }
#lfc-board .lfc-controls{ display:flex; align-items:center; gap:8px; }
#lfc-board #lfc-sponsors{ overflow:hidden; background:var(--surface); border:1px solid var(--line); border-radius:12px; padding:10px 0; }
#lfc-board .spn-track{ display:flex; align-items:center; gap:32px; animation-name:spnScroll; animation-timing-function:linear; animation-iteration-count:infinite; }
#lfc-board .spn-track:hover{ animation-play-state:paused; }
#lfc-board .spn-chip{ flex:0 0 auto; background:#fff; border-radius:8px; padding:8px 20px; display:flex; align-items:center; justify-content:center; min-width:120px; height:56px; box-sizing:border-box; }
#lfc-board .spn-chip img{ max-height:40px; max-width:150px; object-fit:contain; display:block; }
#lfc-board .spn-fallback{ font-size:13px; font-weight:700; color:#141C3F; white-space:nowrap; }
@media (prefers-reduced-motion: reduce){ #lfc-board .spn-track{ animation:none; } }
#lfc-board .bar{ border:1px solid var(--line); border-radius:12px; overflow:hidden; margin-bottom:10px; }
#lfc-board .bar-hd{ display:flex; align-items:center; gap:12px; background:var(--header-band); color:var(--header-text); padding:13px 16px; cursor:pointer; user-select:none; }
#lfc-board .bar-title{ font-size:18px; flex:1; }
#lfc-board .chev{ transition:transform .2s; font-size:13px; }
#lfc-board .bar[data-open="1"] .chev{ transform:rotate(90deg); }
#lfc-board .bar-body{ display:none; padding:14px; background:var(--surface); overflow-x:auto; }
#lfc-board .bar[data-open="1"] .bar-body{ display:block; }
#lfc-board .pill{ font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:3px 10px; border-radius:999px; color:#fff; }
#lfc-board .pill.live{ background:var(--pill-live); } #lfc-board .pill.finished{ background:var(--pill-finished); } #lfc-board .pill.upcoming{ background:var(--pill-upcoming); }
#lfc-board .placeholder{ border:1px dashed var(--line); border-radius:10px; padding:22px; text-align:center; color:var(--dim); font-size:14px; }
#lfc-board .placeholder code{ color:var(--secondary); font-weight:700; }
#lfc-board .msg{ padding:16px; color:var(--dim); font-size:14px; }
#lfc-board .err{ padding:14px 16px; color:var(--accent); font-size:13px; white-space:pre-wrap; }
#lfc-board .tbl{ width:100%; border-collapse:collapse; font-size:13px; }
#lfc-board .tbl.tbl-auto{ width:auto; }
#lfc-board .tbl th{ text-align:left; color:var(--dim); font-size:11px; font-weight:700; letter-spacing:.5px; text-transform:uppercase; padding:6px 10px; border-bottom:2px solid var(--accent); white-space:nowrap; }
#lfc-board .tbl td{ padding:7px 10px; border-bottom:1px solid var(--line); }
#lfc-board .tbl tbody tr:nth-child(even) td{ background:var(--row-alt); }
#lfc-board .tbl .num{ text-align:right; font-variant-numeric:tabular-nums; }
#lfc-board .tbl .rk,#lfc-board .tbl .seed{ color:var(--accent); font-weight:600; font-family:var(--font-outfit),sans-serif; }
#lfc-board .tbl .nm{ font-weight:600; font-family:var(--font-outfit),system-ui,sans-serif; letter-spacing:-.01em; }
#lfc-board .lb-nm,#lfc-board .bk-name,#lfc-board .ov-row .n,#lfc-board .ov-card .cn{ font-family:var(--font-outfit),system-ui,sans-serif; letter-spacing:-.01em; }
#lfc-board .tbl .pts{ color:var(--secondary); font-weight:800; font-variant-numeric:tabular-nums; }
#lfc-board .tbl .sub{ color:var(--dim); font-size:11px; }
#lfc-board .lb-row{ display:flex; align-items:center; padding:9px 14px; border-radius:8px; }
#lfc-board .lb-row:nth-child(even){ background:var(--row-alt); }
#lfc-board .lb-rk{ color:var(--accent); font-size:22px; width:38px; line-height:1; }
#lfc-board .lb-nm{ flex:1; font-size:15px; font-weight:600; }
#lfc-board .lb-pt{ color:var(--secondary); font-size:20px; line-height:1; }
#lfc-board .lb-head{ display:flex; color:var(--dim); font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; padding:0 14px 8px; }
#lfc-board .lb-head .h-rk{ width:38px; } #lfc-board .lb-head .h-nm{ flex:1; }
#lfc-board .set-block{ margin-bottom:18px; }
#lfc-board .set-title{ font-size:20px; color:var(--accent); margin-bottom:8px; }
#lfc-board .slot-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:12px; }
#lfc-board .slot-card{ background:var(--card); border:1px solid var(--line); border-radius:10px; overflow:hidden; }
#lfc-board .slot-hd{ background:var(--header-band); color:var(--header-text); font-size:13px; font-weight:700; padding:6px 10px; }
#lfc-board .bk{ position:relative; }
#lfc-board .bk-col-label{ position:absolute; top:0; text-transform:uppercase; letter-spacing:1px; font-size:12px; color:var(--dim); text-align:center; font-weight:700; }
#lfc-board .bk-match{ position:absolute; transform:translateY(-50%); background:var(--card); border:1px solid var(--line); border-radius:10px; overflow:hidden; }
#lfc-board .bk-player{ display:flex; align-items:center; gap:8px; padding:9px 12px; font-size:15px; }
#lfc-board .bk-player + .bk-player{ border-top:1px solid var(--line); }
#lfc-board .bk-seed{ color:var(--seed); width:22px; flex-shrink:0; font-size:13px; font-weight:700; }
#lfc-board .bk-name{ flex:1; min-width:0; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
#lfc-board .bk-dist{ flex-shrink:0; font-weight:800; color:var(--accent); font-variant-numeric:tabular-nums; }
#lfc-board .bk-empty .bk-name{ color:var(--dim); font-style:italic; font-weight:400; }
#lfc-board .bk-champbox{ position:absolute; transform:translateY(-50%); background:var(--accent); border-radius:12px; padding:16px 12px; text-align:center; }
#lfc-board .bk-champ-label{ color:rgba(255,255,255,.85); font-size:10px; letter-spacing:2px; font-weight:700; text-transform:uppercase; margin-bottom:6px; }
#lfc-board .bk-champ-name{ color:#fff; font-size:22px; line-height:1.1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
#lfc-board .stream-wrap{ position:relative; max-width:1280px; margin:0 auto; }
#lfc-board .video{ position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:12px; }
#lfc-board .video iframe{ position:absolute; inset:0; width:100%; height:100%; border:0; }
#lfc-board .overlay{ position:absolute; top:16px; right:16px; pointer-events:none; background:rgba(16,24,64,.9); border-radius:12px; padding:12px 14px; max-width:480px; }
#lfc-board .ov-title{ font-size:11px; letter-spacing:1px; color:var(--secondary); font-weight:800; text-transform:uppercase; margin-bottom:6px; }
#lfc-board .ov-row{ display:flex; align-items:center; gap:10px; padding:3px 0; color:#fff; font-size:13px; }
#lfc-board .ov-row .r{ color:var(--accent); font-family:var(--font-outfit),sans-serif; font-weight:600; width:22px; }
#lfc-board .ov-row .n{ flex:1; font-weight:600; } #lfc-board .ov-row .p{ color:#b6c0e6; font-weight:700; }
#lfc-board .ov-cards{ display:flex; gap:6px; flex-wrap:nowrap; }
#lfc-board .ov-card{ background:rgba(255,255,255,.06); border-radius:10px; padding:8px; flex:1 1 0; min-width:0; }
#lfc-board .ov-card .cn{ font-size:11px; font-weight:700; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
#lfc-board .ov-card .cb{ font-family:var(--font-outfit),sans-serif; font-weight:600; font-size:26px; color:var(--accent); text-align:center; line-height:1; margin:2px 0; }
#lfc-board .ov-card .cl{ font-size:9px; letter-spacing:1px; color:#8592bd; text-align:center; }
#lfc-board .ov-balls{ display:grid; grid-template-columns:repeat(3,1fr); gap:3px; margin-top:5px; }
#lfc-board .ov-b{ font-size:9px; text-align:center; border-radius:4px; padding:2px 0; background:rgba(255,255,255,.12); color:#b6c0e6; }
#lfc-board .ov-b.best{ background:var(--accent); color:#fff; }
#lfc-board .ov-b.zero{ opacity:.55; }
#lfc-board .ov-b.blank{ opacity:.25; font-style:italic; }
#lfc-board .ov-b.confirmed{ text-decoration:underline; text-underline-offset:2px; text-decoration-thickness:2px; }
#lfc-board .ov-prog{ font-size:9px; color:#8592bd; text-align:center; margin-top:4px; }
#lfc-board .ov-fill{ position:relative; padding-bottom:56.25%; height:0; border-radius:12px; overflow:hidden; max-width:1280px; margin:0 auto; }
#lfc-board .ov-fill-inner{ position:absolute; inset:0; background:#101843; padding:24px; overflow:auto; }
#lfc-board .ov-fill-inner .ov-cards{ flex-wrap:wrap; }
#lfc-board .ov-fill-inner .ov-card{ flex:1 1 140px; }
#lfc-board .champ-banner{ background:var(--accent); border-radius:16px; padding:44px 20px; text-align:center; }
#lfc-board .champ-label{ color:rgba(255,255,255,.85); font-size:13px; letter-spacing:3px; font-weight:700; text-transform:uppercase; margin-bottom:10px; }
#lfc-board .champ-name{ font-family:var(--font-outfit),sans-serif; font-weight:600; color:#fff; font-size:56px; line-height:1; }
@media (max-width: 640px){ #lfc-board .overlay{ position:static; background:#101843; max-width:none; margin-top:10px; border-radius:10px; } #lfc-board .ov-cards{ flex-wrap:wrap; } #lfc-board .ov-card{ flex:1 1 45%; } }
`

export default function EventScoreboard({block}: {block: EventScoreboardBlock}) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const BASE = block.dataEndpoint || DEFAULTS.dataEndpoint
    const VIDEO_ID = block.videoId || DEFAULTS.videoId
    const BRAND_LOGO = block.brandLogoUrl || DEFAULTS.brandLogoUrl
    const STREAM_LIVE = block.streamLive !== false

    const timers: ReturnType<typeof setInterval>[] = []
    const every = (fn: () => void, ms: number) => {
      const id = setInterval(fn, ms)
      timers.push(id)
      return id
    }
    const q = (sel: string) => root.querySelector(sel) as HTMLElement | null
    const mediaMount = q('#lfc-media')
    const barsMount = q('#lfc-bars')
    if (!mediaMount || !barsMount) return

    const esc = (v: unknown) =>
      String(v == null ? '' : v).replace(/[&<>"]/g, (c) =>
        ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c] as string,
      )
    const show = (v: unknown) => (v === '' || v == null ? '' : esc(v))
    const fetchJson = (url: string) =>
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error('HTTP ' + res.status)
          return res.json()
        })
        .then((d: any) => {
          if (d && d.error) throw new Error(d.error)
          return d
        })
    const errBox = (label: string, err: Error) =>
      '<div class="err">' + esc(label) + ' fetch failed:\n' + esc(err.message) + '</div>'

    function renderSponsors() {
      const mount = q('#lfc-sponsors')
      if (!mount) return
      if (!SPONSORS.length) {
        mount.style.display = 'none'
        return
      }
      const list = SPONSORS.slice()
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const tmp = list[i]
        list[i] = list[j]
        list[j] = tmp
      }
      const chip = (s: {name: string; url: string}) => {
        const hasImg = !!s.url
        const img = hasImg
          ? '<img src="' + esc(s.url) + '" alt="' + esc(s.name) + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'block\';">'
          : ''
        const fallback = '<span class="spn-fallback" style="display:' + (hasImg ? 'none' : 'block') + ';">' + esc(s.name) + '</span>'
        return '<div class="spn-chip">' + img + fallback + '</div>'
      }
      const setHTML = list.map(chip).join('')
      const probe = document.createElement('div')
      probe.style.cssText = 'position:absolute; visibility:hidden; display:flex; gap:32px;'
      probe.innerHTML = setHTML
      mount.appendChild(probe)
      const setWidth = probe.offsetWidth + 32
      const trackWidth = mount.offsetWidth
      mount.removeChild(probe)
      const repeats = Math.max(1, Math.ceil(trackWidth / setWidth) + 1)
      const halfHTML = new Array(repeats).fill(setHTML).join('')
      const track = document.createElement('div')
      track.className = 'spn-track'
      track.innerHTML = halfHTML + halfHTML
      mount.innerHTML = ''
      mount.appendChild(track)
      const half = track.scrollWidth / 2
      track.style.animationDuration = Math.max(4, half / SPONSOR_PX_PER_SEC) + 's'
      const styleTag = document.createElement('style')
      styleTag.textContent = '@keyframes spnScroll{ from{transform:translateX(0);} to{transform:translateX(-' + half + 'px);} }'
      mount.appendChild(styleTag)
    }

    const RENDERERS: Record<string, ((el: HTMLElement) => void) | undefined> = {
      leaderboard(el) {
        fetchJson(BASE + '?page=leaderboard')
          .then((d: any) => {
            const ps = (d && d.players) || []
            if (!ps.length) {
              el.innerHTML = '<div class="msg">No players yet.</div>'
              return
            }
            let h = '<div class="lb-head"><span class="h-rk">#</span><span class="h-nm">Player</span><span>Pts</span></div>'
            ps.forEach((p: any) => {
              h += '<div class="lb-row"><span class="dsp lb-rk">' + show(p.rank) + '</span><span class="lb-nm">' + show(p.name) + '</span><span class="dsp lb-pt">' + show(p.totalPoints) + '</span></div>'
            })
            el.innerHTML = h
          })
          .catch((e: Error) => {
            el.innerHTML = errBox('Leaderboard', e)
          })
      },
      oncourseholes(el) {
        fetchJson(BASE + '?page=leaderboard')
          .then((d: any) => {
            const ps = (d && d.players) || []
            if (!ps.length) {
              el.innerHTML = '<div class="msg">No players yet.</div>'
              return
            }
            const cell = (dist: unknown, rank: unknown) =>
              '<td class="num">' + show(dist) + ' <span class="sub">#' + show(rank) + '</span></td>'
            let h = '<table class="tbl tbl-auto"><thead><tr><th>#</th><th>Player</th><th class="num">Pts</th><th class="num">Driving Range</th><th class="num">Hole 1</th><th class="num">Hole 14</th><th class="num">Hole 17</th></tr></thead><tbody>'
            ps.forEach((p: any) => {
              h += '<tr><td class="rk">' + show(p.rank) + '</td><td class="nm">' + show(p.name) + '</td><td class="pts num">' + show(p.totalPoints) + '</td>' + cell(p.drDistance, p.drRank) + cell(p.hole4Distance, p.hole4Rank) + cell(p.hole6Distance, p.hole6Rank) + cell(p.hole10Distance, p.hole10Rank) + '</tr>'
            })
            el.innerHTML = h + '</tbody></table>'
          })
          .catch((e: Error) => {
            el.innerHTML = errBox('Hole results', e)
          })
      },
      r16points(el) {
        fetchJson(BASE + '?page=roundof16points')
          .then((d: any) => {
            const ps = (d && d.players) || []
            if (!ps.length) {
              el.innerHTML = '<div class="msg">No data yet.</div>'
              return
            }
            let h = '<table class="tbl tbl-auto"><thead><tr><th>Seed</th><th>Player</th><th class="num">S1</th><th class="num">S2</th><th class="num">S3</th><th class="num">S4</th><th class="num">S5</th><th class="num">Total</th><th class="num">Longest</th></tr></thead><tbody>'
            ps.forEach((p: any) => {
              const s = p.sets || []
              h += '<tr><td class="seed">' + show(p.seed) + '</td><td class="nm">' + show(p.name) + '</td>' + '<td class="num">' + show(s[0]) + '</td><td class="num">' + show(s[1]) + '</td><td class="num">' + show(s[2]) + '</td><td class="num">' + show(s[3]) + '</td><td class="num">' + show(s[4]) + '</td>' + '<td class="pts num">' + show(p.totalPoints) + '</td><td class="num">' + show(p.longest) + '</td></tr>'
            })
            el.innerHTML = h + '</tbody></table>'
          })
          .catch((e: Error) => {
            el.innerHTML = errBox('R16 points', e)
          })
      },
      r16sets(el) {
        fetchJson(BASE + '?page=roundof16setresults')
          .then((d: any) => {
            const sets = (d && d.sets) || []
            if (!sets.length) {
              el.innerHTML = '<div class="msg">No data yet.</div>'
              return
            }
            let h = ''
            sets.forEach((set: any) => {
              h += '<div class="set-block"><div class="dsp set-title">' + show(set.label) + '</div><div class="slot-grid">'
              ;(set.slots || []).forEach((slot: any) => {
                h += '<div class="slot-card"><div class="slot-hd">' + show(slot.slot) + '</div><table class="tbl"><thead><tr><th>Player</th><th class="num">Dist</th><th class="num">Pts</th></tr></thead><tbody>'
                ;(slot.players || []).forEach((p: any) => {
                  h += '<tr><td class="nm">' + show(p.name) + '</td><td class="num">' + show(p.distance) + '</td><td class="pts num">' + show(p.points) + '</td></tr>'
                })
                h += '</tbody></table></div>'
              })
              h += '</div></div>'
            })
            el.innerHTML = h
          })
          .catch((e: Error) => {
            el.innerHTML = errBox('R16 set results', e)
          })
      },
      bracket(el) {
        fetchJson(BASE + '?page=bracket')
          .then((d: any) => {
            const playerRow = (p: any) => {
              const has = p && (p.name || p.name === 0)
              const seed = has && (p.seed || p.seed === 0) ? p.seed : ''
              const dist = has && (p.distance || p.distance === 0) ? p.distance : ''
              return '<div class="bk-player' + (has ? '' : ' bk-empty') + '"><span class="bk-seed">' + show(seed) + '</span><span class="bk-name">' + (has ? show(p.name) : '—') + '</span><span class="bk-dist">' + show(dist) + '</span></div>'
            }
            const matchHTML = (m: any, x: number, y: number, w: number) =>
              '<div class="bk-match" style="left:' + x + 'px; top:' + y + 'px; width:' + w + 'px;">' + playerRow(m && m.p1) + playerRow(m && m.p2) + '</div>'
            const qf = d.quarterfinals || [],
              sf = d.semifinals || [],
              fn = d.final
            const champ = show(d.champion) || ''
            const colW = 210,
              colGap = 50,
              champW = 150
            const colX = [0, colW + colGap, 2 * (colW + colGap), 3 * (colW + colGap)]
            const qfPitch = 96,
              qfStart = 40
            const qfCenters = [0, 1, 2, 3].map((i) => qfStart + i * qfPitch)
            const sfCenters = [(qfCenters[0] + qfCenters[1]) / 2, (qfCenters[2] + qfCenters[3]) / 2]
            const finalCenter = (sfCenters[0] + sfCenters[1]) / 2
            const totalH = qfCenters[3] + qfStart
            const totalW = colX[3] + champW
            let html =
              '<div class="bk-col-label" style="left:' + colX[0] + 'px;width:' + colW + 'px;">Quarterfinals</div>' +
              '<div class="bk-col-label" style="left:' + colX[1] + 'px;width:' + colW + 'px;">Semifinals</div>' +
              '<div class="bk-col-label" style="left:' + colX[2] + 'px;width:' + colW + 'px;">Final</div>'
            qf.forEach((m: any, i: number) => {
              html += matchHTML(m, colX[0], qfCenters[i], colW)
            })
            sf.forEach((m: any, i: number) => {
              html += matchHTML(m, colX[1], sfCenters[i], colW)
            })
            html += matchHTML(fn, colX[2], finalCenter, colW)
            html += '<div class="bk-champbox" style="left:' + colX[3] + 'px; top:' + finalCenter + 'px; width:' + champW + 'px;">' + '<div class="bk-champ-label">Champion</div><div class="dsp bk-champ-name">' + champ + '</div></div>'
            el.innerHTML = '<div class="bk" style="height:' + totalH + 'px; width:' + totalW + 'px;">' + html + '</div>'
          })
          .catch((e: Error) => {
            el.innerHTML = errBox('Bracket', e)
          })
      },
    }

    const scoreCard = (p: any) => {
      const raw = p.balls || []
      const balls = raw.map(Number)
      const hit = balls.filter((b: number) => b > 0).length
      const confirmed = /^(yes|y|true|1)$/i.test(String(p.confirmed == null ? '' : p.confirmed).trim())
      let bestVal = 0,
        bi = -1
      balls.forEach((n: number, i: number) => {
        if (n > 0 && n > bestVal) {
          bestVal = n
          bi = i
        }
      })
      const cells = raw
        .map((b: any, i: number) => {
          const blank = b === '' || b == null
          const n = Number(b)
          let cls = blank ? 'blank' : i === bi ? 'best' : n > 0 ? '' : 'zero'
          if (i === bi && confirmed) cls += ' confirmed'
          const txt = blank ? '·' : n > 0 ? show(b) : '0'
          return '<div class="ov-b ' + cls + '">' + txt + '</div>'
        })
        .join('')
      const bbBlank = p.bestBall === '' || p.bestBall == null
      const allBallsBlank = raw.every((b: any) => b === '' || b == null)
      const bbTxt = !bbBlank ? show(p.bestBall) : allBallsBlank ? '–' : String(bestVal)
      return '<div class="ov-card"><div class="cn">' + show(p.player) + '</div>' + '<div class="cb">' + bbTxt + '</div><div class="cl">BEST BALL</div>' + '<div class="ov-balls">' + cells + '</div><div class="ov-prog">' + hit + ' of 6</div></div>'
    }
    const scoreOverlay = (el: HTMLElement, page: string, title: string) => {
      fetchJson(BASE + '?page=' + page)
        .then((d: any) => {
          const slots = (d && d.slots) || []
          if (!slots.length) {
            el.innerHTML = '<div class="ov-title">' + title + '</div><div class="ov-prog">No data yet.</div>'
            return
          }
          el.innerHTML = '<div class="ov-title">' + title + '</div><div class="ov-cards">' + slots.map(scoreCard).join('') + '</div>'
        })
        .catch((e: Error) => {
          el.innerHTML = '<div class="ov-title">' + title + '</div><div class="ov-prog">' + esc(e.message) + '</div>'
        })
    }
    const OVERLAY_RENDERERS: Record<string, ((el: HTMLElement) => void) | undefined> = {
      prelim(el) {
        fetchJson(BASE + '?page=leaderboard')
          .then((d: any) => {
            const ps = ((d && d.players) || []).slice(0, 5)
            const rows = ps
              .map((p: any) => '<div class="ov-row"><span class="r">' + show(p.rank) + '</span><span class="n">' + show(p.name) + '</span><span class="p">' + show(p.totalPoints) + '</span></div>')
              .join('')
            el.innerHTML = '<div class="ov-title">Top 5 — Prelim</div>' + (rows || '<div class="ov-prog">No data yet.</div>')
          })
          .catch((e: Error) => {
            el.innerHTML = '<div class="ov-title">Top 5 — Prelim</div><div class="ov-prog">' + esc(e.message) + '</div>'
          })
      },
      r16(el) {
        scoreOverlay(el, 'roundof16scoring', 'Round of 16 — 4-Ball')
      },
      finals(el) {
        scoreOverlay(el, 'finalsscoring', 'Finals — 2-Ball')
      },
    }

    const barIntervals: Record<string, ReturnType<typeof setInterval>> = {}
    let overlayTimer: ReturnType<typeof setInterval> | null = null
    let champTimer: ReturnType<typeof setInterval> | null = null

    const openStateFor = (id: string) => {
      try {
        const v = localStorage.getItem('lfc-open-' + id)
        if (v !== null) return v === '1'
      } catch {}
      return false
    }

    function rebuildBars(phase: string) {
      Object.keys(barIntervals).forEach((id) => clearInterval(barIntervals[id]))
      Object.keys(barIntervals).forEach((id) => delete barIntervals[id])
      barsMount!.innerHTML = ''
      const order = ORDERS[phase] || ORDERS.prelim
      const states = PHASE_STATES[phase] || {}
      order.forEach((id) => {
        const def = BAR_DEFS[id]
        if (!def) return
        const wired = RENDERERS[def.view]
        const state = states[id]
        const pill = state ? '<span class="pill ' + state + '">' + esc(state) + '</span>' : ''
        const el = document.createElement('section')
        el.className = 'bar'
        el.setAttribute('data-open', openStateFor(id) ? '1' : '0')
        el.setAttribute('data-id', id)
        const body = wired ? '<div class="msg">Loading…</div>' : '<div class="placeholder">Layout placeholder — hook up the <code>' + esc(def.view) + '</code> reader here.</div>'
        el.innerHTML = '<header class="bar-hd"><span class="chev">▸</span><span class="bar-title dsp">' + esc(def.title) + '</span>' + pill + '</header><div class="bar-body">' + body + '</div>'
        el.querySelector('.bar-hd')!.addEventListener('click', () => {
          const nowOpen = el.getAttribute('data-open') !== '1'
          el.setAttribute('data-open', nowOpen ? '1' : '0')
          try {
            localStorage.setItem('lfc-open-' + id, nowOpen ? '1' : '0')
          } catch {}
        })
        barsMount!.appendChild(el)
        if (wired) {
          const target = el.querySelector('.bar-body') as HTMLElement
          wired(target)
          barIntervals[id] = every(() => wired(target), POLL_MS)
        }
      })
    }

    const streamMediaHTML = () =>
      '<div class="stream-wrap"><div class="video"><iframe src="https://www.youtube.com/embed/' + esc(VIDEO_ID) + '?autoplay=1&mute=1&controls=0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>' + '<div class="overlay" id="lfc-ov"></div></div>'
    const overlayFillHTML = () => '<div class="ov-fill"><div class="ov-fill-inner" id="lfc-ov"></div></div>'
    const championMediaHTML = () => '<div class="champ-banner"><div class="champ-label">Champion</div><div class="champ-name" id="lfc-champ-name">Loading…</div></div>'

    function rebuildMedia(phase: string) {
      if (overlayTimer) {
        clearInterval(overlayTimer)
        overlayTimer = null
      }
      if (champTimer) {
        clearInterval(champTimer)
        champTimer = null
      }
      if (phase === 'champion') {
        mediaMount!.innerHTML = championMediaHTML()
        const nameEl = mediaMount!.querySelector('#lfc-champ-name') as HTMLElement
        const loadChamp = () => {
          fetchJson(BASE + '?page=bracket')
            .then((d: any) => {
              nameEl.textContent = d && d.champion ? d.champion : '—'
            })
            .catch(() => {
              nameEl.textContent = 'Unavailable'
            })
        }
        loadChamp()
        champTimer = every(loadChamp, POLL_MS)
      } else {
        mediaMount!.innerHTML = STREAM_LIVE ? streamMediaHTML() : overlayFillHTML()
        const overlayEl = mediaMount!.querySelector('#lfc-ov') as HTMLElement
        const runOverlay = () => {
          const r = OVERLAY_RENDERERS[phase]
          if (r) r(overlayEl)
        }
        runOverlay()
        overlayTimer = every(runOverlay, POLL_MS)
      }
    }

    // logo
    const lg = q('#lfc-logo') as HTMLImageElement | null
    if (lg) {
      if (BRAND_LOGO) {
        lg.onerror = () => {
          lg.style.display = 'none'
        }
        lg.src = BRAND_LOGO
      } else {
        lg.style.display = 'none'
      }
    }
    renderSponsors()

    let currentPhase: string | null = null
    const PHASE_ALIASES: Record<string, string> = {
      prelim: 'prelim',
      preliminary: 'prelim',
      r16: 'r16',
      'round of 16': 'r16',
      roundof16: 'r16',
      finals: 'finals',
      'final round': 'finals',
      champion: 'champion',
      complete: 'champion',
      'tournament complete': 'champion',
    }
    const normalizePhase = (raw: unknown) => {
      const k = String(raw == null ? '' : raw).trim().toLowerCase()
      return PHASE_ALIASES[k] || (ORDERS[k] ? k : null)
    }
    const applyPhase = (p: string) => {
      if (p === currentPhase) return
      currentPhase = p
      rebuildMedia(p)
      rebuildBars(p)
    }
    const pollPhase = () => {
      fetchJson(BASE + '?page=phase')
        .then((d: any) => {
          const p = normalizePhase(d && d.phase)
          if (!p) return
          applyPhase(p)
        })
        .catch(() => undefined)
    }
    applyPhase(DEFAULT_PHASE)
    pollPhase()
    every(pollPhase, POLL_MS)

    return () => {
      timers.forEach((id) => clearInterval(id))
    }
  }, [block])

  return (
    <section style={{background: '#ffffff', color: '#141c3f', padding: '56px 0 96px'}}>
      <style dangerouslySetInnerHTML={{__html: CSS}} />
      <div style={{padding: '0 24px'}}>
        <div className="lfc lfc-light" id="lfc-board" ref={rootRef}>
          <div className="lfc-top">
            <div className="lfc-brandwrap">
              <span className="dsp lfc-brand">LAUNCH FOR CARE INVITATIONAL</span>
              <img className="lfc-logo" id="lfc-logo" alt="Launch for Care Invitational" />
            </div>
            <div className="lfc-controls" />
          </div>
          <div id="lfc-sponsors" style={{marginBottom: '10px'}} />
          <div id="lfc-media" style={{marginBottom: '10px'}} />
          <div id="lfc-bars" />
        </div>
      </div>
    </section>
  )
}
