/**
 * HISTORIA: «GTA 6 ha destrozado todos los récords» (vídeo viral 30 s · 25 nov 2026).
 * Fondos: arte oficial de rockstargames.com. Efectos estilo GTA: gta-fx (echris6/gta-components, MIT), en public/fx/v-*.webm.
 * Datos: Take-Two (3.790 M$ el primer día), Sony/PlayStation (39 M jugadores y 683 M horas en PS5, 19-22 nov).
 */
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Bg, MaskLine, punch, useShake } from "./components";
import { C, FONT_BODY, FONT_HEAD, popSpring, ramp, wordF } from "./lib";
import { BrandLogo, GtaFx, HookBadge, Lema, NewsBar, Poll, SceneDef, SceneProps } from "./news";

const DATE = "25 NOV";
const Bar: React.FC<{ active: number }> = ({ active }) => <NewsBar active={active} total={5} label="GTA 6" date={DATE} />;

// desplazamientos verticales de los efectos (px) para no tapar los subtítulos (y ≥ 1290)
const FX_Y = { chyron: 0, cash: 0, wasted: 0, confirmado: -330, horas: 0, mision: 0 };

// =====================================================================
// 1. GANCHO: rótulo de última hora sobre el arte oficial
// =====================================================================
const Hook: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fRec = wordF("hook", "records", startMs);
  const z = punch(frame, fps, fRec, 0.05);
  return (
    <AbsoluteFill style={{ scale: String(z) }}>
      <Bg src="img/keyart.jpg" dur={dur} dim={0.35} from={1.1} to={1.3} y={[0, -60]} />
      <HookBadge label="ÚLTIMA HORA" date="25 NOV 2026" />
      <GtaFx name="v-chyron" from={0} style={{ translate: `0 ${FX_Y.chyron}px` }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. DINERO: 3.790 M$ el primer día
// =====================================================================
const Dinero: React.FC<SceneProps> = ({ dur }) => (
  <AbsoluteFill>
    <Bg src="img/poster.jpg" dur={dur} dim={0.45} from={1.6} to={1.8} objectPosition="60% center" />
    <Bar active={1} />
    <GtaFx name="v-cash" from={0} style={{ translate: `0 ${FX_Y.cash}px` }} />
  </AbsoluteFill>
);

// =====================================================================
// 4. GTA 5: su récord… WASTED
// =====================================================================
const Gta5: React.FC<SceneProps> = ({ startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fCinco = wordF("gta5", "gta", startMs);
  const sh = useShake(fCinco + 6, 10, 18);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0e", translate: `${sh.x}px ${sh.y}px` }}>
      <AbsoluteFill style={{ filter: `grayscale(${ramp(frame, fCinco, 10)})` }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", scale: String(popSpring(frame, fps, 0)) }}>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 44, color: C.white, opacity: 0.8, letterSpacing: "0.12em" }}>RÉCORD ANTERIOR</div>
          <div style={{ fontFamily: FONT_HEAD, fontSize: 230, color: C.white, lineHeight: 1 }}>GTA V</div>
          <div style={{ fontFamily: FONT_HEAD, fontSize: 120, color: C.nvLight }}>800 M$</div>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 800, fontSize: 40, color: C.white, opacity: 0.8 }}>primer día · 2013</div>
        </div>
      </AbsoluteFill>
      <GtaFx name="v-wasted" from={Math.max(0, fCinco - 30)} style={{ translate: `0 ${FX_Y.wasted}px` }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 5. PS5: +39 M jugadores · CONFIRMADO
// =====================================================================
const Ps5: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fJug = wordF("ps5", "jugadores", startMs);
  return (
    <AbsoluteFill>
      <Bg src="img/car.jpg" dur={dur} dim={0.5} from={1.15} to={1.3} objectPosition="40% center" />
      <Bar active={2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", scale: String(popSpring(frame, fps, 0)) }}>
        <BrandLogo slug="playstation" size={200} color={C.white} />
      </div>
      <GtaFx name="v-confirmado" from={Math.max(0, fJug - 24)} style={{ translate: `0 ${FX_Y.confirmado}px` }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 6. HORAS: 683.000.000
// =====================================================================
const Horas: React.FC<SceneProps> = ({ dur }) => (
  <AbsoluteFill>
    <Bg src="img/skyline.jpg" dur={dur} dim={0.5} from={1.05} to={1.2} />
    <Bar active={3} />
    <GtaFx name="v-horas" from={0} style={{ translate: `0 ${FX_Y.horas}px` }} />
  </AbsoluteFill>
);

// =====================================================================
// 7. MISIÓN SUPERADA: mayor lanzamiento del entretenimiento
// =====================================================================
const Mision: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const fMayor = wordF("mision", "mayor", startMs);
  return (
    <AbsoluteFill>
      <Bg src="img/keyart.jpg" dur={dur} dim={0.45} from={1.25} to={1.4} y={[-40, 20]} />
      <Bar active={4} />
      <GtaFx name="v-mision" from={0} style={{ translate: `0 ${FX_Y.mision}px` }} />
      <div style={{ position: "absolute", left: 80, right: 80, top: 860, textAlign: "center", opacity: frame >= fMayor ? 1 : 0 }}>
        <MaskLine delay={fMayor} size={82} shadow={C.ink}>
          Mayor lanzamiento
        </MaskLine>
        <MaskLine delay={fMayor + 4} size={82} color={C.nvLight} shadow={C.ink}>
          del entretenimiento
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", justifyContent: "center", opacity: ramp(frame, fMayor + 10, 8) }}>
        <BrandLogo slug="rockstargames" size={120} />
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 8. CIERRE
// =====================================================================
const Cierre: React.FC<SceneProps> = (p) => (
  <Poll {...p} segId="cierre" line1="¿Ya lo" line2="has jugado?" size1={170} size2={170} footer="Fuentes: Take-Two · PlayStation · Forbes · CNN" bar={<Bar active={5} />} />
);

// =====================================================================
// MINIATURA (portada TikTok 1080×1920; zona clave y 240-1680)
// =====================================================================
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.ink }}>
    <Img src={staticFile("img/keyart.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", scale: "1.15" }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,6,24,0.85) 0%, rgba(11,6,24,0.45) 40%, rgba(11,6,24,0.8) 66%, rgba(11,6,24,0.95) 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center" }}>
      <div style={{ display: "inline-block", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 44, color: C.white, background: C.red, padding: "10px 26px", borderRadius: 10, letterSpacing: "0.08em" }}>
        ● ÚLTIMA HORA
      </div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 250, lineHeight: 1.02, color: C.white, marginTop: 30, textShadow: `10px 10px 0 ${C.ink}` }}>GTA 6</div>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 170, lineHeight: 1.02, color: C.nvLight, textShadow: `0 0 60px ${C.nv}, 10px 10px 0 ${C.ink}`, whiteSpace: "nowrap" }}>LO HA ROTO TODO</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center" }}>
      <div style={{ fontFamily: FONT_HEAD, fontSize: 230, lineHeight: 1, color: C.white, textShadow: `8px 8px 0 ${C.ink}` }}>3.790 M$</div>
      <div style={{ display: "inline-block", marginTop: 16, fontFamily: FONT_BODY, fontWeight: 900, fontSize: 54, color: C.ink, background: C.yellow, padding: "10px 30px", borderRadius: 999, rotate: "-3deg" }}>
        EN SU PRIMER DÍA
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1400, textAlign: "center", fontFamily: FONT_HEAD, fontSize: 110, color: "#FF3B2E", textShadow: "0 0 40px #FF3B2E, 6px 6px 0 #000", rotate: "-4deg" }}>
      GTA V: WASTED
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1620, textAlign: "center", fontFamily: FONT_BODY, fontWeight: 900, fontSize: 40, color: C.white, opacity: 0.9 }}>
      TE LO CUENTO EN 1 MINUTO
    </div>
  </AbsoluteFill>
);

