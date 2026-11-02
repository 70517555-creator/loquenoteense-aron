import { useLayoutEffect, useRef, useState } from 'react'
import { useServicios } from '../../app/servicios'
import type { Comentario } from '../../domain/foro'
import { Icono } from '../../ui/Icono'
import { clases } from '../../utils/clases'
import { haceCuanto } from '../../utils/tiempo'
import { BotonDeVoto } from './BotonDeVoto'
import { BotonReportar } from './BotonReportar'
import { sinGuiones } from './useApodo'

const rutaDelComentario = (c: Comentario) => `temas/${c.temaId}/comentarios/${c.id}`

const AVATARES: [inicio: string, emoji: string][] = [
  ['Mamá', '👩'], ['Papá', '👨'], ['Abuela', '👵'], ['Abuelo', '👴'], ['Apoderada', '🙋‍♀️'], ['Apoderado', '🙋‍♂️'],
]

function avatarDe(comentario: Comentario) {
  if (comentario.rol === 'psicologia') return '💚'
  return AVATARES.find(([inicio]) => comentario.apodo.startsWith(inicio))?.[1] ?? '🙂'
}

function separarApodo(apodo: string) {
  const [quien, ...resto] = sinGuiones(apodo).split(' · ')
  return { quien, grado: resto.join(' · ') }
}

function EstadoPropio({ comentario }: { comentario: Comentario }) {
  if (comentario.estado === 'pendiente') {
    return <span className="insignia insignia--suave">⏳ En revisión: solo tú lo ves por ahora</span>
  }
  if (comentario.estado === 'rechazado') {
    return <p className="comentario__rechazo">No se publicó. {comentario.motivoRechazo}</p>
  }
  return null
}

function MeAyudo({ comentario }: { comentario: Comentario }) {
  const { foro } = useServicios()
  return (
    <BotonDeVoto id={comentario.id} total={comentario.meAyudo} votar={() => foro.marcarMeAyudo(comentario)}>
      <Icono nombre="heart" tam={14} /> Me ayudó
    </BotonDeVoto>
  )
}

function TextoRecortable({ texto }: { texto: string }) {
  const parrafo = useRef<HTMLParagraphElement>(null)
  const [abierto, setAbierto] = useState(false)
  const [esLargo, setEsLargo] = useState(false)

  useLayoutEffect(() => {
    const p = parrafo.current
    if (p && !abierto) setEsLargo(p.scrollHeight > p.clientHeight + 2)
  }, [texto, abierto])

  return (
    <>
      <p ref={parrafo} className={clases('comentario__texto', !abierto && 'comentario__texto--recortado')}>{texto}</p>
      {(esLargo || abierto) && (
        <button className="comentario__leer" onClick={() => setAbierto(!abierto)}>{abierto ? 'Ver menos' : 'Leer más'}</button>
      )}
    </>
  )
}

interface Props {
  comentario: Comentario
  onQuitar?: (comentario: Comentario) => void
}

export function TarjetaDeComentario({ comentario, onQuitar }: Props) {
  const dePsicologia = comentario.rol === 'psicologia'
  const publicado = comentario.estado === 'aprobado'
  const { quien, grado } = separarApodo(comentario.apodo)
  const detalles = [grado, comentario.respondeA && `en respuesta a ${sinGuiones(comentario.respondeA)}`, haceCuanto(comentario.creadoEn)]

  return (
    <li className={clases('comentario', dePsicologia && 'comentario--psicologia', !publicado && 'comentario--propio')}>
      <span className="comentario__avatar" aria-hidden="true">{avatarDe(comentario)}</span>
      <div className="comentario__cuerpo">
        <div className="comentario__autor">
          <b>{quien}</b>
          {dePsicologia && <span className="insignia">Psicología del colegio</span>}
          {comentario.esMio && publicado && <small className="suave">(tú)</small>}
          {onQuitar && publicado && (
            <button className="comentario__quitar" onClick={() => onQuitar(comentario)} aria-label="Quitar este comentario del foro" title="Quitar del foro (solo psicología)">
              <Icono nombre="close" tam={14} />
            </button>
          )}
        </div>
        <small className="comentario__meta">{detalles.filter(Boolean).join(' · ')}</small>
        <TextoRecortable texto={comentario.texto} />
        {comentario.esMio && <EstadoPropio comentario={comentario} />}
        {publicado && (
          <div className="comentario__acciones">
            <MeAyudo comentario={comentario} />
            {!comentario.esMio && <BotonReportar ruta={rutaDelComentario(comentario)} texto={comentario.texto} />}
          </div>
        )}
      </div>
    </li>
  )
}
