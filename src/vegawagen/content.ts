// Demo comercial para Vegawagen (taller mecánico, Churriana de la Vega).
// Todos los textos y datos se editan aquí. Los datos salen de directorios públicos
// y de las fotos de su ficha de Google (noviembre 2026): confírmalos con el taller (busca `TODO`).
import neon from './img/neon.jpg'
import fachada from './img/fachada.jpg'
import motor from './img/motor.jpg'
import mecanico from './img/mecanico.jpg'
import mercedes from './img/mercedes.jpg'
import bmw from './img/bmw.jpg'
import cupra from './img/cupra.jpg'

export const img = { neon, fachada, motor, mecanico, mercedes, bmw, cupra }

export const vw = {
  name: 'Vegawagen',
  legal: 'Vegawagen C.B.',
  since: 2010,
  phone: '958 55 44 41',
  phoneHref: 'tel:+34958554441',
  // Número que aparece con el icono de WhatsApp en la pared del taller. TODO: confirmar
  whatsapp: '633 044 180',
  whatsappHref: 'https://wa.me/34633044180?text=' + encodeURIComponent('Hola, quería pedir cita en Vegawagen.'),
  address: ['C. Dalí, 7 · Nave 1', '18194 Churriana de la Vega, Granada'],
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Vegawagen+C.+Dal%C3%AD+7+Churriana+de+la+Vega',
  mapsEmbed: 'https://maps.google.com/maps?q=C.%20Dal%C3%AD%207%2C%2018194%20Churriana%20de%20la%20Vega%2C%20Granada&z=16&output=embed',
  // TODO: los directorios no coinciden; confirmar el horario real
  hours: [ { d: 'Lunes – Jueves', h: '7:00 – 16:00' }, { d: 'Viernes', h: '7:00 – 15:00' }, { d: 'Sábado y domingo', h: 'Cerrado' } ],
  // TODO: confirmar la nota y el número de reseñas en su ficha de Google
  rating: 4.7,
  reviews: 150,

  hero: {
    kicker: 'Taller multimarca · Churriana de la Vega',
    title: ['Tu coche,', 'en buenas manos.'],
    text: 'Mecánica, electrónica y diagnosis con precio claro y sin sorpresas. Desde 2010 en la Vega de Granada.',
    scroll: 'Desliza: lo desmontamos y lo volvemos a montar',
    outro: 'Volkswagen · Audi · SEAT · Škoda · Cupra · y todas las marcas',
  },

  trust: [
    { value: 4.7, decimals: 1, prefix: '', suffix: '★', label: 'Nota en Google' },
    { value: 150, decimals: 0, prefix: '+', suffix: '', label: 'Reseñas de clientes' },
    { value: 2010, decimals: 0, prefix: '', suffix: '', label: 'Abiertos desde', plain: true },
    { value: 6, decimals: 0, prefix: '', suffix: '', label: 'Servicios bajo un techo' },
  ],

  // Marcas que aparecen en la pared del taller junto a "Trabajamos todas las marcas"
  brands: ['Volkswagen', 'Audi', 'SEAT', 'Škoda', 'Cupra', 'y todas las marcas'],

  gallery: { kicker: 'El taller', title: 'Así trabajamos en Vegawagen.', items: [
    { src: 'cupra', alt: 'Cupra Ateca en la zona de recepción del taller', tag: 'Recepción', span: 'wide' },
    { src: 'mecanico', alt: 'Mecánico de Vegawagen trabajando en el paso de rueda de un coche rojo', tag: 'Mecánica', span: 'tall' },
    { src: 'bmw', alt: 'BMW X5 azul en la entrada del taller', tag: 'Todas las marcas', span: 'normal' },
    { src: 'neon', alt: 'Rótulo de neón cian con el nombre Vegawagen', tag: 'Vegawagen', span: 'wide' },
    { src: 'mercedes', alt: 'Mercedes Clase C clásico en el taller', tag: 'Clásicos también', span: 'normal' },
  ] },

  services: { kicker: 'Servicios', title: 'Todo lo que tu coche necesita, en un solo taller.', items: [
    { icon: 'wrench', title: 'Mantenimiento', text: 'Revisiones, cambios de aceite y filtros, distribución y puesta a punto según el plan del fabricante.' },
    { icon: 'scan', title: 'Diagnosis electrónica', text: 'Leemos las centralitas, localizamos la avería y te la explicamos antes de tocar nada.' },
    { icon: 'disc', title: 'Frenos y suspensión', text: 'Pastillas, discos, amortiguadores y dirección. Tu seguridad, lo primero.' },
    { icon: 'tire', title: 'Neumáticos', text: 'Venta, montaje, equilibrado y consejo sobre la medida y la marca que te conviene.' },
    { icon: 'bolt', title: 'Electricidad', text: 'Baterías, alternadores, arranque, luces y sistemas eléctricos del vehículo.' },
    { icon: 'check', title: 'Pre-ITV', text: 'Repasamos el coche antes de la inspección para que pases a la primera.' },
  ] },

  diag: { kicker: 'Diagnosis', title: 'Encontramos la avería. Y te la explicamos.',
    text: 'Es lo que más repiten nuestros clientes: aquí te cuentan qué le pasa al coche, qué urge y qué puede esperar. Sin cambiar piezas a ciegas y sin venderte lo que no necesitas.',
    lines: [
      { t: 'Conectando al vehículo por OBD-II…', s: 'OK' },
      { t: 'Leyendo centralitas', s: '12 módulos' },
      { t: 'Motor · P0301 fallo de encendido, cilindro 1', s: 'Detectado', warn: true },
      { t: 'Bobina y bujía del cilindro 1', s: 'Revisar' },
      { t: 'Frenos · ABS · Airbag', s: 'Sin fallos' },
      { t: 'Informe para el cliente', s: 'Listo' },
    ] },

  process: { kicker: 'Cómo trabajamos', title: 'Sin sorpresas, de principio a fin.', steps: [
    { title: 'Llamas o escribes', text: 'Por teléfono o WhatsApp: nos cuentas qué notas y buscamos hueco.' },
    { title: 'Diagnóstico', text: 'Revisamos el coche y localizamos el problema real.' },
    { title: 'Presupuesto claro', text: 'Te decimos qué hay que hacer y cuánto cuesta. Tú decides.' },
    { title: 'Recoges tu coche', text: 'Reparado, revisado y con la explicación de lo que hemos hecho.' },
  ] },

  // Temas que se repiten en sus reseñas públicas (resumen, no citas literales).
  // TODO: sustituir por 3 reseñas reales de Google, con el permiso del taller.
  opinions: { kicker: 'Opiniones', title: 'Lo que más se repite en Google.', items: [
    { title: 'Te explican la avería', text: 'Explican con claridad qué le pasa al coche y no intentan venderte servicios que no hacen falta.' },
    { title: 'Mejor precio que el concesionario', text: 'Clientes que comparan con el servicio oficial y destacan el ahorro con el mismo nivel de trabajo.' },
    { title: 'Resuelven lo que otros no', text: 'Averías complicadas que otros talleres no habían encontrado, solucionadas aquí.' },
  ] },

  location: { kicker: 'Dónde estamos', title: 'Busca la fachada roja de Castrol Service.',
    text: 'En Churriana de la Vega, a un paso de Granada. La puerta grande con el cartel de Vegawagen.' },

  crate: { kicker: 'Hasta la última pieza', title: 'Cada pieza, en su sitio.',
    text: 'Las piezas que han ido cayendo mientras bajabas acaban aquí. En el taller pasa igual: nada se pierde y todo se revisa.' },

  cta: { title: 'Trae tu coche a la Vega.', text: 'Llámanos o escríbenos por WhatsApp, cuéntanos qué le pasa y te damos cita.', button: 'Llamar ahora' },
  footer: 'Propuesta de web realizada por DanIA Studio.',
  // Aviso de marcas: el emblema de la portada reproduce el logotipo de Volkswagen
  legalNote: 'Vegawagen es un taller independiente, no un servicio oficial. Volkswagen, Audi, SEAT, Škoda y Cupra y sus logotipos son marcas registradas de sus titulares y se citan solo para indicar los vehículos que reparamos.',
}