export const SCENES: SceneDef[] = [
  { key: "hook", firstSeg: "hook", C: Hook },
  { key: "lema", firstSeg: "lema", C: Lema, flash: C.nv },
  { key: "dinero", firstSeg: "dinero", C: Dinero, flash: C.yellow },
  { key: "gta5", firstSeg: "gta5", C: Gta5 },
  { key: "ps5", firstSeg: "ps5", C: Ps5, flash: C.nv },
  { key: "horas", firstSeg: "horas", C: Horas, flash: C.nvLight },
  { key: "mision", firstSeg: "mision", C: Mision, flash: C.yellow },
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
      <Sfx at={at("hook", "records")} src="glitch" volume={0.35} />
      <Sfx at={at("lema", "menos")} src="ding" volume={0.4} />
      <Sfx at={at("dinero", "3")} src="cash" volume={0.5} />
      <Sfx at={at("gta5", "gta") + 4} src="impact" volume={0.55} />
      <Sfx at={at("ps5", "jugadores") - 10} src="impact" volume={0.45} />
      <Sfx at={at("horas", "683") - 4} src="riser" volume={0.3} />
      <Sfx at={at("mision", "mayor") - 6} src="ding" volume={0.45} />
      <Sfx at={at("cierre", "comentarios")} src="pop" volume={0.5} />
    </>
  );
};
