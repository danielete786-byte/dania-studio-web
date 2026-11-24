// Genera una versión de la demo en UN solo archivo HTML (JS y CSS incrustados)
// que se puede abrir con doble clic o enviar, sin servidor.
// Uso: node scripts/build-standalone.mjs vegawagen
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs'
import { resolve, join } from 'node:path'

const name = process.argv[2] || 'vegawagen'
const root = resolve(import.meta.dirname, '..'), tmp = join(root, 'node_modules/.standalone-' + name)
await build({ root, configFile: false, base: './', logLevel: 'warn', plugins: [react()],
  build: { outDir: tmp, emptyOutDir: true, assetsInlineLimit: 1e9, cssCodeSplit: false, modulePreload: false,
    rollupOptions: { input: join(root, `demos/${name}/index.html`), output: { inlineDynamicImports: true } } } })

let html = readFileSync(join(tmp, `demos/${name}/index.html`), 'utf8')
const assets = join(tmp, 'assets'), files = readdirSync(assets)
const esc = s => s.replace(/<\/(script|style)/gi, '<\\/$1')
html = html.replace(/<script type="module" crossorigin src="[^"]*\/assets\/([^"]+)"><\/script>/, (_, f) => '')
  .replace(/<link rel="stylesheet" crossorigin href="[^"]*\/assets\/([^"]+)">/, (_, f) => `<style>${esc(readFileSync(join(assets, f), 'utf8'))}</style>`)
const js = files.filter(f => f.endsWith('.js'))
if (js.length !== 1) throw new Error('Se esperaba un solo JS, hay: ' + js.join(', '))
// función de reemplazo: el JS minificado contiene secuencias como $' o $& que replace() interpretaría
const code = esc(readFileSync(join(assets, js[0]), 'utf8'))
html = html.replace('</body>', () => `<script type="module">${code}</script></body>`)
if (/\/assets\//.test(html)) throw new Error('Quedan referencias a /assets/ sin incrustar')
const out = join(root, `demos/${name}/${name}-demo.html`)
writeFileSync(out, html); rmSync(tmp, { recursive: true, force: true })
console.log('OK', out, (html.length / 1024).toFixed(0) + ' KB')
