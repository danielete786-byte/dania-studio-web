// Botón de sonido (empieza en silencio; los navegadores solo permiten audio tras una interacción)
import { useEffect, useState } from 'react'
import { sound } from './sound'

export default function SoundToggle() {
  const [on, setOn] = useState(sound.on)
  useEffect(() => sound.subscribe(setOn), [])
  return <button type="button" onClick={() => sound.toggle()} aria-pressed={on} aria-label={on ? 'Desactivar sonido' : 'Activar sonido'}
    className={`fixed bottom-[92px] right-3 z-50 flex items-center gap-2 rounded-full border px-3 py-2.5 text-[12px] uppercase tracking-[0.18em] backdrop-blur-xl transition md:bottom-6 md:left-6 md:right-auto md:px-4
      ${on ? 'border-neon/70 bg-black/70 text-neon shadow-[0_0_22px_-6px_rgba(34,225,238,.8)]' : 'border-white/15 bg-black/60 text-white/60 hover:text-white'}`}>
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 9v6h4l5 4V5L8 9z" />{on ? <><path d="M16 9a4 4 0 0 1 0 6" /><path d="M18.5 6.5a8 8 0 0 1 0 11" /></> : <path d="M17 9l5 6M22 9l-5 6" />}
    </svg>
    <span className="hidden md:inline">{on ? 'Sonido' : 'Sin sonido'}</span>
    {on && <span className="flex h-3 items-end gap-[2px]" aria-hidden>{[0, 1, 2].map(i => <span key={i} className="eq w-[2px] bg-neon" style={{ animationDelay: `${i * 0.15}s` }} />)}</span>}
  </button>
}
