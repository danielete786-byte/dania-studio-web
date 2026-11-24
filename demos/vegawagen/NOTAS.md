# Vegawagen: investigación y propuesta de web

Demo comercial de DanIA Studio. Investigación hecha el 24/11/2026 con buscadores y directorios públicos. No se pudo abrir Google Maps directamente, así que la nota y el número de reseñas vienen de directorios que copian la ficha de Google. **Confírmalo todo con el taller antes de publicar.**

> El negocio es **Vegawagen**, confirmado con las fotos de su ficha de Google Maps. Al principio se buscó como "Vegabuggy" y con ese nombre no sale nada.

## Datos del negocio

| Dato | Valor | Fiabilidad |
|---|---|---|
| Nombre | Vegawagen C.B. (comunidad de bienes) | Alta (registro mercantil: Axesor, Empresite) |
| CIF | E18937961 | Alta (Axesor) |
| Actividad | CNAE 4520, mantenimiento y reparación de vehículos de motor | Alta |
| En activo desde | 2010 | Alta (Axesor) |
| Dirección | C. Dalí, 7, Nave 1, 18194 Churriana de la Vega (Granada) | Media: algún directorio antiguo pone C. Dalí, 1 |
| Teléfono | 958 55 44 41 | Alta (directorios y pared del taller) |
| WhatsApp | 633 044 180 | Media: sale con el icono de WhatsApp en la pared del taller (fotos de Google Maps) |
| Horario | L–J 7:00–16:00 · V 7:00–15:00 · S–D cerrado | **Baja**: otra fuente dice L–V 9:00–14:00 |
| Google | ≈ 4,6–4,7 ★ con 96–167 reseñas, según la fecha del directorio | Media |
| Servicios | Mecánica general, diagnosis, electricidad, pre-ITV, neumáticos, mantenimiento | Media |
| Marcas | En la pared: "Trabajamos todas las marcas", con los logos de Volkswagen, Audi, Škoda, SEAT y Cupra | Alta (fotos) |
| Imagen | Fachada roja de **Castrol Service** con el cartel "Vegawagen"; rótulo de neón cian; logo en forma de W (avatar de Google Maps) | Alta (fotos) |
| Web propia | **No se ha encontrado** | Alta |
| Redes sociales | **No se han encontrado** (ni Instagram ni Facebook). Sí suben fotos a su ficha de Google Maps | Media |

### Lo que más repiten los clientes en las reseñas
- Te explican con claridad qué le pasa al coche y no te venden lo que no necesitas.
- Precio mejor que el del servicio oficial.
- Les han arreglado averías difíciles que otros talleres no encontraban. Hay reseñas que hablan de un Golf GTI, o sea, tienen clientes con coches del grupo VW. Pregúntales si se consideran especialistas en VAG; el nombre "Vegawagen" lo sugiere.
- Hay alguna reseña negativa aislada (trabajo deficiente, precio alto). Lo normal con más de 150 reseñas.

## Argumentos de venta

1. **Tienen buena reputación y no la aprovechan.** Con una nota de 4,7 y más de 150 reseñas, quien les busca en Google acaba en directorios como QDQ, Cylex o Páginas Amarillas, con datos desactualizados (dos direcciones y dos horarios distintos). Con una web propia, el teléfono y el horario los controlan ellos.
2. **Pensada para que llamen.** En el móvil, el botón "Llamar" está siempre visible y lleva directo al teléfono. Así es como un taller consigue clientes.
3. **Destaca frente a la competencia de Churriana** (Autoveloz, Taller Vargas, Generalife Motor…). No es habitual que un taller de barrio tenga una web con 3D, y una rueda que se despieza se recuerda. No he revisado las webs de la competencia una por una.
4. **Pone en valor lo que dicen sus clientes:** la sección de diagnosis cuenta justo lo que más se repite en sus reseñas ("te explican la avería").
5. **SEO local:** "taller mecánico Churriana de la Vega" y "pre-ITV Churriana" son búsquedas con intención de compra. Con la web, más la ficha de Google enlazada, captan esa demanda.

