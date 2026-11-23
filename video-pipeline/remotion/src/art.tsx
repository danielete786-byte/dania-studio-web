import React from "react";
import { C } from "./lib";

// Todas las ilustraciones son originales (SVG dibujado a mano en código).

// ---------- Palmera ----------
export const Palm: React.FC<{ x: number; y: number; h: number; sway?: number; color?: string; flip?: boolean }> = ({
  x,
  y,
  h,
  sway = 0,
  color = "#1B0B2E",
  flip = false,
}) => {
  const s = flip ? -1 : 1;
  const topX = x + s * h * 0.18;
  const topY = y - h;
  return (
    <g>
      <path d={`M ${x - 6} ${y} Q ${x + s * h * 0.05} ${y - h * 0.5} ${topX} ${topY} L ${topX + 6} ${topY + 4} Q ${x + s * h * 0.09} ${y - h * 0.5} ${x + 8} ${y} Z`} fill={color} />
      <g transform={`rotate(${sway} ${topX} ${topY})`}>
        {[-160, -125, -90, -55, -20, 15].map((a, i) => {
          const r = h * (0.42 + (i % 2) * 0.08);
          const rad = (a * Math.PI) / 180;
          const ex = topX + Math.cos(rad) * r;
          const ey = topY + Math.sin(rad) * r * 0.55 + r * 0.25;
          const mx = topX + Math.cos(rad) * r * 0.5;
          const my = topY + Math.sin(rad) * r * 0.5 - r * 0.12;
          return <path key={i} d={`M ${topX} ${topY} Q ${mx} ${my} ${ex} ${ey} Q ${mx + 6} ${my + 14} ${topX} ${topY + 6} Z`} fill={color} />;
        })}
      </g>
    </g>
  );
};

// ---------- OVNI ----------
export const Ufo: React.FC<{ x: number; y: number; w: number; beam?: number; lights?: number }> = ({ x, y, w, beam = 0, lights = 0 }) => {
  const h = w * 0.28;
  return (
    <g>
      {beam > 0 ? (
        <path d={`M ${x - w * 0.18} ${y + h * 0.3} L ${x - w * 0.75} ${y + w * 2.2} L ${x + w * 0.75} ${y + w * 2.2} L ${x + w * 0.18} ${y + h * 0.3} Z`} fill="url(#beam)" opacity={beam} />
      ) : null}
      <ellipse cx={x} cy={y - h * 0.25} rx={w * 0.22} ry={h * 0.55} fill="#9FF6FF" opacity={0.9} />
      <ellipse cx={x} cy={y} rx={w * 0.5} ry={h * 0.32} fill="#C9C3D9" />
      <ellipse cx={x} cy={y + h * 0.06} rx={w * 0.5} ry={h * 0.16} fill="#7C7491" />
      {[-0.36, -0.18, 0, 0.18, 0.36].map((k, i) => (
        <circle key={i} cx={x + k * w} cy={y + h * 0.04} r={w * 0.028} fill={(i + Math.floor(lights)) % 2 ? C.yellow : C.cyan} />
      ))}
    </g>
  );
};

// ---------- Foto: casa + palmeras + OVNI ----------
export const HouseUfoPhoto: React.FC<{ ufoX?: number; ufoY?: number; beam?: number; sway?: number; lights?: number }> = ({
  ufoX = 300,
  ufoY = 130,
  beam = 0,
  sway = 0,
  lights = 0,
}) => (
  <svg viewBox="0 0 600 520" width="100%" height="100%">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2B1055" />
        <stop offset="0.55" stopColor="#D53A9D" />
        <stop offset="1" stopColor="#FF9A5A" />
      </linearGradient>
      <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#9FF6FF" stopOpacity="0.9" />
        <stop offset="1" stopColor="#9FF6FF" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width="600" height="520" fill="url(#sky)" />
    <circle cx="300" cy="330" r="95" fill="#FFD23F" opacity="0.85" />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x="190" y={318 + i * 22} width="220" height={4 + i * 2} fill="#D53A9D" />
    ))}
    <rect y="400" width="600" height="120" fill="#1D3B2A" />
    {/* casa */}
    <g>
      <rect x="150" y="300" width="300" height="110" fill="#F3E3C6" />
      <polygon points="130,305 300,240 470,305" fill="#8A3B4E" />
      <rect x="330" y="335" width="100" height="75" fill="#C9B79A" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="330" x2="430" y1={350 + i * 15} y2={350 + i * 15} stroke="#A8957A" strokeWidth="3" />
      ))}
      <rect x="175" y="330" width="55" height="40" fill="#3B6E8F" />
      <rect x="255" y="340" width="40" height="70" fill="#6B3A2E" />
    </g>
    <Palm x={95} y={420} h={230} sway={sway} />
    <Palm x={520} y={425} h={200} sway={-sway} flip />
    <Palm x={470} y={430} h={150} sway={sway * 0.6} />
    <Ufo x={ufoX} y={ufoY} w={170} beam={beam} lights={lights} />
  </svg>
);

