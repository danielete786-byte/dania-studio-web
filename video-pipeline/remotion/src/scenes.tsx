/**
 * HISTORIA: «Bloomberg encuentra chips Blackwell de Nvidia, prohibidos en China, en un centro de datos de Shanghái» (IA · 28 nov 2026).
 * Fuentes: Bloomberg (27 nov), vía Yahoo Finance, The Next Web, WION; Megaspeed en la Entity List (Benzinga).
 */
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { MaskLine, Stamp, punch, useShake } from "./components";
import { C, clamp, FONT_BODY, FONT_HEAD, popSpring, ramp, softSpring, wordF } from "./lib";
import { BrandLogo, Counter, HookBadge, Lema, NewsBar, Poll, SceneDef, SceneProps, TechBackdrop } from "./news";

const DATE = "28 NOV";
const Bar: React.FC<{ active: number }> = ({ active }) => <NewsBar active={active} total={4} label="NOTICIA IA" date={DATE} />;

// ---------- chincheta de mapa (dibujo propio) ----------
const Pin: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 100 130" width={size} height={size * 1.3}>
    <path d="M 50 126 C 50 126 8 74 8 46 A 42 42 0 0 1 92 46 C 92 74 50 126 50 126 Z" fill={C.red} stroke="#fff" strokeWidth="5" />
    <circle cx="50" cy="46" r="16" fill="#fff" />
  </svg>
);

// ---------- rack NVL72 (dibujo propio): 18 bandejas × 4 chips = 72 ----------
const Rack72: React.FC<{ w: number; lit: number }> = ({ w, lit }) => (
  <svg viewBox="0 0 300 600" width={w} height={w * 2}>
    <rect x="10" y="6" width="280" height="588" rx="18" fill="#101410" stroke={C.nv} strokeWidth="6" />
    {Array.from({ length: 18 }, (_, r) => (
      <g key={r} transform={`translate(30 ${26 + r * 31})`}>
        <rect width="240" height="24" rx="5" fill="#1a1f19" />
        {[0, 1, 2, 3].map((k) => {
          const n = r * 4 + k;
          return <rect key={k} x={14 + k * 56} y="5" width="44" height="14" rx="3" fill={n < lit ? C.nvLight : "#2c3529"} />;
        })}
      </g>
    ))}
  </svg>
);

// =====================================================================
// 1. GANCHO
// =====================================================================
const Hook: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("hook", q, startMs);
  const fProh = w("prohibidos");
  const fSh = w("shanghai");
  const sh = useShake(fSh + 4, 8, 14);
  const z = punch(frame, fps, fSh, 0.06);
  const pin = interpolate(frame, [fSh - 6, fSh + 4], [-500, 0], clamp);
  return (
    <AbsoluteFill style={{ scale: String(z), translate: `${sh.x}px ${sh.y}px` }}>
      <TechBackdrop hue="#0B1A06" />
      <HookBadge label="ÚLTIMA HORA" date="28 NOV 2026" />
      <div style={{ position: "absolute", right: 80, top: 250, scale: String(popSpring(frame, fps, 0)) }}>
        <BrandLogo slug="nvidia" size={170} />
      </div>
      <div style={{ position: "absolute", left: 80, top: 230 }}>
        <MaskLine delay={-9} size={110} shadow={C.ink}>
          Los chips de IA
        </MaskLine>
        <MaskLine delay={-5} size={110} shadow={C.ink}>
          más potentes de
        </MaskLine>
        <MaskLine delay={-1} size={150} color={C.nvLight} shadow={C.ink}>
          Nvidia
        </MaskLine>
      </div>
      <Stamp text="Prohibidos en China" delay={fProh} color={C.red} size={84} rotate={-6} style={{ left: 120, top: 690 }} />
      <div style={{ position: "absolute", left: 120, top: 860, display: "flex", alignItems: "flex-end", gap: 26, opacity: frame >= fSh - 6 ? 1 : 0 }}>
        <div style={{ translate: `0 ${pin}px` }}>
          <Pin size={140} />
        </div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 190, lineHeight: 1, color: C.white, textShadow: `8px 8px 0 ${C.ink}`, scale: String(popSpring(frame, fps, fSh)), transformOrigin: "left bottom" }}>SHANGHÁI</div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. EL RACK: 72 chips Blackwell · garantía de un préstamo de 14 M$
