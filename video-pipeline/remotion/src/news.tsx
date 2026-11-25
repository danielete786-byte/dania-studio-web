/**
 * Piezas comunes del formato "noticia en menos de un minuto".
 * Úsalas en scenes.tsx: TechBackdrop, NewsBar, HookBadge, Lema, Poll, Counter, CodeWindow.
 */
import React from "react";
import * as SI from "simple-icons";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { CommentBubble } from "./art";
import { MaskLine, TopBar } from "./components";
import { C, clamp, EASE_IN, EASE_MOVE, FONT_BODY, FONT_HEAD, popSpring, ramp, wordF } from "./lib";

export type SceneProps = { dur: number; startMs: number };
export type SceneDef = { key: string; firstSeg: string; C: React.FC<SceneProps>; flash?: string };
export const MONO = "'DejaVu Sans Mono', 'Liberation Mono', monospace";

// ---------- fondo tecnológico: rejilla + pistas de circuito con pulsos ----------
export const TechBackdrop: React.FC<{ glow?: string; hue?: string }> = ({ glow = C.nv, hue = "#071A2E" }) => {
  const frame = useCurrentFrame();
  const traces = Array.from({ length: 9 }, (_, i) => {
    const y = 160 + i * 205 + random(`ty${i}`) * 60;
    const x1 = random(`tx${i}`) * 300;
    const x2 = x1 + 260 + random(`tw${i}`) * 300;
    const yy = y + (random(`td${i}`) > 0.5 ? 90 : -90);
    return { d: `M ${x1} ${y} H ${x2} L ${x2 + 90} ${yy} H 1100`, len: x2 - x1 + 130 + 1100 - x2 - 90, phase: random(`tp${i}`) };
  });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 38%, ${hue} 0%, ${C.ink} 70%)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={glow} strokeOpacity="0.08" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="1080" height="1920" fill="url(#grid)" />
        {traces.map((t, i) => {
          const p = ((frame / 70 + t.phase) % 1) * t.len;
          return (
            <g key={i}>
              <path d={t.d} fill="none" stroke={glow} strokeOpacity={0.14} strokeWidth={3} />
              <path d={t.d} fill="none" stroke={glow} strokeOpacity={0.9} strokeWidth={4} strokeDasharray={`60 ${t.len}`} strokeDashoffset={-p} />
            </g>
          );
        })}
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${glow}22 0%, transparent 55%)` }} />
    </AbsoluteFill>
  );
};

// ---------- barra superior (categoría + fecha + progreso) ----------
export const NewsBar: React.FC<{ active: number; total: number; label: string; date: string }> = ({ active, total, label, date }) => (
  <TopBar
    active={active}
    total={total}
    color={C.nv}
    label={
      <>
        {label} · <span style={{ color: C.nvLight }}>{date}</span>
      </>
    }
  />
);

// ---------- etiqueta del gancho (p. ej. "ÚLTIMA HORA") ----------
export const HookBadge: React.FC<{ label: string; date: string; color?: string; blink?: boolean }> = ({ label, date, color = C.red, blink = true }) => {
  const frame = useCurrentFrame();
  const on = !blink || Math.floor(frame / 8) % 2 === 0;
  return (
    <div style={{ position: "absolute", left: 80, top: 120, display: "flex", gap: 16, alignItems: "center" }}>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 34, color: C.white, background: color, padding: "8px 18px", borderRadius: 8, letterSpacing: "0.1em" }}>
        {blink ? <span style={{ opacity: on ? 1 : 0.35 }}>● </span> : null}
        {label}
      </div>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 800, fontSize: 30, color: C.white, opacity: 0.85 }}>{date}</div>
    </div>
  );
};

// ---------- escena del lema: cronómetro + "TE LO CUENTO EN MENOS DE 1 MINUTO" ----------
export const Lema: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sweep = interpolate(frame, [0, dur], [0, 1], { ...clamp, easing: EASE_MOVE });
  const R = 230;
  const L = 2 * Math.PI * R;
  return (
    <AbsoluteFill>
      <TechBackdrop hue={C.ink} />
      <div style={{ position: "absolute", left: 540 - 280, top: 300, width: 560, height: 560, scale: String(popSpring(frame, fps, 0)) }}>
        <svg width={560} height={600} viewBox="0 -40 560 600">
          <rect x="250" y="-38" width="60" height="40" rx="8" fill={C.white} />
          <circle cx="280" cy="280" r={R + 24} fill="#0a0f18" stroke={C.white} strokeWidth="10" />
          <circle cx="280" cy="280" r={R} fill="none" stroke="#222a33" strokeWidth="34" />
          <circle cx="280" cy="280" r={R} fill="none" stroke={C.nv} strokeWidth="34" strokeDasharray={L} strokeDashoffset={L * (1 - sweep * 0.92)} transform="rotate(-90 280 280)" strokeLinecap="round" />
          {Array.from({ length: 12 }, (_, i) => (
            <line key={i} x1="280" y1="70" x2="280" y2="95" stroke={C.white} strokeWidth="6" transform={`rotate(${i * 30} 280 280)`} />
          ))}
          <line x1="280" y1="280" x2="280" y2="110" stroke={C.red} strokeWidth="10" strokeLinecap="round" transform={`rotate(${sweep * 330} 280 280)`} />
          <circle cx="280" cy="280" r="18" fill={C.red} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 920, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <MaskLine delay={0} size={104} shadow={C.ink}>
          Te lo cuento en
        </MaskLine>
        <div style={{ marginTop: 10, fontFamily: FONT_HEAD, fontSize: 120, color: C.ink, background: C.nv, padding: "0 30px 10px", rotate: "-2deg", scale: String(popSpring(frame, fps, 6)), boxShadow: `0 0 50px ${C.nv}` }}>
          MENOS DE 1 MINUTO
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- cierre con encuesta Sí/No + burbuja de comentario ----------
export const Poll: React.FC<SceneProps & { line1: string; line2: string; segId: string; commentWord?: string; footer?: string; bar?: React.ReactNode; size1?: number; size2?: number }> = ({
  startMs,
  line1,
  line2,
  segId,
  commentWord = "comentarios",
  footer,
  bar,
  size1 = 170,
  size2 = 180,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fCom = wordF(segId, commentWord, startMs);
  return (
    <AbsoluteFill>
      <TechBackdrop />
      {bar}
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
        <MaskLine delay={0} size={size1} shadow={C.ink}>
          {line1}
        </MaskLine>
        <MaskLine delay={4} size={size2} color={C.nvLight} shadow={C.ink}>
          {line2}
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 760, display: "flex", gap: 40, justifyContent: "center" }}>
        {[
          { t: "SÍ", c: C.nv },
          { t: "NO", c: C.red },
        ].map((b, i) => (
          <div
            key={b.t}
            style={{
              width: 360,
              height: 200,
              borderRadius: 30,
              background: b.c,
              color: C.white,
              fontFamily: FONT_HEAD,
              fontSize: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              scale: String(popSpring(frame, fps, 8 + i * 4) * (1 + 0.03 * Math.sin((frame + i * 10) / 5))),
              boxShadow: `0 0 40px ${b.c}`,
            }}
          >
            {b.t}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 540 - 110, top: 1010, scale: String(popSpring(frame, fps, fCom - 2)), rotate: `${Math.sin(frame / 5) * 5}deg` }}>
        <CommentBubble w={220} />
      </div>
      {footer ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1225, textAlign: "center", fontFamily: FONT_BODY, fontWeight: 800, fontSize: 28, color: C.white, opacity: ramp(frame, 10, 10) * 0.75 }}>
          {footer}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---------- contador animado (−23 %, +10 %, 75.000…) ----------
export const Counter: React.FC<{
  from: number;
  to: number;
  start: number;
  dur: number;
  prefix?: string;
  suffix?: string;
  color: string;
  size: number;
  format?: (v: number) => string;
  style?: React.CSSProperties;
}> = ({ from, to, start, dur, prefix = "", suffix = "", color, size, format, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < start) return null;
  const v = interpolate(frame, [start, start + dur], [from, to], { ...clamp, easing: EASE_IN });
  const s = popSpring(frame, fps, start);
  return (
    <div style={{ position: "absolute", fontFamily: FONT_HEAD, fontSize: size, color, textShadow: `6px 6px 0 ${C.ink}`, scale: String(interpolate(s, [0, 1], [0.5, 1])), ...style }}>
      {prefix}
      {format ? format(v) : Math.round(v).toLocaleString("es-ES").replace(/\s/g, ".")}
      {suffix}
    </div>
  );
};

// ---------- ventana de código que se escribe sola ----------
export const CodeWindow: React.FC<{ lines: { t: string; c?: string }[]; start: number; cps?: number; width: number; title?: string; size?: number }> = ({
  lines,
  start,
  cps = 2.2,
  width,
  title = "Video.tsx",
  size = 34,
}) => {
  const frame = useCurrentFrame();
  let budget = Math.max(0, (frame - start) * cps);
  return (
    <div style={{ width, background: "#0B1220", borderRadius: 22, border: `3px solid ${C.nv}`, boxShadow: `0 0 50px ${C.nv}55, 0 30px 60px rgba(0,0,0,0.6)`, overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "14px 20px", background: "#111b2e" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
        ))}
        <div style={{ marginLeft: 14, fontFamily: MONO, fontSize: 24, color: "#8aa0c0" }}>{title}</div>
      </div>
      <div style={{ padding: "18px 26px 24px", fontFamily: MONO, fontSize: size, lineHeight: 1.45, color: "#d6e2ff", whiteSpace: "pre" }}>
        {lines.map((l, i) => {
          const n = Math.min(l.t.length, Math.floor(budget));
          budget -= l.t.length;
          return (
            <div key={i} style={{ color: l.c ?? "#d6e2ff", minHeight: size * 1.45 }}>
              {l.t.slice(0, n)}
              {n > 0 && n < l.t.length ? <span style={{ background: C.nvLight, color: C.nvLight }}>▌</span> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- logos reales de marcas (paquete simple-icons, CC0; las marcas son de sus dueños) ----------
// Úsalos solo para IDENTIFICAR a la empresa de la noticia: sin deformarlos, recolorearlos de forma rara
// ni sugerir patrocinio. Si una marca no está en el paquete, se muestra su nombre escrito.
type SiIcon = { slug: string; title: string; hex: string; path: string };
const ICONS: SiIcon[] = (Object.values(SI) as unknown[]).filter((x): x is SiIcon => !!x && typeof x === "object" && "slug" in (x as object) && "path" in (x as object));
export const brandIcon = (slug: string) => ICONS.find((i) => i.slug === slug);
const isDark = (hex: string) => {
  const n = parseInt(hex, 16);
  return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114 < 60;
};
export const BrandLogo: React.FC<{ slug: string; size: number; color?: string; style?: React.CSSProperties }> = ({ slug, size, color, style }) => {
  const icon = brandIcon(slug);
  if (!icon)
    return <div style={{ fontFamily: FONT_HEAD, fontSize: size * 0.5, color: color ?? C.white, lineHeight: 1, ...style }}>{slug.toUpperCase()}</div>;
  const fill = color ?? (isDark(icon.hex) ? "#FFFFFF" : `#${icon.hex}`);
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={style} role="img" aria-label={icon.title}>
      <path d={icon.path} fill={fill} />
    </svg>
  );
};