// ---------- Polaroid ----------
export const Polaroid: React.FC<{ children: React.ReactNode; caption?: string; width: number; style?: React.CSSProperties }> = ({
  children,
  caption,
  width,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      width,
      background: "#F7F3EA",
      padding: `${width * 0.045}px ${width * 0.045}px ${width * 0.16}px`,
      boxShadow: "0 30px 60px rgba(0,0,0,0.55)",
      ...style,
    }}
  >
    <div style={{ width: "100%", aspectRatio: "600 / 520", overflow: "hidden" }}>{children}</div>
    {caption ? (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: width * 0.035,
          textAlign: "center",
          fontFamily: "PermanentMarker",
          fontSize: width * 0.065,
          color: "#222",
        }}
      >
        {caption}
      </div>
    ) : null}
  </div>
);

// ---------- Billete ----------
export const Banknote: React.FC<{ w: number; value?: string; mark?: string; glow?: number }> = ({ w, value = "10", mark = "?", glow = 0 }) => (
  <svg viewBox="0 0 520 230" width={w} height={(w * 230) / 520} style={{ filter: glow ? `drop-shadow(0 0 ${glow}px ${C.green})` : undefined }}>
    <rect x="2" y="2" width="516" height="226" rx="10" fill="#B9D7A8" stroke="#2F5B3A" strokeWidth="4" />
    <rect x="16" y="16" width="488" height="198" rx="6" fill="none" stroke="#2F5B3A" strokeWidth="3" strokeDasharray="6 4" />
    <ellipse cx="260" cy="115" rx="70" ry="85" fill="#DDEBD2" stroke="#2F5B3A" strokeWidth="4" />
    <circle cx="260" cy="95" r="30" fill="#2F5B3A" />
    <path d="M 205 185 Q 260 120 315 185 Z" fill="#2F5B3A" />
    <text x="260" y="112" textAnchor="middle" fontFamily="Anton" fontSize="46" fill={C.yellow}>
      {mark}
    </text>
    <text x="40" y="70" fontFamily="Anton" fontSize="54" fill="#2F5B3A">
      {value}
    </text>
    <text x="480" y="205" textAnchor="end" fontFamily="Anton" fontSize="54" fill="#2F5B3A">
      {value}
    </text>
    <text x="400" y="70" textAnchor="middle" fontFamily="Montserrat" fontWeight="900" fontSize="18" fill="#2F5B3A">
      FEDERAL NOTE
    </text>
    <text x="120" y="200" textAnchor="middle" fontFamily="Montserrat" fontWeight="900" fontSize="16" fill="#2F5B3A">
      ONE · TEN · DOLLARS
    </text>
  </svg>
);

