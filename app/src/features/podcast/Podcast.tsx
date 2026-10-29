import { useState } from 'react'
import { config } from '../../config'
import type { Episodio } from '../../domain/tipos'
import { useContenido } from '../../hooks/useContenido'
import { useEnLinea } from '../../hooks/useEnLinea'
import { Cargando } from '../../ui/Cargando'
import { Encabezado } from '../../ui/Encabezado'
import { Icono } from '../../ui/Icono'
import { Ilustracion } from '../../ui/Ilustracion'

const ALTO_REPRODUCTOR_SPOTIFY = 152

function PortadaDelPodcast() {
  return (
    <div className="podcast-portada">
      <Ilustracion
        src="/images/podcast.webp"
        className="podcast-portada__img"
        alt="Portada del podcast"
        respaldo={
          <div className="podcast-portada__img podcast-portada__respaldo">
            <Icono nombre="headphones" tam={56} />
          </div>
        }
      />
      <div>
        <h2 className="mano titulo-grande sin-margen">Lo que no te enseñaron</h2>
        <p className="suave">Conversaciones cortas para escuchar de camino al trabajo o mientras cocinas.</p>
        {config.urlPodcast && (
          <a className="boton boton--borde" href={config.urlPodcast} target="_blank" rel="noopener noreferrer">
            Abrir en Spotify
          </a>
        )}
      </div>
    </div>
  )
}

function Reproductor({ episodio }: { episodio: Episodio }) {
  if (episodio.spotifyEmbed) {
    return (
      <iframe
        className="episodio__reproductor"
        src={episodio.spotifyEmbed}
        title={`Episodio ${episodio.numero}: ${episodio.titulo}`}
        height={ALTO_REPRODUCTOR_SPOTIFY}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    )
  }
  return <audio className="episodio__audio" src={episodio.audioUrl} controls autoPlay preload="none" />
}

interface PropsDeEpisodio {
  episodio: Episodio
  abierto: boolean
  puedeEscuchar: boolean
  onEscuchar: () => void
}

function TarjetaDeEpisodio({ episodio, abierto, puedeEscuchar, onEscuchar }: PropsDeEpisodio) {
  const publicado = Boolean(episodio.spotifyEmbed || episodio.audioUrl)

  return (
    <li className="tarjeta episodio">
      <div className="episodio__cabeza">
        <span className="episodio__num mano">#{episodio.numero}</span>
        <div>
          <h3 className="episodio__titulo">{episodio.titulo}</h3>
          <p className="suave">{episodio.descripcion}</p>
          <small className="suave">{episodio.duracion}</small>
        </div>
      </div>
      {!publicado && <span className="insignia insignia--suave">Muy pronto</span>}
      {publicado && !abierto && (
        <button className="boton" onClick={onEscuchar} disabled={!puedeEscuchar}>
          <Icono nombre="play" tam={18} /> Escuchar
        </button>
      )}
      {publicado && abierto && <Reproductor episodio={episodio} />}
    </li>
  )
}

function ListaDeEpisodios({ episodios }: { episodios: Episodio[] }) {
  const enLinea = useEnLinea()
  const [abierto, setAbierto] = useState<string>()

  return (
    <>
      {!enLinea && <p className="aviso-suave">Para escuchar el podcast necesitas internet.</p>}
      <ul className="episodios">
        {episodios.map((episodio) => (
          <TarjetaDeEpisodio
            key={episodio.id}
            episodio={episodio}
            abierto={abierto === episodio.id}
            puedeEscuchar={enLinea}
            onEscuchar={() => setAbierto(episodio.id)}
          />
        ))}
      </ul>
    </>
  )
}

export default function Podcast() {
  const episodios = useContenido('episodios')
  return (
    <main>
      <Encabezado titulo="Podcast" icono="headphones" />
      <div className="contenedor">
        <PortadaDelPodcast />
        {episodios ? <ListaDeEpisodios episodios={episodios} /> : <Cargando />}
      </div>
    </main>
  )
}
