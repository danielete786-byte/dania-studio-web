"""Locuta el guion con la voz masculina del canal (clon de tts/voice/ref.wav).

Uso:  python tts/gen.py <dir_historia> [tomas=2] [ids,separados,por,comas]

Lee <dir_historia>/script.json y escribe <dir_historia>/takes/<id>_<k>.wav
más takes/report.json con la fidelidad de cada toma (Whisper) y su ritmo.
"""
import sys, os, json, time, glob, re, unicodedata, difflib
import numpy as np
import torch
import soundfile as sf
import librosa
from qwen_tts import Qwen3TTSModel
from faster_whisper import WhisperModel

HERE = os.path.dirname(os.path.abspath(__file__))
STORY = os.path.abspath(sys.argv[1])
TAKES = int(sys.argv[2]) if len(sys.argv) > 2 else 2
ONLY = sys.argv[3].split(",") if len(sys.argv) > 3 else None
REF = os.path.join(HERE, "voice", "ref.wav")
REF_TEXT = open(os.path.join(HERE, "voice", "ref.txt"), encoding="utf-8").read().strip()

torch.set_num_threads(os.cpu_count())
data = json.load(open(os.path.join(STORY, "script.json"), encoding="utf-8"))
items = data["segments"] if isinstance(data, dict) else data
if ONLY:
    items = [s for s in items if s["id"] in ONLY]

base = glob.glob(os.path.expanduser("~/.cache/huggingface/hub/models--Qwen--Qwen3-TTS-12Hz-1.7B-Base/snapshots/*"))[0]
model = Qwen3TTSModel.from_pretrained(base, device_map="cpu", dtype=torch.bfloat16, attn_implementation="sdpa")
prompt = model.create_voice_clone_prompt(ref_audio=REF, ref_text=REF_TEXT, x_vector_only_mode=False)
asr = WhisperModel("large-v3", device="cpu", compute_type="int8")

sys.path.insert(0, HERE)
from numwords import expand_tokens, nk  # noqa: E402


def words(s):
    return [w for w in (nk(x) for x in expand_tokens(s.split())) if w]


os.makedirs(os.path.join(STORY, "takes"), exist_ok=True)
rep_path = os.path.join(STORY, "takes", "report.json")
report = json.load(open(rep_path)) if os.path.exists(rep_path) else {}
for item in items:
    for k in range(TAKES):
        torch.manual_seed(1000 + k * 17 + len(item["text"]))
        t0 = time.time()
        wavs, sr = model.generate_voice_clone(text=item["text"], language="Spanish", voice_clone_prompt=prompt)
        y = wavs[0].astype(np.float32)
        y, _ = librosa.effects.trim(y, top_db=38)
        path = os.path.join(STORY, "takes", f"{item['id']}_{k}.wav")
        sf.write(path, y, sr)
        y16 = librosa.resample(y, orig_sr=sr, target_sr=16000)
        segs, _ = asr.transcribe(y16, language="es", beam_size=5)
        hyp = " ".join(s.text.strip() for s in segs)
        sim = difflib.SequenceMatcher(None, words(item["text"]), words(hyp)).ratio()
        dur = len(y) / sr
        wps = len(item["text"].split()) / dur
        report[os.path.basename(path)] = {"id": item["id"], "sim": round(sim, 3), "dur": round(dur, 2), "wps": round(wps, 2), "hyp": hyp}
        json.dump(report, open(rep_path, "w"), ensure_ascii=False, indent=1)
        print(f"{item['id']}_{k} sim={sim:.3f} dur={dur:.1f}s wps={wps:.2f} gen={time.time()-t0:.0f}s | {hyp}", flush=True)
