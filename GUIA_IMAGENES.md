# Guía de imágenes

**Todas las imágenes van en `app/public/images/`.**
Si falta una, la app muestra un dibujo de respaldo y no aparece ninguna imagen rota. Puedes ir subiéndolas poco a poco.

## 1. Qué imagen va en cada lugar

| Archivo | Tamaño | ¿Obligatoria? | Dónde aparece |
|---|---|---|---|
| `portada.webp` | 1920 × 1080 | ⭐ Sí | Portada en computadora (tu foto del colegio con la familia) |
| `portada-movil.webp` | 1080 × 1920 (vertical) | ⭐ Sí | Portada en celular: **la misma foto, recortada vertical y centrada en la familia** |
| `og.jpg` | 1200 × 630 | ⭐ Sí | Vista previa al compartir el enlace por WhatsApp |
| `podcast.webp` | 800 × 800 | Recomendada | Portada del podcast |
| `casa/explorar.webp`, `casa/mochila.webp`, `casa/zapatos.webp`, `casa/voces.webp`, `casa/retos.webp`, `casa/mundo.webp`, `casa/recursos.webp`, `casa/podcast.webp` | 600 × 450 | Opcional | Escena dentro de cada ventana de la casa |
| `situaciones/celular.webp`, `notas`, `redes`, `amigos`, `emociones`, `respuestas` | 1280 × 720 | Opcional | Escena de cada situación en "Explorar" |
| `zapatos/puerta.webp`, `curso`, `fiesta`, `entiendes`, `noche` | 1280 × 720 | Opcional | Escena de cada pregunta en "Ponte en mis zapatos" |
| `mundo/redes.webp`, `ia`, `videojuegos`, `emocional` | 1280 × 720 | Opcional | Cabecera de cada tema en "El mundo de hoy" |
| `retos/quince.webp`, `cena`, `su-mundo`, `carta`, `caminata`, `perdon`, `acuerdo` | 1280 × 720 | Opcional | Imagen de cada reto |

> Los nombres deben ser **exactos**: en minúsculas, sin tildes y con `.webp`.

## 2. Antes de subir: comprimir (muy importante)

El hosting gratuito tiene un límite de transferencia diaria. Una foto de 5 MB, multiplicada por 1000 padres, agota ese límite en un día.

1. Entra a **https://squoosh.app** (gratis, funciona en el navegador).
2. Arrastra la imagen y ajusta el tamaño de la tabla de arriba (*Resize*).
3. Formato **WebP**, calidad **75**.
4. Meta de peso: portada **menos de 250 KB**; las demás **menos de 120 KB**.
5. Para `og.jpg` usa formato **MozJPEG**, calidad 80.

## 3. Imágenes con IA: estilo único para que todo combine

### Herramientas gratuitas
- **Gemini** (gemini.google.com): permite subir tu foto o tu imagen de referencia para mantener el estilo. **Es la recomendada.**
- **Microsoft Designer / Bing Image Creator**: gratis con una cuenta de Microsoft.
- **Ideogram** o **Leonardo**: tienen planes gratuitos con algunas imágenes al día.

### Reglas para que se vean como una sola app
1. **Usa siempre el mismo "estilo base"** (abajo) y solo cambia la escena.
2. Si la herramienta lo permite, **sube como referencia** tu imagen de inspiración (el collage) o tu foto de portada.
3. Pide **"sin texto"**: la IA escribe mal las letras. El texto lo pone la app.
4. Personajes **ficticios**. Nunca subas fotos reales de estudiantes para transformarlas (protección de menores, Ley 29733).

### Estilo base (cópialo al inicio de cada prompt)

```
Warm storybook digital illustration, soft painterly brushwork, golden-hour light,
cozy and hopeful mood. Color palette: cream, terracotta, warm amber, navy blue,
and the school's red-and-white uniform. Peruvian Latin American family characters
with brown skin and dark hair, expressive but gentle faces. Clean composition,
subject slightly off-center, soft background. No text, no letters, no logos, no watermark.
```

### Escenas (pega una después del estilo base)

**Ventanas de la casa (`casa/…`, formato 4:3)**
- `explorar`: *A mother and her teenage son sitting on a sofa, each with a speech-bubble-shaped cushion, looking at each other with curiosity.*
- `mochila`: *An old grey school backpack covered with handwritten paper notes, sitting on a wooden chair by a window.*
- `zapatos`: *A father's big shoes next to a pair of teenage sneakers at the door of a home, warm light.*
- `voces`: *Three teenage students in red-and-white school tracksuits talking and laughing on school steps.*
- `retos`: *A family of four playing a board game at the kitchen table, phones in a basket aside.*
- `mundo`: *A teenager's room with a glowing phone, a game controller and floating icons of hearts and stars, cozy evening.*
- `recursos`: *An open notebook with colorful question cards spread on a wooden table, a cup of coffee.*
- `podcast`: *A pair of headphones and a microphone on a cozy desk with a plant, warm lamp light.*

**Situaciones (`situaciones/…`, formato 16:9)**
- `celular`: *A tired mother in the living room looking at her teenage daughter absorbed in her phone on the sofa.*
- `notas`: *A teenage boy at a desk holding a report card, worried, his father in the doorway.*
- `redes`: *A teenage girl taking a selfie in her room, her mother watching softly from the hallway.*
- `amigos`: *A group of teenage friends laughing in a park while a parent waves from a distance.*
- `emociones`: *A teenage girl sitting on her bed hugging her knees, her mother sitting quietly next to her.*
- `respuestas`: *A father and teenage son in a kitchen, the son with crossed arms, the father taking a deep breath.*

**Ponte en mis zapatos (`zapatos/…`)**
- `puerta`: *A teenage girl closing her bedroom door, seen from the hallway, backpack on the floor.*
- `curso`: *A teenage boy showing a test paper to his mother at the dining table.*
- `fiesta`: *A teenage girl getting ready for a party, asking permission to her father.*
- `entiendes`: *A teenage boy frustrated in front of his mother, both standing in the living room.*
- `noche`: *A teenager awake late at night in bed, face lit by a phone, a clock showing late hours.*

**El mundo de hoy (`mundo/…`)**
- `redes`: *Hands holding a smartphone with abstract social media hearts and bubbles floating around.*
- `ia`: *A student at a desk with a laptop showing a friendly abstract AI glow, books around.*
- `videojuegos`: *A father and son playing a video game together on the sofa, laughing.*
- `emocional`: *A mother and teenage daughter talking calmly on a park bench, soft sunset.*

**Portada del podcast (`podcast.webp`, 1:1)**
```
Cozy illustration of a small warm house at sunset with headphones resting on the roof,
cream and red tones. No text.
```
(El título lo puedes agregar después en Canva).

## 4. Tu foto de portada

- **Computadora** (`portada.webp`): la foto horizontal completa.
- **Celular** (`portada-movil.webp`): recórtala **vertical (9:16)**, con la familia en el centro-abajo y el árbol o el colegio arriba. Así el título queda sobre el cielo y no tapa a las personas.
- Si sale el escudo o el nombre del colegio, confirma con la dirección que se puede usar.
