/**
 * HISTORIA: «Tidal borrará ~27 millones de canciones hechas solo con IA» (IA · 25 nov 2026).
 * Sin logotipos de terceros: marcas solo como texto.
 */
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, random, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Chip, MaskLine, Stamp, punch, useShake } from "./components";
import { C, clamp, EASE_MOVE, FONT_BODY, FONT_HEAD, popSpring, ramp, softSpring, wordF } from "./lib";
import { Counter, HookBadge, Lema, NewsBar, Poll, SceneDef, SceneProps, TechBackdrop } from "./news";

const DATE = "25 NOV";
const Bar: React.FC<{ active: number }> = ({ active }) => <NewsBar active={active} total={5} label="NOTICIA IA" date={DATE} />;

// ---------- iconos propios ----------
const Note: React.FC<{ s: number; color: string }> = ({ s, color }) => (
  <svg viewBox="0 0 60 70" width={s} height={(s * 70) / 60}>
    <path d="M 22 8 L 54 2 L 54 48" stroke={color} strokeWidth="7" fill="none" strokeLinejoin="round" />
    <line x1="22" y1="8" x2="22" y2="56" stroke={color} strokeWidth="7" />
    <ellipse cx="14" cy="57" rx="11" ry="8" fill={color} />
    <ellipse cx="46" cy="49" rx="11" ry="8" fill={color} />
  </svg>
);
const Trash: React.FC<{ w: number; lid: number }> = ({ w, lid }) => (
  <svg viewBox="0 0 200 240" width={w} height={(w * 240) / 200}>
    <g transform={`rotate(${-lid * 28} 20 46)`}>
      <rect x="10" y="30" width="180" height="22" rx="8" fill={C.white} />
      <rect x="75" y="14" width="50" height="20" rx="6" fill={C.white} />
    </g>
    <path d="M 26 62 L 174 62 L 160 232 L 40 232 Z" fill="#141a24" stroke={C.white} strokeWidth="8" />
    {[66, 100, 134].map((x) => (
      <line key={x} x1={x} y1="86" x2={x - 4 + (x - 100) * 0.05} y2="208" stroke={C.white} strokeWidth="8" strokeLinecap="round" opacity="0.6" />
    ))}
  </svg>
);
const TrackRow: React.FC<{ i: number; del: number; w: number }> = ({ i, del, w }) => {
  const names = ["Neon Dreams (AI)", "Lofi Beats #2841", "Chill Vibes 99", "Summer Hit AI v3", "Sad Piano 1127", "Epic Trailer 512"];
  return (
    <div style={{ position: "relative", width: w, height: 86, display: "flex", alignItems: "center", gap: 18, padding: "0 20px", background: "#0f1520", borderRadius: 16, border: "2px solid #223", opacity: 1 - del * 0.6, translate: `${del * 60}px 0` }}>
      <div style={{ width: 56, height: 56, borderRadius: 10, background: `linear-gradient(135deg, ${C.nv}, #8E5CFF)` }} />
      <div style={{ flex: 1, fontFamily: FONT_BODY, fontWeight: 800, fontSize: 30, color: C.white }}>{names[i % names.length]}</div>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 24, color: C.ink, background: C.yellow, borderRadius: 8, padding: "4px 10px" }}>100% IA</div>
      <div style={{ position: "absolute", left: 14, right: 14, top: 40, height: 8, background: C.red, scale: `${del} 1`, transformOrigin: "left center", borderRadius: 4 }} />
    </div>
  );
};

