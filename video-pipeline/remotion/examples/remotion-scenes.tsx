import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { CommentBubble } from "./art";
import { Chip, MaskLine, Stamp, TopBar, punch, useShake } from "./components";
import { C, clamp, EASE_IN, EASE_MOVE, FONT_BODY, FONT_HEAD, popSpring, ramp, softSpring, TL, msToF, wordF } from "./lib";

export type SceneProps = { dur: number; startMs: number };
const MONO = "'DejaVu Sans Mono', 'Liberation Mono', monospace";

const Bar: React.FC<{ active: number }> = ({ active }) => (
  <TopBar
    active={active}
    total={4}
    color={C.nv}
    label={
      <>
        HERRAMIENTAS IA · <span style={{ color: C.nvLight }}>23 NOV</span>
      </>
    }
  />
);

// =====================================================================
// Fondo tecnológico (rejilla + pistas con pulsos)
// =====================================================================
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

// ---------- ventana de código con tecleo ----------
const CodeWindow: React.FC<{ lines: { t: string; c?: string }[]; start: number; cps?: number; width: number; title?: string; size?: number }> = ({
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
          const typing = n > 0 && n < l.t.length;
          return (
            <div key={i} style={{ color: l.c ?? "#d6e2ff", minHeight: size * 1.45 }}>
              {l.t.slice(0, n)}
              {typing || (budget <= 0 && n === l.t.length && budget > -l.t.length - 1 && Math.floor(frame / 8) % 2 === 0) ? (
                <span style={{ background: C.nvLight, color: C.nvLight }}>▌</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- timeline de editor de vídeo (lo que NO se usa) ----------
const EditorTimeline: React.FC<{ w: number }> = ({ w }) => {
  const frame = useCurrentFrame();
  const tracks = [
    [0.02, 0.3, "#8E5CFF"],
    [0.33, 0.62, "#FF5CA8"],
    [0.65, 0.95, "#5CFFB0"],
  ];
  return (
    <div style={{ width: w, background: "#1a1d24", borderRadius: 18, padding: 18, boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{ flex: 1, height: 10, borderLeft: "2px solid #555" }} />
        ))}
      </div>
      {[0, 1, 2].map((r) => (
        <div key={r} style={{ position: "relative", height: 56, marginBottom: 10, background: "#22262f", borderRadius: 8 }}>
          {tracks.map(([a, b, c], k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                left: `${((Number(a) + r * 0.07) % 0.9) * 100}%`,
                width: `${(Number(b) - Number(a)) * 100 * (0.7 + 0.1 * r)}%`,
                top: 6,
                bottom: 6,
                background: String(c),
                opacity: 0.75,
                borderRadius: 6,
              }}
            />
          ))}
        </div>
      ))}
      <div style={{ position: "absolute", top: 10, bottom: 10, left: 20 + ((frame * 6) % (w - 40)), width: 4, background: C.red }} />
    </div>
  );
};

// =====================================================================
// 1. GANCHO: este vídeo se ha programado
// =====================================================================
export const Hook: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("hook", q, startMs);
  const fEdit = w("editado");
  const fProg = w("programado");
  const sh = useShake(fProg, 10, 16);
  const strike = ramp(frame, fProg - 2, 8);
  const code = softSpring(frame, fps, fProg - 4);
  const z = punch(frame, fps, fProg, 0.06);
  return (
    <AbsoluteFill style={{ scale: String(z), translate: `${sh.x}px ${sh.y}px` }}>
      <TechBackdrop />
      <div style={{ position: "absolute", left: 80, top: 120, display: "flex", gap: 16, alignItems: "center" }}>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 32, color: C.white, background: C.nv, padding: "8px 18px", borderRadius: 8, letterSpacing: "0.1em" }}>
          HERRAMIENTAS IA
        </div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 800, fontSize: 30, color: C.white, opacity: 0.85 }}>23 NOV 2026</div>
      </div>
      <div style={{ position: "absolute", left: 80, top: 230 }}>
        <MaskLine delay={-9} size={140} shadow={C.nv}>
          Este vídeo
        </MaskLine>
        <div style={{ position: "relative", display: "inline-block" }}>
          <MaskLine delay={-5} size={120} shadow={C.ink}>
            no se ha editado
          </MaskLine>
          <div style={{ position: "absolute", left: -6, top: "48%", height: 16, width: `${strike * 104}%`, background: C.red, rotate: "-2deg" }} />
        </div>
        <MaskLine delay={fProg - 3} size={122} color={C.nvLight} shadow={C.ink}>
          Se ha programado
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 90, top: 790, opacity: 1 - code * 0.85, scale: String(1 - code * 0.1) }}>
        <EditorTimeline w={900} />
      </div>
      {frame >= fEdit + 2 && frame < fProg + 6 ? <Stamp text="Sin editor" delay={fEdit + 2} color={C.red} size={96} rotate={-8} style={{ left: 300, top: 860 }} /> : null}
      <div style={{ position: "absolute", left: 90, top: 780, translate: `${interpolate(code, [0, 1], [1100, 0])}px 0`, rotate: `${interpolate(code, [0, 1], [8, -2])}deg` }}>
        <CodeWindow
          width={900}
          start={fProg - 2}
          cps={3.2}
          lines={[
            { t: "const frame = useCurrentFrame();", c: "#9CDCFE" },
            { t: "const s = spring({ frame, fps });", c: "#C3E88D" },
            { t: "return <Escena scale={s} />;", c: "#FFCB6B" },
          ]}
        />
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 2. LEMA (cronómetro)
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
      <TechBackdrop hue="#0A2440" />
      <div style={{ position: "absolute", left: 540 - 280, top: 300, width: 560, height: 560, scale: String(pop) }}>
        <svg width={560} height={600} viewBox="0 -40 560 600">
          <rect x="250" y="-38" width="60" height="40" rx="8" fill={C.white} />
          <circle cx="280" cy="280" r={R + 24} fill="#0a1424" stroke={C.white} strokeWidth="10" />
          <circle cx="280" cy="280" r={R} fill="none" stroke="#18304d" strokeWidth="34" />
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
        <div style={{ marginTop: 10, fontFamily: FONT_HEAD, fontSize: 120, color: C.white, background: C.nv, padding: "0 30px 10px", rotate: "-2deg", scale: String(popSpring(frame, fps, 6)), boxShadow: `0 0 50px ${C.nv}` }}>
          MENOS DE 1 MINUTO
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. QUÉ ES: React -> vídeo, fotograma a fotograma
// =====================================================================
const ReactAtom: React.FC<{ w: number; spin: number }> = ({ w, spin }) => (
  <svg viewBox="-110 -110 220 220" width={w} height={w}>
    {[0, 60, 120].map((a) => (
      <ellipse key={a} rx="100" ry="38" fill="none" stroke="#61DAFB" strokeWidth="9" transform={`rotate(${a + spin})`} />
    ))}
    <circle r="18" fill="#61DAFB" />
  </svg>
);

