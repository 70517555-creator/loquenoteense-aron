import { ChatCircleDots, Headphones } from '@phosphor-icons/react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Episodio } from '../../domain/tipos'
import { useContenido } from '../../hooks/useContenido'
import { useEnLinea } from '../../hooks/useEnLinea'
import { Cargando } from '../../ui/Cargando'
import { Encabezado } from '../../ui/Encabezado'
import { Ilustracion } from '../../ui/Ilustracion'
import { clases } from '../../utils/clases'
import { ConversacionDelTema } from '../foro/ConversacionDelTema'
import { CompartirEpisodio, PARAMETRO_EPISODIO } from './CompartirEpisodio'
import { Reacciones } from './Reacciones'
import { ReproductorRetro } from './ReproductorRetro'
import { estaPublicado, useEpisodiosEscuchados } from './useEpisodioNuevo'

function PortadaDelPodcast() {
  return (
    <div className="podcast-portada">
      <Ilustracion
        src="/images/podcast.webp"
        className="podcast-portada__img"
        alt="Portada del podcast"
        respaldo={<div className="podcast-portada__img podcast-portada__respaldo"><Headphones size={56} weight="duotone" /></div>}
      />
      <div>
        <h2 className="mano titulo-grande sin-margen">Lo que no te enseñaron</h2>
        <p className="suave">Conversaciones cortas para escuchar de camino al trabajo o mientras cocinas.</p>
      </div>
    </div>
  )
}

const temaDelEpisodio = (e: Episodio) => ({
  id: `podcast-${e.id}`,
  titulo: `Podcast #${e.numero}: ${e.titulo}`,
  descripcion: e.descripcion,
  fecha: e.publicadoEn ?? '',
})

function EpisodioEnEscena({ episodio }: { episodio: Episodio }) {
  const { marcar } = useEpisodiosEscuchados()
  return (
    <article className="episodio-en-escena">
      <header className="episodio-en-escena__cabeza">
        <span className="episodio__num mano">#{episodio.numero}</span>
        <div>
          <h2 className="episodio__titulo">{episodio.titulo}</h2>
          <p className="suave sin-margen">{episodio.descripcion}</p>
        </div>
      </header>
      <ReproductorRetro episodio={episodio} onEmpezar={() => marcar(episodio.id)} />
      <CompartirEpisodio episodio={episodio} />
      <Reacciones episodio={episodio.id} />
      <h3 className="episodio-en-escena__subtitulo"><ChatCircleDots size={24} weight="duotone" /> Comenta el episodio</h3>
      <ConversacionDelTema tema={temaDelEpisodio(episodio)} etiqueta="Podcast" autor="Comentas" resumida sinTablero />
    </article>
  )
}

function OtrosEpisodios({ episodios, activo, onElegir }: { episodios: Episodio[]; activo?: string; onElegir: (id: string) => void }) {
  return (
    <section className="otros-episodios">
      <h3 className="episodio-en-escena__subtitulo">Todos los episodios</h3>
      <ul className="episodios">
        {episodios.map((e) => {
          const publicado = estaPublicado(e)
          return (
            <li key={e.id}>
              <button className={clases('tarjeta', 'episodio', e.id === activo && 'episodio--activo')} disabled={!publicado} onClick={() => onElegir(e.id)}>
                <span className="episodio__num mano">#{e.numero}</span>
                <span className="episodio__datos">
                  <b className="episodio__titulo">{e.titulo}</b>
                  <small className="suave">{publicado ? e.duracion : 'Muy pronto'}</small>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default function Podcast() {
  const episodios = useContenido('episodios')
  const enLinea = useEnLinea()
  const [params] = useSearchParams()
  const [elegido, setElegido] = useState(params.get(PARAMETRO_EPISODIO) ?? undefined)
  const publicados = episodios?.filter(estaPublicado) ?? []
  const activo = publicados.find((e) => e.id === elegido) ?? publicados.at(-1)

  return (
    <main>
      <Encabezado titulo="Podcast" icono="headphones" />
      <div className="contenedor podcast">
        <PortadaDelPodcast />
        {!episodios ? (
          <Cargando />
        ) : (
          <>
            {!enLinea && <p className="aviso-suave">Para escuchar el podcast necesitas internet.</p>}
            {activo && <EpisodioEnEscena key={activo.id} episodio={activo} />}
            <OtrosEpisodios episodios={episodios} activo={activo?.id} onElegir={(id) => { setElegido(id); scrollTo({ top: 0, behavior: 'smooth' }) }} />
          </>
        )}
      </div>
    </main>
  )
}