// =====================================================================
const Rack: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("rack", q, startMs);
  const fRack = w("rack");
  const f72 = w("72");
  const fBlack = w("blackwell");
  const fGar = w("garantia");
  const f14 = w("14");
  const lit = Math.round(interpolate(frame, [fRack, f72 + 6], [0, 72], clamp));
  return (
    <AbsoluteFill>
      <TechBackdrop hue="#0B1A06" />
      <Bar active={1} />
      <div style={{ position: "absolute", left: 80, top: 240, fontFamily: FONT_BODY, fontWeight: 900, fontSize: 36, color: C.ink, background: C.white, padding: "8px 22px", borderRadius: 8, opacity: ramp(frame, 0, 6) }}>
        LO HA DESCUBIERTO BLOOMBERG
      </div>
      <div style={{ position: "absolute", left: 80, top: 340, scale: String(softSpring(frame, fps, fRack - 6)), transformOrigin: "center top" }}>
        <Rack72 w={360} lit={lit} />
      </div>
      <Counter from={0} to={72} start={fRack} dur={Math.max(8, f72 - fRack + 6)} format={(v) => String(Math.round(v))} color={C.nvLight} size={250} style={{ left: 500, top: 360 }} />
      <div style={{ position: "absolute", left: 510, top: 640, opacity: ramp(frame, fBlack - 4, 6) }}>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 70, color: C.white, lineHeight: 1 }}>CHIPS</div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 86, color: C.nvLight, lineHeight: 1 }}>BLACKWELL</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 500,
          right: 60,
          top: 880,
          padding: "26px 30px",
          borderRadius: 22,
          background: "#F4F1E8",
          rotate: "-3deg",
          scale: String(popSpring(frame, fps, fGar - 4)),
          opacity: frame >= fGar - 4 ? 1 : 0,
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 28, color: "#555", letterSpacing: "0.08em" }}>GARANTÍA DE UN PRÉSTAMO</div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 96, color: C.ink, lineHeight: 1.05, opacity: ramp(frame, f14 - 2, 6) }}>14 M$</div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 4. MEGASPEED: lista negra de EE. UU.
// =====================================================================
const Megaspeed: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("megaspeed", q, startMs);
  const fLig = w("ligado");
  const fMeg = w("megaspeed");
  const fLista = w("lista");
  const node = (at: number, top: number, color: string, kicker: string, title: string) => (
    <div
      style={{
        position: "absolute",
        left: 100,
        right: 100,
        top,
        padding: "26px 34px",
        borderRadius: 24,
        background: "rgba(10,14,10,0.92)",
        border: `5px solid ${color}`,
        scale: String(popSpring(frame, fps, at)),
        opacity: frame >= at ? 1 : 0,
      }}
    >
      <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 30, color, letterSpacing: "0.08em" }}>{kicker}</div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 92, color: C.white, lineHeight: 1.05 }}>{title}</div>
    </div>
  );
  const link = ramp(frame, fLig, 10);
  return (
    <AbsoluteFill>
      <TechBackdrop hue="#0B1A06" />
      <Bar active={2} />
      {node(0, 260, C.nv, "SHANGHÁI", "CENTRO DE DATOS")}
      <div style={{ position: "absolute", left: 535, top: 470, width: 10, height: interpolate(link, [0, 1], [0, 140]), background: C.white, borderRadius: 5 }} />
      {node(fMeg - 8, 620, C.yellow, "LIGADO A LA FUNDADORA DE", "MEGASPEED")}
      <Stamp text="Lista negra de EE. UU." delay={fLista - 2} color={C.red} size={84} rotate={-6} style={{ left: 130, top: 930 }} />
    </AbsoluteFill>
  );
};

// ---------- mochila (dibujo propio) ----------
const Backpack: React.FC<{ w: number }> = ({ w }) => (
  <svg viewBox="0 0 200 240" width={w} height={w * 1.2}>
    <path d="M 70 40 Q 100 0 130 40" fill="none" stroke="#c9d1c4" strokeWidth="12" />
    <rect x="30" y="40" width="140" height="190" rx="40" fill="#3a4a7a" />
    <rect x="55" y="130" width="90" height="70" rx="16" fill="#2c3a63" />
    <line x1="60" y1="150" x2="140" y2="150" stroke="#c9d1c4" strokeWidth="5" />
  </svg>
);

