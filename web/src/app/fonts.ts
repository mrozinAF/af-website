import {
  Manrope,
  Outfit,
  Newsreader,
  Familjen_Grotesk,
  IBM_Plex_Mono,
} from 'next/font/google'
import localFont from 'next/font/local'

// Body + UI text — crisp, modern, readable (pairs with Nexa's geometry).
export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

// --- Hero design system (from the homepage design handoff) ---
export const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
})
export const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
})
export const familjen = Familjen_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-familjen',
  display: 'swap',
})
export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
})

// Geometric sans — matches the AF logo. Used Heavy for labels/nav/buttons.
export const nexa = localFont({
  src: [
    {path: './fonts/Nexa-ExtraLight.ttf', weight: '300', style: 'normal'},
    {path: './fonts/Nexa-Heavy.ttf', weight: '800', style: 'normal'},
  ],
  variable: '--font-nexa',
  display: 'swap',
})

// Mont — bold geometric display.
export const mont = localFont({
  src: './fonts/Mont-Heavy.otf',
  variable: '--font-mont',
  weight: '800',
  display: 'swap',
})

// Alte Haas Grotesk — softer grotesk display.
export const alteHaas = localFont({
  src: './fonts/AlteHaasGrotesk-Bold.ttf',
  variable: '--font-alte-haas',
  weight: '700',
  display: 'swap',
})

// Retro display face for big headings.
export const coolvetica = localFont({
  src: './fonts/Coolvetica.otf',
  variable: '--font-coolvetica',
  weight: '400',
  display: 'swap',
})

// Elegant serif for accents (quotes, eyebrows).
export const modernRomance = localFont({
  src: './fonts/ModernRomance.otf',
  variable: '--font-modern-romance',
  weight: '400',
  display: 'swap',
})
