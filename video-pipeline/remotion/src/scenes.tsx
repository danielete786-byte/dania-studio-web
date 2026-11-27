/**
 * HISTORIA: «Silksong: la expansión gratuita Sea of Sorrow llega el 11 de diciembre» (Videojuegos · 27 nov 2026).
 * Anuncio en el Cherry Time! de Team Cherry. Fuentes: Team Cherry (blog), Kotaku, PC Gamer, Shacknews, Nintendo Everything.
 * Sin imágenes oficiales (assets.nintendo.com no está permitido en el entorno): todo el arte es dibujo propio.
 */
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, random, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Chip, MaskLine, Stamp, punch, useShake } from "./components";
import { C, FONT_BODY, FONT_HEAD, popSpring, ramp, softSpring, wordF } from "./lib";
import { HookBadge, Lema, NewsBar, Poll, SceneDef, SceneProps } from "./news";

const DATE = "27 NOV";
const Bar: React.FC<{ active: number }> = ({ active }) => <NewsBar active={active} total={4} label="VIDEOJUEGOS" date={DATE} />;

// ---------- océano (dibujo propio): rayos de luz, olas, burbujas ----------
const Ocean: React.FC<{ level?: number }> = ({ level = 1500 }) => {
  const frame = useCurrentFrame();
  const wave = (k: number) => {
    const y0 = level + k * 70;
    let d = `M 0 ${y0}`;
    for (let x = 0; x <= 1080; x += 40) d += ` L ${x} ${y0 + Math.sin(x / 90 + frame / (14 + k * 4) + k) * (16 - k * 3)}`;
    return d + " L 1080 1920 L 0 1920 Z";
  };
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #071226 0%, #0a1f3d 45%, #06101f 100%)" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {[0, 1, 2, 3].map((i) => (
          <polygon key={i} points={`${200 + i * 220},0 ${300 + i * 220},0 ${120 + i * 260 + Math.sin(frame / 40 + i) * 30},1920 ${-40 + i * 260},1920`} fill="#9fd4ff" opacity={0.04 + 0.02 * Math.sin(frame / 25 + i)} />
        ))}
        {Array.from({ length: 40 }, (_, i) => {
          const x = random(`bx${i}`) * 1080;
          const sp = 1 + random(`bs${i}`) * 2;
          const y = 1920 - ((frame * sp + random(`by${i}`) * 1920) % 1920);
          return <circle key={i} cx={x + Math.sin(frame / 15 + i) * 8} cy={y} r={2 + random(`br${i}`) * 6} fill="none" stroke="#bfe3ff" strokeOpacity={0.35} strokeWidth={2} />;
        })}
        {[0, 1, 2].map((k) => (
          <path key={k} d={wave(k)} fill={["#0e2f5a", "#0b2548", "#081a35"][k]} opacity={0.9} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// ---------- calendario (dibujo propio) ----------
const Calendar: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.1, overflow: "hidden", background: C.white, boxShadow: `0 0 60px ${C.nv}88, 0 20px 50px rgba(0,0,0,0.6)` }}>
    <div style={{ height: size * 0.28, background: C.nv, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_HEAD, fontSize: size * 0.18, color: C.white, letterSpacing: "0.08em" }}>DICIEMBRE</div>
    <div style={{ height: size * 0.72, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_HEAD, fontSize: size * 0.56, color: C.ink, lineHeight: 1 }}>11</div>
  </div>
);

// ---------- barco (silueta propia) ----------
const Ship: React.FC<{ w: number }> = ({ w }) => (
  <svg viewBox="0 0 300 220" width={w} height={(w * 220) / 300}>
    <path d="M 30 150 L 270 150 L 235 200 L 65 200 Z" fill="#0b0f1a" stroke={C.nvLight} strokeWidth="4" />
    <line x1="150" y1="20" x2="150" y2="150" stroke="#0b0f1a" strokeWidth="8" />
    <path d="M 156 28 L 156 140 L 250 140 Z" fill="#e9eef7" opacity="0.92" />
    <path d="M 144 40 L 144 140 L 70 140 Z" fill="#e9eef7" opacity="0.8" />
    <path d="M 150 14 L 180 22 L 150 30 Z" fill={C.nv} />
  </svg>
);

