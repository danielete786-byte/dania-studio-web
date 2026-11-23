import React from "react";
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Banknote,
  Bigfoot,
  Boat,
  Body,
  Building,
  Burger,
  CommentBubble,
  Footprint,
  HouseUfoPhoto,
  MapPin,
  Mangrove,
  Polaroid,
  Ufo,
} from "./art";
import { Badge, Bg, Chip, Hand, MaskLine, RetroGrid, Stamp, TopBar, punch, useShake } from "./components";
import { C, clamp, EASE_IN, EASE_MOVE, FONT_BODY, FONT_HAND, FONT_HEAD, popSpring, ramp, seg, softSpring, wordF } from "./lib";

export type SceneProps = { dur: number; startMs: number };

// =====================================================================
// 1. GANCHO
// =====================================================================
export const Hook: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string, n = 0) => wordF("hook", q, startMs, n);
  const fFoto = w("foto");
  const fCinco = w("cinco");
  const fNadie = w("nadie");
  const sh = useShake(fNadie, 12, 22);
  const drop = popSpring(frame, fps, fFoto - 2);
  const z = punch(frame, fps, fCinco, 0.06) * punch(frame, fps, fNadie, 0.08);
  const glitch = frame >= fNadie && frame < fNadie + 10 ? 1 : 0;
  return (
    <AbsoluteFill style={{ scale: String(z), translate: `${sh.x}px ${sh.y}px` }}>
      <Bg src="img/keyart.jpg" dur={dur} dim={0.5} from={1.15} to={1.3} y={[0, -60]} />
      <RetroGrid opacity={0.35} />
      <div style={{ position: "absolute", left: 80, top: 250 }}>
        <MaskLine delay={-9} size={128}>
          Rockstar escondió
        </MaskLine>
        <MaskLine delay={fFoto - 4} size={128} color={C.yellow} shadow={C.purple}>
          una foto de GTA VI
        </MaskLine>
        <div style={{ height: 14 }} />
        <div
          style={{
            display: "inline-block",
            fontFamily: FONT_HEAD,
            fontSize: 104,
            color: C.white,
            background: C.pink,
            padding: "0 24px 8px",
            rotate: "-3deg",
            scale: String(interpolate(popSpring(frame, fps, fCinco - 2), [0, 1], [0, 1])),
            boxShadow: `8px 8px 0 ${C.night}`,
          }}
        >
          5 AÑOS ANTES
        </div>
      </div>
      <Polaroid
        width={540}
        caption="2021"
        style={{
          left: 270,
          top: 720,
          rotate: `${interpolate(drop, [0, 1], [-30, -5])}deg`,
          translate: `0 ${interpolate(drop, [0, 1], [-1400, 0])}px`,
          filter: glitch ? `drop-shadow(14px 0 0 ${C.red}) drop-shadow(-14px 0 0 ${C.cyan})` : undefined,
        }}
      >
        <HouseUfoPhoto sway={Math.sin(frame / 12) * 4} beam={0.5 + 0.3 * Math.sin(frame / 5)} lights={frame / 6} />
      </Polaroid>
      <Stamp text="Nadie se dio cuenta" delay={fNadie} size={70} rotate={-8} style={{ left: 140, top: 1080 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 2. INTRO
// =====================================================================
const MiniIcon: React.FC<{ i: number }> = ({ i }) => {
  if (i === 0)
    return (
      <svg viewBox="0 0 200 120" width={120}>
        <Ufo x={100} y={60} w={180} lights={1} />
      </svg>
    );
  if (i === 1) return <Banknote w={130} />;
  if (i === 2) return <Bigfoot h={120} />;
  if (i === 3)
    return (
      <div style={{ scale: "0.9" }}>
        <Building w={140} draw={1} />
      </div>
    );
  return <Burger w={110} />;
};

export const Intro: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string) => wordF("intro", q, startMs);
  const fRaras = w("raras");
  const fJug = w("jugadores");
  const under = ramp(frame, fRaras + 4, 12);
  return (
    <AbsoluteFill>
      <Bg src="img/skyline.jpg" dur={dur} dim={0.35} from={1.05} to={1.18} />
      <RetroGrid opacity={0.55} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <MaskLine delay={0} size={130}>
          Las 5 cosas
        </MaskLine>
        <MaskLine delay={fRaras - 3} size={190} color={C.pink} shadow={C.night}>
          más raras
        </MaskLine>
        <svg width={700} height={60} style={{ marginTop: -16 }}>
          <path
            d="M 10 40 Q 180 10 350 32 T 690 22"
            stroke={C.yellow}
            strokeWidth={12}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={800}
            strokeDashoffset={800 * (1 - under)}
          />
        </svg>
        <MaskLine delay={fRaras + 8} size={130} color={C.cyan} shadow={C.night}>
          de GTA VI
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1020, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const s = popSpring(frame, fps, fJug - 10 + i * 3);
          return (
            <div
              key={i}
              style={{
                width: 172,
                height: 172,
                borderRadius: 30,
                background: "rgba(11,6,24,0.75)",
                border: `4px solid ${[C.cyan, C.green, C.green, C.red, C.yellow][i]}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                scale: String(s),
                rotate: `${interpolate(s, [0, 1], [30, (i - 2) * 3])}deg`,
              }}
            >
              <MiniIcon i={i} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 3. LA CASA DEL CONSPIRANOICO (casa1 + casa2)
// =====================================================================
const Note: React.FC<{ text: string; delay: number; x: number; y: number; rot: number; color: string; w?: number }> = ({
  text,
  delay,
  x,
  y,
  rot,
  color,
  w = 380,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = popSpring(frame, fps, delay);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        padding: "34px 26px 30px",
        background: color,
        fontFamily: FONT_HAND,
        fontSize: 48,
        lineHeight: 1.1,
        color: "#1a1a1a",
        textAlign: "center",
        rotate: `${rot}deg`,
        scale: String(interpolate(s, [0, 1], [0.2, 1])),
        opacity: interpolate(s, [0, 0.2], [0, 1], clamp),
        boxShadow: "0 18px 30px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ position: "absolute", left: "50%", top: -14, width: 30, height: 30, marginLeft: -15, borderRadius: 15, background: C.red, boxShadow: "0 4px 6px rgba(0,0,0,0.5)" }} />
      {text}
    </div>
  );
};

export const Casa: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w1 = (q: string, n = 0) => wordF("casa1", q, startMs, n);
  const w2 = (q: string, n = 0) => wordF("casa2", q, startMs, n);
  const fDos = w1("dos");
  const fBar = w1("bar");
  const fFoto = w1("foto");
  const fPalm = w1("palmeras");
  const fPlat = w1("platillo");
  const partB = Math.round(((seg("casa2").startMs - startMs) / 1000) * fps) - 4;
  const fLeon = w2("leonida");
  const fGaraje = w2("garaje");
  const fNotas = w2("notas");
  const fConsp = w2("conspiranoico");
  const fVideo = w2("videojuego");
  const sh = useShake(fVideo, 12, 20);

  const enter = popSpring(frame, fps, 2);
  const toB = softSpring(frame, fps, partB);
  const ufoIn = ramp(frame, fPlat - 6, 20, EASE_MOVE);
  const flash = interpolate(frame, [fFoto, fFoto + 2, fFoto + 8], [0, 0.9, 0], clamp);
  const strings = ramp(frame, fNotas + 6, 18);
  const z = punch(frame, fps, partB, 0.05) * punch(frame, fps, fVideo, 0.08);

  return (
    <AbsoluteFill style={{ scale: String(z), translate: `${sh.x}px ${sh.y}px` }}>
      <Bg src="img/skyline_wide.jpg" dur={dur} dim={0.6} blur={6} from={1.3} to={1.5} x={[60, -60]} tint="#6b2fa8" />
      <RetroGrid opacity={0.25} color={C.cyan} />
      <TopBar active={1} />
      <Badge n={1} delay={0} />
      <Chip text="GTA San Andreas · 2021" delay={fDos} color={C.yellow} size={40} style={{ left: 420, top: 300, opacity: 1 - toB }} />

      {/* Polaroid: centrada en la parte A, se va al tablero en la parte B */}
      <Polaroid
        width={interpolate(toB, [0, 1], [700, 420])}
        caption={frame >= fBar ? "Lil' Probe'Inn" : ""}
        style={{
          left: interpolate(toB, [0, 1], [190, 70]),
          top: interpolate(toB, [0, 1], [440, 420]),
          rotate: `${interpolate(toB, [0, 1], [interpolate(enter, [0, 1], [18, 3]), -7])}deg`,
          scale: String(interpolate(enter, [0, 1], [0.4, 1])),
        }}
      >
        <HouseUfoPhoto
          ufoX={interpolate(ufoIn, [0, 1], [760, 300])}
          ufoY={interpolate(ufoIn, [0, 1], [40, 130])}
          beam={frame > fPlat + 14 ? 0.55 + 0.25 * Math.sin(frame / 4) : 0}
          sway={frame >= fPalm ? Math.sin((frame - fPalm) / 5) * 8 : 0}
          lights={frame / 5}
        />
        <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash }} />
      </Polaroid>
      {frame < partB ? <Hand text="¿un OVNI?" delay={fPlat + 6} size={66} style={{ left: 640, top: 1110 }} rotate={-8} /> : null}

      {/* Parte B: tablero conspiranoico */}
      {frame >= partB ? (
        <>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            {[
              [280, 560, 760, 560],
              [280, 560, 300, 930],
              [760, 560, 760, 980],
              [300, 930, 760, 980],
            ].map(([x1, y1, x2, y2], i) => {
              const L = Math.hypot(x2 - x1, y2 - y1);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={C.red}
                  strokeWidth={6}
                  strokeDasharray={L}
                  strokeDashoffset={L * (1 - interpolate(strings, [i * 0.15, i * 0.15 + 0.4], [0, 1], clamp))}
                />
              );
            })}
          </svg>
          <div style={{ position: "absolute", left: 600, top: 330 }}>
            {(() => {
              const s = popSpring(frame, fps, fLeon);
              return (
                <div style={{ translate: `0 ${interpolate(s, [0, 1], [-300, 0])}px`, opacity: interpolate(s, [0, 0.2], [0, 1], clamp) }}>
                  <MapPin w={90} />
                </div>
              );
            })()}
          </div>
          <Chip text="Belville · Leonida" delay={fLeon + 4} color={C.pink} textColor={C.white} size={44} style={{ left: 520, top: 480 }} />
          <Chip text="El garaje" delay={fGaraje} color={C.cyan} size={38} style={{ left: 600, top: 580 }} />
          <Note text="No puedo salir de Leonida" delay={fNotas} x={570} y={660} rot={5} color={C.yellow} w={380} />
          <Note text="¿J + L?" delay={fConsp - 2} x={110} y={880} rot={-6} color="#FF8FC2" w={300} />
          <Stamp text="Esto es un videojuego" delay={fVideo} color={C.cyan} size={62} rotate={-6} style={{ left: 148, top: 1120 }} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// =====================================================================
// 4. BILLETES DE RED DEAD
// =====================================================================
export const Billetes: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string, n = 0) => wordF("billetes", q, startMs, n);
  const fTrailer = w("trailer");
  const fBill = w("billetes");
  const fReales = w("reales");
  const fRed = w("red");
  const fMismo = w("mismo");
  const sh = useShake(fRed, 8, 14);
  const big = popSpring(frame, fps, fBill - 2);
  const toVenn = softSpring(frame, fps, fMismo - 4);
  const strike = ramp(frame, fReales + 8, 8);
  const z = punch(frame, fps, fRed, 0.07) * punch(frame, fps, fMismo, 0.06);
  return (
    <AbsoluteFill style={{ scale: String(z), translate: `${sh.x}px ${sh.y}px` }}>
      <Bg src="img/club.jpg" dur={dur} dim={0.55} from={1.1} to={1.25} y={[-30, 30]} />
      {/* lluvia de billetes */}
      {Array.from({ length: 14 }, (_, i) => {
        const t0 = fBill - 6 + i * 4;
        const p = (frame - t0) / (fps * 2.2);
        if (p < 0 || p > 1) return null;
        const x = random(`bx${i}`) * 1000 - 120;
        const r = (random(`br${i}`) - 0.5) * 120 + p * (random(`bs${i}`) - 0.5) * 400;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: interpolate(p, [0, 1], [-260, 2000]), rotate: `${r}deg`, opacity: 0.9 }}>
            <Banknote w={260 + random(`bw${i}`) * 120} value={i % 2 ? "1" : "10"} />
          </div>
        );
      })}
      <TopBar active={2} />
      <Badge n={2} delay={0} />
      <Chip text="Tráiler 2" delay={fTrailer} color={C.yellow} size={44} style={{ left: 430, top: 300 }} />
      {/* billete protagonista */}
      <div
        style={{
          position: "absolute",
          left: 540 - 380,
          top: 470,
          scale: String(interpolate(big, [0, 1], [0.2, 1]) * interpolate(toVenn, [0, 1], [1, 0.6])),
          rotate: `${interpolate(big, [0, 1], [-25, -4])}deg`,
          opacity: interpolate(toVenn, [0, 1], [1, 0]),
        }}
      >
        <Banknote w={760} value="10" mark={frame >= fRed ? "RDR2" : "?"} glow={frame >= fRed ? 30 : 0} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - toVenn }}>
        {frame >= fReales && frame < fRed ? (
          <div style={{ position: "relative" }}>
            <MaskLine delay={fReales} size={100}>
              Presidentes reales
            </MaskLine>
            <div style={{ position: "absolute", left: -10, top: 52, height: 16, width: `${strike * 104}%`, background: C.red, rotate: "-3deg" }} />
          </div>
        ) : null}
        {frame >= fRed ? (
          <>
            <MaskLine delay={fRed} size={86}>
              Presidentes de
            </MaskLine>
            <MaskLine delay={fRed + 4} size={110} color={C.red} shadow={C.night}>
              Red Dead Redemption 2
            </MaskLine>
          </>
        ) : null}
      </div>
      {/* Venn: mismo universo */}
      {frame >= fMismo - 4 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, height: 600 }}>
          {[
            { label: "GTA", color: C.pink, dx: -1 },
            { label: "RDR", color: C.red, dx: 1 },
          ].map((c) => (
            <div
              key={c.label}
              style={{
                position: "absolute",
                left: 540 - 230 + c.dx * interpolate(toVenn, [0, 1], [420, 120]),
                top: 40,
                width: 460,
                height: 460,
                borderRadius: 230,
                border: `10px solid ${c.color}`,
                background: `${c.color}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: c.dx < 0 ? "flex-start" : "flex-end",
                padding: "0 60px",
                fontFamily: FONT_HEAD,
                fontSize: 100,
                color: C.white,
                boxShadow: `0 0 50px ${c.color}`,
              }}
            >
              {c.label}
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 560,
              textAlign: "center",
              fontFamily: FONT_HEAD,
              fontSize: 120,
              color: C.yellow,
              textShadow: `6px 6px 0 ${C.night}`,
              scale: String(popSpring(frame, fps, fMismo + 6)),
            }}
          >
            MISMO UNIVERSO
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// =====================================================================
// 5. BIGFOOT
// =====================================================================
export const BigfootScene: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string, n = 0) => wordF("bigfoot", q, startMs, n);
  const fPant = w("pantanos");
  const fCotton = w("cottonmouth");
  const fSkunk = w("skunk");
  const fBig = w("bigfoot");
  const fFlorida = w("florida");
  const fMision = w("mision");
  const emerge = ramp(frame, fSkunk - 4, 16);
  const sh = useShake(fSkunk, 10, 16);
  const card = softSpring(frame, fps, fMision - 2);
  const z = punch(frame, fps, fSkunk, 0.08);
  const drift = frame * 1.2;
  return (
    <AbsoluteFill style={{ scale: String(z), translate: `${sh.x}px ${sh.y}px`, background: "linear-gradient(180deg,#06231f 0%,#0b3b33 45%,#03110e 100%)" }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="moon">
            <stop offset="0" stopColor="#E9FFF6" />
            <stop offset="0.5" stopColor="#B6FFE0" stopOpacity="0.5" />
            <stop offset="1" stopColor="#B6FFE0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={540} cy={760} r={420} fill="url(#moon)" />
        <circle cx={540} cy={760} r={230} fill="#E9FFF6" opacity={0.92} />
        <g transform={`translate(${-drift * 0.2} 0)`} opacity={0.55}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Mangrove key={i} x={i * 260 + 40} y={1060} s={1.1} color="#0a2a22" />
          ))}
        </g>
        <rect x={0} y={1060} width={1080} height={860} fill="#03140f" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <line key={i} x1={(i * 160 + frame * 2) % 1240 - 100} x2={(i * 160 + frame * 2) % 1240 + 20} y1={1100 + i * 28} y2={1100 + i * 28} stroke="#2E7D6A" strokeWidth={3} opacity={0.6} />
        ))}
      </svg>
      {/* Bigfoot */}
      <div
        style={{
          position: "absolute",
          left: 540 - 190,
          top: 520,
          opacity: emerge,
          translate: `0 ${interpolate(emerge, [0, 1], [80, 0])}px`,
          scale: String(interpolate(emerge, [0, 1], [0.85, 1])),
          filter: `blur(${interpolate(emerge, [0, 1], [12, 0])}px)`,
        }}
      >
        <Bigfoot h={660} eyes={frame > fSkunk + 6 ? 0.6 + 0.4 * Math.sin(frame / 3) : 0} armSwing={Math.sin(frame / 8) * 10} />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <g transform={`translate(${-drift * 0.6} 0)`}>
          {[-140, 1180, 1600].map((x, i) => (
            <Mangrove key={i} x={x} y={1260} s={1.7} />
          ))}
        </g>
      </svg>
      {/* niebla */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: -400 + ((frame * (1 + i) + i * 300) % 600),
            top: 900 + i * 120,
            width: 1800,
            height: 260,
            borderRadius: "50%",
            background: "rgba(200,255,235,0.12)",
            filter: "blur(40px)",
          }}
        />
      ))}
      <TopBar active={3} />
      <Badge n={3} delay={0} color={C.green} />
      <Chip text="Pantanos de Leonida" delay={fPant} color={C.green} size={40} style={{ left: 420, top: 300 }} />
      <div style={{ position: "absolute", left: 120, top: 440 }}>
        {(() => {
          const s = popSpring(frame, fps, fCotton);
          return (
            <div style={{ translate: `0 ${interpolate(s, [0, 1], [-300, 0])}px`, opacity: interpolate(s, [0, 0.2], [0, 1], clamp) }}>
              <MapPin w={80} color={C.green} />
            </div>
          );
        })()}
      </div>
      <Chip text="Lago Cottonmouth" delay={fCotton + 3} color={C.white} size={40} style={{ left: 70, top: 570 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1040, textAlign: "center", opacity: 1 - card }}>
        <MaskLine delay={fSkunk} size={170} color={C.green} shadow={C.night}>
          Skunk Ape
        </MaskLine>
      </div>
      <div style={{ opacity: 1 - card }}>
        <Hand text="= el Bigfoot de Florida" delay={fBig - 2} size={60} color={C.yellow} style={{ left: 230, top: 1220 }} />
      </div>
      {[0, 1, 2, 3, 4].map((i) => {
        const s = popSpring(frame, fps, fFlorida + i * 5);
        return (
          <div key={i} style={{ position: "absolute", left: i % 2 ? 960 : 880, top: 980 - i * 100, rotate: `${i % 2 ? 12 : -8}deg`, scale: String(s), opacity: 0.9 }}>
            <Footprint w={52} />
          </div>
        );
      })}
      {/* tarjeta de misión (diseño propio) */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 1060,
          translate: `${interpolate(card, [0, 1], [1100, 0])}px 0`,
          background: "rgba(3,20,15,0.92)",
          border: `5px solid ${C.green}`,
          borderRadius: 24,
          padding: "26px 34px",
          display: "flex",
          alignItems: "center",
          gap: 28,
          boxShadow: `0 0 40px ${C.green}88`,
        }}
      >
        <div style={{ width: 90, height: 90, borderRadius: 45, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_HEAD, fontSize: 64, color: C.night }}>
          !
        </div>
        <div>
          <div style={{ fontFamily: FONT_BODY, fontWeight: 900, fontSize: 32, color: C.green, letterSpacing: "0.15em" }}>NUEVA MISIÓN</div>
          <div style={{ fontFamily: FONT_HEAD, fontSize: 70, color: C.white, lineHeight: 1.05 }}>CAZA AL SKUNK APE</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 6. DEXTER
