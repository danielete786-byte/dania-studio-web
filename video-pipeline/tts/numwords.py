"""Normalización de texto y paso de cifras a palabras (para alinear guion y Whisper)."""
import re
import unicodedata
from num2words import num2words


def nk(s: str) -> str:
    """Clave normalizada: minúsculas, sin tildes ni signos."""
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", s)


_NUM = re.compile(r"^([$€]?)(\d{1,3}(?:[.,]\d{3})+|\d+)(?:[.,](\d+))?\s*(%|€|\$)?$")


def number_words(tok: str):
    """'75.000' -> ['setenta','y','cinco','mil']; '23%' -> [... 'por','ciento']; None si no es número."""
    t = tok.strip("¿?¡!.,;:«»\"'()")
    m = _NUM.match(t)
    if not m:
        return None
    pre, ent, dec, suf = m.groups()
    n = int(re.sub(r"[.,]", "", ent))
    out = num2words(n, lang="es").split()
    if dec:
        out += ["coma"] + num2words(int(dec), lang="es").split()
    if suf == "%":
        out += ["por", "ciento"]
    if "$" in (pre or "") + (suf or ""):
        out += ["dolares"]
    if "€" in (pre or "") + (suf or ""):
        out += ["euros"]
    return out


def expand_tokens(tokens):
    """Expande cifras a palabras; deja el resto igual."""
    res = []
    for w in tokens:
        nw = number_words(w)
        res.extend(nw if nw else [w])
    return res