// =====================================================================
// 1. GANCHO
// =====================================================================
const Hook: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("hook", q, startMs);
  const fBorrar = w("borrar");
  const fNum = w("27");
  const fInt = w("inteligencia");
  const sh = useShake(fBorrar, 8, 12);
  const z = punch(frame, fps, fNum, 0.05);
  return (
    <AbsoluteFill style={{ scale: String(z), translate: `${sh.x}px ${sh.y}px` }}>
      <TechBackdrop />
      <HookBadge label="ÚLTIMA HORA" date="25 NOV 2026" />
      <div style={{ position: "absolute", left: 80, top: 230 }}>
        <MaskLine delay={-9} size={150} shadow={C.red}>
          Tidal borra
        </MaskLine>
      </div>
      <Counter from={0} to={27} start={fNum - 2} dur={16} suffix=" MILLONES" color={C.nvLight} size={150} style={{ left: 80, top: 410 }} />
      <div style={{ position: "absolute", left: 80, top: 590 }}>
        <MaskLine delay={fInt - 6} size={84} shadow={C.ink}>
          de canciones hechas
        </MaskLine>
        <MaskLine delay={fInt - 2} size={84} color={C.yellow} shadow={C.ink}>
          solo con IA
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 80, top: 830, display: "flex", flexDirection: "column", gap: 14 }}>
        {[0, 1, 2, 3].map((i) => (
          <TrackRow key={i} i={i} w={640} del={ramp(frame, fBorrar + 4 + i * 5, 8)} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 760, top: 900 }}>
        <Trash w={220} lid={ramp(frame, fBorrar, 8)} />
      </div>
      {/* notas que caen a la papelera */}
      {Array.from({ length: 6 }, (_, i) => {
        const p = (frame - (fBorrar + 6 + i * 5)) / 16;
        if (p < 0 || p > 1) return null;
        return (
          <div key={i} style={{ position: "absolute", left: interpolate(p, [0, 1], [500 + i * 30, 840]), top: interpolate(p, [0, 0.5, 1], [880 + i * 40, 820, 960]), rotate: `${p * 200}deg`, opacity: 1 - p * 0.3 }}>
            <Note s={60} color={C.nvLight} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. CUÁNDO: 9 dic · 100 % IA fuera · con ayuda de IA se queda
// =====================================================================
const Cuando: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("cuando", q, startMs);
  const fRech = w("rechazara");
  const fAyuda = w("ayuda");
  const cal = popSpring(frame, fps, 0);
  return (
    <AbsoluteFill>
      <TechBackdrop />
      <Bar active={1} />
      <div style={{ position: "absolute", left: 540 - 200, top: 230, width: 400, borderRadius: 24, overflow: "hidden", background: C.white, boxShadow: "0 30px 60px rgba(0,0,0,0.6)", rotate: `${interpolate(cal, [0, 1], [-20, -3])}deg`, scale: String(cal) }}>
        <div style={{ background: C.nv, color: C.white, fontFamily: FONT_BODY, fontWeight: 900, fontSize: 44, textAlign: "center", padding: "10px 0" }}>DICIEMBRE</div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 230, color: C.ink, textAlign: "center", lineHeight: 1.1 }}>9</div>
      </div>
      {[
        { t: "100% IA", s: "FUERA", c: C.red, icon: "✕", at: fRech },
        { t: "CON AYUDA DE IA", s: "SE QUEDA", c: C.green, icon: "✓", at: fAyuda },
      ].map((b, i) => {
        const s = popSpring(frame, fps, b.at - 2);
        return (
          <div
            key={b.t}
            style={{
              position: "absolute",
              left: 80,
              right: 80,
              top: 640 + i * 270,
              height: 230,
              borderRadius: 28,
              border: `6px solid ${b.c}`,
              background: "rgba(11,6,24,0.85)",
              display: "flex",
              alignItems: "center",
              gap: 34,
              padding: "0 40px",
              scale: String(s),
              opacity: frame >= b.at - 2 ? 1 : 0,
              boxShadow: `0 0 40px ${b.c}66`,
            }}
          >
            <div style={{ width: 130, height: 130, borderRadius: 65, background: b.c, color: C.ink, fontFamily: FONT_HEAD, fontSize: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>{b.icon}</div>
            <div>
              <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 44, color: C.white }}>{b.t}</div>
              <div style={{ fontFamily: FONT_HEAD, fontSize: 100, color: b.c, lineHeight: 1 }}>{b.s}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// =====================================================================
// 4. MOTIVO: 43 % de lo que llegaba era 100 % IA
// =====================================================================
const Motivo: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("motivo", q, startMs);
  const f43 = w("43");
  const fIA = w("100");
  const R = 230;
  const L = 2 * Math.PI * R;
  const fill = interpolate(frame, [f43 - 2, f43 + 18], [0, 0.43], { ...clamp, easing: EASE_MOVE });
  const z = punch(frame, fps, f43, 0.05);
  return (
    <AbsoluteFill style={{ scale: String(z) }}>
      <TechBackdrop hue="#0a1d33" />
      <Bar active={2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center" }}>
        <MaskLine delay={0} size={100} shadow={C.ink}>
          El motivo
        </MaskLine>
      </div>
      <svg width={600} height={600} viewBox="-300 -300 600 600" style={{ position: "absolute", left: 240, top: 380 }}>
        <circle r={R} fill="none" stroke="#1c2a3c" strokeWidth={70} />
        <circle r={R} fill="none" stroke={C.yellow} strokeWidth={70} strokeDasharray={L} strokeDashoffset={L * (1 - fill)} transform="rotate(-90)" />
      </svg>
      <Counter from={0} to={43} start={f43 - 2} dur={18} suffix="%" color={C.white} size={190} style={{ left: 0, right: 0, top: 570, textAlign: "center" }} />
      <div style={{ position: "absolute", left: 80, right: 80, top: 1030, textAlign: "center", opacity: frame >= fIA - 6 ? 1 : 0 }}>
        <MaskLine delay={fIA - 6} size={64} shadow={C.ink}>
          de las canciones subidas
        </MaskLine>
        <MaskLine delay={fIA - 2} size={84} color={C.yellow} shadow={C.ink}>
          eran 100% IA
        </MaskLine>
      </div>
      <Chip text="Últimos 90 días · datos de Tidal" delay={fIA + 8} color={C.white} size={28} style={{ left: 300, top: 1215 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 5. ESCUCHAS: 96 % con cero reproducciones
// =====================================================================
const Escuchas: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("escuchas", q, startMs);
  const f96 = w("96");
  const fNi = w("ni");
  const sh = useShake(fNi, 8, 12);
  return (
    <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px` }}>
      <TechBackdrop hue="#0a1d33" />
      <Bar active={3} />
      <Counter from={0} to={96} start={f96 - 2} dur={16} suffix="%" color={C.nvLight} size={240} style={{ left: 0, right: 0, top: 240, textAlign: "center" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", opacity: frame >= f96 + 6 ? 1 : 0 }}>
        <MaskLine delay={f96 + 6} size={70} shadow={C.ink}>
          de esas canciones
        </MaskLine>
      </div>
      {/* reproductor con 0 escuchas y ecualizador plano */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 660, height: 330, borderRadius: 30, background: "#0f1520", border: `4px solid ${C.nv}`, padding: 30, scale: String(popSpring(frame, fps, f96 + 4)) }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140 }}>
          {Array.from({ length: 22 }, (_, i) => {
            const alive = frame < fNi;
            const h = alive ? 20 + 100 * Math.abs(Math.sin(frame / 4 + i * 0.7) * random(`eq${i}`)) : 6;
            return <div key={i} style={{ flex: 1, height: h, background: alive ? C.nvLight : "#33415a", borderRadius: 4 }} />;
          })}
        </div>
        <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 40, color: C.white }}>Reproducciones</div>
          <div style={{ fontFamily: FONT_HEAD, fontSize: 110, color: frame >= fNi ? C.red : C.white }}>0</div>
        </div>
      </div>
      <Stamp text="Ni una escucha" delay={fNi} color={C.red} size={90} rotate={-7} style={{ left: 190, top: 1040 }} />
      <Chip text="en 3 meses" delay={fNi + 10} color={C.white} size={34} style={{ left: 420, top: 1200 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 6. OTRAS PLATAFORMAS
// =====================================================================
const Otras: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("otras", q, startMs);
  const fSp = w("spotify");
  const fAp = w("apple");
  const fPerm = w("permiten");
  const toB = softSpring(frame, fps, fPerm - 2);
  return (
    <AbsoluteFill>
      <TechBackdrop hue="#1d1606" glow={C.yellow} />
      <Bar active={4} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center" }}>
        <MaskLine delay={0} size={90} shadow={C.ink}>
          ¿Y los demás?
        </MaskLine>
      </div>
      {[
        { t: "SPOTIFY", at: fSp, x: 80 },
        { t: "APPLE MUSIC", at: fAp, x: 560 },
      ].map((b) => (
        <div
          key={b.t}
          style={{
            position: "absolute",
            left: b.x,
            top: 450,
            width: 440,
            height: 300,
            borderRadius: 30,
            background: "#141a24",
            border: `5px solid ${C.white}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            scale: String(popSpring(frame, fps, b.at - 2)),
            opacity: frame >= b.at - 2 ? 1 : 0,
          }}
        >
          <Note s={90} color={C.white} />
          <div style={{ fontFamily: FONT_HEAD, fontSize: 70, color: C.white }}>{b.t}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 830, textAlign: "center", scale: String(toB), opacity: toB }}>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 100, color: C.yellow, textShadow: `6px 6px 0 ${C.ink}` }}>TODAVÍA LAS PERMITEN</div>
      </div>
      <Chip text="Etiquetan la música IA o la recomiendan menos" delay={fPerm + 10} color={C.white} size={28} style={{ left: 150, top: 1040 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 7. CIERRE
// =====================================================================
const Cierre: React.FC<SceneProps> = (p) => (
  <Poll {...p} segId="cierre" line1="¿Deberían hacer" line2="lo mismo?" size1={120} size2={190} footer="Fuentes: Tidal · TechCrunch · Variety · The Hollywood Reporter · CBC" bar={<Bar active={5} />} />
);

// =====================================================================
// MINIATURA (portada TikTok 1080×1920; zona clave y 240-1680)
// =====================================================================
export const Thumbnail: React.FC = () => (
  <AbsoluteFill>
    <TechBackdrop />
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 70%, ${C.red}44 0%, transparent 45%)` }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 44, color: C.white, background: C.red, padding: "10px 26px", borderRadius: 10, letterSpacing: "0.08em" }}>
        ● ÚLTIMA HORA
      </div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 200, lineHeight: 1.08, color: C.white, marginTop: 40, textShadow: `10px 10px 0 ${C.ink}` }}>ADIÓS A LA</div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 230, lineHeight: 1.08, color: C.nvLight, textShadow: `0 0 60px ${C.nv}, 10px 10px 0 ${C.ink}` }}>MÚSICA IA</div>
      <div style={{ display: "inline-block", marginTop: 26, fontFamily: FONT_BODY, fontWeight: 900, fontSize: 52, color: C.ink, background: C.yellow, padding: "10px 30px", borderRadius: 999, rotate: "-3deg" }}>
        TIDAL BORRA 27 MILLONES
      </div>
      <div style={{ marginTop: 18, fontFamily: FONT_BODY, fontWeight: 900, fontSize: 36, color: C.white }}>DE CANCIONES HECHAS 100% CON IA</div>
    </div>
    <div style={{ position: "absolute", left: 120, top: 1080 }}>
      <Trash w={330} lid={1} />
    </div>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ position: "absolute", left: 440 + i * 70, top: 1070 + (i % 2) * 90, rotate: `${-30 + i * 25}deg` }}>
        <Note s={110} color={C.nvLight} />
      </div>
    ))}
    <div style={{ position: "absolute", right: 80, top: 1240, textAlign: "right" }}>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 170, lineHeight: 1, color: C.red, textShadow: `8px 8px 0 ${C.ink}` }}>96%</div>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 36, color: C.white }}>SIN NI UNA ESCUCHA</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1620, textAlign: "center", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 40, color: C.white, opacity: 0.9 }}>
      NOTICIA IA · TE LO CUENTO EN 1 MINUTO
    </div>
  </AbsoluteFill>
);

export const SCENES: SceneDef[] = [
  { key: "hook", firstSeg: "hook", C: Hook },
  { key: "lema", firstSeg: "lema", C: Lema, flash: C.nv },
  { key: "cuando", firstSeg: "cuando", C: Cuando, flash: C.nvLight },
  { key: "motivo", firstSeg: "motivo", C: Motivo, flash: C.yellow },
  { key: "escuchas", firstSeg: "escuchas", C: Escuchas, flash: C.nv },
  { key: "otras", firstSeg: "otras", C: Otras, flash: C.yellow },
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
      <Sfx at={at("hook", "borrar")} src="glitch" volume={0.4} />
      <Sfx at={at("hook", "27") - 2} src="riser" volume={0.3} />
      <Sfx at={at("lema", "menos")} src="ding" volume={0.4} />
      <Sfx at={at("cuando", "rechazara")} src="impact" volume={0.45} />
      <Sfx at={at("cuando", "ayuda")} src="ding" volume={0.4} />
      <Sfx at={at("motivo", "43") - 2} src="riser" volume={0.3} />
      <Sfx at={at("escuchas", "ni")} src="glitch" volume={0.45} />
      <Sfx at={at("otras", "permiten")} src="pop" volume={0.45} />
      <Sfx at={at("cierre", "comentarios")} src="pop" volume={0.5} />
    </>
  );
};
