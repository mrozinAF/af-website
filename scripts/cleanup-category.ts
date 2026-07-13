import {getCliClient} from 'sanity/cli'

const client = getCliClient()

// The peopleGrid block key on the Our Team page (from a query).
const PEOPLE_GRID_KEY = 'fea56pl0qk'

async function run() {
  await client
    .transaction()
    .patch('person-ian', (p) => p.unset(['category']))
    .patch('person-ethan', (p) => p.unset(['category']))
    .patch('person-andrew', (p) => p.unset(['category']))
    .patch('page-our-team', (p) =>
      p.unset([`content[_key=="${PEOPLE_GRID_KEY}"].category`]),
    )
    .commit()
  console.log('✔ Removed leftover "category" values.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