const FilmStrip: React.FC<{ w: number; offset: number; active: number }> = ({ w, offset, active }) => (
  <div style={{ width: w, height: 250, background: "#111", borderRadius: 14, overflow: "hidden", position: "relative", boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}>
    {[0, 1].map((row) => (
      <div key={row} style={{ position: "absolute", left: 0, right: 0, top: row ? 222 : 8, height: 20, display: "flex", gap: 14, translate: `${-(offset % 34)}px 0` }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{ width: 20, height: 20, borderRadius: 4, background: "#ddd", flexShrink: 0 }} />
        ))}
      </div>
    ))}
    <div style={{ position: "absolute", top: 40, bottom: 40, left: 0, display: "flex", gap: 12, translate: `${-(offset % 182)}px 0` }}>
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          style={{
            width: 170,
            height: 170,
            borderRadius: 8,
            flexShrink: 0,
            background: `linear-gradient(135deg, ${C.nv}, ${["#8E5CFF", "#FF5CA8", "#5CFFB0"][i % 3]})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT_HEAD,
            fontSize: 60,
            color: "#fff",
            opacity: i === active ? 1 : 0.75,
          }}
        >
          {String(i + 1 + Math.floor(offset / 182)).padStart(2, "0")}
        </div>
      ))}
    </div>
  </div>
);

export const Que: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string, n = 0) => wordF("que", q, startMs, n);
  const fRem = w("remotion");
  const fCod = w("codigo");
  const fVid = w("video");
  const fFot = w("fotograma");
  const total = msToF(TL.durationMs);
  const counter = Math.round(interpolate(frame, [fFot, fFot + 40], [1, total], { ...clamp, easing: EASE_IN }));
  const z = punch(frame, fps, fRem, 0.05);
  return (
    <AbsoluteFill style={{ scale: String(z) }}>
      <TechBackdrop />
      <Bar active={1} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center" }}>
        <MaskLine delay={0} size={70} shadow={C.ink}>
          Se llama
        </MaskLine>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 210, lineHeight: 1, color: C.nvLight, textShadow: `0 0 40px ${C.nv}, 8px 8px 0 ${C.ink}`, scale: String(popSpring(frame, fps, fRem - 2)), opacity: frame >= fRem - 2 ? 1 : 0 }}>
          REMOTION
        </div>
      </div>
      {/* tubería: React -> película -> vídeo */}
      <div style={{ position: "absolute", left: 70, top: 640, display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ scale: String(popSpring(frame, fps, fCod - 2)), textAlign: "center" }}>
          <ReactAtom w={210} spin={frame * 3} />
          <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 36, color: "#61DAFB" }}>REACT</div>
        </div>
        <svg width={110} height={60} style={{ opacity: ramp(frame, fCod + 4, 8) }}>
          <path d="M 0 30 H 90 M 70 10 L 95 30 L 70 50" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ scale: String(popSpring(frame, fps, fVid - 2)), textAlign: "center" }}>
          <div style={{ width: 210, height: 210, borderRadius: 30, background: C.nv, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 50px ${C.nv}` }}>
            <svg width={110} height={110} viewBox="0 0 100 100">
              <path d="M 30 18 L 84 50 L 30 82 Z" fill="#fff" />
            </svg>
          </div>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 36, color: C.white }}>VÍDEO</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 960, opacity: ramp(frame, fFot - 4, 8) }}>
        <FilmStrip w={900} offset={Math.max(0, frame - fFot) * 14} active={1} />
      </div>
      <div style={{ position: "absolute", right: 90, top: 1225, fontFamily: MONO, fontSize: 34, color: C.nvLight, opacity: frame >= fFot ? 1 : 0 }}>
        frame {String(counter).padStart(4, "0")} / {total}
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 4. AGENTES DE IA: describes -> la IA escribe el código
// =====================================================================
export const Agentes: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string, n = 0) => wordF("agentes", q, startMs, n);
  const fEnero = w("enero");
  const fHab = w("habilidades");
  const fClaude = w("claude");
  const fDesc = w("describes");
  const fEscr = w("escribe");
  const prompt = "Hazme un vídeo de 30 s sobre Nvidia, con voz y subtítulos";
  const typed = prompt.slice(0, Math.max(0, Math.floor((frame - fDesc + 2) * 2.4)));
  const render = ramp(frame, fEscr + 14, 22, EASE_MOVE);
  return (
    <AbsoluteFill>
      <TechBackdrop hue="#0D1F3A" />
      <Bar active={2} />
      <Chip text="Desde enero 2026" delay={fEnero} color={C.nv} textColor={C.white} size={40} style={{ left: 80, top: 230 }} />
      <Chip text="Agent Skills" delay={fHab} color={C.yellow} textColor={C.ink} size={40} style={{ left: 560, top: 230 }} />
      <Chip text="Claude Code · Cursor · Codex" delay={fClaude} color={C.white} textColor={C.ink} size={36} style={{ left: 190, top: 330 }} />
      {/* titular mientras llega el prompt */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 500,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: interpolate(frame, [fDesc - 8, fDesc - 2], [1, 0], clamp),
        }}
      >
        <svg width={220} height={220} viewBox="-50 -50 100 100" style={{ scale: String(popSpring(frame, fps, fHab - 4)), rotate: `${frame * 1.5}deg` }}>
          <path d="M 0 -46 C 6 -10 10 -6 46 0 C 10 6 6 10 0 46 C -6 10 -10 6 -46 0 C -10 -6 -6 -10 0 -46 Z" fill={C.nvLight} />
          <circle r="8" fill="#fff" />
        </svg>
        <MaskLine delay={fHab - 2} size={150} shadow={C.ink}>
          Agentes
        </MaskLine>
        <MaskLine delay={fHab + 3} size={150} color={C.nvLight} shadow={C.ink}>
          de IA
        </MaskLine>
      </div>
      {/* prompt del usuario */}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 450,
          background: C.white,
          borderRadius: "30px 30px 30px 6px",
          padding: "26px 32px",
          fontFamily: FONT_BODY,
          fontWeight: 800,
          fontSize: 44,
          color: C.ink,
          lineHeight: 1.25,
          minHeight: 170,
          scale: String(popSpring(frame, fps, fDesc - 4)),
          opacity: frame >= fDesc - 4 ? 1 : 0,
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ fontSize: 26, color: "#667", marginBottom: 6 }}>Tú</div>
        {typed}
        {typed.length < prompt.length ? <span style={{ color: C.nv }}>▌</span> : null}
      </div>
      {/* la IA escribe el código */}
      <div style={{ position: "absolute", left: 90, top: 760, opacity: frame >= fEscr - 4 ? 1 : 0, translate: `0 ${interpolate(softSpring(frame, fps, fEscr - 4), [0, 1], [200, 0])}px` }}>
        <CodeWindow
          width={900}
          size={30}
          start={fEscr - 2}
          cps={6}
          title="IA escribiendo…"
          lines={[
            { t: "<Composition id=\"Noticia\"", c: "#9CDCFE" },
            { t: "  durationInFrames={990}", c: "#C3E88D" },
            { t: "  fps={30} width={1080}", c: "#C3E88D" },
            { t: "  height={1920} />", c: "#9CDCFE" },
          ]}
        />
        <div style={{ marginTop: 22, height: 28, borderRadius: 14, background: "#18304d", overflow: "hidden", opacity: frame >= fEscr + 12 ? 1 : 0 }}>
          <div style={{ width: `${render * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.nv}, ${C.nvLight})` }} />
        </div>
        <div style={{ marginTop: 8, fontFamily: MONO, fontSize: 28, color: C.nvLight, opacity: frame >= fEscr + 12 ? 1 : 0 }}>
          {render < 1 ? `Renderizando… ${Math.round(render * 100)}%` : "✓ video.mp4 listo"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 5. CIFRAS: 75.000 estrellas y gratis hasta 3 personas
// =====================================================================
const Star: React.FC<{ w: number }> = ({ w }) => (
  <svg viewBox="0 0 100 100" width={w} height={w}>
    <path d="M 50 5 L 61 37 L 95 38 L 68 59 L 78 92 L 50 72 L 22 92 L 32 59 L 5 38 L 39 37 Z" fill={C.yellow} stroke="#fff" strokeWidth="3" />
  </svg>
);

export const Cifras: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string, n = 0) => wordF("cifras", q, startMs, n);
  const fNum = w("75");
  const fGit = w("github");
  const fGratis = w("gratis");
  const fPart = w("particulares");
  const fEmp = w("empresas");
  const v = Math.round(interpolate(frame, [fNum - 2, fNum + 22], [0, 75000], { ...clamp, easing: EASE_IN }));
  const toB = softSpring(frame, fps, fGratis - 4);
  const sh = useShake(fGratis, 8, 14);
  const z = punch(frame, fps, fNum + 10, 0.05) * punch(frame, fps, fGratis, 0.06);
  return (
    <AbsoluteFill style={{ scale: String(z), translate: `${sh.x}px ${sh.y}px` }}>
      <TechBackdrop hue="#1d1a06" glow={C.yellow} />
      <Bar active={3} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", flexDirection: "column", alignItems: "center", translate: `0 ${-toB * 40}px`, scale: String(1 - toB * 0.25) }}>
        <div style={{ scale: String(popSpring(frame, fps, fNum - 4)), rotate: `${Math.sin(frame / 10) * 6}deg` }}>
          <Star w={230} />
        </div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 200, lineHeight: 1, color: C.white, textShadow: `0 0 40px ${C.yellow}88, 8px 8px 0 ${C.ink}`, opacity: frame >= fNum - 2 ? 1 : 0 }}>
          {v.toLocaleString("es-ES").replace(/\s/g, ".")}
        </div>
        <Chip text="Estrellas en GitHub" delay={fGit - 2} color={C.yellow} textColor={C.ink} size={42} style={{ position: "relative" }} />
      </div>
      {/* gratis */}
      <Stamp text="Gratis" delay={fGratis} color={C.green} size={140} rotate={-7} style={{ left: 300, top: 820 }} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 1030, display: "flex", gap: 20, justifyContent: "center" }}>
        <Chip text="✓ Particulares" delay={fPart} color={C.green} textColor={C.ink} size={38} style={{ position: "relative" }} />
        <Chip text="✓ Empresas ≤ 3 personas" delay={fEmp} color={C.green} textColor={C.ink} size={38} style={{ position: "relative" }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1140, textAlign: "center", fontFamily: FONT_BODY, fontWeight: 800, fontSize: 28, color: C.white, opacity: frame >= fEmp + 10 ? 0.75 : 0 }}>
        Empresas más grandes: licencia de pago
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 6. CIERRE
// =====================================================================
export const Cierre: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fCom = wordF("cierre", "comentarios", startMs);
  return (
    <AbsoluteFill>
      <TechBackdrop />
      <Bar active={4} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
        <MaskLine delay={0} size={170} shadow={C.ink}>
          ¿Lo
        </MaskLine>
        <MaskLine delay={4} size={190} color={C.nvLight} shadow={C.ink}>
          probarías?
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 120, right: 120, top: 760, display: "flex", gap: 40, justifyContent: "center" }}>
        {[
          { t: "SÍ", c: C.nv, tc: C.white },
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
      <div style={{ position: "absolute", left: 540 - 110, top: 1010, scale: String(popSpring(frame, fps, fCom - 2)), rotate: `${Math.sin(frame / 5) * 5}deg` }}>
        <CommentBubble w={220} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1220, textAlign: "center", fontFamily: FONT_BODY, fontWeight: 800, fontSize: 30, color: C.nvLight, opacity: ramp(frame, 10, 10) }}>
        Este vídeo está hecho con Remotion
      </div>
    </AbsoluteFill>
  );
};
