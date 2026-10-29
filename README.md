# Lo que no te enseñaron — PWA escuela para padres

App web instalable (PWA) para los padres de familia del I.E.P. Santísimo Cristo Moreno.
Funciona sin internet, no necesita login y todo su contenido es gratuito de alojar.

## Arquitectura

**Cliente estático + serverless**, con el frontend en **capas** y **puertos y adaptadores** (hexagonal ligera).

```
app/src/
├── domain/        Qué es cada contenido (tipos), el foro y la detección de riesgo
├── ports/         Contratos: ContentRepository, AssistantPort, ProgressStore, ForoPort
├── adapters/      Implementaciones intercambiables
│   ├── content/     localContentRepository (hoy) → Firestore (mañana)
│   ├── assistant/   localAssistant · remoteAssistant (Groq) · resilientAssistant
│   │   └── modos/     Una estrategia por función del asistente
│   ├── progress/    localProgressStore (solo en el celular del padre)
│   └── foro/        Firestore: foro de padres y panel de psicología (se descarga solo al abrir el foro)
├── content/       ✏️  EL CONTENIDO: textos, retos, voces, episodios, guías del asistente
├── app/           Rutas, páginas, servicios (único lugar que elige adaptadores), diseño general
├── features/      Una carpeta por pantalla, con sus componentes y hooks propios
├── hooks/         Hooks reutilizables (contenido, progreso, conexión, temporizador…)
├── ui/            Componentes reutilizables (logo, encabezado, fichas, íconos…)
├── utils/         Funciones pequeñas y puras (clases CSS, listas, tiempo)
└── styles/        index.css → tokens.css (diseño), base.css y secciones/ (una hoja por pantalla)

firestore.rules    Quién puede leer y escribir cada cosa del foro (se aplica en el servidor)

worker/src/        Función de Cloudflare que guarda la clave de Groq
├── index.js         Recibe el pedido y coordina
├── cors.js          Solo acepta pedidos desde los dominios del colegio
├── validacion.js    Revisa y recorta lo que llega
├── instrucciones.js Reglas e instrucciones de cada modo
├── groq.js          Llama a Groq (gpt-oss-120b) y, si no hay cuota, prueba gpt-oss-20b
└── formato.js       Quita asteriscos y símbolos de formato de la respuesta
```

**Principios aplicados:**
- **Responsabilidad única:** cada archivo hace una sola cosa (un modo del asistente, un hook, un componente).
- **Abierto/cerrado:** para agregar un modo al asistente se crea una estrategia en `adapters/assistant/modos/` y se registra en `localAssistant.ts`; no se toca el resto.
- **Inversión de dependencias:** las pantallas solo conocen los puertos (`ports/`); `app/servicios.ts` decide qué adaptador usar.
- **Sin repetición:** claves de progreso en `app/clavesDeProgreso.ts`, navegación con `useSeleccionEnUrl`, contenido separado de la lógica.

**Por qué es resistente:**
- El contenido viaja dentro de la app: no hay base de datos que se caiga ni lecturas que cobren.
- El *service worker* guarda la app en el celular: funciona sin internet.
- Las imágenes se descargan solo cuando se ven y quedan guardadas 30 días.
- La IA tiene respaldo: si Groq no responde o se acaba la cuota, contesta el motor propio con contenido del colegio.
- Las señales de riesgo (suicidio, autolesión, abuso) se detectan **en el celular**, sin IA, y muestran de inmediato la Línea 113 opción 5, la Línea 100 y el SAMU 106.
- Si una pantalla falla, solo esa pantalla muestra un aviso: el resto sigue funcionando.
- El foro es lo único que usa internet: si Firestore llega a su límite gratis, solo se pausa el foro hasta el día siguiente.

## Comandos

Requisito: Node.js 20 o superior.

```bash
cd app
npm install        # solo la primera vez
npm run dev        # ver la app en http://localhost:5173
npm run build      # versión final en app/dist
npm run preview    # probar la versión final (incluye modo sin internet)
```

## Cómo editar el contenido

Todo está en `app/src/content/`. Edita el texto entre comillas y guarda:

| Archivo | Qué contiene |
|---|---|
| `situaciones.ts` | Situaciones de "Explorar" (padre vs. hijo) |
| `escenarios.ts` | Preguntas de "Ponte en mis zapatos" |
| `etiquetas.ts` | Etiquetas de "Mi mochila" |
| `voces.ts` | Frases de estudiantes (**anónimas y con autorización**) |
| `retos.ts` | Retos en familia |
| `tendencias.ts` | Temas de "El mundo de hoy" |
| `recursos.ts` | Preguntas, guías y descargables |
| `episodios.ts` | Episodios del podcast (pega la URL de Spotify) |
| `guiaAsistente.ts` | Lo que responde el asistente propio: temas, frases y jerga |
| `guiaEnsayo.ts` | Escena inicial, frases y respuestas del "Ensayo de conversación" |
| `guiaAntesDeHablar.ts` | Frases a revisar y consejos de "Antes de hablar" |
| `temasDeReserva.ts` | Temas del foro que salen cuando psicología no programó uno para ese día |
| `politicas.ts` | Política de privacidad y normas del foro (página `/privacidad`) |
| `frasesPortada.ts` | Frases del post-it de la portada (cada visita muestra la siguiente; máximo ~50 letras) |

