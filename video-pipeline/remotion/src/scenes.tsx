/**
 * HISTORIA: «Nvidia readmite a Jensen Huang» (IA · 24 nov 2026).
 * Exporta SCENES (una escena por bloque del guion) y SfxCues.
 */
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Chip, MaskLine, Stamp, punch, useShake } from "./components";
import { C, clamp, EASE_MOVE, FONT_BODY, FONT_HEAD, popSpring, ramp, softSpring, wordF } from "./lib";
import { Counter, HookBadge, Lema, NewsBar, Poll, SceneDef, SceneProps, TechBackdrop } from "./news";

const DATE = "24 NOV";
const Bar: React.FC<{ active: number }> = ({ active }) => <NewsBar active={active} total={4} label="NOTICIA IA" date={DATE} />;

// ---------- silla de CEO (ilustración propia) ----------
const CeoChair: React.FC<{ w: number; spot: number; glow: number }> = ({ w, spot, glow }) => (
  <svg viewBox="0 0 500 520" width={w} height={(w * 520) / 500} style={{ filter: glow ? `drop-shadow(0 0 ${30 * glow}px ${C.nv})` : undefined }}>
    <defs>
      <radialGradient id="spot" cx="0.5" cy="0.1" r="0.9">
        <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <path d="M 170 0 L 330 0 L 470 520 L 30 520 Z" fill="url(#spot)" opacity={spot} />
    <ellipse cx="250" cy="490" rx="170" ry="22" fill="#000" opacity="0.6" />
    <rect x="150" y="90" width="200" height="230" rx="40" fill="#1d1f1c" stroke={C.nv} strokeWidth="5" />
    <rect x="175" y="115" width="150" height="180" rx="28" fill="#2a2d29" />
    <rect x="130" y="300" width="240" height="60" rx="26" fill="#1d1f1c" stroke={C.nv} strokeWidth="5" />
    <rect x="110" y="250" width="40" height="90" rx="16" fill="#1d1f1c" />
    <rect x="350" y="250" width="40" height="90" rx="16" fill="#1d1f1c" />
    <rect x="238" y="360" width="24" height="90" fill="#3a3d39" />
    {[-1, -0.5, 0, 0.5, 1].map((k, i) => (
      <line key={i} x1="250" y1="450" x2={250 + k * 140} y2={478 - Math.abs(k) * 6} stroke="#3a3d39" strokeWidth="14" strokeLinecap="round" />
    ))}
    <rect x="195" y="190" width="110" height="46" rx="8" fill={C.nv} />
    <text x="250" y="224" textAnchor="middle" fontFamily="Anton" fontSize="34" fill={C.ink}>
      CEO
    </text>
  </svg>
);

