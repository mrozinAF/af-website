import {firefox, webkit} from 'playwright'
const url='http://localhost:3000/'
const ff=await firefox.launch({headless:false, args:['-width','1280','-height','900']})
const fp=await (await ff.newContext({viewport:null})).newPage(); await fp.goto(url)
const wk=await webkit.launch({headless:false})
const wp=await (await wk.newContext({viewport:{width:1280,height:900}})).newPage(); await wp.goto(url)
console.log('Firefox + WebKit windows open. Leave this running to keep them open.')
await new Promise(()=>{})
