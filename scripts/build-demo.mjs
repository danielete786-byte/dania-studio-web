// Construye una demo como carpeta independiente, lista para copiar en gh-pages:
//   dist-demos/<nombre>/index.html + dist-demos/<nombre>/assets/*
// Se publica en https://<usuario>.github.io/dania-studio-web/demos/<nombre>/
// Uso: node scripts/build-demo.mjs vegawagen
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import { renameSync, rmSync, mkdirSync } from 'node:fs'
import { resolve, join } from 'node:path'

const name = process.argv[2] || 'vegawagen'
const root = resolve(import.meta.dirname, '..'), out = join(root, 'dist-demos', name)
rmSync(out, { recursive: true, force: true })
await build({ root, configFile: false, base: `/dania-studio-web/demos/${name}/`, publicDir: false, logLevel: 'warn', plugins: [react()],
  build: { outDir: out, emptyOutDir: true, rollupOptions: { input: join(root, `demos/${name}/index.html`) } } })
// vite deja el html en demos/<nombre>/index.html dentro de outDir: lo subimos a la raíz de la carpeta
renameSync(join(out, `demos/${name}/index.html`), join(out, 'index.html'))
rmSync(join(out, 'demos'), { recursive: true, force: true })
console.log('OK', out)