// =====================================================================
// 1. GANCHO
// =====================================================================
const Hook: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("hook", q, startMs);
  const fFecha = w("fecha");
  const fExp = w("expansion");
  const fSea = w("sea");
  const f11 = w("11");
  const z = punch(frame, fps, f11, 0.05);
  const cal = popSpring(frame, fps, f11 - 4);
  return (
    <AbsoluteFill style={{ scale: String(z) }}>
      <Ocean level={1560} />
      <HookBadge label="ÚLTIMA HORA" date="27 NOV 2026" />
      <div style={{ position: "absolute", left: 80, top: 230 }}>
        <MaskLine delay={-9} size={86} shadow={C.ink}>
          Hollow Knight:
        </MaskLine>
        <MaskLine delay={-6} size={180} color={C.nvLight} shadow={C.ink}>
          Silksong
        </MaskLine>
        <MaskLine delay={fFecha - 6} size={96} shadow={C.ink}>
          ya tiene fecha
        </MaskLine>
      </div>
      <Chip text="1ª gran expansión" delay={fExp - 6} color={C.nv} textColor={C.white} size={46} style={{ left: 80, top: 690 }} />
      <div style={{ position: "absolute", left: 80, top: 790, opacity: frame >= fSea - 6 ? 1 : 0 }}>
        <MaskLine delay={fSea - 6} size={110} shadow={C.ink}>
          <span style={{ textShadow: `0 0 30px #5CC2FF` }}>SEA OF SORROW</span>
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 540 - 160, top: 940, scale: String(cal), opacity: frame >= f11 - 4 ? 1 : 0, rotate: "-4deg" }}>
        <Calendar size={300} />
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. GRATIS
// =====================================================================
const Gratis: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("gratis", q, startMs);
  const fGra = w("gratis");
  const fTod = w("todos");
  const tag = softSpring(frame, fps, 2);
  const sh = useShake(fGra + 2, 8, 12);
  return (
    <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px` }}>
      <Ocean level={1600} />
      <Bar active={1} />
      <div style={{ position: "absolute", left: 80, top: 250 }}>
        <MaskLine delay={0} size={110} shadow={C.ink}>
          Y lo mejor...
        </MaskLine>
      </div>
      {/* etiqueta de precio (dibujo propio) */}
      <svg viewBox="0 0 520 300" width={620} height={358} style={{ position: "absolute", left: 230, top: 470, rotate: `${interpolate(tag, [0, 1], [-30, -8])}deg`, opacity: tag }}>
        <path d="M 120 20 L 500 20 L 500 280 L 120 280 L 20 150 Z" fill="#f4efe4" stroke={C.ink} strokeWidth="6" />
        <circle cx="90" cy="150" r="22" fill="#0a1f3d" />
        <text x="320" y="200" textAnchor="middle" fontFamily="Anton" fontSize="150" fill={C.ink}>
          0 €
        </text>
      </svg>
      <Stamp text="GRATIS" delay={fGra} color={C.nv} size={170} rotate={-8} style={{ left: 190, top: 840 }} />
      <Chip text="Para todos los que tengan el juego" delay={fTod - 4} color={C.white} size={40} style={{ left: 90, top: 1130 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 4. CONTENIDO: océano de Pharloom
// =====================================================================
const Icon: React.FC<{ kind: string }> = ({ kind }) => (
  <svg viewBox="0 0 100 100" width={110} height={110}>
    {kind === "zonas" && (
      <g fill={C.nvLight}>
        <path d="M 10 80 Q 50 50 90 80 Z" />
        <rect x="47" y="30" width="6" height="40" />
        <path d="M 50 30 Q 30 20 18 34 Q 34 28 50 34 Q 66 28 82 34 Q 70 20 50 30 Z" />
      </g>
    )}
    {kind === "personajes" && (
      <g fill={C.nvLight}>
        <circle cx="35" cy="35" r="14" />
        <path d="M 12 85 Q 35 45 58 85 Z" />
        <circle cx="68" cy="40" r="11" opacity="0.7" />
        <path d="M 50 85 Q 68 52 88 85 Z" opacity="0.7" />
      </g>
    )}
    {kind === "poderes" && <path d="M 58 6 L 22 56 L 46 56 L 38 94 L 78 40 L 52 40 Z" fill={C.yellow} />}
    {kind === "jefes" && (
      <g fill={C.red}>
        <path d="M 50 12 C 82 12 92 40 88 62 L 80 92 L 66 74 L 50 92 L 34 74 L 20 92 L 12 62 C 8 40 18 12 50 12 Z" />
        <circle cx="36" cy="46" r="8" fill="#fff" />
        <circle cx="64" cy="46" r="8" fill="#fff" />
      </g>
    )}
  </svg>
);
const Contenido: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("contenido", q, startMs);
  const fOce = w("oceano");
  const fPh = w("pharloom");
  const items = [
    { k: "zonas", t: "Zonas nuevas", at: w("zonas") },
    { k: "personajes", t: "Personajes", at: w("personajes") },
    { k: "poderes", t: "Poderes", at: w("poderes") },
    { k: "jefes", t: "Jefes enormes", at: w("jefes") },
  ];
  const ship = softSpring(frame, fps, fOce - 6);
  return (
    <AbsoluteFill>
      <Ocean level={1450} />
      <Bar active={2} />
      <div style={{ position: "absolute", left: 80, top: 240 }}>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 40, color: C.nvLight, letterSpacing: "0.08em", opacity: ramp(frame, 0, 6) }}>TEAM CHERRY PROMETE</div>
        <MaskLine delay={fOce - 4} size={88} shadow={C.ink}>
          El océano olvidado
        </MaskLine>
        <MaskLine delay={fPh - 4} size={88} shadow={C.ink}>
          de <span style={{ color: C.nvLight }}>Pharloom</span>
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 600, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
        {items.map((it) => {
          const sp = popSpring(frame, fps, it.at - 3);
          return (
            <div
              key={it.k}
              style={{
                height: 240,
                borderRadius: 26,
                background: "rgba(5,10,22,0.85)",
                border: `5px solid ${it.k === "jefes" ? C.red : C.nv}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                scale: String(interpolate(sp, [0, 1], [0.5, 1])),
                opacity: frame >= it.at - 3 ? 1 : 0,
              }}
            >
              <Icon kind={it.k} />
              <div style={{ fontFamily: FONT_HEAD, fontSize: 64, color: C.white, lineHeight: 1 }}>{it.t}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 740, top: 1110 + Math.sin(frame / 10) * 6, rotate: `${Math.sin(frame / 12) * 3}deg`, opacity: ship, translate: `${interpolate(ship, [0, 1], [120, 0])}px 0` }}>
        <Ship w={230} />
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 5. ¿PESCANDO?
// =====================================================================
const Pesca: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("pesca", q, startMs);
  const fPes = w("pescando");
  const cast = ramp(frame, 2, 14);
  const bob = Math.sin(frame / 7) * 10 + (frame > fPes && frame < fPes + 10 ? 24 : 0);
  return (
    <AbsoluteFill>
      <Ocean level={1100} />
      <Bar active={3} />
      <div style={{ position: "absolute", left: 80, top: 240 }}>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 40, color: C.nvLight, letterSpacing: "0.08em" }}>EL FINAL DEL TRÁILER</div>
      </div>
      {/* caña de pescar (dibujo propio) */}
      <svg width={1080} height={1300} style={{ position: "absolute", left: 0, top: 300 }}>
        <line x1="980" y1="980" x2={interpolate(cast, [0, 1], [900, 560])} y2={interpolate(cast, [0, 1], [400, 120])} stroke="#c9a26b" strokeWidth="14" strokeLinecap="round" />
        <path d={`M ${interpolate(cast, [0, 1], [900, 560])} ${interpolate(cast, [0, 1], [400, 120])} Q 420 ${300 + bob} 330 ${800 + bob}`} fill="none" stroke="#e9eef7" strokeWidth="3" opacity={cast} />
        <g transform={`translate(330 ${800 + bob})`} opacity={cast}>
          <circle r="26" fill={C.red} />
          <path d="M -26 0 A 26 26 0 0 0 26 0 Z" fill="#fff" />
          <line x1="0" y1="-26" x2="0" y2="-44" stroke="#fff" strokeWidth="5" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", scale: String(popSpring(frame, fps, fPes - 4)), opacity: frame >= fPes - 4 ? 1 : 0, rotate: "-5deg" }}>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 190, color: C.nvLight, lineHeight: 1, textShadow: `0 0 40px ${C.nv}, 8px 8px 0 ${C.ink}` }}>¿PESCANDO?</div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 6. CIERRE