// =====================================================================
// 1. GANCHO
// =====================================================================
const Hook: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("hook", q, startMs);
  const fNv = w("nvidia");
  const fJen = w("jensen");
  const fOnce = w("11");
  const fDim = w("dimitiera");
  const sh = useShake(fDim, 10, 16);
  const chair = popSpring(frame, fps, fJen - 4);
  const back = ramp(frame, fDim - 2, 10);
  const z = punch(frame, fps, fJen, 0.05) * punch(frame, fps, fDim, 0.07);
  return (
    <AbsoluteFill style={{ scale: String(z), translate: `${sh.x}px ${sh.y}px` }}>
      <TechBackdrop hue="#0B1A06" />
      <HookBadge label="ÚLTIMA HORA" date="24 NOV 2026" />
      <div style={{ position: "absolute", left: 80, top: 230 }}>
        <MaskLine delay={-9} size={124} shadow={C.red}>
          Giro total:
        </MaskLine>
        <MaskLine delay={fNv - 4} size={124} shadow={C.ink}>
          <span style={{ color: C.nvLight }}>Nvidia</span> vuelve
        </MaskLine>
        <MaskLine delay={fNv + 2} size={124} shadow={C.ink}>
          a contratar a
        </MaskLine>
        <MaskLine delay={fJen - 3} size={140} color={C.nvLight} shadow={C.ink}>
          Jensen Huang
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 540 - 190, top: 840, scale: String(interpolate(chair, [0, 1], [0.5, 1])), opacity: interpolate(chair, [0, 0.3], [0, 1], clamp) }}>
        <CeoChair w={380} spot={0.5 + 0.5 * back} glow={back} />
      </div>
      {frame < fDim - 1 ? <Chip text="Solo 11 días después" delay={fOnce} color={C.white} size={34} style={{ left: 600, top: 1060, rotate: "-4deg" }} /> : null}
      <Stamp text="De vuelta" delay={fDim} color={C.nvLight} size={110} rotate={-8} style={{ left: 250, top: 950 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. CONSEJO: unanimidad + seguridad nacional
// =====================================================================
const Consejo: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("consejo", q, startMs);
  const fCons = w("consejo");
  const fUnan = w("unanimidad");
  const fAseg = w("asegura");
  const fRiesgo = w("riesgo");
  const toB = softSpring(frame, fps, fAseg - 2);
  const table = popSpring(frame, fps, 0);
  const seats = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    return { x: 540 + Math.cos(a) * 330, y: 740 + Math.sin(a) * 250 };
  });
  const z = punch(frame, fps, fUnan, 0.05);
  return (
    <AbsoluteFill style={{ scale: String(z) }}>
      <TechBackdrop />
      <Bar active={1} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center" }}>
        <MaskLine delay={fCons - 2} size={120} shadow={C.ink}>
          El consejo vota
        </MaskLine>
      </div>
      {/* parte A: mesa con todos los votos a favor */}
      <div style={{ position: "absolute", inset: 0, opacity: 1 - toB, scale: String(1 - toB * 0.2), translate: `0 ${-toB * 80}px` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", scale: String(table) }}>
          <ellipse cx={540} cy={740} rx={250} ry={170} fill="#1b2614" stroke={C.nv} strokeWidth={8} />
          <text x={540} y={770} textAnchor="middle" fontFamily="Anton" fontSize={90} fill={C.nvLight} opacity={0.35}>
            NVIDIA
          </text>
          {seats.map((s, i) => {
            const sp = popSpring(frame, fps, fUnan - 6 + i * 2);
            return (
              <g key={i}>
                <circle cx={s.x} cy={s.y} r={52} fill="#2b2f2a" stroke="#fff" strokeOpacity={0.4} strokeWidth={4} />
                <circle cx={s.x} cy={s.y - 8} r={18} fill="#9aa39a" />
                <path d={`M ${s.x - 28} ${s.y + 30} Q ${s.x} ${s.y} ${s.x + 28} ${s.y + 30} Z`} fill="#9aa39a" />
                <g opacity={frame >= fUnan - 6 + i * 2 ? 1 : 0} transform={`translate(${s.x} ${s.y}) scale(${sp})`}>
                  <circle r={52} fill={C.nv} />
                  <path d="M -22 2 L -6 18 L 24 -16" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </g>
            );
          })}
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1040, textAlign: "center", fontFamily: FONT_HEAD, fontSize: 140, color: C.nvLight, textShadow: `6px 6px 0 ${C.ink}`, scale: String(popSpring(frame, fps, fUnan + 4)), opacity: frame >= fUnan + 4 ? 1 : 0 }}>
          8 DE 8: SÍ
        </div>
      </div>
      {/* parte B: escudo de seguridad nacional */}
      {frame >= fAseg - 4 ? (
        <div style={{ position: "absolute", inset: 0, opacity: toB }}>
          <div style={{ position: "absolute", left: 540 - 170, top: 430, scale: String(popSpring(frame, fps, fAseg - 2)) }}>
            <svg viewBox="0 0 200 230" width={340} height={391}>
              <path d="M 100 8 L 186 40 V 110 C 186 165 148 205 100 222 C 52 205 14 165 14 110 V 40 Z" fill="#10220a" stroke={C.nv} strokeWidth="8" />
              <path d="M 62 115 L 90 143 L 142 88" stroke={C.nvLight} strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={160} strokeDashoffset={160 * (1 - ramp(frame, fRiesgo - 4, 12))} />
            </svg>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 880, textAlign: "center" }}>
            <MaskLine delay={fRiesgo - 4} size={96} shadow={C.ink}>
              «Sin riesgo para la
            </MaskLine>
            <MaskLine delay={fRiesgo} size={96} color={C.nvLight} shadow={C.ink}>
              seguridad nacional»
            </MaskLine>
          </div>
          <Chip text="Según el consejo de Nvidia" delay={fRiesgo + 10} color={C.white} size={32} style={{ left: 300, top: 1150 }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// =====================================================================
// 4. BOLSA: +31 %, mejor día en 23 años, casi 1 billón $
// =====================================================================
const Bolsa: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("bolsa", q, startMs);
  const fDisp = w("disparo");
  const f31 = w("31");
  const fMejor = w("mejor");
  const fBillon = w("billon");
  // serie ilustrativa: plano y salto del 31 %
  const pts = [100, 99, 101, 98, 100, 99, 101, 112, 124, 131.5];
  const X0 = 110,
    X1 = 970,
    Y0 = 560,
    Y1 = 960;
  const yv = (v: number) => Y0 + ((134 - v) / (134 - 94)) * (Y1 - Y0);
  const xv = (i: number) => X0 + (i / (pts.length - 1)) * (X1 - X0);
  const path = pts.map((v, i) => `${i ? "L" : "M"} ${xv(i)} ${yv(v)}`).join(" ");
  const pd = ramp(frame, fDisp - 10, 30, EASE_MOVE);
  const sh = useShake(f31, 10, 16);
  const z = punch(frame, fps, f31, 0.07) * punch(frame, fps, fBillon, 0.05);
  return (
    <AbsoluteFill style={{ scale: String(z), translate: `${sh.x}px ${sh.y}px` }}>
      <TechBackdrop hue="#0E2108" />
      <Bar active={2} />
      <div style={{ position: "absolute", left: 80, top: 230, display: "flex", gap: 18, alignItems: "baseline" }}>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 110, color: C.white }}>NVDA</div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 800, fontSize: 30, color: C.white, opacity: 0.75, lineHeight: 1.3 }}>
          Nasdaq · lunes 23 nov
          <div style={{ fontSize: 22, opacity: 0.7 }}>Gráfico ilustrativo · cierre: 165,05 $</div>
        </div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={X0} x2={X1} y1={Y0 + (i * (Y1 - Y0)) / 4} y2={Y0 + (i * (Y1 - Y0)) / 4} stroke="#fff" strokeOpacity={0.1} strokeWidth={2} />
        ))}
        <path d={path} fill="none" stroke={C.nvLight} strokeWidth={10} strokeLinejoin="round" strokeDasharray={2400} strokeDashoffset={2400 * (1 - pd)} />
        {pd > 0.98 ? <circle cx={xv(pts.length - 1)} cy={yv(131.5)} r={16 + 4 * Math.abs(Math.sin(frame / 4))} fill={C.nvLight} /> : null}
      </svg>
      <Counter from={0} to={31} start={f31 - 2} dur={14} prefix="+" suffix="%" color={C.nvLight} size={200} style={{ left: 90, top: 990 }} />
      <Chip text="Mejor día en 23 años" delay={fMejor} color={C.yellow} textColor={C.ink} size={30} style={{ left: 520, top: 1035 }} />
      <Chip text="+1 billón $ de valor" delay={fBillon - 2} color={C.nv} textColor={C.ink} size={30} style={{ left: 520, top: 1120 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 5. TRUMP + INVESTIGACIÓN ABIERTA
// =====================================================================
const Trump: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("trump", q, startMs);
  const fConv = w("convencio");
  const fPero = w("pero");
  const fInv = w("investigacion");
  const card = softSpring(frame, fps, 0);
  const lens = popSpring(frame, fps, fInv - 4);
  return (
    <AbsoluteFill>
      <TechBackdrop hue="#1d1606" glow={C.yellow} />
      <Bar active={3} />
      {/* cita atribuida (parafraseada), no imita ninguna red social */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 260,
          background: "rgba(255,255,255,0.96)",
          borderRadius: 30,
          padding: "34px 40px",
          translate: `0 ${interpolate(card, [0, 1], [-600, 0])}px`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ fontFamily: FONT_HEAD, fontSize: 96, color: C.ink, lineHeight: 1.05 }}>
          «Convencí <span style={{ color: C.red }}>a la junta</span>»
        </div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 800, fontSize: 30, color: "#555", marginTop: 12 }}>— Donald Trump (parafraseado)</div>
      </div>
      {frame >= fConv ? <Chip text="Él se atribuye el regreso" delay={fConv} color={C.red} textColor={C.white} size={36} style={{ left: 280, top: 560 }} /> : null}
      {/* lupa: investigación abierta */}
      <div style={{ position: "absolute", left: 540 - 150, top: 680, scale: String(lens), opacity: frame >= fInv - 4 ? 1 : 0, rotate: `${Math.sin(frame / 6) * 8}deg` }}>
        <svg viewBox="0 0 200 200" width={300} height={300}>
          <circle cx="84" cy="84" r="58" fill="#1b1a10" stroke={C.yellow} strokeWidth="14" />
          <circle cx="84" cy="84" r="40" fill={C.yellow} opacity="0.15" />
          <line x1="128" y1="128" x2="184" y2="184" stroke={C.yellow} strokeWidth="22" strokeLinecap="round" />
        </svg>
      </div>
      <Stamp text="Investigación abierta" delay={fInv} color={C.yellow} size={80} rotate={-6} style={{ left: 120, top: 1000 }} />
      {frame >= fPero ? <Chip text="Políticos de ambos partidos la cuestionan" delay={fInv + 12} color={C.white} size={26} style={{ left: 130, top: 1165 }} /> : null}
    </AbsoluteFill>
  );
};

