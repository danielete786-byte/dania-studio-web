/**
 * HISTORIA: «GTA 6, el mayor lanzamiento de la historia de PlayStation» (Videojuegos · 24 nov 2026).
 * Fondos: arte oficial de prensa de rockstargames.com (public/img, no se sube a git).
 */
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, random, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg, Chip, MaskLine, Stamp, punch, useShake } from "./components";
import { C, FONT_BODY, FONT_HEAD, popSpring, softSpring, wordF } from "./lib";
import { Counter, HookBadge, Lema, NewsBar, Poll, SceneDef, SceneProps, TechBackdrop } from "./news";

const DATE = "24 NOV";
const Bar: React.FC<{ active: number }> = ({ active }) => <NewsBar active={active} total={4} label="VIDEOJUEGOS" date={DATE} />;
const millones = (v: number) => `${Math.round(v)}`;

// ---------- iconos propios ----------
const Player: React.FC<{ s: number; color: string }> = ({ s, color }) => (
  <svg viewBox="0 0 40 50" width={s} height={s * 1.25}>
    <circle cx="20" cy="12" r="10" fill={color} />
    <path d="M 2 48 Q 20 14 38 48 Z" fill={color} />
  </svg>
);
const Console: React.FC<{ w: number; on: boolean }> = ({ w, on }) => (
  <svg viewBox="0 0 60 110" width={w} height={(w * 110) / 60}>
    <path d="M 8 4 Q 30 0 52 4 L 46 106 L 14 106 Z" fill={on ? "#fff" : "#2a2a33"} />
    <rect x="25" y="6" width="10" height="98" rx="4" fill={on ? C.nv : "#16161c"} />
  </svg>
);
const Clock: React.FC<{ w: number; t: number }> = ({ w, t }) => (
  <svg viewBox="-60 -60 120 120" width={w} height={w}>
    <circle r="54" fill="#1a0a14" stroke={C.nv} strokeWidth="8" />
    {Array.from({ length: 12 }, (_, i) => (
      <line key={i} x1="0" y1="-44" x2="0" y2="-36" stroke="#fff" strokeWidth="4" transform={`rotate(${i * 30})`} />
    ))}
    <line x1="0" y1="0" x2="0" y2="-38" stroke="#fff" strokeWidth="5" strokeLinecap="round" transform={`rotate(${t * 40})`} />
    <line x1="0" y1="0" x2="0" y2="-26" stroke={C.nvLight} strokeWidth="7" strokeLinecap="round" transform={`rotate(${t * 3.3})`} />
    <circle r="6" fill={C.nvLight} />
  </svg>
);

