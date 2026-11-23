import React from "react";
import { createTikTokStyleCaptions } from "@remotion/captions";
import {
  AbsoluteFill,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, clamp, EASE_IN, EASE_OUT, FONT_BODY, FONT_HAND, FONT_HEAD, popSpring, ramp, TL } from "./lib";

// ---------------- Fondo con Ken Burns ----------------
export const Bg: React.FC<{
  src: string;
  from?: number;
  to?: number;
  x?: [number, number];
  y?: [number, number];
  dim?: number;
  blur?: number;
  tint?: string;
  dur: number;
  objectPosition?: string;
}> = ({ src, from = 1.08, to = 1.22, x = [0, 0], y = [0, 0], dim = 0.45, blur = 0, tint, dur, objectPosition = "center" }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, dur], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.night }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          scale: String(interpolate(p, [0, 1], [from, to])),
          translate: `${interpolate(p, [0, 1], x)}px ${interpolate(p, [0, 1], y)}px`,
          filter: `blur(${blur}px) saturate(1.15)`,
        }}
      />
      {tint ? <AbsoluteFill style={{ backgroundColor: tint, mixBlendMode: "multiply" }} /> : null}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(11,6,24,${dim + 0.2}) 0%, rgba(11,6,24,${dim * 0.6}) 35%, rgba(11,6,24,${dim}) 60%, rgba(11,6,24,${Math.min(0.95, dim + 0.35)}) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------- Grano + viñeta + scanlines ----------------
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = frame % 8;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.12, mixBlendMode: "overlay" }}>
        <filter id={`n${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#n${seed})`} />
      </svg>
      <AbsoluteFill
        style={{
          background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.10) 0px, rgba(0,0,0,0.10) 2px, transparent 2px, transparent 5px)",
          opacity: 0.35,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.65) 100%)" }} />
    </AbsoluteFill>
  );
};

