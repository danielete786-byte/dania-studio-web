/**
 * HISTORIA: «La plantilla de Rockstar (GTA 6) rechaza al sindicato: 75% vota NO» (Videojuegos · 26 nov 2026).
 * Fondos: arte oficial de rockstargames.com. Efectos GTA: public/fx/v3-*.webm (gta-fx).
 * Fuentes: PC Gamer, Kotaku, VGC, Edinburgh News (votación IWGB: 75,3% no, participación 93,2%).
 */
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg, Chip, MaskLine, Stamp, punch, useShake } from "./components";
import { C, clamp, FONT_BODY, FONT_HEAD, popSpring, ramp, softSpring, wordF } from "./lib";
import { BrandLogo, GtaFx, HookBadge, Lema, NewsBar, Poll, SceneDef, SceneProps, TechBackdrop } from "./news";

const DATE = "26 NOV";
const Bar: React.FC<{ active: number }> = ({ active }) => <NewsBar active={active} total={4} label="VIDEOJUEGOS" date={DATE} />;
const FX_Y = { chyron: -470, voto: -40 };

// =====================================================================
// 1. GANCHO: rótulo de última hora (gta-fx) sobre el arte oficial
// =====================================================================
const Hook: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("hook", q, startMs);
  const fRock = w("rockstar");
  const fGta = w("gta");
  const fSind = w("sindicato");
  const z = punch(frame, fps, fSind, 0.04);
  return (
    <AbsoluteFill style={{ scale: String(z) }}>
      <Bg src="img/keyart.jpg" dur={dur} dim={0.45} from={1.1} to={1.25} y={[0, -40]} />
      <HookBadge label="ÚLTIMA HORA" date="26 NOV 2026" />
      <div style={{ position: "absolute", left: 80, top: 250, display: "flex", alignItems: "center", gap: 24, opacity: ramp(frame, fRock - 4, 6), scale: String(popSpring(frame, fps, fRock - 4)), transformOrigin: "left center" }}>
        <BrandLogo slug="rockstargames" size={130} />
        <Chip text="Estudio de GTA 6" delay={fGta - 4} color={C.nv} textColor={C.white} size={46} style={{ position: "relative" }} />
      </div>
      <GtaFx name="v3-chyron" from={-48} style={{ translate: `0 ${FX_Y.chyron}px` }} />
      <Stamp text="Rechazado" delay={fSind} color={C.red} size={110} rotate={-7} style={{ left: 250, top: 1050 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. LA VOTACIÓN: 75% no · participación 93%
// =====================================================================
const Voto: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const w = (q: string) => wordF("voto", q, startMs);
  const f75 = w("75");
  const f93 = w("93");
  return (
    <AbsoluteFill>
      <Bg src="img/skyline.jpg" dur={dur} dim={0.6} from={1.05} to={1.18} />
      <Bar active={1} />
      <Chip text="Estudios de Reino Unido" delay={0} color={C.white} size={44} style={{ left: 80, top: 250 }} />
      <GtaFx name="v3-voto" from={Math.max(0, f75 - 24)} style={{ translate: `0 ${FX_Y.voto}px` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1160, display: "flex", justifyContent: "center", opacity: ramp(frame, f93 - 2, 6) }}>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 46, color: C.ink, background: C.yellow, padding: "10px 30px", borderRadius: 999, scale: String(interpolate(frame, [f93 - 2, f93 + 6], [0.6, 1], clamp)) }}>
          PARTICIPACIÓN: 93%
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 4. LA POSTURA DE ROCKSTAR
// =====================================================================
const Rockstar: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("rockstar", q, startMs);
  const fDir = w("directamente");
  const card = softSpring(frame, fps, 4);
  return (
    <AbsoluteFill>
      <Bg src="img/poster.jpg" dur={dur} dim={0.65} from={1.1} to={1.22} />
      <Bar active={2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center", scale: String(popSpring(frame, fps, 0)) }}>
        <BrandLogo slug="rockstargames" size={250} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 600,
          padding: "40px 44px",
          borderRadius: 28,
          background: "rgba(5,8,7,0.82)",
          borderLeft: `14px solid ${C.nv}`,
          translate: `0 ${interpolate(card, [0, 1], [80, 0])}px`,
          opacity: card,
        }}
      >
        <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 34, color: C.nvLight, letterSpacing: "0.06em" }}>LA POSTURA DE ROCKSTAR</div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 92, color: C.white, lineHeight: 1.08, marginTop: 14 }}>
          Su plantilla prefiere tratar{" "}
          <span style={{ color: C.yellow, opacity: frame >= fDir - 2 ? 1 : 0.25 }}>directamente</span> con la empresa
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- mazo de juez (dibujo propio) ----------
const Gavel: React.FC<{ w: number; angle: number }> = ({ w, angle }) => (
  <svg viewBox="0 0 300 300" width={w} height={w}>
    <rect x="40" y="250" width="220" height="30" rx="8" fill="#6b3f1d" />
    <rect x="80" y="232" width="140" height="22" rx="6" fill="#8a5428" />
    <g transform={`rotate(${angle} 230 200)`}>
      <rect x="120" y="150" width="150" height="20" rx="8" fill="#a8693a" transform="rotate(-35 195 160)" />
      <rect x="60" y="40" width="70" height="130" rx="14" fill="#8a5428" transform="rotate(-35 95 105)" />
      <rect x="66" y="52" width="58" height="14" rx="5" fill="#d9a066" transform="rotate(-35 95 105)" />
    </g>
  </svg>
);

