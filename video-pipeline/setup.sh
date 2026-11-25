#!/usr/bin/env bash
# Prepara una sesión nueva para producir vídeos (idempotente). Tarda ~10-15 min la primera vez.
#  - venv de Python en ~/.video-venv con Qwen3-TTS + Whisper
#  - modelos: Qwen3-TTS 1.7B Base (voz clonada) y faster-whisper large-v3
#  - dependencias de Remotion (npm ci)
set -euo pipefail
cd "$(dirname "$0")"
VENV="$HOME/.video-venv"
export HF_HUB_DISABLE_XET=1   # el host cas-server de Xet no está permitido en este entorno

if [ ! -x "$VENV/bin/python" ]; then
  uv venv -q "$VENV" --python 3.12
fi
VIRTUAL_ENV="$VENV" uv pip install -q -r tts/requirements.txt

"$VENV/bin/python" - <<'PY'
from huggingface_hub import snapshot_download
for r in ["Qwen/Qwen3-TTS-12Hz-1.7B-Base", "Systran/faster-whisper-large-v3"]:
    print("modelo listo:", snapshot_download(r))
PY

(cd remotion && npm ci --no-audit --no-fund --loglevel=error)
# HyperFrames (renderiza los efectos GTA de gta-fx/): lo deja en la caché de npx
npx --yes hyperframes@0.8.162 --version >/dev/null 2>&1 || true
echo "SETUP OK"
