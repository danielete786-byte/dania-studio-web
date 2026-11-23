import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, spring, staticFile } from "remotion";
import timeline from "./data/timeline.json";
import { THEME } from "./theme";

// ---------- paleta Vice City (propia) ----------
export const C = {
  pink: "#FF2E88",
  orange: "#FF8A3D",
  cyan: "#22E4FF",
  yellow: "#FFD23F",
  purple: "#2A0F4A",
  night: "#0B0618",
  green: "#3DFF9A",
  red: "#FF3B3B",
  white: "#FFFFFF",
  nv: THEME.accent, // acento principal (ver theme.ts)
  nvLight: THEME.accentLight,
  ink: "#050807",
};

export const FONT_HEAD = "Anton";
export const FONT_BODY = "Montserrat";
export const FONT_HAND = "PermanentMarker";

loadFont({ family: FONT_HEAD, url: staticFile("fonts/anton.woff2") });
loadFont({ family: FONT_BODY, url: staticFile("fonts/montserrat-900.woff2"), weight: "900" });
loadFont({ family: FONT_BODY, url: staticFile("fonts/montserrat-800.woff2"), weight: "800" });
loadFont({ family: FONT_HAND, url: staticFile("fonts/marker.woff2") });

// ---------- lenguaje de movimiento (Energetic) ----------
export const EASE_IN = Easing.bezier(0.16, 1, 0.3, 1); // entradas
export const EASE_OUT = Easing.bezier(0.7, 0, 0.84, 0); // salidas
export const EASE_MOVE = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_POP = Easing.bezier(0.34, 1.56, 0.64, 1);

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const popSpring = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 11, stiffness: 180, mass: 0.7 } });

export const softSpring = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 200 } });

export const ramp = (frame: number, start: number, dur: number, ease = EASE_IN) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: ease });

// ---------- línea de tiempo de la voz ----------
export type Word = { text: string; startMs: number; endMs: number };
export type Seg = { id: string; startMs: number; endMs: number };
export const TL = timeline as { durationMs: number; segments: Seg[]; words: Word[] };

export const FPS = 30;
export const msToF = (ms: number) => Math.round((ms / 1000) * FPS);

export const seg = (id: string): Seg => {
  const s = TL.segments.find((x) => x.id === id);
  if (!s) throw new Error("segment not found " + id);
  return s;
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");

/**
 * Fotograma (relativo a `sceneStartMs`) en el que empieza la palabra `q`
 * dentro del segmento `segId`. `nth` elige la enésima coincidencia.
 */
export const wordF = (segId: string, q: string, sceneStartMs: number, nth = 0, fallbackFrac = 0.5) => {
  const s = seg(segId);
  const nq = norm(q);
  const ws = TL.words.filter((w) => w.startMs >= s.startMs - 50 && w.startMs < s.endMs + 50);
  const hits = ws.filter((w) => norm(w.text).startsWith(nq));
  const w = hits[nth] ?? hits[0];
  const ms = w ? w.startMs : s.startMs + (s.endMs - s.startMs) * fallbackFrac;
  return msToF(ms - sceneStartMs);
};