// ---------------- Sol retro + rejilla (ambiental) ----------------
export const RetroGrid: React.FC<{ opacity?: number; top?: number; color?: string }> = ({ opacity = 0.5, top = 1180, color = C.pink }) => {
  const frame = useCurrentFrame();
  const off = (frame * 4) % 80;
  const lines = Array.from({ length: 14 }, (_, i) => i);
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="gridfade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} stopOpacity="0" />
            <stop offset="1" stopColor={color} stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {lines.map((i) => {
          const yy = top + Math.pow((i * 80 + off) / 1120, 2) * (1920 - top);
          return <line key={i} x1={0} x2={1080} y1={yy} y2={yy} stroke="url(#gridfade)" strokeWidth={2} />;
        })}
        {Array.from({ length: 17 }, (_, i) => i - 8).map((i) => (
          <line key={"v" + i} x1={540 + i * 40} y1={top} x2={540 + i * 260} y2={1920} stroke="url(#gridfade)" strokeWidth={2} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// ---------------- Badge de número (#1…#5) ----------------
export const Badge: React.FC<{ n: number; delay?: number; color?: string }> = ({ n, delay = 0, color = C.pink }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = popSpring(frame, fps, delay);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        top: 230,
        display: "flex",
        alignItems: "center",
        gap: 20,
        scale: String(interpolate(s, [0, 1], [0.3, 1])),
        rotate: `${interpolate(s, [0, 1], [-25, -6])}deg`,
        opacity: interpolate(s, [0, 0.2], [0, 1], clamp),
        transformOrigin: "left center",
      }}
    >
      <div
        style={{
          fontFamily: FONT_HEAD,
          fontSize: 150,
          lineHeight: 1,
          color: C.white,
          padding: "6px 30px 14px",
          background: color,
          boxShadow: `10px 10px 0 ${C.night}, 0 0 60px ${color}`,
          borderRadius: 12,
        }}
      >
        #{n}
      </div>
    </div>
  );
};

// ---------------- Titular con revelado por máscara ----------------
export const MaskLine: React.FC<{
  children: React.ReactNode;
  delay: number;
  size?: number;
  color?: string;
  stroke?: string;
  shadow?: string;
  font?: string;
  style?: React.CSSProperties;
}> = ({ children, delay, size = 120, color = C.white, shadow = C.pink, font = FONT_HEAD, style }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, delay, 9);
  return (
    <div style={{ overflow: "hidden", paddingBottom: 8, ...style }}>
      <div
        style={{
          fontFamily: font,
          fontSize: size,
          lineHeight: 1.02,
          color,
          textTransform: "uppercase",
          letterSpacing: "-0.01em",
          translate: `0 ${interpolate(p, [0, 1], [110, 0])}%`,
          textShadow: `6px 6px 0 ${shadow}`,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ---------------- Sello (stamp) ----------------
export const Stamp: React.FC<{
  text: string;
  delay: number;
  color?: string;
  rotate?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({ text, delay, color = C.red, rotate = -8, size = 78, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = popSpring(frame, fps, delay);
  if (frame < delay) return null;
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: FONT_HEAD,
        fontSize: size,
        color,
        border: `8px solid ${color}`,
        padding: "4px 26px 10px",
        borderRadius: 10,
        textTransform: "uppercase",
        rotate: `${rotate}deg`,
        scale: String(interpolate(s, [0, 1], [2.4, 1])),
        opacity: interpolate(s, [0, 0.3], [0, 1], clamp),
        background: "rgba(11,6,24,0.55)",
        whiteSpace: "nowrap",
        boxShadow: `0 0 40px ${color}55`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// ---------------- Etiqueta / chip ----------------
export const Chip: React.FC<{
  text: string;
  delay: number;
  color?: string;
  textColor?: string;
  size?: number;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
}> = ({ text, delay, color = C.cyan, textColor = C.night, size = 44, style, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = popSpring(frame, fps, delay);
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: FONT_BODY,
        fontWeight: 900,
        fontSize: size,
        color: textColor,
        background: color,
        padding: "12px 26px",
        borderRadius: 999,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        scale: String(interpolate(s, [0, 1], [0.4, 1])),
        opacity: interpolate(s, [0, 0.25], [0, 1], clamp),
        boxShadow: `0 10px 30px rgba(0,0,0,0.45)`,
        ...style,
      }}
    >
      {icon}
      {text}
    </div>
  );
};

// ---------------- Texto manuscrito ----------------
export const Hand: React.FC<{ text: string; delay: number; size?: number; color?: string; style?: React.CSSProperties; rotate?: number }> = ({
  text,
  delay,
  size = 56,
  color = C.yellow,
  style,
  rotate = -4,
}) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, delay, 12);
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: FONT_HAND,
        fontSize: size,
        color,
        rotate: `${rotate}deg`,
        clipPath: `inset(-20% ${interpolate(p, [0, 1], [100, -5])}% -20% -5%)`,
        whiteSpace: "nowrap",
        textShadow: "3px 3px 0 rgba(0,0,0,0.6)",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// ---------------- Flash de transición ----------------
export const Flash: React.FC<{ color?: string }> = ({ color = C.pink }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 2, 8], [0.85, 0.6, 0], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #fff 0%, ${color} 45%, transparent 80%)`, opacity: o }} />
    </AbsoluteFill>
  );
};

// ---------------- Barra superior: marca + progreso ----------------
export const TopBar: React.FC<{ active: number; label?: React.ReactNode; total?: number; color?: string }> = ({ active, label, total = 5, color = C.pink }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 110, display: "flex", alignItems: "center", gap: 18 }}>
      <div
        style={{
          fontFamily: FONT_BODY,
          fontWeight: 900,
          fontSize: 30,
          color: C.white,
          letterSpacing: "0.12em",
          background: "rgba(11,6,24,0.6)",
          border: `3px solid ${color}`,
          padding: "8px 18px",
          borderRadius: 10,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
      <div style={{ flex: 1, display: "flex", gap: 10 }}>
        {Array.from({ length: total }, (_, k) => k + 1).map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 12,
              borderRadius: 6,
              background: i <= active ? color : "rgba(255,255,255,0.25)",
              boxShadow: i === active ? `0 0 ${14 + 6 * Math.sin(frame / 4)}px ${color}` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ---------------- Subtítulos palabra a palabra ----------------
const { pages } = createTikTokStyleCaptions({
  captions: TL.words.map((w) => ({ text: " " + w.text, startMs: w.startMs, endMs: w.endMs, timestampMs: w.startMs, confidence: 1 })),
  combineTokensWithinMilliseconds: 900,
});

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const page = pages.find((p, i) => ms >= p.startMs && ms < (pages[i + 1]?.startMs ?? p.startMs + p.durationMs + 400) && ms < p.startMs + p.durationMs + 400);
  if (!page) return null;
  const pageStartF = Math.round((page.startMs / 1000) * fps);
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 140,
        top: 1290,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignContent: "flex-start",
        columnGap: 24,
        rowGap: 0,
      }}
    >
      {page.tokens.map((tk, i) => {
        const tf = Math.round((tk.fromMs / 1000) * fps);
        const s = spring({ frame: frame - tf, fps, config: { damping: 15, stiffness: 220, mass: 0.6 } });
        const active = ms >= tk.fromMs && ms < tk.toMs + 60;
        const visible = frame >= tf || frame - pageStartF < 0;
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT_BODY,
              fontWeight: 900,
              fontSize: 76,
              lineHeight: 1.15,
              textTransform: "uppercase",
              color: active ? C.yellow : C.white,
              WebkitTextStroke: "3px #000",
              paintOrder: "stroke fill",
              textShadow: "0 6px 0 rgba(0,0,0,0.85), 0 0 24px rgba(0,0,0,0.6)",
              opacity: visible ? 1 : 0,
              scale: String(interpolate(s, [0, 1], [0.7, 1])),
              translate: `0 ${interpolate(s, [0, 1], [18, 0])}px`,
              display: "inline-block",
            }}
          >
            {tk.text.trim()}
          </span>
        );
      })}
    </div>
  );
};

// ---------------- Temblor (pattern interrupt) ----------------
export const useShake = (at: number, dur = 10, amp = 18) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > at + dur) return { x: 0, y: 0 };
  const k = 1 - (frame - at) / dur;
  return { x: (random(`sx${frame}`) - 0.5) * 2 * amp * k, y: (random(`sy${frame}`) - 0.5) * 2 * amp * k };
};

// punch-in de cámara (escala) en un instante
export const punch = (frame: number, fps: number, at: number, amount = 0.1) => {
  const s = popSpring(frame, fps, at);
  const decay = interpolate(frame, [at, at + 18], [1, 0.35], clamp);
  return 1 + amount * s * decay;
};

export const fadeOut = (frame: number, end: number, dur = 6) => interpolate(frame, [end - dur, end], [1, 0], { ...clamp, easing: EASE_OUT });
export const fadeIn = (frame: number, start: number, dur = 8) => interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: EASE_IN });