// =====================================================================
// 1. GANCHO
// =====================================================================
const Hook: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("hook", q, startMs);
  const fPS = w("playstation");
  const fMas = w("mas");
  const fDias = w("4");
  const sh = useShake(fMas + 4, 10, 16);
  const z = punch(frame, fps, fPS, 0.05) * punch(frame, fps, fMas + 4, 0.07);
  return (
    <AbsoluteFill style={{ scale: String(z), translate: `${sh.x}px ${sh.y}px` }}>
      <Bg src="img/keyart.jpg" dur={dur} dim={0.55} from={1.12} to={1.28} y={[0, -50]} />
      <HookBadge label="ÚLTIMA HORA" date="24 NOV 2026" />
      <div style={{ position: "absolute", left: 80, top: 230 }}>
        <MaskLine delay={-9} size={150} shadow={C.nv}>
          GTA 6 rompe
        </MaskLine>
        <MaskLine delay={fPS - 8} size={110} shadow={C.ink}>
          la historia de
        </MaskLine>
        <MaskLine delay={fPS - 3} size={140} color={C.nvLight} shadow={C.ink}>
          PlayStation
        </MaskLine>
      </div>
      <Counter from={0} to={39} start={fMas} dur={18} prefix="+" format={millones} suffix=" M" color={C.white} size={220} style={{ left: 80, top: 820 }} />
      <Chip text="jugadores en PS5" delay={fMas + 10} color={C.nv} textColor={C.white} size={44} style={{ left: 90, top: 1080 }} />
      <Stamp text="En 4 días" delay={fDias} color={C.yellow} size={80} rotate={-8} style={{ left: 600, top: 1060 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. HORAS JUGADAS
// =====================================================================
const Horas: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("horas", q, startMs);
  const fSony = w("sony");
  const fNum = w("683");
  const fJug = w("17");
  const z = punch(frame, fps, fNum + 6, 0.06);
  return (
    <AbsoluteFill style={{ scale: String(z) }}>
      <TechBackdrop hue="#2a0618" />
      <Bar active={1} />
      <Chip text="Datos de Sony" delay={fSony} color={C.white} size={40} style={{ left: 80, top: 230 }} />
      <div style={{ position: "absolute", left: 540 - 200, top: 330, scale: String(popSpring(frame, fps, 2)) }}>
        <Clock w={400} t={frame} />
      </div>
      <Counter from={0} to={683} start={fNum - 2} dur={22} format={millones} color={C.nvLight} size={240} style={{ left: 0, right: 0, top: 760, textAlign: "center" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1010, textAlign: "center", opacity: frame >= fNum + 6 ? 1 : 0 }}>
        <MaskLine delay={fNum + 6} size={84} shadow={C.ink}>
          millones de horas
        </MaskLine>
      </div>
      <Chip text="+17 h por jugador" delay={fJug} color={C.yellow} textColor={C.ink} size={44} style={{ left: 330, top: 1150 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 4. RÉCORDS: simultáneos + 7 de cada 10 consolas nuevas
// =====================================================================
const Record: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("record", q, startMs);
  const fRec = w("record");
  const fSim = w("simultaneos");
  const fPrim = w("primero");
  const fSiete = w("7");
  const toB = softSpring(frame, fps, fPrim - 4);
  return (
    <AbsoluteFill>
      <TechBackdrop hue="#2a0618" />
      <Bar active={2} />
      {/* A: multitud de jugadores a la vez */}
      <div style={{ opacity: 1 - toB }}>
        <div style={{ position: "absolute", left: 70, right: 70, top: 300, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
          {Array.from({ length: 60 }, (_, i) => {
            const s = popSpring(frame, fps, fSim - 14 + Math.floor(random(`p${i}`) * 16));
            return (
              <div key={i} style={{ scale: String(s) }}>
                <Player s={70} color={i % 7 === 0 ? C.nvLight : "#ffffff"} />
              </div>
            );
          })}
        </div>
        <Stamp text="Récord" delay={fRec} color={C.nvLight} size={150} rotate={-8} style={{ left: 260, top: 560 }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 1080, textAlign: "center" }}>
          <MaskLine delay={fSim - 2} size={80} shadow={C.ink}>
            jugadores a la vez
          </MaskLine>
        </div>
      </div>
      {/* B: 7 de cada 10 consolas nuevas */}
      {frame >= fPrim - 6 ? (
        <div style={{ opacity: toB }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
            <MaskLine delay={fPrim - 4} size={96} shadow={C.ink}>
              Lo primero que se jugó
            </MaskLine>
          </div>
          <div style={{ position: "absolute", left: 90, right: 90, top: 520, display: "flex", flexWrap: "wrap", gap: 30, justifyContent: "center" }}>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} style={{ scale: String(popSpring(frame, fps, fPrim + i * 2)) }}>
                <Console w={120} on={i < 7 && frame >= fSiete + i * 2} />
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1000, textAlign: "center", fontFamily: FONT_HEAD, fontSize: 130, color: C.nvLight, textShadow: `6px 6px 0 ${C.ink}`, scale: String(popSpring(frame, fps, fSiete)), opacity: frame >= fSiete ? 1 : 0 }}>
            7 DE CADA 10
          </div>
          <Chip text="consolas nuevas" delay={fSiete + 6} color={C.white} size={40} style={{ left: 360, top: 1170 }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// =====================================================================
// 5. OJO: jugadores ≠ copias vendidas
// =====================================================================
const Ojo: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("ojo", q, startMs);
  const fJug = w("jugadores");
  const fCop = w("copias");
  const sh = useShake(fCop, 8, 12);
  return (
    <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px` }}>
      <TechBackdrop hue="#1d1606" glow={C.yellow} />
      <Bar active={3} />
      <Stamp text="Ojo" delay={0} color={C.yellow} size={140} rotate={-6} style={{ left: 380, top: 260 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 150, color: C.white, scale: String(popSpring(frame, fps, fJug - 2)), opacity: frame >= fJug - 2 ? 1 : 0 }}>JUGADORES</div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 180, color: C.red, lineHeight: 0.9, scale: String(popSpring(frame, fps, fCop - 4)), opacity: frame >= fCop - 4 ? 1 : 0 }}>≠</div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 130, color: C.yellow, scale: String(popSpring(frame, fps, fCop)), opacity: frame >= fCop ? 1 : 0 }}>COPIAS VENDIDAS</div>
      </div>
      <Chip text="Ventas oficiales de la semana: aún sin cifra" delay={fCop + 10} color={C.white} size={30} style={{ left: 150, top: 1150 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 6. CIERRE
// =====================================================================
const Cierre: React.FC<SceneProps> = (p) => (
  <Poll {...p} segId="cierre" line1="¿Ya lo" line2="estás jugando?" footer="Fuentes: PlayStation · HotHardware · Mixed · VGTimes" bar={<Bar active={4} />} />
);

// =====================================================================
// MINIATURA (portada TikTok 1080×1920; zona clave y 240-1680)
// =====================================================================
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.ink }}>
    <Img src={staticFile("img/keyart.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: "1.15" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,6,24,0.8) 0%, rgba(11,6,24,0.5) 40%, rgba(11,6,24,0.85) 70%, rgba(11,6,24,0.95) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 44, color: C.white, background: C.red, padding: "10px 26px", borderRadius: 10, letterSpacing: "0.08em" }}>
        ● ÚLTIMA HORA
      </div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 250, lineHeight: 0.95, color: C.white, marginTop: 30, textShadow: `10px 10px 0 ${C.ink}` }}>GTA 6</div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 250, lineHeight: 0.95, color: C.nvLight, textShadow: `0 0 60px ${C.nv}, 10px 10px 0 ${C.ink}` }}>RÉCORD</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 900, textAlign: "center" }}>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 300, lineHeight: 1, color: C.white, textShadow: `8px 8px 0 ${C.ink}` }}>39</div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 160, lineHeight: 1, color: C.white, textShadow: `8px 8px 0 ${C.ink}`, whiteSpace: "nowrap" }}>MILLONES</div>
      <div style={{ display: "inline-block", marginTop: 16, fontFamily: FONT_BODY, fontWeight: 900, fontSize: 54, color: C.ink, background: C.yellow, padding: "10px 30px", borderRadius: 999, rotate: "-3deg" }}>
        DE JUGADORES EN 4 DÍAS
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1620, textAlign: "center", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 40, color: C.white, opacity: 0.9 }}>
      PLAYSTATION · TE LO CUENTO EN 1 MINUTO
    </div>
  </AbsoluteFill>
);

export const SCENES: SceneDef[] = [
  { key: "hook", firstSeg: "hook", C: Hook },
  { key: "lema", firstSeg: "lema", C: Lema, flash: C.nv },
  { key: "horas", firstSeg: "horas", C: Horas, flash: C.nvLight },
  { key: "record", firstSeg: "record", C: Record, flash: C.nv },
  { key: "ojo", firstSeg: "ojo", C: Ojo, flash: C.yellow },
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
      <Sfx at={at("hook", "mas") - 2} src="riser" volume={0.3} />
      <Sfx at={at("hook", "4")} src="impact" volume={0.5} />
      <Sfx at={at("lema", "menos")} src="ding" volume={0.4} />
      <Sfx at={at("horas", "683")} src="riser" volume={0.3} />
      <Sfx at={at("horas", "17")} src="pop" volume={0.45} />
      <Sfx at={at("record", "record")} src="impact" volume={0.5} />
      <Sfx at={at("record", "7")} src="ding" volume={0.4} />
      <Sfx at={at("ojo", "copias")} src="glitch" volume={0.45} />
      <Sfx at={at("cierre", "comentarios")} src="pop" volume={0.5} />
    </>
  );
};
