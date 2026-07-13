import {getCliClient} from 'sanity/cli'

const client = getCliClient()
const key = () => Math.random().toString(36).slice(2, 12)

// Boilerplate photos (Lorem Picsum) — fixed seeds so they stay stable.
async function uploadPhoto(seed: string, w: number, h: number, filename: string) {
  const res = await fetch(`https://picsum.photos/seed/${seed}/${w}/${h}`)
  if (!res.ok) throw new Error(`Failed to fetch photo ${seed}: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buf, {filename})
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

const imageBlock = (img: {asset: unknown}, altText: string, caption?: string) => ({
  ...img,
  _type: 'imageBlock', // must come AFTER the spread so it isn't overwritten to "image"
  _key: key(),
  altText,
  ...(caption ? {caption} : {}),
})

// Give the first hero block on a page an image; optionally append an imageBlock.
async function decorate(
  docId: string,
  heroSeed: string,
  extra?: {seed: string; alt: string; caption?: string},
) {
  const doc = await client.getDocument(docId)
  if (!doc || !Array.isArray(doc.content)) {
    console.warn(`skip ${docId} (no content)`)
    return
  }
  const hero = doc.content.find((b: {_type: string}) => b._type === 'hero') as
    | {_key: string}
    | undefined

  const patch = client.patch(docId)

  if (hero) {
    const heroImg = await uploadPhoto(heroSeed, 1200, 1000, `${heroSeed}.jpg`)
    patch.set({[`content[_key=="${hero._key}"].image`]: {...heroImg, _type: 'image'}})
  }

  if (extra) {
    const blockImg = await uploadPhoto(extra.seed, 1600, 900, `${extra.seed}.jpg`)
    patch.insert('after', 'content[-1]', [imageBlock(blockImg, extra.alt, extra.caption)])
  }

  await patch.commit()
  console.log(`✔ decorated ${docId}`)
}

async function run() {
  await decorate('d6016f48-8743-4a57-aae4-78ab0e66ba37', 'af-home-team', {
    seed: 'af-home-collab',
    alt: 'Ascendance Foundry team collaborating',
    caption: 'Fellows working alongside client teams.',
  })
  await decorate('page-our-team', 'af-team-office')
  await decorate('page-fellows', 'af-fellows-students', {
    seed: 'af-fellows-work',
    alt: 'Fellows at work',
  })
  await decorate('page-full-time-positions', 'af-careers-desk')
  await decorate('page-summer-camp', 'af-camp-learning', {
    seed: 'af-camp-group',
    alt: 'Summer camp participants',
  })
  console.log('Done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