// =====================================================================
// 6. CIERRE
// =====================================================================
const Cierre: React.FC<SceneProps> = (p) => (
  <Poll {...p} segId="cierre" line1="¿Ha hecho" line2="bien Nvidia?" footer="Fuentes: Nvidia · NPR · PBS · Bloomberg Línea · Yahoo Finance" bar={<Bar active={4} />} />
);

export const SCENES: SceneDef[] = [
  { key: "hook", firstSeg: "hook", C: Hook },
  { key: "lema", firstSeg: "lema", C: Lema, flash: C.nv },
  { key: "consejo", firstSeg: "consejo", C: Consejo, flash: C.nvLight },
  { key: "bolsa", firstSeg: "bolsa", C: Bolsa, flash: C.nv },
  { key: "trump", firstSeg: "trump", C: Trump, flash: C.yellow },
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
      <Sfx at={at("hook", "jensen")} src="pop" volume={0.45} />
      <Sfx at={at("hook", "dimitiera")} src="impact" volume={0.5} />
      <Sfx at={at("lema", "menos")} src="ding" volume={0.4} />
      <Sfx at={at("consejo", "unanimidad") - 6} src="pop" volume={0.45} />
      <Sfx at={at("consejo", "riesgo")} src="ding" volume={0.4} />
      <Sfx at={at("bolsa", "disparo") - 8} src="riser" volume={0.35} />
      <Sfx at={at("bolsa", "31")} src="impact" volume={0.5} />
      <Sfx at={at("bolsa", "billon")} src="cash" volume={0.45} />
      <Sfx at={at("trump", "convencio")} src="pop" volume={0.45} />
      <Sfx at={at("trump", "investigacion")} src="glitch" volume={0.4} />
      <Sfx at={at("cierre", "comentarios")} src="pop" volume={0.5} />
    </>
  );
};
