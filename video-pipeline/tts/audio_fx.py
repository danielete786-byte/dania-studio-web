"""Música synthwave original + efectos de sonido sintetizados (sin samples externos).

Uso: python audio_fx.py <out_dir> <duracion_musica_seg>
"""
import sys, os
import numpy as np
import soundfile as sf
from scipy import signal

SR = 48000
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(d * SR)) / SR


def env_ad(n, a, d_curve=6.0):
    """Ataque lineal (a seg) + caída exponencial hasta el final."""
    e = np.ones(n)
    na = max(1, int(a * SR))
    e[:na] = np.linspace(0, 1, na)
    rest = n - na
    if rest > 0:
        e[na:] = np.exp(-d_curve * np.linspace(0, 1, rest))
    return e


def lp(x, fc, order=4):
    b, a = signal.butter(order, min(fc, SR / 2 - 100) / (SR / 2), "low")
    return signal.lfilter(b, a, x)


def hp(x, fc, order=4):
    b, a = signal.butter(order, fc / (SR / 2), "high")
    return signal.lfilter(b, a, x)


def bp(x, lo, hi, order=2):
    b, a = signal.butter(order, [lo / (SR / 2), hi / (SR / 2)], "band")
    return signal.lfilter(b, a, x)


def saw(f, tt, detune=0.0):
    ph = (f * (1 + detune)) * tt
    return 2 * (ph - np.floor(ph + 0.5))


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) + 1e-9
    return x / m * peak


def simple_reverb(x, mix=0.25, decay=0.5):
    out = x.copy()
    for d_ms, g in [(29, 0.6), (37, 0.55), (53, 0.5), (71, 0.45), (97, 0.4), (131, 0.35)]:
        d = int(d_ms / 1000 * SR)
        y = np.zeros_like(x)
        y[d:] = x[:-d] * g * decay
        out += y * mix
    return out


# ---------------------------------------------------------------- música
def note(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def music(duration, bpm=108):
    beat = 60 / bpm
    n = int(duration * SR)
    mixL = np.zeros(n)
    kick_env = np.zeros(n)

    # progresión Am - F - C - G (un compás por acorde)
    chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
    roots = [45, 41, 48, 43]
    bar = 4 * beat
    nbars = int(np.ceil(duration / bar)) + 1

    def add(sig, start):
        s = int(start * SR)
        if s >= n:
            return
        e = min(n, s + len(sig))
        mixL[s:e] += sig[: e - s]

    # kick
    kt = t(0.45)
    f_sweep = 45 + 110 * np.exp(-kt * 28)
    kick = np.sin(2 * np.pi * np.cumsum(f_sweep) / SR) * env_ad(len(kt), 0.002, 7)
    kick += 0.3 * lp(rng.standard_normal(len(kt)), 3000) * env_ad(len(kt), 0.0005, 80)
    # snare/clap
    st_ = t(0.35)
    snare = 0.7 * bp(rng.standard_normal(len(st_)), 900, 7000) * env_ad(len(st_), 0.001, 12)
    snare += 0.4 * np.sin(2 * np.pi * 190 * st_) * env_ad(len(st_), 0.001, 25)
    snare = simple_reverb(snare, 0.5)
    # hats
    ht = t(0.06)
    hat = hp(rng.standard_normal(len(ht)), 7500) * env_ad(len(ht), 0.0005, 30)

    intro_bars = 1  # primer compás sin batería completa (pero arranca con energía)
    for b in range(nbars):
        bt = b * bar
        ci = b % 4
        for k in range(4):
            if b >= intro_bars or k >= 2:
                add(0.95 * kick, bt + k * beat)
                s = int((bt + k * beat) * SR)
                kick_env[s: s + int(0.25 * SR)] = 1.0
            if k in (1, 3) and b >= intro_bars:
                add(0.45 * snare, bt + k * beat)
        for k in range(8):
            if b >= intro_bars:
                add((0.16 if k % 2 else 0.09) * hat, bt + k * beat / 2)
        # bajo en corcheas
        for k in range(8):
            d = beat / 2 * 0.9
            tt = t(d)
            f = note(roots[ci] - 12 + (12 if k % 2 else 0))
            bs = 0.5 * saw(f, tt) + 0.5 * saw(f, tt, 0.004)
            bs = lp(bs, 900) * env_ad(len(tt), 0.004, 3)
            add(0.38 * bs, bt + k * beat / 2)
        # pad
        tt = t(bar)
        pad = np.zeros(len(tt))
        for m in chords[ci]:
            for dt in (-0.006, 0.0, 0.007):
                pad += saw(note(m), tt, dt)
        pad = lp(pad, 1800, 2)
        pe = np.minimum(1, tt / 0.25) * np.minimum(1, (bar - tt) / 0.2)
        add(0.06 * pad * pe, bt)
        # arpegio en semicorcheas
        if b >= intro_bars:
            arp_notes = chords[ci] + [chords[ci][0] + 12]
            for k in range(16):
                m = arp_notes[[0, 1, 2, 3, 2, 1, 2, 3][k % 8]] + 12
                d = beat / 4 * 0.8
                tt = t(d)
                sq = np.sign(np.sin(2 * np.pi * note(m) * tt)) * 0.5 + 0.5 * saw(note(m), tt)
                sq = lp(sq, 3500) * env_ad(len(tt), 0.002, 5)
                add(0.07 * sq, bt + k * beat / 4)

    # sidechain (bombeo) con la caída del kick
    sc = np.ones(n)
    kick_starts = np.where(np.diff(np.concatenate([[0], kick_env])) > 0)[0]
    pump = 1 - 0.55 * np.exp(-np.linspace(0, 1, int(0.22 * SR)) * 5)
    for s in kick_starts:
        e = min(n, s + len(pump))
        sc[s:e] = np.minimum(sc[s:e], pump[: e - s])
    # aplicamos el bombeo a todo menos al propio kick: aproximación, suficiente para un lecho
    mix = mixL * (0.6 + 0.4 * sc)
    # eco estéreo ligero
    d = int(beat * 0.75 * SR)
    left = mix.copy()
    right = mix.copy()
    right[d:] += 0.18 * mix[:-d]
    left[d // 2:] += 0.12 * mix[: -d // 2]
    st = np.stack([left, right], 1)
    # fade out final
    fo = int(1.5 * SR)
    st[-fo:] *= np.linspace(1, 0, fo)[:, None]
    return norm(st, 0.8)


# ---------------------------------------------------------------- SFX
def whoosh(d=0.55, up=True):
    tt = t(d)
    x = rng.standard_normal(len(tt))
    out = np.zeros_like(x)
    # barrido de filtro por bloques
    blocks = 40
    L = len(x) // blocks
    for i in range(blocks):
        p = i / blocks
        fc = 300 + (5000 if up else 3000) * (p if up else (1 - p)) ** 1.5
        seg = bp(x[i * L:(i + 1) * L + 200], fc * 0.6, min(fc * 1.6, 20000))
        out[i * L:i * L + len(seg[:L])] = seg[:L]
    e = np.sin(np.pi * np.linspace(0, 1, len(tt))) ** 1.5
    return norm(out * e, 0.8)


def impact(d=1.4):
    tt = t(d)
    f = 30 + 70 * np.exp(-tt * 6)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(tt), 0.003, 4)
    crack = lp(rng.standard_normal(len(tt)), 6000) * env_ad(len(tt), 0.001, 30)
    x = sub + 0.5 * crack
    return norm(simple_reverb(x, 0.4), 0.95)


def riser(d=1.6):
    tt = t(d)
    x = bp(rng.standard_normal(len(tt)), 800, 9000)
    f = 200 + 1400 * (tt / d) ** 2
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR)
    e = (tt / d) ** 2.2
    return norm((0.7 * x + 0.3 * tone) * e, 0.8)


