// Demo comercial para Vegawagen (taller mecánico, Churriana de la Vega).
// Todos los textos y datos se editan aquí. Los datos salen de directorios públicos
// (noviembre 2026): confírmalos con el taller antes de publicar (busca `TODO`).
export const vw = {
  name: 'Vegawagen',
  legal: 'Vegawagen C.B.',
  since: 2010,
  phone: '958 55 44 41',
  phoneHref: 'tel:+34958554441',
  // TODO: pedir un móvil con WhatsApp y su email; si no hay, borrar
  whatsapp: '',
  email: '',
  address: ['C. Dalí, 7 · Nave 1', '18194 Churriana de la Vega, Granada'],
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Vegawagen+C.+Dal%C3%AD+7+Churriana+de+la+Vega',
  mapsEmbed: 'https://maps.google.com/maps?q=C.%20Dal%C3%AD%207%2C%2018194%20Churriana%20de%20la%20Vega%2C%20Granada&z=16&output=embed',
  // TODO: los directorios no coinciden; confirmar el horario real
  hours: [ { d: 'Lunes – Jueves', h: '7:00 – 16:00' }, { d: 'Viernes', h: '7:00 – 15:00' }, { d: 'Sábado y domingo', h: 'Cerrado' } ],
  // TODO: confirmar la nota y el número de reseñas en su ficha de Google
  rating: 4.7,
  reviews: 150,

  hero: {
    kicker: 'Taller mecánico · Churriana de la Vega',
    title: ['Tu coche,', 'en buenas manos.'],
    text: 'Mecánica, diagnosis y mantenimiento con precio claro y sin sorpresas. Desde 2010 en la Vega de Granada.',
    cta: 'Pide cita',
    scroll: 'Desliza: lo revisamos pieza a pieza',
    outro: ['Cada pieza,', 'revisada.'],
  },
  // Etiquetas que aparecen sobre la rueda despiezada (en este orden: neumático, frenos, suspensión, buje)
  heroLabels: ['Neumáticos', 'Frenos', 'Suspensión', 'Mecánica'],

  trust: [
    { value: 4.7, decimals: 1, prefix: '', suffix: '★', label: 'Nota en Google' },
    { value: 150, decimals: 0, prefix: '+', suffix: '', label: 'Reseñas de clientes' },
    { value: 2010, decimals: 0, prefix: '', suffix: '', label: 'Abiertos desde', plain: true },
    { value: 6, decimals: 0, prefix: '', suffix: '', label: 'Servicios bajo un techo' },
  ],

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
    { title: 'Llamas o vienes', text: 'Nos cuentas qué notas en el coche y buscamos hueco.' },
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

  cta: { title: 'Trae tu coche a la Vega.', text: 'Llámanos, cuéntanos qué le pasa y te damos cita.', button: 'Llamar ahora' },
  footer: 'Propuesta de web realizada por DanIA Studio.',
}
