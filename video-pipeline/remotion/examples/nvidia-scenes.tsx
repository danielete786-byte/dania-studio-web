import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { CommentBubble } from "./art";
import { Chip, MaskLine, Stamp, TopBar, punch, useShake } from "./components";
import { C, clamp, EASE_IN, EASE_MOVE, FONT_BODY, FONT_HEAD, popSpring, ramp, softSpring, wordF } from "./lib";

export type SceneProps = { dur: number; startMs: number };

const TOTAL = 4;
const Bar: React.FC<{ active: number }> = ({ active }) => (
  <TopBar
    active={active}
    total={TOTAL}
    color={C.nv}
    label={
      <>
        NOTICIA IA · <span style={{ color: C.nvLight }}>23 NOV</span>
      </>
    }
  />
);

// =====================================================================
// Fondo tecnológico: rejilla + pistas de circuito con pulsos + brillo
// =====================================================================
export const TechBackdrop: React.FC<{ glow?: string; hue?: string }> = ({ glow = C.nv, hue = "#0B1A06" }) => {
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

// =====================================================================
// 1. GANCHO: Trump pide readmitir a Huang
// =====================================================================
const CeoChair: React.FC<{ w: number; spot: number }> = ({ w, spot }) => (
  <svg viewBox="0 0 500 520" width={w} height={(w * 520) / 500}>
    <defs>
      <radialGradient id="spot" cx="0.5" cy="0.1" r="0.9">
        <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <path d="M 170 0 L 330 0 L 470 520 L 30 520 Z" fill="url(#spot)" opacity={spot} />
    <ellipse cx="250" cy="490" rx="170" ry="22" fill="#000" opacity="0.6" />
    {/* respaldo */}
    <rect x="150" y="90" width="200" height="230" rx="40" fill="#1d1f1c" stroke={C.nv} strokeWidth="5" />
    <rect x="175" y="115" width="150" height="180" rx="28" fill="#2a2d29" />
    {/* asiento */}
    <rect x="130" y="300" width="240" height="60" rx="26" fill="#1d1f1c" stroke={C.nv} strokeWidth="5" />
    {/* brazos */}
    <rect x="110" y="250" width="40" height="90" rx="16" fill="#1d1f1c" />
    <rect x="350" y="250" width="40" height="90" rx="16" fill="#1d1f1c" />
    {/* pie */}
    <rect x="238" y="360" width="24" height="90" fill="#3a3d39" />
    {[-1, -0.5, 0, 0.5, 1].map((k, i) => (
      <line key={i} x1="250" y1="450" x2={250 + k * 140} y2={478 - Math.abs(k) * 6} stroke="#3a3d39" strokeWidth="14" strokeLinecap="round" />
    ))}
    {/* placa */}
    <rect x="195" y="190" width="110" height="46" rx="8" fill={C.nv} />
    <text x="250" y="224" textAnchor="middle" fontFamily="Anton" fontSize="34" fill={C.ink}>
      CEO
    </text>
  </svg>
);

export const Hook: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("hook", q, startMs);
  const fNv = w("nvidia");
  const fJen = w("jensen");
  const fEsc = w("escandalo");
  const sh = useShake(fEsc, 12, 20);
  const chair = popSpring(frame, fps, fJen - 4);
  const blink = Math.floor(frame / 8) % 2 === 0 ? 1 : 0.35;
  const z = punch(frame, fps, fJen, 0.05) * punch(frame, fps, fEsc, 0.07);
  return (
    <AbsoluteFill style={{ scale: String(z), translate: `${sh.x}px ${sh.y}px` }}>
      <TechBackdrop />
      <div style={{ position: "absolute", left: 80, top: 120, display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 34, color: C.white, background: C.red, padding: "8px 18px", borderRadius: 8, letterSpacing: "0.1em" }}>
          <span style={{ opacity: blink }}>●</span> ÚLTIMA HORA
        </div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 800, fontSize: 30, color: C.white, opacity: 0.85 }}>23 NOV 2026</div>
      </div>
      <div style={{ position: "absolute", left: 80, top: 230 }}>
        <MaskLine delay={-9} size={132} shadow={C.red}>
          Trump pide
        </MaskLine>
        <MaskLine delay={fNv - 4} size={132} shadow={C.ink}>
          que <span style={{ color: C.nvLight }}>Nvidia</span>
        </MaskLine>
        <MaskLine delay={fNv + 2} size={132} shadow={C.ink}>
          readmita a
        </MaskLine>
        <MaskLine delay={fJen - 3} size={150} color={C.nvLight} shadow={C.ink}>
          Jensen Huang
        </MaskLine>
      </div>
      <div
        style={{
          position: "absolute",
          left: 540 - 190,
          top: 835,
          scale: String(interpolate(chair, [0, 1], [0.5, 1])),
          opacity: interpolate(chair, [0, 0.3], [0, 1], clamp),
        }}
      >
        <CeoChair w={380} spot={0.6 + 0.4 * Math.sin(frame / 6)} />
      </div>
      {frame < fEsc - 1 ? <Chip text="Silla vacía desde el 12 nov" delay={fJen + 8} color={C.white} size={32} style={{ left: 560, top: 1060, rotate: "-4deg" }} /> : null}
      <Stamp text="Escándalo" delay={fEsc} color={C.red} size={110} rotate={-9} style={{ left: 250, top: 930 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 2. LEMA: te lo cuento en menos de un minuto
// =====================================================================
export const Lema: React.FC<SceneProps> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sweep = interpolate(frame, [0, dur], [0, 1], { ...clamp, easing: EASE_MOVE });
  const pop = popSpring(frame, fps, 0);
  const R = 230;
  const L = 2 * Math.PI * R;
  return (
    <AbsoluteFill>
      <TechBackdrop hue="#14240A" />
      <div style={{ position: "absolute", left: 540 - 280, top: 300, width: 560, height: 560, scale: String(pop) }}>
        <svg width={560} height={600} viewBox="0 -40 560 600">
          <rect x="250" y="-38" width="60" height="40" rx="8" fill={C.white} />
          <circle cx="280" cy="280" r={R + 24} fill="#0d150a" stroke={C.white} strokeWidth="10" />
          <circle cx="280" cy="280" r={R} fill="none" stroke="#1f2d18" strokeWidth="34" />
          <circle
            cx="280"
            cy="280"
            r={R}
            fill="none"
            stroke={C.nv}
            strokeWidth="34"
            strokeDasharray={L}
            strokeDashoffset={L * (1 - sweep * 0.92)}
            transform="rotate(-90 280 280)"
            strokeLinecap="round"
          />
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
        <div
          style={{
            marginTop: 10,
            fontFamily: FONT_HEAD,
            fontSize: 120,
            color: C.ink,
            background: C.nv,
            padding: "0 30px 10px",
            rotate: "-2deg",
            scale: String(popSpring(frame, fps, 6)),
            boxShadow: `0 0 50px ${C.nv}`,
          }}
        >
          MENOS DE 1 MINUTO
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. DIMISIÓN
// =====================================================================
const BrokenHeart: React.FC<{ w: number; split: number }> = ({ w, split }) => (
  <svg viewBox="0 0 220 200" width={w} height={(w * 200) / 220}>
    <g transform={`translate(${-split * 18} 0) rotate(${-split * 10} 110 190)`}>
      <path d="M 110 190 L 30 110 A 45 45 0 0 1 110 40 L 95 80 L 120 105 L 100 135 Z" fill={C.red} />
    </g>
    <g transform={`translate(${split * 18} 0) rotate(${split * 10} 110 190)`}>
      <path d="M 110 190 L 190 110 A 45 45 0 0 0 110 40 L 95 80 L 120 105 L 100 135 Z" fill={C.red} />
    </g>
  </svg>
);

const Gpu: React.FC<{ w: number }> = ({ w }) => (
  <svg viewBox="0 0 120 120" width={w} height={w}>
    {Array.from({ length: 6 }, (_, i) => (
      <g key={i}>
        <rect x={18 + i * 15} y="0" width="6" height="16" fill={C.nvLight} />
        <rect x={18 + i * 15} y="104" width="6" height="16" fill={C.nvLight} />
        <rect x="0" y={18 + i * 15} width="16" height="6" fill={C.nvLight} />
        <rect x="104" y={18 + i * 15} width="16" height="6" fill={C.nvLight} />
      </g>
    ))}
    <rect x="14" y="14" width="92" height="92" rx="10" fill="#10180c" stroke={C.nv} strokeWidth="5" />
    <text x="60" y="70" textAnchor="middle" fontFamily="Anton" fontSize="30" fill={C.nvLight}>
      GPU
    </text>
  </svg>
);

export const Dimision: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string, n = 0) => wordF("dimision", q, startMs, n);
  const fFue = w("fue");
  const fOnce = w("11");
  const fSup = w("supuestas");
  const fUna = w("una", 0);
  const fEmp = w("empresa");
  const fContra = w("contrabando");
  const fChina = w("china");
  const cal = popSpring(frame, fps, 0);
  const toB = softSpring(frame, fps, fUna - 2);
  const route = ramp(frame, fContra - 4, 26, EASE_MOVE);
  // trayectoria del chip (arco)
  const ax = 180,
    ay = 1050,
    bx = 900,
    by = 1050,
    cx = 540,
    cy = 700;
  const pt = (t: number) => ({
    x: (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * cx + t * t * bx,
    y: (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * cy + t * t * by,
  });
  const p = pt(route);
  return (
    <AbsoluteFill>
      <TechBackdrop hue="#1A0A0A" glow={C.red} />
      <Bar active={1} />
      {/* parte A: calendario + corazón roto */}
      <div style={{ opacity: 1 - toB, translate: `0 ${-toB * 120}px` }}>
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 250,
            width: 400,
            borderRadius: 24,
            overflow: "hidden",
            background: C.white,
            boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
            rotate: `${interpolate(cal, [0, 1], [-20, -4])}deg`,
            scale: String(cal),
          }}
        >
          <div style={{ background: C.red, color: C.white, fontFamily: FONT_BODY, fontWeight: 900, fontSize: 44, textAlign: "center", padding: "10px 0" }}>NOVIEMBRE</div>
          <div style={{ fontFamily: FONT_HEAD, fontSize: 230, color: C.ink, textAlign: "center", lineHeight: 1.1 }}>12</div>
        </div>
        <Stamp text="Dimite" delay={fFue} color={C.red} size={96} rotate={-10} style={{ left: 170, top: 545 }} />
        <Chip text="Hace 11 días" delay={fOnce} color={C.nv} textColor={C.ink} size={46} style={{ left: 560, top: 330 }} />
        <div style={{ position: "absolute", left: 600, top: 470, scale: String(popSpring(frame, fps, fSup - 2)) }}>
          <BrokenHeart w={300} split={ramp(frame, fSup + 8, 10)} />
        </div>
        <div style={{ position: "absolute", left: 80, right: 80, top: 860, textAlign: "center" }}>
          <MaskLine delay={fSup} size={92} shadow={C.ink}>
            Supuestas
          </MaskLine>
          <MaskLine delay={fSup + 4} size={120} color={C.red} shadow={C.ink}>
            infidelidades
          </MaskLine>
        </div>
      </div>
      {/* parte B: empresa investigada por contrabando de chips */}
      {frame >= fUna - 4 ? (
        <div style={{ opacity: toB }}>
          <div style={{ position: "absolute", left: 80, right: 80, top: 250, textAlign: "center" }}>
            <MaskLine delay={fEmp - 2} size={76} shadow={C.ink}>
              Una, con una directiva de
            </MaskLine>
            <MaskLine delay={fEmp + 2} size={84} color={C.yellow} shadow={C.ink}>
              una empresa investigada
            </MaskLine>
          </div>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            <path d={`M ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`} fill="none" stroke={C.white} strokeOpacity={0.35} strokeWidth={6} strokeDasharray="18 16" />
            <path
              d={`M ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`}
              fill="none"
              stroke={C.red}
              strokeWidth={8}
              strokeDasharray={1000}
              strokeDashoffset={1000 * (1 - route)}
            />
            <circle cx={ax} cy={ay} r={18} fill={C.white} />
            <circle cx={bx} cy={by} r={18 + (frame >= fChina ? 6 * Math.abs(Math.sin(frame / 4)) : 0)} fill={C.red} />
          </svg>
          <div style={{ position: "absolute", left: p.x - 60, top: p.y - 60, opacity: frame >= fContra - 4 ? 1 : 0 }}>
            <Gpu w={120} />
          </div>
          <Chip text="EE. UU." delay={fEmp} color={C.white} size={40} style={{ left: 100, top: 1100 }} />
          <Chip text="China" delay={fChina - 2} color={C.red} textColor={C.white} size={40} style={{ left: 810, top: 1100 }} />
          <Stamp text="Contrabando de chips" delay={fContra} color={C.yellow} size={64} rotate={-5} style={{ left: 175, top: 560 }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// =====================================================================
// 4. LA JUNTA DICE NO
// =====================================================================
export const Junta: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("junta", q, startMs);
  const fJunta = w("junta");
  const fNo = w("no");
  const fRead = w("readmitirlo");
  const table = popSpring(frame, fps, 0);
  const seats = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    return { x: 540 + Math.cos(a) * 330, y: 760 + Math.sin(a) * 250 };
  });
  return (
    <AbsoluteFill>
      <TechBackdrop />
      <Bar active={2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center" }}>
        <MaskLine delay={fJunta - 2} size={120} shadow={C.ink}>
          La junta dice
        </MaskLine>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", scale: String(table) }}>
        <ellipse cx={540} cy={760} rx={250} ry={170} fill="#1b2614" stroke={C.nv} strokeWidth={8} />
        <text x={540} y={790} textAnchor="middle" fontFamily="Anton" fontSize={90} fill={C.nvLight} opacity={0.35}>
          NVIDIA
        </text>
        {seats.map((s, i) => {
          const sp = popSpring(frame, fps, fNo + i * 2);
          return (
            <g key={i}>
              <circle cx={s.x} cy={s.y} r={52} fill="#2b2f2a" stroke="#fff" strokeOpacity={0.4} strokeWidth={4} />
              <circle cx={s.x} cy={s.y - 8} r={18} fill="#9aa39a" />
              <path d={`M ${s.x - 28} ${s.y + 30} Q ${s.x} ${s.y} ${s.x + 28} ${s.y + 30} Z`} fill="#9aa39a" />
              <g opacity={frame >= fNo + i * 2 ? 1 : 0} transform={`translate(${s.x} ${s.y}) scale(${sp})`}>
                <circle r={52} fill={C.red} />
                <path d="M -20 -20 L 20 20 M 20 -20 L -20 20" stroke="#fff" strokeWidth={12} strokeLinecap="round" />
              </g>
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1050,
          textAlign: "center",
          fontFamily: FONT_HEAD,
          fontSize: 150,
          color: C.red,
          textShadow: `6px 6px 0 ${C.ink}`,
          scale: String(popSpring(frame, fps, fNo + 2)),
        }}
      >
        NO
      </div>
      <Chip text="CEO interina: Colette Kress" delay={fRead} color={C.nv} textColor={C.ink} size={38} style={{ left: 225, top: 1215 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 5. BOLSA: −23 % en una semana y rebote
// =====================================================================
const Counter: React.FC<{ from: number; to: number; start: number; dur: number; prefix: string; color: string; size: number; style?: React.CSSProperties }> = ({
  from,
  to,
  start,
  dur,
  prefix,
  color,
  size,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = interpolate(frame, [start, start + dur], [from, to], { ...clamp, easing: EASE_IN });
  const s = popSpring(frame, fps, start);
  if (frame < start) return null;
  return (
    <div style={{ position: "absolute", fontFamily: FONT_HEAD, fontSize: size, color, textShadow: `6px 6px 0 ${C.ink}`, scale: String(interpolate(s, [0, 1], [0.5, 1])), ...style }}>
      {prefix}
      {Math.round(v)}%
    </div>
  );
};

export const Bolsa: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string, n = 0) => wordF("bolsa", q, startMs, n);
  const fHund = w("hundido");
  const f23 = w("23");
  const fMsg = w("mensaje");
  const fReb = w("rebotar");
  const f10 = w("10");
  const panel = popSpring(frame, fps, 0);
  // serie ilustrativa: cae ~23 % y rebota
  const down = [100, 101, 97, 98, 92, 93, 88, 86, 87, 80, 82, 77];
  const up = [77, 80, 84.7];
  const X0 = 110,
    X1 = 970,
    Y0 = 570,
    Y1 = 1060;
  const yv = (v: number) => Y0 + ((102 - v) / (102 - 74)) * (Y1 - Y0);
  const n = down.length + up.length - 2;
  const xv = (i: number) => X0 + (i / n) * (X1 - X0);
  const dPath = down.map((v, i) => `${i ? "L" : "M"} ${xv(i)} ${yv(v)}`).join(" ");
  const uPath = up.map((v, i) => `${i ? "L" : "M"} ${xv(down.length - 1 + i)} ${yv(v)}`).join(" ");
  const pd = ramp(frame, fHund - 8, 34, EASE_MOVE);
  const pu = ramp(frame, fReb - 4, 16, EASE_IN);
  const shake = useShake(f23, 10, 16);
  const z = punch(frame, fps, f23, 0.06) * punch(frame, fps, f10, 0.06);
  return (
    <AbsoluteFill style={{ scale: String(z), translate: `${shake.x}px ${shake.y}px` }}>
      <TechBackdrop hue={frame >= fReb ? "#0E2108" : "#200808"} glow={frame >= fReb ? C.nv : C.red} />
      <Bar active={3} />
      <div style={{ position: "absolute", left: 80, top: 230, display: "flex", gap: 18, alignItems: "baseline" }}>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 110, color: C.white }}>NVDA</div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 800, fontSize: 30, color: C.white, opacity: 0.75, lineHeight: 1.3 }}>
          Nasdaq · última semana
          <div style={{ fontSize: 22, opacity: 0.7 }}>Gráfico ilustrativo · cierre vie: 125,53 $</div>
        </div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: panel }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={X0} x2={X1} y1={Y0 + (i * (Y1 - Y0)) / 4} y2={Y0 + (i * (Y1 - Y0)) / 4} stroke="#fff" strokeOpacity={0.1} strokeWidth={2} />
        ))}
        <path d={dPath} fill="none" stroke={C.red} strokeWidth={10} strokeLinejoin="round" strokeDasharray={3000} strokeDashoffset={3000 * (1 - pd)} />
        <path d={uPath} fill="none" stroke={C.nvLight} strokeWidth={10} strokeLinejoin="round" strokeDasharray={600} strokeDashoffset={600 * (1 - pu)} />
        {pd > 0.98 ? <circle cx={xv(down.length - 1)} cy={yv(77)} r={16} fill={C.red} /> : null}
        {pu > 0.98 ? <circle cx={xv(n)} cy={yv(84.7)} r={16} fill={C.nvLight} /> : null}
      </svg>
      <Counter from={0} to={23} start={f23 - 2} dur={14} prefix="−" color={C.red} size={160} style={{ left: 90, top: 1000 }} />
      <Chip text="en una semana" delay={f23 + 10} color={C.red} textColor={C.white} size={32} style={{ left: 90, top: 1200 }} />
      {/* mensaje de Trump (cita traducida, no captura) */}
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          top: 370,
          background: "rgba(255,255,255,0.95)",
          borderRadius: 26,
          padding: "22px 30px",
          fontFamily: FONT_BODY,
          fontWeight: 800,
          fontSize: 36,
          color: C.ink,
          lineHeight: 1.25,
          translate: `0 ${interpolate(softSpring(frame, fps, fMsg - 3), [0, 1], [-500, 0])}px`,
          opacity: frame >= fMsg - 3 ? 1 : 0,
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
        }}
      >
        «Espero que la junta de Nvidia vuelva a contratar a Jensen Huang»
        <div style={{ fontSize: 26, color: "#555", marginTop: 8 }}>— Donald Trump, domingo 22 nov (traducido)</div>
      </div>
      <Counter from={0} to={10} start={f10 - 2} dur={10} prefix="+" color={C.nvLight} size={160} style={{ right: 90, top: 1000 }} />
      <Chip text="hoy, antes de abrir" delay={f10 + 6} color={C.nv} textColor={C.ink} size={32} style={{ right: 90, top: 1200 }} />
      
    </AbsoluteFill>
  );
};

