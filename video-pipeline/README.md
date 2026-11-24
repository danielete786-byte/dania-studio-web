# Vídeos «Te lo cuento en menos de un minuto»

Sistema para producir **vídeos verticales de noticias de última hora** (1080×1920, 30 fps, **≤ 35 s**) con motion graphics hechos en código (Remotion), **voz masculina en español** (siempre la misma, clonada de `tts/voice/ref.wav`) y subtítulos palabra a palabra.

Dos categorías diarias:

| Categoría | Hora de entrega (Madrid) | Acento (`remotion/src/theme.ts`) | Etiqueta de la barra |
|---|---|---|---|
| Inteligencia artificial | 9:00 | azul `#0B84F3` / `#5CC2FF` | `NOTICIA IA` |
| Videojuegos | 19:00 | rosa `#FF2E88` / `#FF8FC2` | `VIDEOJUEGOS` |

(Si la noticia va de una empresa con color de marca muy reconocible —p. ej. Nvidia verde `#76B900`/`#A6F23A`— se puede usar ese color.)

## Estructura

```
setup.sh      instala Python (Qwen3-TTS + Whisper), descarga modelos y hace npm ci  (~10-15 min, idempotente)
voice.sh      locución 2 tomas/frase -> mejor toma -> voz masterizada + tiempos por palabra + música
still.sh      hoja de contacto de fotogramas para revisar (remotion/out/sheet.jpg)
render.sh     render final + audio a -14 LUFS + subtítulos .srt
tts/          gen.py, assemble.py, numwords.py, fix_timeline.py, audio_fx.py, make_srt.py, voice/ref.wav
remotion/     plantilla: src/scenes.tsx (la historia), src/news.tsx (piezas comunes), src/theme.ts (color)
remotion/examples/   escenas de vídeos ya hechos: nvidia-scenes.tsx, remotion-scenes.tsx, gta6-scenes.tsx
stories/      una carpeta por vídeo (no se suben a git, salvo el ejemplo)
```

## Procedimiento completo (lo que hace cada sesión programada)

### 0. Preparar
```bash
cd video-pipeline
./setup.sh > /tmp/setup.log 2>&1 &     # en segundo plano; mientras, investiga
```

### 1. Investigar la noticia (WebSearch)
- Noticia de **las últimas 24 horas** de la categoría. Elige **la más importante**, no la más llamativa.
- **Verifícala con al menos 2 medios fiables** (agencias, medios generalistas o especializados serios, comunicados oficiales). Los agregadores y blogs sirven solo como pista.
- Rumores, filtraciones y acusaciones: o se descartan o se dicen como tales («según…», «supuestas…»). Nada de inventar cifras.
- Si no hay nada sólido de hoy, usa la noticia verificada más importante de los últimos 2-3 días y dilo en el mensaje de entrega.
- Apunta las URLs de las fuentes: van en el mensaje final.

### 2. Guion → `stories/AAAA-MM-DD-<ia|videojuegos>/script.json`
```json
{
  "segments": [
    {"id": "hook",   "gap": 0.3,  "text": "La noticia entera en una frase con gancho."},
    {"id": "lema",   "gap": 0.4,  "text": "Te lo cuento en menos de un minuto."},
    {"id": "bloque1","gap": 0.35, "text": "Contexto: qué ha pasado y por qué importa."},
    {"id": "bloque2","gap": 0.35, "text": "Dato o cifra clave."},
    {"id": "bloque3","gap": 0.4,  "text": "Consecuencia o lo que viene ahora."},
    {"id": "cierre", "gap": 0.0,  "text": "¿Pregunta al espectador? Te leo en comentarios."}
  ],
  "display": [
    {"spoken": "veintitrés por ciento", "display": "23%"},
    {"spoken": "Juang", "display": "Huang"}
  ]
}
```
Reglas:
- **Siempre**: primero la noticia (`hook`) y después, literal, **«Te lo cuento en menos de un minuto.»** (`lema`). Cierre con pregunta + «Te leo en comentarios.»
- **Máximo 35 s** en total ≈ **80-90 palabras** (la voz va a ~3,1 palabras/s más pausas).
- Cifras **escritas en palabras** en `text` y con su forma en cifras en `display` (para los subtítulos).
- Nombres extranjeros que la voz pueda pronunciar mal: escríbelos como suenan («Juang») y corrígelos en `display`.
- Evita siglas que suenan raras en voz alta (mejor «jefe» o «consejero delegado» que «CEO»).
- Español de España, tono cercano y directo.

### 3. Voz
```bash
./voice.sh stories/<carpeta>      # ~8-10 min
```
Revisa la salida: cada toma muestra `sim` (fidelidad según Whisper) y la transcripción.
- Si un nombre sale mal transcrito de forma que suena mal, reescríbelo y regenera solo ese bloque:
  `HF_HUB_OFFLINE=1 ~/.video-venv/bin/python tts/gen.py stories/<carpeta> 2 <id>` y vuelve a lanzar `./voice.sh`… o solo
  `~/.video-venv/bin/python tts/assemble.py stories/<carpeta> remotion` y `tts/audio_fx.py`.
