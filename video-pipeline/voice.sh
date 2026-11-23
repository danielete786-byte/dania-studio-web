#!/usr/bin/env bash
# Paso de voz: locución (2 tomas por frase) + montaje + tiempos por palabra + música.
# Uso: ./voice.sh stories/<carpeta>      (la carpeta debe tener script.json)
set -euo pipefail
cd "$(dirname "$0")"
STORY="$1"; PY="$HOME/.video-venv/bin/python"
export HF_HUB_OFFLINE=1
"$PY" tts/gen.py "$STORY" 2
"$PY" tts/assemble.py "$STORY" remotion
DUR=$("$PY" -c "import json;print(json.load(open('remotion/src/data/timeline.json'))['durationMs']/1000+2)")
"$PY" tts/audio_fx.py remotion/public/sfx "$DUR" >/dev/null
echo "VOZ OK"
