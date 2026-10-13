import puppeteer from 'puppeteer-core'
const URL = process.argv[2] || 'http://localhost:4173/dania-studio-web/', pre = process.argv[3] || ''
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox','--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] })
const errs = []
const p = await b.newPage(); p.on('console', m => { if (['error','warning'].includes(m.type())) errs.push(m.type()+': '+m.text()) }); p.on('pageerror', e => errs.push('pageerror: '+e.message))
p.on('requestfailed', r => errs.push('reqfail: '+r.url()))
await p.setViewport({ width: 1440, height: 900 }); await p.goto(URL, { waitUntil: 'networkidle0', timeout: 90000 })
await new Promise(r => setTimeout(r, 2500))
const go = async (y, name, wait = 2500) => { await p.evaluate(y => window.scrollTo(0, y), y); await new Promise(r => setTimeout(r, wait)); await p.screenshot({ path: `shots/${pre}${name}.png` }) }
if (pre) { await go(0, 'live-hero'); const hh = await p.evaluate(() => document.querySelector('section').offsetHeight - innerHeight); await go(hh*0.5,'live-mid')
  await p.evaluate(() => document.querySelector('#contacto').scrollIntoView()); await new Promise(r => setTimeout(r, 8000)); await p.screenshot({ path: `shots/${pre}cta.png` }) }
else {
await go(0, '01-hero')
const hh = await p.evaluate(() => document.querySelector('section').offsetHeight - innerHeight)
await go(hh * 0.5, '02-hero-mid'); await go(hh * 0.95, '03-hero-end')
const off = async s => p.evaluate(s => document.querySelector(s).getBoundingClientRect().top + scrollY, s)
await go(await off('#servicios') - 40, '04-servicios', 3000)
await go(await off('section[aria-label=Cifras]') - 100, '05-cifras', 3500)
await go(await off('#portfolio') - 40, '06-portfolio', 3000)
await go(await off('#proceso'), '07-proceso', 3000)
await p.evaluate(() => document.querySelector('#contacto').scrollIntoView()); await new Promise(r => setTimeout(r, 3000))
await p.mouse.move(1000, 250); await new Promise(r => setTimeout(r, 6000)); await p.screenshot({ path: 'shots/08-cta-3d.png' })
console.log('glb loaded:', await p.evaluate(() => document.querySelector('[role=img][aria-label^="Logo 3D interactivo"]')?.dataset.loaded))
const m = await b.newPage(); m.on('pageerror', e => errs.push('m pageerror: '+e.message))
await m.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); await m.goto(URL, { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 2500)); await m.screenshot({ path: 'shots/09-mobile-hero.png' })
}
console.log(errs.join('\n') || 'no console errors'); await b.close()
