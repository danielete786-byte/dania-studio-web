#!/usr/bin/env bash
# Efectos estilo GTA (librería echris6/gta-components, MIT) como capas transparentes para los vídeos de GTA.
#
#   ./gta-fx.sh list                                  -> lista los 50 efectos verticales
#   ./gta-fx.sh prepare <efecto> <carpeta>            -> copia el efecto listo para editar textos/colores
#   ./gta-fx.sh render  <carpeta> <nombre> ['{"variant":"1"}']
#                                                     -> remotion/public/fx/<nombre>.webm (VP9 con transparencia)
# Ej.: ./gta-fx.sh prepare 08-wanted-level stories/2026-11-25-videojuegos/fx/wanted
#      (traduce los textos del index.html si hace falta)
#      ./gta-fx.sh render stories/2026-11-25-videojuegos/fx/wanted wanted '{"variant":"1"}'
set -euo pipefail
cd "$(dirname "$0")"
FX="$(pwd)/gta-fx"
CHROME=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome
cmd="${1:-list}"
case "$cmd" in
  list)
    python3 -c "
import json
for s in json.load(open('$FX/components.json'))['shorts']:
    print(f\"{s['dir'].split('/')[-1]:<24} {s['name']:<28} {s.get('job','')[:90]}\")" ;;
  prepare)
    src="$FX/shorts/$2"; dst="$3"
    [ -f "$src/index.html" ] || { echo "No existe el efecto $2 (usa ./gta-fx.sh list)"; exit 1; }
    rm -rf "$dst"; mkdir -p "$dst"; cp -R "$src/." "$dst/"
    mkdir -p "$dst/assets/fonts" "$dst/assets/kit" "$dst/assets/shots" "$dst/assets/plates" "$dst/assets/clips" "$dst/assets/vendor"
    cp -R "$FX/shared/fonts/." "$dst/assets/fonts/"; cp -R "$FX/shared/kit-shorts/." "$dst/assets/kit/"
    cp "$FX/vendor/gsap.min.js" "$FX/vendor/three.min.js" "$dst/assets/vendor/"
    # GSAP/Three en local (el CDN no está permitido en este entorno)
    sed -i -E 's#https://cdn.jsdelivr.net/npm/gsap@[0-9.]+/dist/gsap.min.js#assets/vendor/gsap.min.js#g; s#https://cdn.jsdelivr.net/npm/three@[0-9.]+/build/three.min.js#assets/vendor/three.min.js#g' "$dst/index.html"
    # los clips de muestra (tráileres de Rockstar) NO se incluyen: rellenos negros, invisibles con bg=none
    for f in $(grep -oE 'assets/(shots|plates|clips)/[A-Za-z0-9._-]+\.(mp4|webm|mov)' "$dst/index.html" | sort -u); do
      [ -f "$dst/$f" ] || ffmpeg -loglevel error -y -f lavfi -i color=c=black:s=1080x1920:r=30:d=12 -c:v libx264 -pix_fmt yuv420p "$dst/$f"
    done
    echo "Listo para editar: $dst/index.html (textos en inglés: tradúcelos si salen en pantalla)" ;;
  render)
    dir="$2"; name="$3"; vars="${4:-{\}}"
    vars=$(python3 -c "import json,sys; v=json.loads(sys.argv[1]); v['bg']='none'; print(json.dumps(v))" "$vars")
    mkdir -p remotion/public/fx
    out="$(pwd)/remotion/public/fx/$name.webm"
    (cd "$dir" && PUPPETEER_EXECUTABLE_PATH="$CHROME" npx --yes hyperframes@0.8.162 render . -o "$out" --format webm --variables "$vars" --quiet)
    ffprobe -v error -show_entries format=duration -of csv=p=0 "$out" | xargs printf "EFECTO: remotion/public/fx/$name.webm (%.1fs, transparente)\n" ;;
  *) echo "uso: $0 list | prepare <efecto> <carpeta> | render <carpeta> <nombre> [variables-json]"; exit 1 ;;
esac
