import { actividades } from '../../content/actividades'
import { Icono } from '../../ui/Icono'
import type { VideoAbierto } from './useVideoDeBienvenida'
import { leerYouTube } from './youtube'

const MAXIMO_DE_MINIATURAS = 3

interface Miniatura extends VideoAbierto {
  etiqueta: string
}

function miniaturas(bienvenida: VideoAbierto | null): Miniatura[] {
  const deActividades = actividades.flatMap((a): Miniatura[] => {
    const video = leerYouTube(a.youtube)
    return video ? [{ video, titulo: a.titulo, etiqueta: 'Lo que hemos vivido', bienvenida: false }] : []
  })
  const todas = bienvenida ? [{ ...bienvenida, etiqueta: 'Bienvenida' }, ...deActividades] : deActividades
  return todas.slice(0, MAXIMO_DE_MINIATURAS)
}

export function MiniaturasDeVideos({ bienvenida, onAbrir }: { bienvenida: VideoAbierto | null; onAbrir: (v: VideoAbierto) => void }) {
  const lista = miniaturas(bienvenida)
  if (!lista.length) return null
  return (
    <ul className="miniaturas" aria-label="Videos">
      {lista.map((m) => (
        <li key={m.video.id}>
          <button className="miniatura" onClick={() => onAbrir(m)} aria-label={`Ver video: ${m.titulo}`}>
            <span className="miniatura__imagen">
              <img src={`https://i.ytimg.com/vi/${m.video.id}/mqdefault.jpg`} alt="" decoding="async" />
              <span className="miniatura__play"><Icono nombre="play" tam={18} /></span>
            </span>
            <span className="miniatura__etiqueta">{m.etiqueta}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
