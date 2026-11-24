#!/usr/bin/env bash
# Render final: comprueba tipos, renderiza, normaliza a -14 LUFS (redes), exporta SRT y la miniatura.
# Uso: ./render.sh stories/<carpeta> <NombreDelArchivo>
set -euo pipefail
cd "$(dirname "$0")"
STORY="$(cd "$1" && pwd)"; NAME="$2"; PY="$HOME/.video-venv/bin/python"
(cd remotion && npx tsc --noEmit && npx remotion render Noticia out/raw.mp4 --concurrency=4 --crf=18 --audio-bitrate=256k --log=error)
ffmpeg -loglevel error -y -i remotion/out/raw.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=7 -ar 48000 -c:a aac -b:a 256k -movflags +faststart "$STORY/$NAME.mp4"
"$PY" tts/make_srt.py remotion/src/data/timeline.json "$STORY/$NAME.srt"
(cd remotion && npx remotion still Miniatura "$STORY/$NAME-miniatura.jpg" --image-format=jpeg --jpeg-quality=95 --log=error)
echo "MINIATURA: $STORY/$NAME-miniatura.jpg"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$STORY/$NAME.mp4" | xargs printf "DURACIÓN %.1fs\n"
echo "VÍDEO: $STORY/$NAME.mp4"
