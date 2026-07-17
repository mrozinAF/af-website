import {defineField, defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'

/**
 * Live Event Scoreboard — the interactive tournament widget from the
 * "Launch for Care Invitational" design: YouTube stream, sponsor marquee, and
 * auto-updating leaderboards / round-of-16 / bracket panels. It pulls live
 * scores from an external data feed and refreshes every few seconds.
 * Event-specific config (sponsors, phases, panel definitions) is baked into the
 * frontend component; the feed URL, video, logo and stream toggle are editable
 * here.
 */
export default defineType({
  name: 'eventScoreboard',
  title: 'Live Event Scoreboard',
  description:
    'The live tournament scoreboard — stream, sponsors, leaderboards and bracket — that updates automatically from the event data feed. Used on the Events page.',
  type: 'object',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'dataEndpoint',
      title: 'Live data feed URL',
      type: 'url',
      description: 'The Google Apps Script /exec URL that serves the live scores.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'videoId',
      title: 'YouTube video ID',
      type: 'string',
      description: 'The live-stream video ID (the part after v= in a YouTube URL).',
    }),
    defineField({
      name: 'brandLogoUrl',
      title: 'Event logo URL',
      type: 'url',
      description: 'Logo shown in the scoreboard header.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'streamLive',
      title: 'Show the live stream',
      type: 'boolean',
      description:
        'On during the event (shows the video). Turn off to show the score overlays full-width instead.',
      initialValue: true,
    }),
  ],
  preview: {prepare: () => ({title: 'Live Event Scoreboard'})},
})