// =====================================================================
// 5. BATALLA LEGAL: el sindicato no se rinde
// =====================================================================
const Juicio: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("juicio", q, startMs);
  const fRinde = w("rinde");
  const fBat = w("batalla");
  const f25 = w("2025");
  const hit = fBat + 8;
  const ang = interpolate(frame, [fBat - 6, hit], [-40, 0], clamp);
  const sh = useShake(hit, 8, 14);
  return (
    <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px` }}>
      <TechBackdrop hue="#2a0618" />
      <Bar active={3} />
      <div style={{ position: "absolute", left: 80, top: 250 }}>
        <MaskLine delay={0} size={96} shadow={C.ink}>
          El sindicato
        </MaskLine>
      </div>
      <Stamp text="No se rinde" delay={fRinde - 2} color={C.nv} size={110} rotate={-6} style={{ left: 90, top: 380 }} />
      <div style={{ position: "absolute", right: 60, top: 560, opacity: ramp(frame, fBat - 8, 6) }}>
        <Gavel w={420} angle={ang} />
      </div>
      <div style={{ position: "absolute", left: 80, top: 640, opacity: ramp(frame, fBat - 4, 6) }}>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 100, color: C.white, lineHeight: 1, textShadow: `6px 6px 0 ${C.ink}` }}>BATALLA</div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 100, color: C.nvLight, lineHeight: 1, textShadow: `6px 6px 0 ${C.ink}` }}>LEGAL</div>
      </div>
      <div style={{ position: "absolute", left: 80, top: 1010, display: "flex", alignItems: "center", gap: 24, scale: String(popSpring(frame, fps, f25 - 4)), opacity: frame >= f25 - 4 ? 1 : 0, transformOrigin: "left center" }}>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 48, color: C.ink, background: C.yellow, padding: "10px 26px", borderRadius: 12 }}>DESPEDIDOS EN 2025</div>
      </div>
      <Chip text="Rockstar: por filtraciones" delay={f25 + 10} color={C.white} size={36} style={{ left: 80, top: 1120 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 6. CIERRE
// =====================================================================
const Cierre: React.FC<SceneProps> = (p) => (
  <Poll {...p} segId="cierre" line1="¿Tú qué" line2="votarías?" size1={150} size2={160} footer="Fuentes: PC Gamer · Kotaku · VGC · Edinburgh News" bar={<Bar active={4} />} />
);

// =====================================================================
// MINIATURA (portada TikTok 1080×1920; zona clave y 240-1680)
// =====================================================================
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.ink }}>
    <Img src={staticFile("img/keyart.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: "1.15" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,8,20,0.85) 0%, rgba(5,8,20,0.45) 40%, rgba(5,8,20,0.85) 66%, rgba(5,8,20,0.95) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 44, color: C.white, background: C.red, padding: "10px 26px", borderRadius: 10, letterSpacing: "0.08em" }}>
        ● ÚLTIMA HORA
      </div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 116, lineHeight: 1.05, color: C.white, marginTop: 30, textShadow: `8px 8px 0 ${C.ink}` }}>EN ROCKSTAR VOTAN</div>
      <div
        style={{
          fontFamily: FONT_HEAD,
          fontSize: 330,
          lineHeight: 1.0,
          background: "linear-gradient(180deg, #FFB3D6 10%, #FF2E88 60%, #D10F66 100%)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          filter: "drop-shadow(0 0 40px #FF2E88) drop-shadow(8px 8px 0 #000)",
          rotate: "-4deg",
        }}
      >
        NO
      </div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 140, lineHeight: 1.05, color: C.white, textShadow: `8px 8px 0 ${C.ink}` }}>AL SINDICATO</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", alignItems: "center", gap: 34 }}>
      <BrandLogo slug="rockstargames" size={170} />
      <div style={{ textAlign: "left" }}>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 180, lineHeight: 1, color: C.yellow, textShadow: `8px 8px 0 ${C.ink}` }}>75%</div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 40, color: C.white }}>VOTÓ EN CONTRA</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1470, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 46, color: C.ink, background: C.nvLight, padding: "10px 28px", borderRadius: 999 }}>EL ESTUDIO DE GTA 6</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1620, textAlign: "center", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 40, color: C.white, opacity: 0.9 }}>
      VIDEOJUEGOS · TE LO CUENTO EN 1 MINUTO
    </div>
  </AbsoluteFill>
);

export const SCENES: SceneDef[] = [
  { key: "hook", firstSeg: "hook", C: Hook },
  { key: "lema", firstSeg: "lema", C: Lema, flash: C.nv },
  { key: "voto", firstSeg: "voto", C: Voto, flash: C.nvLight },
  { key: "rockstar", firstSeg: "rockstar", C: Rockstar, flash: C.nv },
  { key: "juicio", firstSeg: "juicio", C: Juicio, flash: C.red },
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
      <Sfx at={at("hook", "rockstar") - 4} src="pop" volume={0.4} />
      <Sfx at={at("hook", "sindicato")} src="impact" volume={0.55} />
      <Sfx at={at("lema", "menos")} src="ding" volume={0.4} />
      <Sfx at={at("voto", "75") - 24} src="riser" volume={0.3} />
      <Sfx at={at("voto", "93")} src="pop" volume={0.45} />
      <Sfx at={at("rockstar", "directamente")} src="whoosh" volume={0.35} />
      <Sfx at={at("juicio", "rinde") - 2} src="impact" volume={0.45} />
      <Sfx at={at("juicio", "batalla") + 8} src="impact" volume={0.5} />
      <Sfx at={at("cierre", "comentarios")} src="pop" volume={0.5} />
    </>
  );
};
