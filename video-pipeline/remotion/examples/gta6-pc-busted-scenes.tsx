/**
 * HISTORIA: «Take-Two tumba el GTA 6 para PC hecho por fans (Proyecto Leonida)» (Videojuegos · 25 nov 2026).
 * Fondos: arte oficial de rockstargames.com. Efectos GTA: public/fx/v2-*.webm (gta-fx).
 * Fuentes: heise, PC Guide, Beebom (retirada DMCA, 3.007 repos); GamesBeat (PC Q1 2027, sin confirmar).
 */
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg, Chip, MaskLine, Stamp, punch, useShake } from "./components";
import { C, FONT_BODY, FONT_HEAD, popSpring, ramp, softSpring, wordF } from "./lib";
import { BrandLogo, GtaFx, HookBadge, Lema, NewsBar, Poll, SceneDef, SceneProps, TechBackdrop } from "./news";

const DATE = "25 NOV";
const Bar: React.FC<{ active: number }> = ({ active }) => <NewsBar active={active} total={5} label="VIDEOJUEGOS" date={DATE} />;
const FX_Y = { busted: 0, repos: 0, rumor: 0 };

// =====================================================================
// 1. GANCHO: titular + BUSTED al final de la frase
// =====================================================================
const Hook: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("hook", q, startMs);
  const fFans = w("fans");
  const fBorr = w("borrados");
  const bustedFrom = Math.max(0, fBorr - 36); // el golpe del efecto (≈1,2 s) cae en «borrados»
  const z = punch(frame, fps, fFans, 0.05);
  return (
    <AbsoluteFill style={{ scale: String(z) }}>
      <Bg src="img/keyart.jpg" dur={dur} dim={0.5} from={1.12} to={1.28} y={[0, -50]} />
      <HookBadge label="ÚLTIMA HORA" date="25 NOV 2026" />
      <div style={{ position: "absolute", left: 80, top: 230 }}>
        <MaskLine delay={-9} size={126} shadow={C.red}>
          Take-Two tumba
        </MaskLine>
        <MaskLine delay={-5} size={126} color={C.nvLight} shadow={C.ink}>
          el GTA 6 para PC
        </MaskLine>
        <MaskLine delay={fFans - 6} size={126} color={C.yellow} shadow={C.ink}>
          hecho por fans
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 80, top: 720, display: "flex", alignItems: "center", gap: 22, opacity: ramp(frame, fFans, 8) }}>
        <BrandLogo slug="github" size={110} />
        <div style={{ fontFamily: FONT_HEAD, fontSize: 96, color: C.white, textShadow: `5px 5px 0 ${C.ink}` }}>+3.000 REPOS</div>
      </div>
      <GtaFx name="v2-busted" from={bustedFrom} style={{ translate: `0 ${FX_Y.busted}px` }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. QUÉ ERA: Proyecto Leonida
// =====================================================================
const Que: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("que", q, startMs);
  const fLeon = w("leonida");
  const fWin = w("windows");
  const fFilt = w("filtrada");
  const card = popSpring(frame, fps, fLeon - 6);
  return (
    <AbsoluteFill>
      <TechBackdrop hue="#2a0618" />
      <Bar active={1} />
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 280,
          background: "#0d1117",
          border: "3px solid #30363d",
          borderRadius: 26,
          padding: "34px 40px",
          scale: String(card),
          opacity: frame >= fLeon - 6 ? 1 : 0,
          boxShadow: `0 0 60px ${C.nv}44`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <BrandLogo slug="github" size={70} />
          <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 34, color: "#8b949e" }}>repositorio · fan-made</div>
        </div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 120, color: C.white, marginTop: 14, lineHeight: 1 }}>PROYECTO</div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 150, color: C.nvLight, lineHeight: 1 }}>LEONIDA</div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 800, fontSize: 34, color: "#c9d1d9", marginTop: 14 }}>Port no oficial de GTA 6 para PC</div>
      </div>
      <Chip text="Para Windows" delay={fWin} color={C.cyan} size={42} style={{ left: 110, top: 930 }} />
      <Chip text="⚠ Versión filtrada de Xbox" delay={fFilt} color={C.yellow} textColor={C.ink} size={42} style={{ left: 110, top: 1040 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 4. DMCA: 3.007 repositorios bloqueados
// =====================================================================
const Dmca: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("dmca", q, startMs);
  const fDer = w("derechos");
  const fNum = w("3.007");
  const sh = useShake(fNum + 20, 8, 12);
  return (
    <AbsoluteFill style={{ translate: `${sh.x}px ${sh.y}px` }}>
      <Bg src="img/skyline.jpg" dur={dur} dim={0.6} from={1.05} to={1.2} />
      <Bar active={2} />
      <Stamp text="Aviso DMCA" delay={fDer} color={C.red} size={90} rotate={-6} style={{ left: 300, top: 1080 }} />
      <GtaFx name="v2-repos" from={Math.max(0, fNum - 8)} style={{ translate: `0 ${FX_Y.repos}px` }} />
      <div style={{ position: "absolute", right: 90, top: 1120, scale: String(popSpring(frame, fps, fNum + 30)), opacity: frame >= fNum + 30 ? 1 : 0 }}>
        <BrandLogo slug="github" size={90} />
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 5. PC OFICIAL: sin fecha
// =====================================================================
const Pc: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("pc", q, startMs);
  const fRock = w("rockstar");
  const fFecha = w("fecha");
  const mon = softSpring(frame, fps, 0);
  return (
    <AbsoluteFill>
      <Bg src="img/car.jpg" dur={dur} dim={0.6} from={1.15} to={1.3} objectPosition="40% center" />
      <Bar active={3} />
      {/* monitor de PC (dibujo propio) */}
      <div style={{ position: "absolute", left: 540 - 330, top: 330, width: 660, scale: String(mon) }}>
        <div style={{ height: 400, borderRadius: 24, border: `10px solid ${C.white}`, background: "#0b0b12", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ fontFamily: FONT_HEAD, fontSize: 150, color: C.white, lineHeight: 1 }}>GTA 6</div>
          <div style={{ fontFamily: FONT_HEAD, fontSize: 90, color: C.nvLight, lineHeight: 1 }}>EN PC</div>
        </div>
        <div style={{ margin: "0 auto", width: 80, height: 60, background: C.white }} />
        <div style={{ margin: "0 auto", width: 280, height: 18, borderRadius: 9, background: C.white }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 870, display: "flex", justifyContent: "center", alignItems: "center", gap: 26, opacity: ramp(frame, fRock - 2, 8) }}>
        <BrandLogo slug="rockstargames" size={110} />
        <div style={{ fontFamily: FONT_HEAD, fontSize: 90, color: C.white, textShadow: `5px 5px 0 ${C.ink}` }}>FECHA:</div>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 130, color: C.yellow, textShadow: `5px 5px 0 ${C.ink}`, scale: String(popSpring(frame, fps, fFecha)), opacity: frame >= fFecha ? 1 : 0 }}>¿?</div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 6. RUMOR: principios de 2027, sin confirmar
// =====================================================================
const Rumor: React.FC<SceneProps> = ({ dur }) => (
  <AbsoluteFill>
    <Bg src="img/keyart.jpg" dur={dur} dim={0.55} from={1.3} to={1.42} y={[0, -30]} />
    <Bar active={4} />
    <GtaFx name="v2-rumor" from={0} style={{ translate: `0 ${FX_Y.rumor}px` }} />
  </AbsoluteFill>
);

// =====================================================================
// 7. CIERRE
// =====================================================================
const Cierre: React.FC<SceneProps> = (p) => (
  <Poll {...p} segId="cierre" line1="¿Esperarás" line2="la oficial?" size1={150} size2={170} footer="Fuentes: heise · PC Guide · Beebom · GamesBeat" bar={<Bar active={5} />} />
);

// =====================================================================
// MINIATURA (portada TikTok 1080×1920; zona clave y 240-1680)
// =====================================================================
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.ink }}>
    <Img src={staticFile("img/keyart.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: "1.15" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,8,20,0.85) 0%, rgba(5,8,20,0.5) 40%, rgba(5,8,20,0.85) 66%, rgba(5,8,20,0.95) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 44, color: C.white, background: C.red, padding: "10px 26px", borderRadius: 10, letterSpacing: "0.08em" }}>
        ● ÚLTIMA HORA
      </div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 150, lineHeight: 1.05, color: C.white, marginTop: 30, textShadow: `8px 8px 0 ${C.ink}` }}>GTA 6 PC "FAN"</div>
      <div
        style={{
          fontFamily: FONT_HEAD,
          fontSize: 300,
          lineHeight: 1.05,
          background: "linear-gradient(180deg, #FFFFFF 30%, #CFE0FF 58%, #A9C4FF 82%)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          filter: "drop-shadow(0 0 40px #3B82FF) drop-shadow(8px 8px 0 #000)",
          rotate: "-4deg",
        }}
      >
        BUSTED
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1080, display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
      <BrandLogo slug="github" size={150} />
      <div style={{ textAlign: "left" }}>
        <div style={{ fontFamily: FONT_HEAD, fontSize: 170, lineHeight: 1, color: C.white, textShadow: `8px 8px 0 ${C.ink}` }}>3.007</div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 44, color: C.yellow }}>REPOS BORRADOS</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1460, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 46, color: C.ink, background: C.nvLight, padding: "10px 28px", borderRadius: 999 }}>TAKE-TWO LO TUMBA</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1620, textAlign: "center", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 40, color: C.white, opacity: 0.9 }}>
      VIDEOJUEGOS · TE LO CUENTO EN 1 MINUTO
    </div>
  </AbsoluteFill>
);