// =====================================================================
const Cierre: React.FC<SceneProps> = (p) => (
  <Poll {...p} segId="cierre" line1="¿Vuelves a" line2="Pharloom?" size1={150} size2={170} footer="Fuentes: Team Cherry · Kotaku · PC Gamer · Shacknews" bar={<Bar active={4} />} />
);

// =====================================================================
// MINIATURA (portada TikTok 1080×1920; zona clave y 240-1680)
// =====================================================================
export const Thumbnail: React.FC = () => (
  <AbsoluteFill>
    <Ocean level={1480} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 44, color: C.white, background: C.red, padding: "10px 26px", borderRadius: 10, letterSpacing: "0.08em" }}>
        ● ÚLTIMA HORA
      </div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 90, lineHeight: 1.05, color: C.white, marginTop: 26, textShadow: `6px 6px 0 ${C.ink}` }}>HOLLOW KNIGHT</div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 230, lineHeight: 1.0, color: C.nvLight, textShadow: `0 0 50px ${C.nv}, 10px 10px 0 ${C.ink}` }}>SILKSONG</div>
      <div style={{ display: "inline-block", marginTop: 20, fontFamily: FONT_HEAD, fontSize: 170, lineHeight: 1.05, color: C.ink, background: C.yellow, padding: "0 40px", borderRadius: 20, rotate: "-4deg" }}>DLC GRATIS</div>
    </div>
    <div style={{ position: "absolute", left: 120, top: 1010, rotate: "-6deg" }}>
      <Calendar size={330} />
    </div>
    <div style={{ position: "absolute", left: 500, top: 1060, width: 480 }}>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 104, lineHeight: 1.0, color: C.white, textShadow: `0 0 30px #5CC2FF, 6px 6px 0 ${C.ink}` }}>SEA OF SORROW</div>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 40, color: C.nvLight, marginTop: 12 }}>1ª GRAN EXPANSIÓN</div>
    </div>
    <div style={{ position: "absolute", left: 700, top: 1335, rotate: "4deg" }}>
      <Ship w={260} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1620, textAlign: "center", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 40, color: C.white, opacity: 0.9 }}>
      VIDEOJUEGOS · TE LO CUENTO EN 1 MINUTO
    </div>
  </AbsoluteFill>
);

