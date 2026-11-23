"""Elige la mejor toma de cada frase, monta la locución y saca tiempos por palabra.

Uso:  python tts/assemble.py <dir_historia> <dir_remotion>

Escribe <dir_remotion>/public/voice.wav (masterizada a -15 LUFS)
y <dir_remotion>/src/data/timeline.json  {durationMs, segments[], words[]}.

script.json admite:
  {"segments": [{"id", "text", "gap"}...],
   "display":  [{"spoken": "setenta y cinco mil", "display": "75.000"}, {"spoken": "Juang", "display": "Huang"}]}
"display" cambia cómo se ESCRIBE en los subtítulos lo que se DICE (cifras, nombres escritos fonéticamente...).
"""
import sys, os, json, re, subprocess, difflib
import numpy as np
import soundfile as sf
import librosa
from faster_whisper import WhisperModel

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from numwords import expand_tokens, nk, number_words  # noqa: E402

STORY = os.path.abspath(sys.argv[1])
OUT = os.path.abspath(sys.argv[2])
SR = 48000
LEAD = 0.12

data = json.load(open(os.path.join(STORY, "script.json"), encoding="utf-8"))
items = data["segments"] if isinstance(data, dict) else data
display = data.get("display", []) if isinstance(data, dict) else []
report = json.load(open(os.path.join(STORY, "takes", "report.json"), encoding="utf-8"))


def score(r):
    return r["sim"] * 10 - abs(r["wps"] - 3.1)


# ---------- elegir tomas y montar ----------
parts = [np.zeros(int(LEAD * SR), dtype=np.float32)]
segments, t = [], LEAD
for it in items:
    cands = {k: v for k, v in report.items() if v.get("id") == it["id"]}
    if not cands:
        sys.exit(f"Sin tomas para '{it['id']}': ejecuta gen.py")
    best = max(cands, key=lambda k: score(cands[k]))
    print(f"{it['id']:>10} -> {best}  sim={cands[best]['sim']} wps={cands[best]['wps']}")
    y, _ = librosa.load(os.path.join(STORY, "takes", best), sr=SR)
    f = int(0.008 * SR)
    y[:f] *= np.linspace(0, 1, f)
    y[-f:] *= np.linspace(1, 0, f)
    segments.append({"id": it["id"], "startMs": round(t * 1000), "endMs": round((t + len(y) / SR) * 1000)})
    parts.append(y)
    t += len(y) / SR
    g = float(it.get("gap", 0.4))
    parts.append(np.zeros(int(g * SR), dtype=np.float32))
    t += g
raw = np.concatenate(parts)
raw_path = os.path.join(STORY, "voice_raw.wav")
sf.write(raw_path, raw, SR)
os.makedirs(os.path.join(OUT, "public"), exist_ok=True)
subprocess.run(
    ["ffmpeg", "-loglevel", "error", "-y", "-i", raw_path, "-af",
     "highpass=f=70,equalizer=f=300:t=q:w=1.2:g=-2,equalizer=f=3500:t=q:w=1.5:g=2,"
     "acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2,loudnorm=I=-15:TP=-1.5:LRA=9",
     "-ar", str(SR), "-ac", "1", os.path.join(OUT, "public", "voice.wav")],
    check=True,
)

# ---------- tiempos por palabra (Whisper) ----------
asr = WhisperModel("large-v3", device="cpu", compute_type="int8")
y16, _ = librosa.load(raw_path, sr=16000)
segs, _ = asr.transcribe(y16, language="es", word_timestamps=True, beam_size=5)
hyp = []
for s in segs:
    for w in s.words:
        nw = number_words(w.word.strip())
        pieces = nw if nw else [w.word.strip()]
        step = (w.end - w.start) / len(pieces)
        for i, p in enumerate(pieces):
            k = nk(p)
            if k:
                hyp.append((k, w.start + i * step, w.start + (i + 1) * step))

# tokens del guion (forma escrita) + su expansión hablada
orig = []  # {text, seg, sub:[idx en flat]}
flat = []  # claves habladas
for it in items:
    for w in it["text"].split():
        subs = []
        for p in expand_tokens([w]):
            k = nk(p)
            if k:
                subs.append(len(flat))
                flat.append({"k": k})
        orig.append({"text": w, "seg": it["id"], "sub": subs})

sm = difflib.SequenceMatcher(None, [x["k"] for x in flat], [h[0] for h in hyp], autojunk=False)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1):
            flat[i1 + k]["s"], flat[i1 + k]["e"] = hyp[j1 + k][1], hyp[j1 + k][2]
    elif tag == "replace" and j2 > j1:
        s0, e0, n = hyp[j1][1], hyp[j2 - 1][2], i2 - i1
        for k in range(n):
            flat[i1 + k]["s"] = s0 + (e0 - s0) * k / n
            flat[i1 + k]["e"] = s0 + (e0 - s0) * (k + 1) / n

segmap = {s["id"]: s for s in segments}
prev_e = LEAD
for o in orig:
    got = [flat[i] for i in o["sub"] if "s" in flat[i]]
    if got:
        o["s"], o["e"] = got[0]["s"], got[-1]["e"]
    else:
        o["s"] = max(prev_e, segmap[o["seg"]]["startMs"] / 1000)
        o["e"] = o["s"] + 0.3
        print("interpolada:", o["text"])
    prev_e = o["e"]

# ---------- forma de pantalla (display) ----------
rules = [([nk(x) for x in d["spoken"].split()], d["display"]) for d in display]
words, i = [], 0
while i < len(orig):
    hit = None
    for keys, disp in rules:
        n = len(keys)
        if n and [nk(o["text"]) for o in orig[i:i + n]] == keys:
            hit = (n, disp)
            break
    if hit:
        n, disp = hit
        tail = re.sub(r"^.*?([.,;:!?»]*)$", r"\1", orig[i + n - 1]["text"])
        words.append({"text": disp + tail, "startMs": round(orig[i]["s"] * 1000), "endMs": round(orig[i + n - 1]["e"] * 1000)})
        i += n
    else:
        o = orig[i]
        words.append({"text": o["text"], "startMs": round(o["s"] * 1000), "endMs": round(o["e"] * 1000)})
        i += 1

total_ms = round(len(raw) / SR * 1000) + 900
tl_path = os.path.join(OUT, "src", "data", "timeline.json")
os.makedirs(os.path.dirname(tl_path), exist_ok=True)
json.dump({"durationMs": total_ms, "segments": segments, "words": words}, open(tl_path, "w"), ensure_ascii=False)
subprocess.run([sys.executable, os.path.join(HERE, "fix_timeline.py"), tl_path], check=True, stdout=subprocess.DEVNULL)
print(f"TOTAL {total_ms / 1000:.1f}s · {len(words)} palabras")
print(" ".join(f"{w['text']}@{w['startMs']}" for w in json.load(open(tl_path))["words"]))