// =====================================================================
// 6. CIERRE: ¿debe volver?
// =====================================================================
export const Cierre: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("cierre", q, startMs);
  const fCom = w("comentarios");
  return (
    <AbsoluteFill>
      <TechBackdrop />
      <Bar active={4} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
        <MaskLine delay={0} size={170} shadow={C.ink}>
          ¿Debe
        </MaskLine>
        <MaskLine delay={4} size={190} color={C.nvLight} shadow={C.ink}>
          volver?
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 760, display: "flex", gap: 40, justifyContent: "center" }}>
        {[
          { t: "SÍ", c: C.nv, tc: C.ink },
          { t: "NO", c: C.red, tc: C.white },
        ].map((b, i) => (
          <div
            key={b.t}
            style={{
              width: 360,
              height: 200,
              borderRadius: 30,
              background: b.c,
              color: b.tc,
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
      <div style={{ position: "absolute", left: 540 - 110, top: 1030, scale: String(popSpring(frame, fps, fCom - 2)), rotate: `${Math.sin(frame / 5) * 5}deg` }}>
        <CommentBubble w={220} />
      </div>
      {/* sello final de duración */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1225, textAlign: "center", fontFamily: FONT_BODY, fontWeight: 800, fontSize: 28, color: "#fff", opacity: interpolate(frame, [dur - 30, dur - 15], [0, 0.7], clamp) }}>
        Fuentes: CNBC · NBC · TechCrunch · Invezz
      </div>
    </AbsoluteFill>
  );
};
