/**
 * HISTORIA: «La FCC aprueba Starmind: hasta 1 millón de satélites de SpaceX como centros de datos de IA» (IA · 26 nov 2026).
 * Fuentes: FCC (orden del 25 nov), NBC News, Space.com, Fox Business.
 */
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, random, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Chip, MaskLine, Stamp, punch, useShake } from "./components";
import { C, clamp, EASE_MOVE, FONT_BODY, FONT_HEAD, popSpring, ramp, softSpring, wordF } from "./lib";
import { BrandLogo, Counter, HookBadge, Lema, NewsBar, Poll, SceneDef, SceneProps } from "./news";

const DATE = "26 NOV";
const Bar: React.FC<{ active: number }> = ({ active }) => <NewsBar active={active} total={5} label="NOTICIA IA" date={DATE} />;

// ---------- espacio: estrellas + Tierra + órbitas con satélites (dibujo propio) ----------
const Space: React.FC<{ sats?: number; earthY?: number; density?: number }> = ({ sats = 60, earthY = 1750, density = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 100%, #0a2a55 0%, #030712 60%)" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="earth" cx="0.5" cy="0.35" r="0.65">
            <stop offset="0" stopColor="#2f7fd8" />
            <stop offset="0.6" stopColor="#0d3b7a" />
            <stop offset="1" stopColor="#04152e" />
          </radialGradient>
        </defs>
        {Array.from({ length: 140 }, (_, i) => (
          <circle key={i} cx={random(`sx${i}`) * 1080} cy={random(`sy${i}`) * 1920} r={random(`sr${i}`) * 2 + 0.5} fill="#fff" opacity={0.3 + 0.6 * Math.abs(Math.sin(frame / 20 + i))} />
        ))}
        {/* atmósfera + Tierra */}
        <circle cx={540} cy={earthY + 900} r={1260} fill="#3aa0ff" opacity={0.18} />
        <circle cx={540} cy={earthY + 900} r={1220} fill="url(#earth)" />
        {/* órbitas */}
        {[0, 1, 2].map((k) => (
          <ellipse key={k} cx={540} cy={earthY - 120 + k * 40} rx={620 + k * 120} ry={260 + k * 60} fill="none" stroke="#5CC2FF" strokeOpacity={0.18} strokeWidth={2} />
        ))}
        {Array.from({ length: Math.round(sats * density) }, (_, i) => {
          const k = i % 3;
          const a = random(`a${i}`) * Math.PI * 2 + frame * (0.006 + k * 0.002) * (i % 2 ? 1 : -1);
          const x = 540 + Math.cos(a) * (620 + k * 120);
          const y = earthY - 120 + k * 40 + Math.sin(a) * (260 + k * 60);
          const front = Math.sin(a) > -0.2;
          return <circle key={i} cx={x} cy={y} r={front ? 5 : 3} fill={front ? C.nvLight : "#9ccfff"} opacity={front ? 1 : 0.5} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- logo real de SpaceX + nombre ----------
const SpacexMark: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * -0.04, ...style }}>
    <BrandLogo slug="spacex" size={size} color={C.white} />
    <div style={{ fontFamily: FONT_HEAD, fontSize: size * 0.46, color: C.white, letterSpacing: "0.04em", lineHeight: 1 }}>SPACEX</div>
  </div>
);

// ---------- satélite (dibujo propio) ----------
const Satellite: React.FC<{ w: number; glow?: number }> = ({ w, glow = 0 }) => (
  <svg viewBox="0 0 400 200" width={w} height={w / 2} style={{ filter: glow ? `drop-shadow(0 0 ${30 * glow}px ${C.nv})` : undefined }}>
    {[0, 1].map((s) => (
      <g key={s} transform={`translate(${s ? 250 : 10} 50)`}>
        <rect width="140" height="100" rx="6" fill="#123a6b" stroke="#5CC2FF" strokeWidth="4" />
        {Array.from({ length: 4 }, (_, i) => (
          <line key={i} x1={28 * (i + 1)} y1="0" x2={28 * (i + 1)} y2="100" stroke="#5CC2FF" strokeOpacity="0.6" strokeWidth="2" />
        ))}
        <line x1="0" y1="50" x2="140" y2="50" stroke="#5CC2FF" strokeOpacity="0.6" strokeWidth="2" />
      </g>
    ))}
    <rect x="150" y="62" width="100" height="76" rx="12" fill="#e6eefc" />
    <rect x="172" y="80" width="56" height="40" rx="6" fill="#0b1530" />
    <text x="200" y="108" textAnchor="middle" fontFamily="Anton" fontSize="24" fill={C.nvLight}>
      IA
    </text>
    <line x1="200" y1="62" x2="200" y2="30" stroke="#e6eefc" strokeWidth="6" />
    <circle cx="200" cy="26" r="8" fill={C.yellow} />
  </svg>
);

// =====================================================================
// 1. GANCHO
// =====================================================================
const Hook: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("hook", q, startMs);
  const fSat = w("satelites");
  const fSpx = w("spacex");
  const fEsp = w("espacio");
  const z = punch(frame, fps, fSpx, 0.05);
  return (
    <AbsoluteFill style={{ scale: String(z) }}>
      <Space sats={90} density={interpolate(frame, [0, fSat + 10], [0.3, 1], clamp)} />
      <HookBadge label="ÚLTIMA HORA" date="26 NOV 2026" />
      <div style={{ position: "absolute", left: 80, top: 230 }}>
        <MaskLine delay={-9} size={110} shadow={C.ink}>
          Luz verde a
        </MaskLine>
        <MaskLine delay={-5} size={200} color={C.nvLight} shadow={C.ink}>
          1 millón
        </MaskLine>
        <MaskLine delay={fSat - 4} size={110} shadow={C.ink}>
          de satélites
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 80, top: 790, display: "flex", alignItems: "center", gap: 24, scale: String(popSpring(frame, fps, fSpx - 2)), opacity: frame >= fSpx - 2 ? 1 : 0 }}>
        <SpacexMark size={260} />
      </div>
      <Chip text="IA en el espacio" delay={fEsp - 4} color={C.nv} textColor={C.white} size={46} style={{ left: 80, top: 1000 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. QUÉ ES: Starmind, centros de datos en órbita
// =====================================================================
const Que: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("que", q, startMs);
  const fApr = w("aprobo");
  const fStar = w("starmind");
  const fCen = w("centros");
  const fSol = w("solar");
  const sat = softSpring(frame, fps, fStar - 6);
  return (
    <AbsoluteFill>
      <Space sats={50} earthY={1900} />
      <Bar active={1} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 236, textAlign: "center" }}>
        <MaskLine delay={0} size={66} shadow={C.ink}>
          El regulador de EE. UU.
        </MaskLine>
      </div>
      <Stamp text="Aprobado · FCC" delay={fApr} color={C.green} size={76} rotate={-6} style={{ left: 270, top: 330 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", opacity: frame >= fStar - 4 ? 1 : 0 }}>
        <MaskLine delay={fStar - 4} size={180} color={C.nvLight} shadow={C.ink}>
          Starmind
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 540 - 300, top: 705, translate: `0 ${interpolate(sat, [0, 1], [400, 0])}px`, rotate: `${Math.sin(frame / 20) * 4}deg`, opacity: sat }}>
        <Satellite w={600} glow={ramp(frame, fCen, 10)} />
      </div>
      <Chip text="Centro de datos en órbita" delay={fCen} color={C.white} size={42} style={{ left: 120, top: 1040 }} />
      <Chip text="☀ Energía solar" delay={fSol - 4} color={C.yellow} textColor={C.ink} size={42} style={{ left: 120, top: 1150 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 4. PLAZOS: 2033 primero · 2040 el millón
// =====================================================================
const Plazos: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("plazos", q, startMs);
  const f33 = w("2033");
  const f40 = w("2040");
  const steps = [
    { y: "2033", n: "1", at: f33 },
    { y: "2035", n: "100.000", at: f33 + 14 },
    { y: "2038", n: "500.000", at: f33 + 26 },
    { y: "2040", n: "1.000.000", at: f40 },
  ];
  const line = ramp(frame, f33 - 6, Math.max(10, f40 - f33 + 6), EASE_MOVE);
  return (
    <AbsoluteFill>
      <Space sats={40} earthY={1950} />
      <Bar active={2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center" }}>
        <MaskLine delay={0} size={100} shadow={C.ink}>
          Los plazos de la FCC
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 150, top: 420, width: 10, height: 760, background: "#18304d", borderRadius: 5 }}>
        <div style={{ width: "100%", height: `${line * 100}%`, background: `linear-gradient(180deg, ${C.nv}, ${C.nvLight})`, borderRadius: 5 }} />
      </div>
      {steps.map((s, i) => {
        const sp = popSpring(frame, fps, s.at);
        const big = i === 0 || i === 3;
        return (
          <div key={s.y} style={{ position: "absolute", left: 130, top: 400 + i * 200, display: "flex", alignItems: "center", gap: 36, opacity: frame >= s.at ? 1 : 0, scale: String(interpolate(sp, [0, 1], [0.6, 1])), transformOrigin: "left center" }}>
            <div style={{ width: 50, height: 50, borderRadius: 25, background: big ? C.nvLight : C.white, boxShadow: `0 0 20px ${C.nv}` }} />
            <div>
              <div style={{ fontFamily: FONT_HEAD, fontSize: big ? 110 : 80, color: big ? C.white : "#c9d8ee", lineHeight: 1 }}>{s.y}</div>
              <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: big ? 44 : 34, color: big ? C.nvLight : "#9fb3cc" }}>
                {s.n} {s.n === "1" ? "satélite operativo" : "satélites"}
              </div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// =====================================================================
// 5. SPACEX: primeros lanzamientos en 2027
// =====================================================================
const Spacex: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("spacex", q, startMs);
  const f27 = w("2027");
  const fLan = w("lanzar");
  const rocket = ramp(frame, fLan - 8, 40, EASE_MOVE);
  return (
    <AbsoluteFill>
      <Space sats={30} earthY={1850} />
      <Bar active={3} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center", scale: String(popSpring(frame, fps, 0)) }}>
        <SpacexMark size={300} />
      </div>
      {/* cohete (dibujo propio) */}
      <svg width={170} height={357} viewBox="0 0 100 210" style={{ position: "absolute", left: 820, top: interpolate(rocket, [0, 1], [1950, 880]) + Math.sin(frame / 8) * 6 }}>
        <path d="M 50 0 C 70 30 72 70 70 140 L 30 140 C 28 70 30 30 50 0 Z" fill="#e6eefc" />
        <rect x="30" y="140" width="40" height="20" fill="#9fb3cc" />
        <path d="M 30 120 L 12 160 L 30 150 Z M 70 120 L 88 160 L 70 150 Z" fill={C.nv} />
        <path d={`M 36 160 Q 50 ${200 + 10 * Math.sin(frame)} 64 160 Z`} fill={C.yellow} />
      </svg>
      <div style={{ position: "absolute", left: 90, top: 760, opacity: frame >= fLan - 4 ? 1 : 0 }}>
        <MaskLine delay={fLan - 4} size={80} shadow={C.ink}>
          Primeros lanzamientos
        </MaskLine>
      </div>
      <Counter from={2020} to={2027} start={f27 - 2} dur={10} format={(v) => String(Math.round(v))} color={C.nvLight} size={230} style={{ left: 90, top: 860 }} />
      <Chip text="Objetivo de SpaceX" delay={f27 + 8} color={C.white} size={36} style={{ left: 100, top: 1160 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 6. RETOS: frío y radiación
// =====================================================================
const Retos: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("retos", q, startMs);
  const fEnf = w("enfriar");
  const fRad = w("radiacion");
  const sh = useShake(fRad + 4, 8, 12);
  return (
    <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px` }}>
      <Space sats={30} earthY={1950} />
      <Bar active={4} />
      <Stamp text="El problema" delay={0} color={C.red} size={110} rotate={-6} style={{ left: 250, top: 250 }} />
      {[
        { at: fEnf, t: "ENFRIAR LOS CHIPS", s: "en el vacío no hay aire", c: C.cyan, icon: "❄" },
        { at: fRad, t: "RADIACIÓN", s: "la electrónica debe aguantarla", c: C.yellow, icon: "☢" },
      ].map((b, i) => (
        <div
          key={b.t}
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 520 + i * 300,
            height: 250,
            borderRadius: 28,
            border: `6px solid ${b.c}`,
            background: "rgba(3,7,18,0.85)",
            display: "flex",
            alignItems: "center",
            gap: 34,
            padding: "0 40px",
            scale: String(popSpring(frame, fps, b.at - 2)),
            opacity: frame >= b.at - 2 ? 1 : 0,
            boxShadow: `0 0 40px ${b.c}66`,
          }}
        >
          <div style={{ width: 150, height: 150, borderRadius: 75, background: b.c, color: C.ink, fontSize: 96, display: "flex", alignItems: "center", justifyContent: "center" }}>{b.icon}</div>
          <div>
            <div style={{ fontFamily: FONT_HEAD, fontSize: 84, color: C.white, lineHeight: 1 }}>{b.t}</div>
            <div style={{ fontFamily: FONT_BODY, fontWeight: 800, fontSize: 36, color: b.c, marginTop: 8 }}>{b.s}</div>
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// =====================================================================
// 7. CIERRE
// =====================================================================
const Cierre: React.FC<SceneProps> = (p) => (
  <Poll {...p} segId="cierre" line1="¿Buena" line2="idea?" footer="Fuentes: FCC · NBC News · Space.com · Fox Business" bar={<Bar active={5} />} />
);

// =====================================================================
// MINIATURA (portada TikTok 1080×1920; zona clave y 240-1680)
// =====================================================================
export const Thumbnail: React.FC = () => (
  <AbsoluteFill>
    <Space sats={120} earthY={1650} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 44, color: C.white, background: C.red, padding: "10px 26px", borderRadius: 10, letterSpacing: "0.08em" }}>
        ● ÚLTIMA HORA
      </div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 250, lineHeight: 1.05, color: C.nvLight, marginTop: 30, textShadow: `0 0 60px ${C.nv}, 10px 10px 0 ${C.ink}` }}>1.000.000</div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 150, lineHeight: 1.05, color: C.white, textShadow: `8px 8px 0 ${C.ink}` }}>SATÉLITES</div>
      <div style={{ display: "inline-block", marginTop: 26, fontFamily: FONT_BODY, fontWeight: 900, fontSize: 56, color: C.ink, background: C.yellow, padding: "10px 30px", borderRadius: 999, rotate: "-3deg" }}>
        PARA IA EN EL ESPACIO
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 930, display: "flex", justifyContent: "center", rotate: "-6deg" }}>
      <Satellite w={540} glow={1} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1220, display: "flex", justifyContent: "center" }}>
      <SpacexMark size={260} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1620, textAlign: "center", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 40, color: C.white, opacity: 0.9 }}>
      NOTICIA IA · TE LO CUENTO EN 1 MINUTO
    </div>
  </AbsoluteFill>
);

export const SCENES: SceneDef[] = [
  { key: "hook", firstSeg: "hook", C: Hook },
  { key: "lema", firstSeg: "lema", C: Lema, flash: C.nv },
  { key: "que", firstSeg: "que", C: Que, flash: C.nvLight },
  { key: "plazos", firstSeg: "plazos", C: Plazos, flash: C.nv },
  { key: "spacex", firstSeg: "spacex", C: Spacex, flash: C.nvLight },
  { key: "retos", firstSeg: "retos", C: Retos, flash: C.red },
  { key: "cierre", firstSeg: "cierre", C: Cierre, flash: C.nv },
];

// sfx: impact, whoosh, whoosh_down, riser, pop, ding, glitch, shutter, cash
const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({ at, src, volume = 0.5 }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={90} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);
export const SfxCues: React.FC = () => {
  const at = (segId: string, q: string, n = 0) => wordF(segId, q, 0, n);
  return (
    <>
      <Sfx at={0} src="impact" volume={0.55} />
      <Sfx at={at("hook", "spacex") - 2} src="pop" volume={0.45} />
      <Sfx at={at("lema", "menos")} src="ding" volume={0.4} />
      <Sfx at={at("que", "aprobo")} src="impact" volume={0.45} />
      <Sfx at={at("que", "starmind") - 6} src="whoosh" volume={0.35} />
      <Sfx at={at("plazos", "2033")} src="pop" volume={0.4} />
      <Sfx at={at("plazos", "2040")} src="ding" volume={0.4} />
      <Sfx at={at("spacex", "spacex")} src="riser" volume={0.35} />
      <Sfx at={at("retos", "radiacion")} src="glitch" volume={0.4} />
      <Sfx at={at("cierre", "comentarios")} src="pop" volume={0.5} />
    </>
  );
};
