/**
 * HISTORIA: «Nvidia frena los envíos de servidores de IA a 4 países del sudeste asiático» (IA · 27 nov 2026).
 * Fuentes: Financial Times (vía The National, Benzinga, The Decoder); norma BIS del 16 nov (Bloomberg, TechCrunch).
 */
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Chip, MaskLine, Stamp, punch, useShake } from "./components";
import { C, clamp, FONT_BODY, FONT_HEAD, popSpring, ramp, softSpring, wordF } from "./lib";
import { BrandLogo, HookBadge, Lema, NewsBar, Poll, SceneDef, SceneProps, TechBackdrop } from "./news";

const DATE = "27 NOV";
const Bar: React.FC<{ active: number }> = ({ active }) => <NewsBar active={active} total={4} label="NOTICIA IA" date={DATE} />;

// ---------- servidor de IA (dibujo propio) ----------
const ServerRack: React.FC<{ w: number; stop: number }> = ({ w, stop }) => {
  const frame = useCurrentFrame();
  return (
    <svg viewBox="0 0 400 420" width={w} height={(w * 420) / 400}>
      <rect x="40" y="10" width="320" height="400" rx="22" fill="#121512" stroke={C.nv} strokeWidth="6" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(70 ${40 + i * 72})`}>
          <rect width="260" height="54" rx="10" fill="#1d221c" stroke="#2f382d" strokeWidth="3" />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={26 + k * 22} cy="27" r="7" fill={stop > 0.5 ? C.red : (frame + i * 3 + k * 5) % 14 < 7 ? C.nvLight : "#2f4a18"} />
          ))}
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <rect key={k} x={110 + k * 22} y="12" width="12" height="30" rx="3" fill="#2a3127" />
          ))}
        </g>
      ))}
      {/* barrera de STOP */}
      <g opacity={stop} transform={`rotate(${interpolate(stop, [0, 1], [-30, -12])} 200 210)`}>
        <rect x="-10" y="180" width="420" height="64" rx="12" fill={C.red} stroke="#fff" strokeWidth="6" />
        <text x="200" y="230" textAnchor="middle" fontFamily="Anton" fontSize="50" fill="#fff" letterSpacing="4">
          ENVÍOS PARADOS
        </text>
      </g>
    </svg>
  );
};

// =====================================================================
// 1. GANCHO
// =====================================================================
const Hook: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("hook", q, startMs);
  const fFrena = w("frena");
  const fPaises = w("4");
  const fAsia = w("asiatico");
  const stop = ramp(frame, fFrena, 8);
  const sh = useShake(fFrena + 6, 8, 14);
  const z = punch(frame, fps, fFrena, 0.05);
  return (
    <AbsoluteFill style={{ scale: String(z), translate: `${sh.x}px ${sh.y}px` }}>
      <TechBackdrop hue="#0B1A06" />
      <HookBadge label="ÚLTIMA HORA" date="27 NOV 2026" />
      <div style={{ position: "absolute", left: 80, top: 230 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <BrandLogo slug="nvidia" size={120} />
          <MaskLine delay={-9} size={130} color={C.nvLight} shadow={C.ink}>
            Nvidia frena
          </MaskLine>
        </div>
        <MaskLine delay={-5} size={110} shadow={C.ink}>
          sus servidores de IA
        </MaskLine>
        <MaskLine delay={fPaises - 6} size={110} shadow={C.ink}>
          a <span style={{ color: C.yellow }}>4 países</span>
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 540 - 220, top: 760 }}>
        <ServerRack w={440} stop={stop} />
      </div>
      <Chip text="Sudeste asiático" delay={fAsia - 6} color={C.white} size={44} style={{ left: 330, top: 1190 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. PAÍSES + quién lo cuenta
// =====================================================================
const COUNTRIES = [
  { q: "malasia", name: "Malasia", code: "MY" },
  { q: "singapur", name: "Singapur", code: "SG" },
  { q: "tailandia", name: "Tailandia", code: "TH" },
  { q: "indonesia", name: "Indonesia", code: "ID" },
];
const Paises: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("paises", q, startMs);
  const fFt = w("financial");
  const fDell = w("dell");
  const fSup = w("supermicro");
  return (
    <AbsoluteFill>
      <TechBackdrop hue="#0B1A06" />
      <Bar active={1} />
      <div style={{ position: "absolute", left: 80, right: 80, top: 250, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
        {COUNTRIES.map((c, i) => {
          const at = i === 0 ? 0 : w(c.q) - 2;
          const sp = popSpring(frame, fps, at);
          const x = ramp(frame, at + 6, 6);
          return (
            <div
              key={c.code}
              style={{
                height: 250,
                borderRadius: 24,
                background: "rgba(10,14,10,0.9)",
                border: `5px solid ${x > 0.5 ? C.red : C.nv}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                scale: String(interpolate(sp, [0, 1], [0.5, 1])),
                opacity: frame >= at ? 1 : 0,
              }}
            >
              <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 40, color: C.nvLight, letterSpacing: "0.1em" }}>{c.code}</div>
              <div style={{ fontFamily: FONT_HEAD, fontSize: 96, color: C.white, lineHeight: 1.05 }}>{c.name}</div>
              <div style={{ position: "absolute", right: 14, top: 10, fontFamily: FONT_HEAD, fontSize: 70, color: C.red, opacity: x, scale: String(interpolate(x, [0, 1], [1.8, 1])) }}>✕</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 830, opacity: ramp(frame, fFt - 4, 6) }}>
        <div style={{ display: "inline-block", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 34, color: C.ink, background: "#FCD0B1", padding: "8px 22px", borderRadius: 8 }}>SEGÚN EL FINANCIAL TIMES</div>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 920, display: "flex", alignItems: "center", gap: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, scale: String(popSpring(frame, fps, fDell - 2)), opacity: frame >= fDell - 2 ? 1 : 0 }}>
          <BrandLogo slug="dell" size={130} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, scale: String(popSpring(frame, fps, fSup - 2)), opacity: frame >= fSup - 2 ? 1 : 0 }}>
          <BrandLogo slug="supermicro" size={130} />
          <div style={{ fontFamily: FONT_HEAD, fontSize: 70, color: C.white }}>SUPERMICRO</div>
        </div>
      </div>
      <Chip text="Ya avisan a sus clientes" delay={w("avisando") - 2} color={C.yellow} textColor={C.ink} size={44} style={{ left: 80, top: 1120 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 4. MOTIVO: licencia de EE. UU. · China y los centros de datos
// =====================================================================
const Node: React.FC<{ label: string; sub: string; color: string; at: number; x: number }> = ({ label, sub, color, at, x }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 820,
        width: 280,
        height: 200,
        borderRadius: 24,
        background: "rgba(10,14,10,0.92)",
        border: `5px solid ${color}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        scale: String(popSpring(frame, fps, at)),
        opacity: frame >= at ? 1 : 0,
      }}
    >
      <div style={{ fontFamily: FONT_HEAD, fontSize: 66, color: C.white, lineHeight: 1 }}>{label}</div>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 26, color, marginTop: 8, textAlign: "center" }}>{sub}</div>
    </div>
  );
};
const Motivo: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("motivo", q, startMs);
  const fEeuu = w("estados");
  const fLic = w("licencia");
  const fChina = w("china");
  const fCen = w("centros");
  const card = softSpring(frame, fps, fEeuu - 4);
  const cut = ramp(frame, fCen + 10, 8);
  const sh = useShake(fCen + 10, 8, 10);
  return (
    <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px` }}>
      <TechBackdrop hue="#0B1A06" />
      <Bar active={2} />
      <div style={{ position: "absolute", left: 80, top: 240 }}>
        <MaskLine delay={0} size={100} shadow={C.ink}>
          El motivo
        </MaskLine>
      </div>
      {/* documento de licencia (dibujo propio) */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 400,
          height: 300,
          borderRadius: 22,
          background: "#F4F1E8",
          padding: "30px 40px",
          rotate: "-2deg",
          translate: `0 ${interpolate(card, [0, 1], [60, 0])}px`,
          opacity: card,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 30, color: "#5a5a5a", letterSpacing: "0.1em" }}>EE. UU. · DEPARTAMENTO DE COMERCIO</div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 96, color: C.ink, lineHeight: 1.1, marginTop: 10 }}>LICENCIA</div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 64, color: "#1a1a1a", lineHeight: 1.1 }}>OBLIGATORIA</div>
      </div>
      <Stamp text="Exigida" delay={fLic} color={C.red} size={80} rotate={-10} style={{ left: 600, top: 560 }} />
      {/* esquema: chips -> centro de datos -> China */}
      <Node label="CHIPS" sub="Nvidia" color={C.nv} at={fChina - 8} x={40} />
      <Node label="CENTRO" sub="de datos en la zona" color={C.cyan} at={fCen - 4} x={400} />
      <Node label="CHINA" sub="acceso remoto" color={C.red} at={fChina} x={760} />
      {[0, 1].map((k) => (
        <div key={k} style={{ position: "absolute", left: 320 + k * 360, top: 912, width: 80, height: 10, background: k === 1 && cut > 0.5 ? C.red : C.white, opacity: ramp(frame, fCen, 6), borderRadius: 5 }} />
      ))}
      <div style={{ position: "absolute", left: 690, top: 870, fontFamily: FONT_HEAD, fontSize: 110, color: C.red, opacity: cut, scale: String(interpolate(cut, [0, 1], [2, 1])), textShadow: `0 0 30px ${C.red}` }}>✕</div>
      <Chip text="Que China no los use" delay={fCen + 10} color={C.red} textColor={C.white} size={44} style={{ left: 230, top: 1080 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 5. DURACIÓN: nadie lo sabe
// =====================================================================
const Duracion: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("duracion", q, startMs);
  const fPar = w("paron");
  const sand = interpolate(frame, [0, 70], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <TechBackdrop hue="#0B1A06" />
      <Bar active={3} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
        <MaskLine delay={0} size={120} shadow={C.ink}>
          ¿Hasta cuándo?
        </MaskLine>
      </div>
      {/* reloj de arena (dibujo propio) */}
      <svg viewBox="0 0 200 300" width={300} height={450} style={{ position: "absolute", left: 390, top: 470, rotate: `${Math.sin(frame / 12) * 4}deg`, scale: String(softSpring(frame, fps, 2)) }}>
        <rect x="20" y="10" width="160" height="16" rx="6" fill={C.nv} />
        <rect x="20" y="274" width="160" height="16" rx="6" fill={C.nv} />
        <path d="M 35 26 L 165 26 L 110 150 L 165 274 L 35 274 L 90 150 Z" fill="none" stroke="#e8f5d0" strokeWidth="6" />
        <path d={`M ${50 + 50 * sand} ${30 + 100 * sand} L ${150 - 50 * sand} ${30 + 100 * sand} L 100 146 Z`} fill={C.yellow} />
        <path d={`M 100 150 L ${100 + 55 * sand} 270 L ${100 - 55 * sand} 270 Z`} fill={C.yellow} />
        <line x1="100" y1="150" x2="100" y2="270" stroke={C.yellow} strokeWidth="3" />
      </svg>
      <Stamp text="Parón sin fecha" delay={fPar - 2} color={C.nvLight} size={100} rotate={-6} style={{ left: 180, top: 1000 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 6. CIERRE
// =====================================================================
const Cierre: React.FC<SceneProps> = (p) => (
  <Poll {...p} segId="cierre" line1="¿Servirá" line2="de algo?" footer="Fuentes: Financial Times · The National · Benzinga · The Decoder" bar={<Bar active={4} />} />
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
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 26, marginTop: 30 }}>
        <BrandLogo slug="nvidia" size={190} />
        <div style={{ fontFamily: FONT_HEAD, fontSize: 210, lineHeight: 1, color: C.nvLight, textShadow: `0 0 50px ${C.nv}, 8px 8px 0 ${C.ink}` }}>NVIDIA</div>
      </div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 230, lineHeight: 1.0, color: C.white, textShadow: `10px 10px 0 ${C.ink}`, marginTop: 10 }}>FRENA</div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 110, lineHeight: 1.08, color: C.white, textShadow: `6px 6px 0 ${C.ink}` }}>SUS SERVIDORES DE IA</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center", rotate: "-4deg" }}>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 110, color: C.white, background: C.red, padding: "6px 40px", borderRadius: 16, border: "6px solid #fff", letterSpacing: "0.04em" }}>ENVÍOS PARADOS</div>
    </div>
    <div style={{ position: "absolute", left: 90, right: 90, top: 1230, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18 }}>
      {["Malasia", "Singapur", "Tailandia", "Indonesia"].map((n) => (
        <div key={n} style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 46, color: C.ink, background: C.yellow, padding: "10px 26px", borderRadius: 999 }}>
          {n.toUpperCase()}
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1620, textAlign: "center", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 40, color: C.white, opacity: 0.9 }}>
      NOTICIA IA · TE LO CUENTO EN 1 MINUTO
    </div>
  </AbsoluteFill>
);

