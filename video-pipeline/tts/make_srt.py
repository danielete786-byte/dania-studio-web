"""Exporta subtítulos SRT desde src/data/timeline.json.  Uso: python tts/make_srt.py <timeline.json> <salida.srt>"""
import sys, json

d = json.load(open(sys.argv[1], encoding="utf-8"))


def ts(ms):
    return f"{ms // 3600000:02}:{ms % 3600000 // 60000:02}:{ms % 60000 // 1000:02},{ms % 1000:03}"


lines, cur = [], []
for w in d["words"]:
    cur.append(w)
    if len(cur) >= 4 or w["text"][-1] in ".,?:!":
        lines.append(cur)
        cur = []
if cur:
    lines.append(cur)
with open(sys.argv[2], "w", encoding="utf-8") as f:
    f.write("\n".join(f"{i}\n{ts(l[0]['startMs'])} --> {ts(l[-1]['endMs'])}\n{' '.join(x['text'] for x in l)}\n" for i, l in enumerate(lines, 1)))
print(len(lines), "subtítulos")
