import { useState } from 'react'
import { actividades, type Actividad } from '../../content/actividades'
import { useEnLinea } from '../../hooks/useEnLinea'
import { Encabezado } from '../../ui/Encabezado'
import { Icono } from '../../ui/Icono'
import { leerYouTube } from '../inicio/youtube'

function VideoDeActividad({ actividad }: { actividad: Actividad }) {
  const video = leerYouTube(actividad.youtube)
  const [reproduciendo, setReproduciendo] = useState(false)
  if (!video) return null

  return (
    <div className="actividad__video">
      {reproduciendo ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
          title={actividad.titulo}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button className="actividad__portada" onClick={() => setReproduciendo(true)} aria-label={`Ver el video: ${actividad.titulo}`}>
          <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" loading="lazy" />
          <span className="actividad__play"><Icono nombre="play" tam={30} /></span>
        </button>
      )}
    </div>
  )
}

export default function Vivido() {
  const enLinea = useEnLinea()

  return (
    <main>
      <Encabezado titulo="Lo que hemos vivido" icono="play" />
      <div className="contenedor">
        <p className="suave">Las actividades de la escuela para padres del Cristo Moreno, contadas en video.</p>
        {!enLinea && <p className="aviso-suave">Para ver los videos necesitas internet.</p>}
        <ul className="actividades">
          {actividades.map((actividad) => (
            <li key={actividad.id} className="tarjeta actividad">
              <VideoDeActividad actividad={actividad} />
              <h2 className="mano titulo-tarjeta sin-margen">{actividad.titulo}</h2>
              <p className="sin-margen">{actividad.descripcion}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
