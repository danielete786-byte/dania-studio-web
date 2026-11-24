// Elementos de marca de Vegawagen: logotipo (W dentro de un hexágono), rótulo de neón e iconos.
import { W_POINTS } from './emblem'

const hex = Array.from({ length: 6 }, (_, k) => { const a = k * Math.PI / 3; return `${(1.72 * Math.cos(a)).toFixed(3)},${(-1.72 * Math.sin(a)).toFixed(3)}` }).join(' ')
const w = W_POINTS.map(p => `${p.x},${-p.y}`).join(' ')

export const Mark = ({ className = 'h-8 w-8' }: { className?: string }) =>
  <svg viewBox="-1.95 -1.95 3.9 3.9" className={className} aria-hidden style={{ filter: 'drop-shadow(0 0 4px rgba(34,225,238,.55))' }}>
    <polygon points={hex} fill="#0B0E12" stroke="#22E1EE" strokeWidth="0.16" strokeLinejoin="round" />
    <polyline points={w} fill="none" stroke="#E9FDFF" strokeWidth="0.26" strokeLinejoin="miter" strokeMiterlimit="6" />
    <polyline points={w} fill="none" stroke="#22E1EE" strokeWidth="0.08" strokeLinejoin="miter" strokeMiterlimit="6" />
  </svg>

// Rótulo tipo neón, como el letrero del taller
export const Wordmark = ({ className = '' }: { className?: string }) =>
  <span className={`wordmark block ${className}`} aria-label="Vegawagen">VEGAWAGEN</span>

export const PhoneIco = () => <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 3h3.5l2 5-2.5 1.5a11 11 0 0 0 6.5 6.5L16 13.5l5 2V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" /></svg>
export const WaIco = () => <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2.1.7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3z" /></svg>
