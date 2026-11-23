#!/usr/bin/env bash
# Hoja de contacto con fotogramas para revisar antes de renderizar.
# Uso: ./still.sh 0 60 150 300 ...   -> remotion/out/sheet.jpg
set -euo pipefail
cd "$(dirname "$0")/remotion"
rm -f out/s-*.png
for f in "$@"; do npx remotion still Noticia "out/s-$(printf %04d "$f").png" --frame="$f" --scale=0.33 --log=error; done
ffmpeg -loglevel error -y $(for f in out/s-*.png; do echo -n "-i $f "; done) -filter_complex "hstack=inputs=$#" out/sheet.jpg
echo "remotion/out/sheet.jpg"
