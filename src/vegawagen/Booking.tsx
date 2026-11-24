// Cita por WhatsApp: el cliente elige marca, modelo, qué le pasa y cuándo le viene bien;
// el mensaje se va redactando en vivo en una vista previa tipo WhatsApp y se abre ya escrito.
import { useMemo, useState } from 'react'
import { vw } from './content'
import { Mark, WaIco, PhoneIco } from './brand'

const BRANDS = ['Volkswagen', 'Audi', 'SEAT', 'Škoda', 'Cupra', 'Otra marca']
const NEEDS = ['Revisión / aceite', 'Testigo encendido', 'Frenos', 'Neumáticos', 'Ruido o vibración', 'Pre-ITV', 'Electricidad', 'Aire acondicionado', 'Otra cosa']
const WHEN = ['Lo antes posible', 'Esta semana', 'La semana que viene']
const SLOT = ['Por la mañana', 'A mediodía', 'Me da igual']

const Chip = ({ on, children, onClick }: { on: boolean; children: React.ReactNode; onClick: () => void }) =>
  <button type="button" aria-pressed={on} onClick={onClick}
    className={`rounded-full border px-4 py-2 text-[14px] transition-all duration-200 ${on ? 'border-neon bg-neon/10 text-white shadow-[0_0_18px_-4px_rgba(34,225,238,.7)]' : 'border-white/15 text-white/65 hover:border-white/30 hover:text-white'}`}>{children}</button>

const Step = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) =>
  <fieldset className="border-t border-white/10 pt-6 first:border-0 first:pt-0">
    <legend className="mb-4 flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-white/80">
      <span className="grid h-7 w-7 place-items-center rounded-full border border-neon/60 font-mono text-[12px] text-neon">{n}</span>{title}</legend>
    {children}</fieldset>