- `sim` baja un poco cuando Whisper escribe cifras: mira la transcripción, no solo el número.
- `TOTAL` debe ser **≤ 35 s**. Si te pasas, recorta el guion.

### 4. Escenas → `remotion/src/scenes.tsx` (+ `theme.ts`)
- Pon el color de la categoría en `remotion/src/theme.ts`.
- Reescribe `scenes.tsx`: **una escena por bloque del guion**, exporta `SCENES` (orden y `firstSeg` = id del bloque), `SfxCues` y **`Thumbnail`** (la miniatura).
- Reutiliza `news.tsx`: `TechBackdrop`, `NewsBar`, `HookBadge` («ÚLTIMA HORA»), `Lema` (cronómetro, úsalo tal cual), `Poll` (cierre Sí/No), `Counter`, `CodeWindow`.
- Y `components.tsx`: `MaskLine` (titulares), `Chip`, `Stamp` (sellos), `Hand`, `punch`, `useShake`; `art.tsx`: ilustraciones SVG.
- Mira `remotion/examples/nvidia-scenes.tsx` (noticia de empresa/bolsa) y `remotion-scenes.tsx` (herramienta) como modelo.
- Sincroniza todo con la voz: `wordF("<idBloque>", "palabra", startMs)` devuelve el fotograma de esa palabra dentro de la escena.

Reglas de diseño:
- Lienzo 1080×1920. Márgenes laterales 80 px. Arriba: barra en y≈110; el contenido va de y≈230 a **y≈1250**.
- **Nada entre y=1290 y el final** salvo los subtítulos (los pone `Video.tsx`); los ~320 px de abajo los tapa la interfaz de TikTok.
- Titulares en Anton: cada letra ocupa ~0,5 × tamaño → una línea de 120 px admite ~15 caracteres. Parte las líneas largas.
- Un elemento protagonista por escena; un cambio o efecto cada 2-4 s (sello, chip, contador, punch-in, temblor).
- Primer fotograma con texto ya visible (gancho inmediato).
- **Sin logotipos, capturas ni vídeos de terceros.** Ilustraciones propias en SVG. Solo se pueden usar imágenes oficiales de prensa de los hosts permitidos en el entorno (p. ej. rockstargames.com) en `remotion/public/img/`.
- Citas de redes sociales: como cita traducida y atribuida, **nunca imitando la interfaz** de la red social.
- Gráficos aproximados: indícalo en pantalla («gráfico ilustrativo»).

**Miniatura (`Thumbnail`)**: portada estática 1080×1920 para TikTok. Titular enorme de 2 palabras (Anton 250-300 px), la cifra o dato más llamativo, la ilustración protagonista y una etiqueta «ÚLTIMA HORA». Todo lo importante dentro de la franja central **y 240-1680** (en el perfil de TikTok la portada se recorta a 3:4). Sin animaciones (es un solo fotograma). Modelo: `Thumbnail` en `remotion/examples/nvidia-vuelve-scenes.tsx` (que además es el mejor ejemplo completo de historia).

### 5. Revisar antes de renderizar
```bash
./still.sh 0 60 150 300 450 600 750 900      # elige fotogramas de cada escena y de los momentos clave
```
Abre `remotion/out/sheet.jpg` (herramienta Read) y corrige: texto que se sale, solapes, cosas tapadas por los subtítulos, escenas vacías demasiado tiempo.

### 6. Render
```bash
./render.sh stories/<carpeta> <Nombre-Del-Video>
```
Deja `stories/<carpeta>/<Nombre>.mp4`, `.srt` y `<Nombre>-miniatura.jpg`. Comprueba que la duración es ≤ 35 s y mira la miniatura con Read.

### 7. Entregar (no se publica nada automáticamente)
Con **SendUserFile** (status `proactive`) envía el `.mp4`, el `.srt` y la **miniatura** `.jpg`. En el mensaje, en español:
1. La noticia en 2-3 líneas + **fuentes con enlace**.
2. **TikTok**: título, descripción y 6-10 hashtags.
3. **X**: un texto de ≤ 280 caracteres con 2-3 hashtags.
4. Recordatorio: «Añade la canción de tendencia desde la app de TikTok y activa la etiqueta *Contenido generado por IA*».
5. Cualquier duda sobre la noticia (dato sin confirmar, cifra que cambia rápido).

No hagas commit de los vídeos ni de `stories/`.

## Notas técnicas
- Voz: Qwen3-TTS 1.7B (Apache-2.0) en CPU, voz diseñada una vez y clonada desde `tts/voice/ref.wav` para que sea siempre la misma. ~40 s de cómputo por frase.
- Subtítulos: Whisper large-v3 alinea las palabras reales; `assemble.py` convierte cifras y aplica `display`.
- Música y efectos: sintetizados por `tts/audio_fx.py` (sin derechos de terceros).
- Navegador para renderizar: `/opt/pw-browsers/...chrome-headless-shell` (preinstalado; configurado en `remotion.config.ts`).
- `HF_HUB_DISABLE_XET=1` es necesario para descargar modelos en este entorno.
