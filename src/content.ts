// Todos los textos y enlaces editables de la web están aquí.
export const content = {
  brand: 'DanIA Studio',
  // TODO: cambia por tu email real
  email: 'hola@daniastudio.com',
  // TODO: pon tus enlaces reales
  youtube: '#',
  tiktok: '#',
  hero: { title: ['Creamos con IA.', 'Contamos con alma.'], kicker: 'Estudio de contenido y vídeo con IA',
    scrollHint: 'Desliza para descubrir' },
  heroLabels: ['Guion', 'Imagen', 'Voz', 'Montaje'],
  services: { kicker: 'Qué hacemos', title: 'Todo lo que tu marca necesita, creado con IA.', items: [
    { icon: 'play', title: 'Vídeos y Shorts virales', text: 'Contenido para YouTube, Shorts y TikTok pensado para enganchar desde el primer segundo.' },
    { icon: 'megaphone', title: 'Anuncios para marcas', text: 'Spots y creatividades que venden, producidos en días en lugar de semanas.' },
    { icon: 'code', title: 'Webs y apps con IA', text: 'Experiencias digitales rápidas, bonitas y listas para convertir.' },
    { icon: 'bolt', title: 'Automatizaciones', text: 'Flujos que trabajan por ti: publicar, responder y crear sin esfuerzo.' } ] },
  // TODO: cifras de ejemplo, cámbialas por las reales (o borra la sección en App.tsx)
  stats: [ { prefix: '+', value: 100, suffix: '', label: 'vídeos creados' },
           { prefix: '+', value: 1, suffix: 'M', label: 'visualizaciones' },
           { prefix: '', value: 3, suffix: '', label: 'plataformas' } ],
  portfolio: { kicker: 'Portfolio', title: 'Piezas recientes', hint: 'Pasa el ratón para reproducir',
    // TODO: añade tus vídeos en /public/videos y lístalos aquí
    items: [ { src: '/videos/dania-logo-3d-1.mp4', title: 'Logo 3D · DanIA Studio', tag: 'Motion 3D', vertical: false },
             { src: '/videos/dania-logo-3d-1.mp4', title: 'Short de marca', tag: 'Shorts', vertical: true },
             { src: '/videos/dania-logo-3d-1.mp4', title: 'Anuncio de producto', tag: 'Anuncio', vertical: false },
             { src: '/videos/dania-logo-3d-1.mp4', title: 'Reel para TikTok', tag: 'TikTok', vertical: true } ] },
  process: { kicker: 'Cómo trabajamos', title: 'De la idea a publicar, sin fricción.', steps: [
    { title: 'Idea', text: 'Escuchamos tu objetivo y definimos el concepto.' },
    { title: 'Guion', text: 'Escribimos la historia, el ritmo y el gancho.' },
    { title: 'Producción con IA', text: 'Imagen, voz y montaje con las mejores herramientas.' },
    { title: 'Revisión y publicación', text: 'Pulimos cada detalle y lo lanzamos al mundo.' } ] },
  cta: { title: '¿Hacemos algo juntos?', text: 'Cuéntame tu idea y te respondo en menos de 24 horas.', button: 'Escríbeme' },
  footer: '© 2026 DanIA Studio. Todos los derechos reservados.',
}