**Voces reales:** solo frases anónimas y con autorización escrita (Ley 29733). Nunca nombres completos ni fotos reales de estudiantes.

**Publicar un episodio del podcast:**
1. Súbelo gratis a Spotify for Creators (creators.spotify.com).
2. En Spotify: *Compartir → Insertar episodio* y copia la URL que empieza con `https://open.spotify.com/embed/episode/`.
3. Pégala en `spotifyEmbed` del episodio en `episodios.ts`.

Imágenes: lee **[GUIA_IMAGENES.md](GUIA_IMAGENES.md)**.

## Variables de configuración (`app/.env`)

| Variable | Para qué sirve |
|---|---|
| `VITE_ASSISTANT_URL` | URL del Worker de Cloudflare. Vacía = el asistente responde solo con la guía del colegio |
| `VITE_PODCAST_URL` | Enlace del programa en Spotify (botón "Abrir en Spotify") |
| `VITE_VIDEO_URL` | Video de bienvenida de YouTube. Sirve `watch?v=`, `youtu.be/` o `shorts/` |
| `VITE_PRIVACY_EMAIL` | Correo del colegio para consultas de privacidad (derechos ARCO). Vacío = se indica acudir a Dirección |

## Foro "Entre padres"

- **Padres:** entran sin cuenta (acceso anónimo). Comentan el tema del día, proponen temas y votan. Todo pasa por revisión antes de publicarse.
- **Psicología:** entra en `/psicologia` con su cuenta de Google. Solo pueden entrar los correos del equipo (colección `psicologos` en Firestore).
- **Dueña (`aneska2291@gmail.com`, en `config.ts` y `firestore.rules`):** la primera vez que entra al panel con Google, su ficha de coordinadora se crea sola. Nadie puede quitarla del equipo.
- **Coordinación:** agrega o quita integrantes (*Equipo*), oculta comentarios ya publicados (*Publicados*) y ve las cifras del foro (*Resumen*).
- Si alguien escribe algo con señales de riesgo, ve al instante las líneas de ayuda y su mensaje llega **marcado como urgente** al panel.
- Reglas de seguridad: `firestore.rules`. Para publicarlas: `firebase deploy --only firestore`.

## Publicar en Firebase Hosting (gratis, plan Spark)

1. Crea un proyecto en https://console.firebase.google.com (sin activar facturación).
2. En `.firebaserc` reemplaza `REEMPLAZA-CON-TU-ID-DE-PROYECTO` por el ID del proyecto.
3. En esta carpeta:
   ```bash
   npm install -g firebase-tools
   firebase login
   cd app && npm run build && cd ..
   firebase deploy --only hosting
   ```
4. La app queda en `https://loquenoteensenaron.web.app` (sitio `loquenoteensenaron` del proyecto `cristomoreno-3ccba`, configurado en `firebase.json`).

## Activar la IA (Groq + Cloudflare Workers, gratis y sin tarjeta)

Mientras no hagas esto, el asistente responde con la guía del colegio (motor propio).

1. Crea tu clave en https://console.groq.com → *API Keys*.
2. Crea una cuenta en https://dash.cloudflare.com (plan gratuito).
3. En `worker/wrangler.toml`, `ALLOWED_ORIGINS` son los dominios desde donde se puede usar el asistente (ya incluye `loquenoteensenaron.web.app`). El límite está en 6 preguntas por minuto por persona, para proteger la cuota gratuita.
4. En la carpeta `worker`:
   ```bash
   npm install
   npx wrangler login
   npx wrangler secret put GROQ_API_KEY
   npx wrangler deploy
   ```
   La clave de Groq **nunca** va en `wrangler.toml` ni en la app: se guarda como secreto con el comando anterior.
   Te dará una URL como `https://lqnte-asistente.TU-USUARIO.workers.dev`.
5. En `app/`, copia `.env.example` como `.env` y pega esa URL en `VITE_ASSISTANT_URL`.
6. Vuelve a publicar: `npm run build` y luego `firebase deploy --only hosting`.

## Antes de lanzar a los padres

- [ ] Fotos comprimidas (portada de menos de 250 KB).
- [ ] Frases de "Voces reales" autorizadas y anónimas.
- [ ] Revisión del contenido por psicología o tutoría del colegio.
- [ ] Revisión de la política de privacidad (`content/politicas.ts`) por Dirección o asesoría legal, y correo de contacto en `VITE_PRIVACY_EMAIL`.
- [ ] Evaluar con asesoría legal si corresponde inscribir el banco de datos del foro ante la Autoridad Nacional de Protección de Datos Personales.
- [ ] Prueba en un Android y un iPhone: instalar, abrir sin internet, usar el asistente.
- [ ] Compartir el enlace por WhatsApp y revisar que salga la vista previa (`og.jpg`).