// =====================================================================
export const Dexter: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string, n = 0) => wordF("dexter", q, startMs, n);
  const fWash = w("washington");
  const fEdif = w("edificio");
  const fDex = w("dexter");
  const fSerie = w("serie");
  const fMuelle = w("muelle");
  const draw = ramp(frame, fEdif - 4, 26, EASE_MOVE);
  const dex = popSpring(frame, fps, fDex - 1);
  const boat = softSpring(frame, fps, fMuelle - 2);
  const sh = useShake(fDex, 8, 14);
  const z = punch(frame, fps, fDex, 0.07);
  return (
    <AbsoluteFill style={{ scale: String(z), translate: `${sh.x}px ${sh.y}px` }}>
      <Bg src="img/beach.jpg" dur={dur} dim={0.62} from={1.1} to={1.25} tint="#ff6a6a" />
      <TopBar active={4} />
      <Badge n={4} delay={0} color={C.red} />
      <Chip text="Washington Island" delay={fWash} color={C.cyan} size={42} style={{ left: 420, top: 300 }} />
      <div style={{ position: "absolute", left: 90, top: 470, translate: `0 ${interpolate(boat, [0, 1], [0, -60])}px` }}>
        <Building w={900} draw={draw} />
      </div>
      {/* goteo */}
      {frame >= fDex
        ? [0, 1, 2, 3].map((i) => {
            const p = (frame - fDex - i * 4) / 30;
            if (p < 0) return null;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 250 + i * 170,
                  top: 760 + interpolate(p, [0, 1], [0, 220], clamp),
                  width: 22,
                  height: 34,
                  borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                  background: C.red,
                  opacity: interpolate(p, [0.6, 1], [1, 0], clamp),
                }}
              />
            );
          })
        : null}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 640,
          textAlign: "center",
          fontFamily: FONT_HEAD,
          fontSize: 230,
          color: C.white,
          letterSpacing: "0.04em",
          scale: String(interpolate(dex, [0, 1], [2.2, 1])),
          opacity: interpolate(dex, [0, 0.2], [0, 1], clamp),
          textShadow: `8px 8px 0 ${C.red}`,
        }}
      >
        DEXTER
        <div style={{ position: "absolute", left: 160, right: 160, top: "94%", height: 14, background: C.red, rotate: "-2deg", scale: `${ramp(frame, fDex + 6, 8)} 1` }} />
      </div>
      <Chip text="El asesino de la serie" delay={fSerie - 4} color={C.red} textColor={C.white} size={40} style={{ left: 260, top: 920 }} />
      {/* agua + barco */}
      <svg width={1080} height={400} style={{ position: "absolute", left: 0, top: 1060, opacity: boat }}>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M 0 ${120 + i * 40} ${Array.from({ length: 12 }, (_, k) => `Q ${k * 100 + 50 - ((frame * 3) % 100)} ${100 + i * 40} ${k * 100 + 100 - ((frame * 3) % 100)} ${120 + i * 40}`).join(" ")}`} stroke={C.cyan} strokeWidth={5} fill="none" opacity={0.7 - i * 0.2} />
        ))}
      </svg>
      <div style={{ position: "absolute", top: 990 + Math.sin(frame / 6) * 6, left: interpolate(boat, [0, 1], [-500, 560]), rotate: `${Math.sin(frame / 8) * 3}deg` }}>
        <Boat w={380} />
      </div>
    </AbsoluteFill>
  );
};

// =====================================================================
// 7. PESO
// =====================================================================
export const Peso: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string, n = 0) => wordF("peso", q, startMs, n);
  const fComes = w("comes");
  const fEng = w("engorda");
  const fSA = w("san");
  const fat = spring({ frame: frame - fEng + 2, fps, config: { damping: 9, stiffness: 120 } });
  const z = punch(frame, fps, fEng, 0.06);
  return (
    <AbsoluteFill style={{ scale: String(z) }}>
      <Bg src="img/pool.jpg" dur={dur} dim={0.5} from={1.12} to={1.3} />
      <TopBar active={5} />
      <Badge n={5} delay={0} color={C.orange} />
      {Array.from({ length: 7 }, (_, i) => {
        const t0 = fComes - 4 + i * 3;
        const p = (frame - t0) / (fps * 1.1);
        if (p < 0 || p > 1) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 80 + random(`hb${i}`) * 820, top: interpolate(p, [0, 1], [-200, 1300], { easing: EASE_IN }), rotate: `${(random(`hr${i}`) - 0.5) * 80 + p * 200}deg` }}>
            <Burger w={150} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 540 - 277, top: 500 }}>
        <Body h={600} fat={Math.max(0, fat)} color={C.cyan} />
      </div>
      {/* medidor */}
      <div style={{ position: "absolute", right: 90, top: 520, width: 70, height: 560, borderRadius: 35, border: `6px solid ${C.white}`, overflow: "hidden", background: "rgba(0,0,0,0.4)" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${15 + 80 * Math.max(0, Math.min(1.1, fat))}%`, background: `linear-gradient(0deg, ${C.green}, ${C.yellow}, ${C.red})` }} />
      </div>
      <div style={{ position: "absolute", right: 70, top: 1100, fontFamily: FONT_BODY, fontWeight: 900, fontSize: 40, color: C.white }}>PESO</div>
      <Stamp text="Como en San Andreas" delay={fSA} color={C.yellow} size={70} rotate={-6} style={{ left: 140, top: 1125 }} />
    </AbsoluteFill>
  );
};

