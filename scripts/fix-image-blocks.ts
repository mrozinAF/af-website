import {getCliClient} from 'sanity/cli'

const client = getCliClient()
const key = () => Math.random().toString(36).slice(2, 12)

async function uploadPhoto(seed: string, w: number, h: number) {
  const res = await fetch(`https://picsum.photos/seed/${seed}/${w}/${h}`)
  if (!res.ok) throw new Error(`fetch ${seed}: ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buf, {filename: `${seed}.jpg`})
  return {asset: {_type: 'reference', _ref: asset._id}}
}

const imageBlock = (img: {asset: unknown}, altText: string, caption?: string) => ({
  ...img,
  _type: 'imageBlock',
  _key: key(),
  altText,
  ...(caption ? {caption} : {}),
})

async function fix(
  docId: string,
  extra: {seed: string; alt: string; caption?: string},
) {
  // 1) drop the stray _type == "image" items from the earlier bad insert
  await client.patch(docId).unset(['content[_type=="image"]']).commit()

  // 2) append a correct imageBlock
  const img = await uploadPhoto(extra.seed, 1600, 900)
  await client
    .patch(docId)
    .insert('after', 'content[-1]', [imageBlock(img, extra.alt, extra.caption)])
    .commit()

  console.log(`✔ fixed ${docId}`)
}

async function run() {
  await fix('d6016f48-8743-4a57-aae4-78ab0e66ba37', {
    seed: 'af-home-collab',
    alt: 'Ascendance Foundry team collaborating',
    caption: 'Fellows working alongside client teams.',
  })
  await fix('page-fellows', {seed: 'af-fellows-work', alt: 'Fellows at work'})
  await fix('page-summer-camp', {seed: 'af-camp-group', alt: 'Summer camp participants'})
  console.log('Done.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
