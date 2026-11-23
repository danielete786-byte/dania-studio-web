"""Corrige inicios de palabra que Whisper adelanta tras una pausa.

Whisper suele "estirar" hacia atrás la primera palabra después de un silencio.
Regla: si una palabra dura mucho más de lo esperable, su inicio se acerca a su final;
y ninguna palabra empieza antes que su frase.
"""
import sys, json, re

p = sys.argv[1]
d = json.load(open(p))
segs = d["segments"]
for w in d["words"]:
    letters = len(re.sub(r"[^\wáéíóúñ]", "", w["text"].lower()))
    expected = 75 * letters + 140
    if not re.search(r"\d", w["text"]) and w["endMs"] - w["startMs"] > expected * 1.6:
        w["startMs"] = w["endMs"] - expected
    s = next((s for s in segs if s["startMs"] - 150 <= w["endMs"] <= s["endMs"] + 150), None)
    if s and w["startMs"] < s["startMs"]:
        w["startMs"] = s["startMs"]
json.dump(d, open(p, "w"), ensure_ascii=False)
print(" ".join(f"{w['text']}@{w['startMs']}" for w in d["words"] if w["text"] in ("Y", "En", "Ahora,", "Llevan", "Mismo", "Como", "¿Cuál", "Te", "el")))