// =====================================================================
// 8. CIERRE
// =====================================================================
export const Cierre: React.FC<SceneProps> = ({ dur, startMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (q: string, n = 0) => wordF("cierre", q, startMs, n);
  const fCom = w("comentarios");
  const bub = popSpring(frame, fps, fCom - 2);
  return (
    <AbsoluteFill>
      <Bg src="img/poster.jpg" dur={dur} dim={0.55} from={1.6} to={1.75} objectPosition="60% center" />
      <RetroGrid opacity={0.4} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <MaskLine delay={0} size={140}>
          ¿Cuál te ha
        </MaskLine>
        <MaskLine delay={4} size={140} color={C.pink} shadow={C.night}>
          parecido
        </MaskLine>
        <MaskLine delay={8} size={170} color={C.yellow} shadow={C.night}>
          más raro?
        </MaskLine>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 890, display: "flex", justifyContent: "space-between" }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const s = popSpring(frame, fps, 6 + i * 3);
          return (
            <div
              key={i}
              style={{
                width: 172,
                height: 200,
                borderRadius: 26,
                background: "rgba(11,6,24,0.8)",
                border: `4px solid ${C.pink}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                overflow: "hidden",
                scale: String(s),
              }}
            >
              <div style={{ fontFamily: FONT_HEAD, fontSize: 44, color: C.yellow }}>#{i + 1}</div>
              <div style={{ scale: "0.8" }}>
                <MiniIcon i={i} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 540 - 110, top: 1110, scale: String(bub), rotate: `${Math.sin(frame / 5) * 5}deg` }}>
        <CommentBubble w={220} />
      </div>
    </AbsoluteFill>
  );
};
