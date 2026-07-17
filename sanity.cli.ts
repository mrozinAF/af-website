import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'xk0vwazc',
    dataset: 'production'
  },
  // Hosted Studio address: https://ascendancefoundry.sanity.studio
  studioHost: 'ascendancefoundry',
  deployment: {
    // The deployed Studio app (ascendancefoundry.sanity.studio) — pins the
    // target so future `sanity deploy` runs don't prompt for it.
    appId: 'y3ef4k24dcracdrebwm5zjsc',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