export const SCENES: SceneDef[] = [
  { key: "hook", firstSeg: "hook", C: Hook },
  { key: "lema", firstSeg: "lema", C: Lema, flash: C.nv },
  { key: "gratis", firstSeg: "gratis", C: Gratis, flash: C.yellow },
  { key: "contenido", firstSeg: "contenido", C: Contenido, flash: C.nv },
  { key: "pesca", firstSeg: "pesca", C: Pesca, flash: C.nvLight },
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
      <Sfx at={0} src="impact" volume={0.5} />
      <Sfx at={at("hook", "sea") - 6} src="whoosh" volume={0.35} />
      <Sfx at={at("hook", "11") - 4} src="impact" volume={0.55} />
      <Sfx at={at("lema", "menos")} src="ding" volume={0.4} />
      <Sfx at={at("gratis", "gratis")} src="cash" volume={0.45} />
      <Sfx at={at("contenido", "zonas") - 3} src="pop" volume={0.35} />
      <Sfx at={at("contenido", "personajes") - 3} src="pop" volume={0.35} />
      <Sfx at={at("contenido", "poderes") - 3} src="pop" volume={0.35} />
      <Sfx at={at("contenido", "jefes") - 3} src="impact" volume={0.45} />
      <Sfx at={at("pesca", "pescando") - 4} src="pop" volume={0.5} />
      <Sfx at={at("cierre", "comentarios")} src="pop" volume={0.5} />
    </>
  );
};