def pop(d=0.12):
    tt = t(d)
    f = 900 * np.exp(-tt * 25) + 300
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_ad(len(tt), 0.001, 12)
    return norm(x, 0.7)


def ding(d=1.2):
    tt = t(d)
    x = np.zeros(len(tt))
    for k, (r, g) in enumerate([(1, 1), (2.76, 0.5), (5.4, 0.25), (8.93, 0.12)]):
        x += g * np.sin(2 * np.pi * 1318.5 * r * tt) * np.exp(-tt * (3 + 3 * k))
    return norm(x, 0.6)


def glitch(d=0.35):
    tt = t(d)
    x = rng.standard_normal(len(tt))
    # cuantizado + puertas aleatorias
    x = np.round(x * 3) / 3
    gate = np.repeat(rng.random(int(d * 60)) > 0.45, int(SR / 60) + 1)[: len(tt)]
    tone = np.sign(np.sin(2 * np.pi * 180 * tt * (1 + 3 * (rng.random() > 0.5))))
    return norm(bp(x * 0.6 + tone * 0.4, 200, 9000) * gate, 0.6)


def shutter(d=0.25):
    tt = t(d)
    x = hp(rng.standard_normal(len(tt)), 2000)
    e = np.zeros(len(tt))
    for s in (0.0, 0.07):
        i = int(s * SR)
        n = int(0.05 * SR)
        e[i:i + n] += np.exp(-np.linspace(0, 8, n))
    return norm(x * e, 0.7)


def cash(d=0.9):
    a = ding(0.9) * 0.6
    tt = t(d)
    coins = np.zeros(len(tt))
    for s in rng.uniform(0.05, 0.5, 9):
        i = int(s * SR)
        n = int(0.06 * SR)
        f = rng.uniform(3500, 6000)
        coins[i:i + n] += np.sin(2 * np.pi * f * np.arange(n) / SR) * np.exp(-np.linspace(0, 6, n))
    return norm(a + 0.5 * coins, 0.7)


if __name__ == "__main__":
    out = sys.argv[1]
    dur = float(sys.argv[2])
    os.makedirs(out, exist_ok=True)
    sf.write(f"{out}/music.wav", music(dur), SR)
    for name, fn in [("whoosh", lambda: whoosh(0.55, True)), ("whoosh_down", lambda: whoosh(0.5, False)),
                     ("impact", impact), ("riser", riser), ("pop", pop), ("ding", ding),
                     ("glitch", glitch), ("shutter", shutter), ("cash", cash)]:
        sf.write(f"{out}/{name}.wav", fn(), SR)
    print("ok")