// =====================================================================
// 5. JENSEN HUANG: «demasiado grandes para el contrabando»
// =====================================================================
const Huang: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("huang", q, startMs);
  const fGran = w("grandes");
  const fCont = w("contrabando");
  const card = softSpring(frame, fps, 2);
  return (
    <AbsoluteFill>
      <TechBackdrop hue="#0B1A06" />
      <Bar active={3} />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 250,
          padding: "34px 40px",
          borderRadius: 26,
          background: "rgba(5,8,7,0.88)",
          borderLeft: `14px solid ${C.nv}`,
          translate: `0 ${interpolate(card, [0, 1], [60, 0])}px`,
          opacity: card,
        }}
      >
        <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 32, color: C.nvLight, letterSpacing: "0.06em" }}>JENSEN HUANG, CEO DE NVIDIA, DECÍA QUE</div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 86, color: C.white, lineHeight: 1.08, marginTop: 12 }}>
          Eran <span style={{ color: C.yellow, opacity: frame >= fGran - 2 ? 1 : 0.3 }}>demasiado grandes</span> para pasarlos de contrabando
        </div>
      </div>
      <div style={{ position: "absolute", left: 150, top: 820, scale: String(popSpring(frame, fps, fGran)), opacity: frame >= fGran ? 1 : 0 }}>
        <Backpack w={220} />
      </div>
      <div style={{ position: "absolute", left: 420, top: 880, fontFamily: FONT_HEAD, fontSize: 150, color: C.red, opacity: ramp(frame, fCont - 4, 6) }}>≠</div>
      <div style={{ position: "absolute", left: 640, top: 700, scale: String(popSpring(frame, fps, fGran + 6)), opacity: frame >= fGran + 6 ? 1 : 0 }}>
        <Rack72 w={250} lit={72} />
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 6. CIERRE
// =====================================================================
const Cierre: React.FC<SceneProps> = (p) => (
  <Poll {...p} segId="cierre" line1="¿Cómo" line2="llegaron?" size1={170} size2={170} footer="Fuentes: Bloomberg · The Next Web · Yahoo Finance · WION" bar={<Bar active={4} />} />
);

// =====================================================================
// MINIATURA (portada TikTok 1080×1920; zona clave y 240-1680)
// =====================================================================
export const Thumbnail: React.FC = () => (
  <AbsoluteFill>
    <TechBackdrop hue="#0B1A06" />
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 44, color: C.white, background: C.red, padding: "10px 26px", borderRadius: 10, letterSpacing: "0.08em" }}>
        ● ÚLTIMA HORA
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 24, marginTop: 26 }}>
        <BrandLogo slug="nvidia" size={150} />
        <div style={{ fontFamily: FONT_HEAD, fontSize: 170, lineHeight: 1, color: C.nvLight, textShadow: `0 0 50px ${C.nv}, 8px 8px 0 ${C.ink}` }}>NVIDIA</div>
      </div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 150, lineHeight: 1.05, color: C.white, textShadow: `8px 8px 0 ${C.ink}`, marginTop: 6 }}>CHIPS PROHIBIDOS</div>
    </div>
    <div style={{ position: "absolute", left: 80, top: 850 }}>
      <Rack72 w={300} lit={72} />
    </div>
    <div style={{ position: "absolute", left: 410, top: 930 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
        <Pin size={110} />
        <div style={{ fontFamily: FONT_HEAD, fontSize: 130, lineHeight: 1, color: C.white, textShadow: `6px 6px 0 ${C.ink}` }}>HALLADOS</div>
      </div>
      <div style={{ display: "inline-block", marginTop: 20, fontFamily: FONT_HEAD, fontSize: 100, lineHeight: 1.1, color: C.white, background: C.red, padding: "0 28px", borderRadius: 16, rotate: "-4deg", whiteSpace: "nowrap" }}>EN SHANGHÁI</div>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 44, color: C.yellow, marginTop: 30 }}>72 CHIPS BLACKWELL</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1620, textAlign: "center", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 40, color: C.white, opacity: 0.9 }}>
      NOTICIA IA · TE LO CUENTO EN 1 MINUTO
    </div>
  </AbsoluteFill>
);

export const SCENES: SceneDef[] = [
  { key: "hook", firstSeg: "hook", C: Hook },
  { key: "lema", firstSeg: "lema", C: Lema, flash: C.nv },
  { key: "rack", firstSeg: "rack", C: Rack, flash: C.nvLight },
  { key: "megaspeed", firstSeg: "megaspeed", C: Megaspeed, flash: C.nv },
  { key: "huang", firstSeg: "huang", C: Huang, flash: C.yellow },
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
      <Sfx at={at("hook", "prohibidos")} src="impact" volume={0.45} />
      <Sfx at={at("hook", "shanghai") - 6} src="whoosh_down" volume={0.4} />
      <Sfx at={at("hook", "shanghai") + 4} src="impact" volume={0.55} />
      <Sfx at={at("lema", "menos")} src="ding" volume={0.4} />
      <Sfx at={at("rack", "rack")} src="riser" volume={0.3} />
      <Sfx at={at("rack", "garantia") - 4} src="pop" volume={0.45} />
      <Sfx at={at("rack", "14")} src="cash" volume={0.4} />
      <Sfx at={at("megaspeed", "megaspeed") - 8} src="pop" volume={0.4} />
      <Sfx at={at("megaspeed", "lista") - 2} src="impact" volume={0.5} />
      <Sfx at={at("huang", "contrabando") - 4} src="glitch" volume={0.35} />
      <Sfx at={at("cierre", "comentarios")} src="pop" volume={0.5} />
    </>
  );
};