// ---------- Bigfoot (silueta) ----------
export const Bigfoot: React.FC<{ h: number; eyes?: number; armSwing?: number }> = ({ h, eyes = 1, armSwing = 0 }) => (
  <svg viewBox="0 0 300 520" height={h} width={(h * 300) / 520}>
    <g fill="#0A140F">
      {/* brazo trasero */}
      <path d={`M 80 150 Q ${40 - armSwing} 260 ${50 - armSwing} 360 L ${70 - armSwing} 362 Q ${80 - armSwing * 0.5} 270 110 185 Z`} />
      {/* cuerpo */}
      <path d="M 150 40 C 110 40 98 70 100 95 C 70 110 60 150 70 200 C 75 260 90 300 95 330 L 85 500 L 135 505 L 145 360 L 160 360 L 170 505 L 220 500 L 210 330 C 215 300 232 260 235 200 C 245 150 232 110 200 95 C 202 70 190 40 150 40 Z" />
      {/* brazo delantero */}
      <path d={`M 222 150 Q ${262 + armSwing} 260 ${250 + armSwing} 370 L ${230 + armSwing} 372 Q ${225 + armSwing * 0.5} 270 192 185 Z`} />
      {/* pelo */}
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M ${80 + i * 11} ${120 + (i % 3) * 8} l -6 18 l 10 -4 Z`} />
      ))}
    </g>
    <g opacity={eyes}>
      <circle cx="135" cy="78" r="6" fill="#FF3B3B" />
      <circle cx="165" cy="78" r="6" fill="#FF3B3B" />
      <circle cx="135" cy="78" r="16" fill="#FF3B3B" opacity="0.35" />
      <circle cx="165" cy="78" r="16" fill="#FF3B3B" opacity="0.35" />
    </g>
  </svg>
);

export const Footprint: React.FC<{ w: number; color?: string }> = ({ w, color = "#3DFF9A" }) => (
  <svg viewBox="0 0 60 110" width={w} height={(w * 110) / 60}>
    <ellipse cx="30" cy="70" rx="20" ry="34" fill={color} />
    {[0, 1, 2, 3, 4].map((i) => (
      <ellipse key={i} cx={12 + i * 9} cy={24 - Math.abs(i - 1.5) * 4} rx="5" ry="7" fill={color} />
    ))}
  </svg>
);

// ---------- Manglar ----------
export const Mangrove: React.FC<{ x: number; y: number; s: number; color?: string }> = ({ x, y, s, color = "#06120D" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
    <path d="M -10 0 Q -12 -120 -4 -230 L 8 -230 Q 14 -120 12 0 Z" />
    {[-70, -40, 30, 60].map((dx, i) => (
      <path key={i} d={`M 0 -60 Q ${dx * 0.6} -40 ${dx} 0 L ${dx + 6} 0 Q ${dx * 0.6 + 5} -36 4 -50 Z`} />
    ))}
    <ellipse cx="0" cy="-260" rx="110" ry="60" />
    <ellipse cx="-70" cy="-225" rx="70" ry="40" />
    <ellipse cx="75" cy="-230" rx="75" ry="42" />
  </g>
);

// ---------- Edificio de apartamentos (dibujo lineal) ----------
export const Building: React.FC<{ w: number; draw: number }> = ({ w, draw }) => {
  const len = 4000;
  const dash = { strokeDasharray: len, strokeDashoffset: len * (1 - draw) } as const;
  return (
    <svg viewBox="0 0 700 420" width={w} height={(w * 420) / 700}>
      <g fill="none" stroke={C.white} strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
        <rect x="40" y="60" width="620" height="340" style={dash} />
        <line x1="40" y1="230" x2="660" y2="230" style={dash} />
        <line x1="20" y1="60" x2="680" y2="60" style={dash} />
        {/* barandilla pasillo */}
        <line x1="40" y1="200" x2="560" y2="200" style={dash} />
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i} x1={60 + i * 36} y1="200" x2={60 + i * 36} y2="230" style={dash} />
        ))}
        {/* escalera exterior */}
        <path d="M 560 230 L 660 400" style={dash} />
        <path d="M 590 230 L 690 400" style={dash} />
        {/* puertas */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={"u" + i} x={80 + i * 120} y="110" width="55" height="90" style={dash} />
        ))}
        {[0, 1, 2, 3].map((i) => (
          <rect key={"d" + i} x={80 + i * 120} y="290" width="55" height="110" style={dash} />
        ))}
        {/* ventanas */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={"w" + i} x={150 + i * 120} y="120" width="40" height="40" style={dash} />
        ))}
      </g>
      {/* puerta marcada (la del piso) */}
      <rect x="80" y="110" width="55" height="90" fill={C.red} opacity={draw > 0.95 ? 0.9 : 0} />
    </svg>
  );
};

// ---------- Barco ----------
export const Boat: React.FC<{ w: number }> = ({ w }) => (
  <svg viewBox="0 0 400 200" width={w} height={w / 2}>
    <path d="M 20 110 L 380 110 L 340 170 L 60 170 Z" fill="#F3F3F3" stroke="#0B0618" strokeWidth="6" />
    <rect x="140" y="60" width="140" height="50" fill="#F3F3F3" stroke="#0B0618" strokeWidth="6" />
    <rect x="160" y="72" width="40" height="26" fill="#3B6E8F" />
    <rect x="215" y="72" width="40" height="26" fill="#3B6E8F" />
    <line x1="130" y1="58" x2="290" y2="58" stroke="#0B0618" strokeWidth="8" />
    <rect x="22" y="90" width="22" height="50" fill="#222" />
    <rect x="48" y="90" width="22" height="50" fill="#222" />
    <line x1="60" y1="140" x2="340" y2="140" stroke={C.red} strokeWidth="6" />
  </svg>
);

// ---------- Hamburguesa ----------
export const Burger: React.FC<{ w: number }> = ({ w }) => (
  <svg viewBox="0 0 200 160" width={w} height={w * 0.8}>
    <path d="M 20 70 Q 100 -10 180 70 Z" fill="#F2A541" />
    {[0, 1, 2, 3, 4].map((i) => (
      <ellipse key={i} cx={60 + i * 20} cy={45 + (i % 2) * 6} rx="4" ry="2.5" fill="#FFF3D6" />
    ))}
    <path d="M 14 78 Q 40 92 60 80 Q 80 94 100 80 Q 120 94 140 80 Q 160 94 186 78 L 186 72 L 14 72 Z" fill="#5BD15B" />
    <rect x="16" y="84" width="168" height="10" fill={C.yellow} />
    <rect x="18" y="94" width="164" height="22" rx="10" fill="#6B3A2E" />
    <path d="M 20 120 L 180 120 Q 180 150 100 150 Q 20 150 20 120 Z" fill="#E8913A" />
  </svg>
);

// ---------- Silueta de personaje (engorda) ----------
export const Body: React.FC<{ h: number; fat: number; color?: string }> = ({ h, fat, color = C.cyan }) => {
  const bw = 70 + fat * 90; // anchura del torso
  return (
    <svg viewBox="-90 0 480 520" height={h} width={(h * 480) / 520}>
      <g fill={color}>
        <circle cx="150" cy="70" r={42 + fat * 8} />
        <ellipse cx="150" cy="230" rx={bw} ry={105 + fat * 15} />
        <rect x={150 - 50 - fat * 20} y="300" width="40" height="190" rx="18" />
        <rect x={150 + 10 + fat * 20} y="300" width="40" height="190" rx="18" />
        <rect x={150 - bw * 0.92 - 18} y="160" width="34" height="160" rx="16" transform={`rotate(${10 + fat * 8} ${150 - bw * 0.92} 170)`} />
        <rect x={150 + bw * 0.92 - 16} y="160" width="34" height="160" rx="16" transform={`rotate(${-10 - fat * 8} ${150 + bw * 0.92} 170)`} />
      </g>
    </svg>
  );
};

// ---------- Burbuja de comentario ----------
export const CommentBubble: React.FC<{ w: number }> = ({ w }) => (
  <svg viewBox="0 0 200 180" width={w} height={w * 0.9}>
    <path d="M 20 20 H 180 Q 195 20 195 35 V 115 Q 195 130 180 130 H 80 L 40 170 L 48 130 H 20 Q 5 130 5 115 V 35 Q 5 20 20 20 Z" fill={C.white} />
    <circle cx="60" cy="75" r="12" fill={C.pink} />
    <circle cx="100" cy="75" r="12" fill={C.pink} />
    <circle cx="140" cy="75" r="12" fill={C.pink} />
  </svg>
);

// ---------- Pin de mapa ----------
export const MapPin: React.FC<{ w: number; color?: string }> = ({ w, color = C.pink }) => (
  <svg viewBox="0 0 100 140" width={w} height={w * 1.4}>
    <path d="M 50 135 C 30 95 8 75 8 48 A 42 42 0 1 1 92 48 C 92 75 70 95 50 135 Z" fill={color} stroke="#fff" strokeWidth="5" />
    <circle cx="50" cy="48" r="16" fill="#fff" />
  </svg>
);
