// Renderiza todas las composiciones a video/out/. Uso: npm run render:all [-- Id1 Id2]
import { execFileSync } from 'node:child_process'

const all = ['LogoIntro', 'LogoIntroVertical', 'BrandPromo', 'TitleCard']
const ids = process.argv.slice(2).length ? process.argv.slice(2) : all
for (const id of ids) {
  console.log(`\n▶ ${id}`)
  execFileSync('npx', ['remotion', 'render', id, `out/${id}.mp4`], { stdio: 'inherit' })
}
execFileSync('npx', ['remotion', 'still', 'Thumbnail', 'out/Thumbnail.png', '--frame=90'], { stdio: 'inherit' })
console.log('\n✔ Listo: mira la carpeta video/out/')