export default function Booking() {
  const [brand, setBrand] = useState(''), [other, setOther] = useState(''), [model, setModel] = useState(''), [plate, setPlate] = useState('')
  const [needs, setNeeds] = useState<string[]>([]), [details, setDetails] = useState(''), [when, setWhen] = useState(WHEN[0]), [slot, setSlot] = useState(SLOT[2])
  const [name, setName] = useState(''), [tried, setTried] = useState(false)
  const toggle = (n: string) => setNeeds(x => x.includes(n) ? x.filter(y => y !== n) : [...x, n])

  const car = [brand === 'Otra marca' ? other.trim() : brand, model.trim()].filter(Boolean).join(' ')
  const message = useMemo(() => [
    `Hola Vegawagen${name.trim() ? `, soy ${name.trim()}` : ''}. Quería pedir cita.`,
    `• Coche: ${car || '…'}${plate.trim() ? ` (${plate.trim().toUpperCase()})` : ''}`,
    `• Necesito: ${needs.length ? needs.join(', ') : '…'}`,
    details.trim() ? `• Detalles: ${details.trim()}` : '',
    `• Cuándo: ${when}, ${slot.toLowerCase()}`,
  ].filter(Boolean).join('\n'), [name, car, plate, needs, details, when, slot])

  // los avisos se actualizan solos en cuanto el cliente corrige el campo
  const errors = tried ? [!car && 'Dinos la marca y el modelo del coche.', !needs.length && 'Marca al menos una cosa que necesites.', !name.trim() && 'Escribe tu nombre.'].filter(Boolean) as string[] : []
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setTried(true)
    if (!car || !needs.length || !name.trim()) return
    window.open(`https://wa.me/34${vw.whatsapp.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`, '_blank', 'noopener')
  }
  const field = 'w-full rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-[15px] text-white placeholder-white/30 outline-none transition focus:border-neon focus:shadow-[0_0_0_3px_rgba(34,225,238,.15)]'

  return <section id="cita" className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
    <div className="reveal mb-12 max-w-3xl md:mb-16"><p className="kicker mb-4">Pide cita</p>
      <h2 className="h-cond grad-text text-[44px] leading-[0.92] md:text-[80px]">Tu cita en un minuto, por WhatsApp.</h2>
      <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/60">Cuéntanos qué le pasa al coche y te contestamos con hueco y presupuesto. Sin llamadas ni esperas.</p></div>
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
      <form onSubmit={submit} noValidate className="reveal panel space-y-6 p-6 md:p-9">
        <Step n={1} title="Tu coche">
          <div className="flex flex-wrap gap-2">{BRANDS.map(b => <Chip key={b} on={brand === b} onClick={() => setBrand(b)}>{b}</Chip>)}</div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {brand === 'Otra marca' && <input className={field} placeholder="¿Qué marca?" value={other} onChange={e => setOther(e.target.value)} aria-label="Marca" />}
            <input className={field} placeholder="Modelo y año (ej. Golf 2018)" value={model} onChange={e => setModel(e.target.value)} aria-label="Modelo y año" />
            <input className={field} placeholder="Matrícula (opcional)" value={plate} onChange={e => setPlate(e.target.value)} aria-label="Matrícula" />
          </div>
        </Step>
        <Step n={2} title="¿Qué necesita?">
          <div className="flex flex-wrap gap-2">{NEEDS.map(n => <Chip key={n} on={needs.includes(n)} onClick={() => toggle(n)}>{n}</Chip>)}</div>
          <textarea className={`${field} mt-4 min-h-[96px] resize-y`} placeholder="Cuéntanos más si quieres: cuándo pasa, qué notas…" value={details} onChange={e => setDetails(e.target.value)} aria-label="Detalles" />
        </Step>
        <Step n={3} title="¿Cuándo te viene bien?">
          <div className="flex flex-wrap gap-2">{WHEN.map(w => <Chip key={w} on={when === w} onClick={() => setWhen(w)}>{w}</Chip>)}</div>
          <div className="mt-3 flex flex-wrap gap-2">{SLOT.map(s => <Chip key={s} on={slot === s} onClick={() => setSlot(s)}>{s}</Chip>)}</div>
        </Step>
        <Step n={4} title="Tu nombre">
          <input className={field} placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} aria-label="Nombre" autoComplete="given-name" />
        </Step>
        <div aria-live="polite">{errors.length > 0 && <ul className="space-y-1 rounded-xl border border-alert/40 bg-alert/10 px-4 py-3 text-[14px] text-white/85">{errors.map(e => <li key={e}>{e}</li>)}</ul>}</div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="btn-neon !px-7 !py-4 text-[16px]"><WaIco /> Enviar por WhatsApp</button>
          <a href={vw.phoneHref} className="btn-ghost !py-4"><PhoneIco /> Prefiero llamar</a>
        </div>
        <p className="text-[12px] text-white/40">Se abrirá WhatsApp con el mensaje ya escrito. Solo tienes que darle a enviar.</p>
      </form>

      {/* vista previa del mensaje, como en el móvil */}
      <aside className="reveal lg:sticky lg:top-28" aria-label="Vista previa del mensaje de WhatsApp">
        <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-[38px] border border-white/15 bg-[#0b141a] shadow-[0_40px_90px_-30px_rgba(0,0,0,.9)]">
          <div className="flex items-center gap-3 bg-[#1f2c34] px-5 pb-3 pt-5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-black"><Mark className="h-7 w-7" /></span>
            <div><p className="text-[15px] font-semibold text-white">Vegawagen · Taller</p><p className="text-[12px] text-white/50">normalmente responde en horario de taller</p></div>
          </div>
          <div className="min-h-[340px] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.03),transparent_40%)] px-4 py-6">
            <p className="mx-auto mb-5 w-fit rounded-lg bg-[#182229] px-3 py-1 text-[11px] uppercase tracking-wider text-white/50">Hoy</p>
            <div className="relative ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-[#005c4b] px-4 pb-6 pt-3 text-[14px] leading-relaxed text-white shadow-lg">
              <p className="whitespace-pre-wrap break-words">{message}</p>
              <span className="absolute bottom-1.5 right-3 text-[11px] text-white/60">ahora ✓✓</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#1f2c34] px-4 py-3"><span className="flex-1 rounded-full bg-[#2a3942] px-4 py-2 text-[13px] text-white/35">Mensaje</span>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#00a884] text-white"><WaIco /></span></div>
        </div>
        <p className="mt-4 text-center text-[13px] text-white/45">WhatsApp del taller: <span className="text-white/75">{vw.whatsapp}</span></p>
      </aside>
    </div>
  </section>
}
