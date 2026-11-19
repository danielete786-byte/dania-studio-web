#!/usr/bin/env python3
"""Valida leonida/data.json antes de publicarlo. Uso: python3 -I tools/validate-leonida.py leonida/data.json
Sale con código 1 si algo no cumple las reglas: entonces NO se debe hacer commit ni push."""
import json, re, sys, pathlib
from urllib.parse import urlparse

data_path = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "leonida/data.json")
sources = json.loads((data_path.parent / "sources.json").read_text(encoding="utf-8"))
domains = [d.lower() for d in sources["newsDomains"]]
errors = []

def host_ok(url):
    try:
        u = urlparse(url)
    except Exception:
        return False
    h = (u.hostname or "").lower()
    return u.scheme == "https" and not u.username and not u.password and any(h == d or h.endswith("." + d) for d in domains)

DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
BAD = re.compile(r"<\s*/?\s*(script|iframe|object|embed|style|svg|img|a)\b|javascript:|on\w+\s*=", re.I)
TAGS = {"Lanzamiento", "Análisis", "Tráiler", "Música", "Evento", "Actualización", "Online", "Ventas", "Imágenes", "Negocio"}

try:
    d = json.loads(data_path.read_text(encoding="utf-8"))
except Exception as e:
    print("JSON inválido:", e); sys.exit(1)

if set(d) - {"updatedAt", "metascore", "news", "videos"}:
    errors.append(f"claves inesperadas: {set(d) - {'updatedAt','metascore','news','videos'}}")
if not isinstance(d.get("metascore"), (int, type(None))) or (d.get("metascore") or 0) > 100:
    errors.append("metascore fuera de rango")
news = d.get("news", [])
if not isinstance(news, list) or len(news) > 150:
    errors.append("news debe ser una lista de máximo 150")
for i, n in enumerate(news):
    where = f"news[{i}] ({n.get('title','?')[:40]})"
    for k, lim in (("title", 160), ("summary", 600), ("source", 60)):
        v = n.get(k)
        if not isinstance(v, str) or not v.strip() or len(v) > lim:
            errors.append(f"{where}: campo {k} vacío o demasiado largo")
        elif BAD.search(v):
            errors.append(f"{where}: campo {k} contiene HTML o código")
    if not DATE.match(str(n.get("date", ""))):
        errors.append(f"{where}: fecha inválida")
    if n.get("tag") not in TAGS:
        errors.append(f"{where}: tag no permitido ({n.get('tag')})")
    if not host_ok(n.get("url", "")):
        errors.append(f"{where}: URL fuera de la lista blanca o no https ({n.get('url')})")
for i, v in enumerate(d.get("videos", [])):
    if not re.fullmatch(r"[A-Za-z0-9_-]{11}", str(v.get("youtubeId", ""))):
        errors.append(f"videos[{i}]: youtubeId inválido")
    if v.get("channel") != sources["videoChannel"]:
        errors.append(f"videos[{i}]: canal no oficial ({v.get('channel')})")
    if not isinstance(v.get("title"), str) or len(v["title"]) > 160 or BAD.search(v["title"]):
        errors.append(f"videos[{i}]: título inválido")

if errors:
    print("VALIDACIÓN FALLIDA:"); [print(" -", e) for e in errors]; sys.exit(1)
print(f"OK: {len(news)} noticias y {len(d.get('videos', []))} vídeos válidos")