export const SCENES: SceneDef[] = [
  { key: "hook", firstSeg: "hook", C: Hook },
  { key: "lema", firstSeg: "lema", C: Lema, flash: C.nv },
  { key: "que", firstSeg: "que", C: Que, flash: C.nvLight },
  { key: "dmca", firstSeg: "dmca", C: Dmca, flash: C.red },
  { key: "pc", firstSeg: "pc", C: Pc, flash: C.nv },
  { key: "rumor", firstSeg: "rumor", C: Rumor, flash: C.yellow },
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
      <Sfx at={at("hook", "fans")} src="pop" volume={0.45} />
      <Sfx at={at("hook", "borrados")} src="impact" volume={0.55} />
      <Sfx at={at("lema", "menos")} src="ding" volume={0.4} />
      <Sfx at={at("que", "leonida") - 4} src="pop" volume={0.45} />
      <Sfx at={at("que", "filtrada")} src="glitch" volume={0.4} />
      <Sfx at={at("dmca", "derechos")} src="impact" volume={0.45} />
      <Sfx at={at("dmca", "3.007") - 6} src="riser" volume={0.3} />
      <Sfx at={at("pc", "fecha")} src="pop" volume={0.45} />
      <Sfx at={at("rumor", "principios") - 4} src="whoosh" volume={0.35} />
      <Sfx at={at("cierre", "comentarios")} src="pop" volume={0.5} />
    </>
  );
};