export const SCENES: SceneDef[] = [
  { key: "hook", firstSeg: "hook", C: Hook },
  { key: "lema", firstSeg: "lema", C: Lema, flash: C.nv },
  { key: "paises", firstSeg: "paises", C: Paises, flash: C.nvLight },
  { key: "motivo", firstSeg: "motivo", C: Motivo, flash: C.nv },
  { key: "duracion", firstSeg: "duracion", C: Duracion, flash: C.yellow },
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
      <Sfx at={at("hook", "frena") + 6} src="impact" volume={0.55} />
      <Sfx at={at("lema", "menos")} src="ding" volume={0.4} />
      <Sfx at={at("paises", "singapur") + 4} src="pop" volume={0.35} />
      <Sfx at={at("paises", "tailandia") + 4} src="pop" volume={0.35} />
      <Sfx at={at("paises", "indonesia") + 4} src="pop" volume={0.35} />
      <Sfx at={at("paises", "dell") - 2} src="whoosh" volume={0.3} />
      <Sfx at={at("motivo", "licencia")} src="impact" volume={0.45} />
      <Sfx at={at("motivo", "centros") + 10} src="glitch" volume={0.4} />
      <Sfx at={at("duracion", "paron") - 2} src="pop" volume={0.45} />
      <Sfx at={at("cierre", "comentarios")} src="pop" volume={0.5} />
    </>
  );
};
