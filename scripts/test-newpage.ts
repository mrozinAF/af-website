import {getCliClient} from 'sanity/cli'
const client = getCliClient()
const key = () => Math.random().toString(36).slice(2,12)
async function run(){
  // 1) create a new page (what a non-technical editor would do via the template)
  await client.createOrReplace({
    _id:'page-test-partners', _type:'page', name:'Our Partners',
    slug:{_type:'slug', current:'our-partners'},
    content:[
      {_type:'pageHeader', _key:key(), title:'Our Partners'},
      {_type:'richText', _key:key(), content:[{_type:'block',_key:key(),style:'normal',markDefs:[],children:[{_type:'span',_key:key(),marks:[],text:'A test page created from the template.'}]}]},
    ],
  })
  // 2) add it to the nav
  const s = await client.getDocument('siteSettings')
  const nav = [...((s?.nav as unknown[])||[]), {_type:'navItem',_key:key(),label:'Our Partners',page:{_type:'reference',_ref:'page-test-partners'}}]
  await client.patch('siteSettings').set({nav}).commit()
  console.log('created test page + added to nav')
}
run().catch(e=>{console.error(e);process.exit(1)})