### Antes de publicar, pídeles
- El logo original en vector: la W de la demo es una recreación inspirada en su avatar de Google Maps.
- Las fotos originales en alta resolución: las de la demo son capturas de su ficha de Google Maps.
- Que confirmen el WhatsApp 633 044 180.
- El horario real y la lista exacta de servicios (¿aire acondicionado?, ¿chapa y pintura?, ¿vehículo de sustitución?).
- Permiso para citar 3 reseñas reales de Google (ahora la web muestra un resumen, no citas literales).
- Un dominio, por ejemplo vegawagen.es (comprueba si está libre).

### Precio orientativo (mercado local, a ajustar)
- Web de una página con 3D, adaptada a móvil, SEO local básico y ficha de Google revisada: 600–1.200 €.
- Mantenimiento (hosting, cambios de horario o textos, copias de seguridad): 20–40 €/mes.
- Extras: vídeo corto de presentación para Google o redes, sistema de cita online o WhatsApp Business.

## La demo

**Marca:** negro con neón cian, como su letrero. Usa sus fotos de Google Maps: recepción, mecánicos, fachada de Castrol Service y el rótulo de neón.

**Animación 3D de la portada:** al hacer scroll se monta el emblema de Vegawagen (una W dentro de un hexágono) con 43 piezas: engranaje, 12 placas de carbono, 6 tramos de marco cromado, 8 tramos de la W, 10 tubos de neón y 6 tornillos que se enroscan. Al final se enciende el neón con un parpadeo, como un rótulo de verdad, y aparece "VEGAWAGEN". Un contador va mostrando las piezas montadas.

**Por qué no se usa el logo de Volkswagen:** es una marca registrada y Vegawagen no es concesionario oficial. Ponerlo como animación principal podría traerles una reclamación y hacer creer a los clientes que es un servicio oficial. Por eso se monta su propia W, que ya recuerda a VW. Las marcas (Volkswagen, Audi, SEAT, Škoda, Cupra) solo aparecen como texto, igual que en su pared ("Trabajamos todas las marcas").

**Archivo para enseñarla sin instalar nada:** `demos/vegawagen/vegawagen-demo.html` (unos 2,5 MB, con todo dentro). Se abre con doble clic o desde el móvil. Para regenerarlo: `node scripts/build-standalone.mjs vegawagen`.

- Código: `demos/vegawagen/index.html` + `src/vegawagen/` (mismo stack que la web de DanIA: Vite, React, Tailwind, GSAP, Lenis y three.js).
- Todos los textos y datos están en `src/vegawagen/content.ts` (busca `TODO`).
- La rueda, el freno, el buje, el amortiguador y los engranajes están modelados por código: no hay archivos 3D que descargar y el 3D ocupa poco.
- Lleva `noindex` para que Google no la indexe como si fuera la web oficial del taller.
- Para verla en local: `npm run dev` y abre `http://localhost:5173/dania-studio-web/demos/vegawagen/`.

## Fuentes
- Axesor, ficha de Vegawagen C.B.: https://www.axesor.es/Informes-Empresas/n/7385027/VEGAWAGEN_CB.html
- Empresite: https://empresite.eleconomista.es/VEGAWAGEN.html
- QDQ: https://www.qdq.com/vegawagen-348139
- Cylex: https://www.cylex.es/churriana-de-la-vega/vegawagen-12954716.html
- esopiniones: https://esopiniones.com/andalusia/vegawagen-1226010
- Autingo: https://www.autingo.es/taller-mecanico/granada/churriana-de-la-vega/vegawagen-c-b
- Talleraqui: https://talleraqui.com/p/vegawagen-4752
- Firmania: https://firmania.es/churriana-de-la-vega/vegawagen-974220
- Taller-mecanico.com.es (Churriana): https://taller-mecanico.com.es/granada/churriana-de-la-vega/
