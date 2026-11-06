import { HandHeart, HourglassMedium } from '@phosphor-icons/react'
import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { useServicios } from '../../app/servicios'
import type { Comentario, Psicologo } from '../../domain/foro'
import { Ico } from '../../ui/Ico'
import { Icono } from '../../ui/Icono'
import { useCerrarConEscape } from '../../hooks/useCerrarConEscape'
import { clases } from '../../utils/clases'
import { fechaYHora } from '../../utils/tiempo'
import { AcompanarComentario } from './AcompanarComentario'
import { BotonDeVoto } from './BotonDeVoto'
import { BotonReportar } from './BotonReportar'
import { sinGuiones } from './useApodo'

const rutaDelComentario = (c: Comentario) => `temas/${c.temaId}/comentarios/${c.id}`

// Avatar como en las apps de mensajes: la inicial de quien escribe, con un color por parentesco.
const COLOR_DE_AVATAR: [inicio: string, color: string][] = [
  ['Mamá', '#c8302c'], ['Papá', '#1f4e8c'], ['Abuela', '#8a4fa3'], ['Abuelo', '#2f6f5e'], ['Apoderad', '#b07812'],
]

function Avatar({ comentario }: { comentario: Comentario }) {
  if (comentario.rol === 'psicologia') {
    return <span className="nota__avatar nota__avatar--psicologia" aria-hidden="true"><HandHeart size={20} weight="fill" /></span>
  }
  const color = COLOR_DE_AVATAR.find(([inicio]) => comentario.apodo.startsWith(inicio))?.[1] ?? '#6b5a50'
  return <span className="nota__avatar" style={{ background: color }} aria-hidden="true">{comentario.apodo.trim().charAt(0).toUpperCase()}</span>
}

function separarApodo(apodo: string) {
  const [quien, ...resto] = sinGuiones(apodo).split(' · ')
  return { quien, grado: resto.join(' · ') }
}

function EstadoPropio({ comentario }: { comentario: Comentario }) {
  if (comentario.estado === 'pendiente') {
    return <span className="insignia insignia--suave"><Ico icono={HourglassMedium} /> En revisión: solo tú lo ves por ahora</span>
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

// Cada nota del mural tiene su color e inclinación fijos (salen del id), para que no cambien al recargar.
const COLORES_DE_NOTA = ['amarillo', 'rosa', 'celeste', 'verde', 'lila']

function semilla(id: string) {
  let h = 0
  for (const letra of id) h = (h * 31 + letra.charCodeAt(0)) >>> 0
  return h
}

function estiloDeNota(comentario: Comentario) {
  const h = semilla(comentario.id)
  const color = comentario.rol === 'psicologia' ? 'psicologia' : COLORES_DE_NOTA[h % COLORES_DE_NOTA.length]
  const giro = ((h >> 4) % 5) - 2
  return { clase: `nota--${color}`, estilo: { '--giro': `${giro * 0.6}deg` } as CSSProperties }
}

interface Props {
  comentario: Comentario
  onQuitar?: (comentario: Comentario) => void
}

interface PropsDeTarjeta extends Props {
  acompanamientos?: Comentario[]
  psicologo?: Psicologo | null
  onAcompanado?: () => void
}

// La respuesta de psicología va dentro de la nota de la familia: así se ve que alguien la leyó y la acompaña.
function Acompanamientos({ respuestas }: { respuestas: Comentario[] }) {
  if (!respuestas.length) return null
  return (
    <div className="nota__acompanamientos">
      {respuestas.map((r) => (
        <div key={r.id} className="acompanamiento">
          <b><Ico icono={HandHeart} peso="fill" /> {sinGuiones(r.apodo)} <time className="acompanamiento__fecha" dateTime={r.creadoEn.toISOString()}>{fechaYHora(r.creadoEn)}</time></b>
          <p>{r.texto}</p>
        </div>
      ))}
    </div>
  )
}

function Encabezado({ comentario, onQuitar }: Props) {
  const publicado = comentario.estado === 'aprobado'
  const { quien, grado } = separarApodo(comentario.apodo)
  const detalles = [grado, comentario.respondeA && `en respuesta a ${sinGuiones(comentario.respondeA)}`, fechaYHora(comentario.creadoEn)]
  return (
    <header className="nota__cabeza">
      <Avatar comentario={comentario} />
      <div className="nota__quien">
        <b>{quien}{comentario.esMio && publicado && <small className="suave"> (tú)</small>}</b>
        {comentario.rol === 'psicologia' && <span className="nota__rol">Psicología del colegio</span>}
        <small className="nota__meta">{detalles.filter(Boolean).join(' · ')}</small>
      </div>
      {onQuitar && publicado && (
        <button className="comentario__quitar" onClick={() => onQuitar(comentario)} aria-label="Quitar este comentario del foro" title="Quitar del foro (solo psicología)">
          <Icono nombre="close" tam={14} />
        </button>
      )}
    </header>
  )
}

function Acciones({ comentario, onAcompanar }: { comentario: Comentario; onAcompanar?: () => void }) {
  if (comentario.estado !== 'aprobado') return null
  return (
    <div className="nota__acciones">
      <MeAyudo comentario={comentario} />
      {onAcompanar && (
        <button className="boton-acompanar" onClick={onAcompanar}>
          <Ico icono={HandHeart} peso="fill" /> Acompañar
        </button>
      )}
      {!comentario.esMio && <BotonReportar ruta={rutaDelComentario(comentario)} texto={comentario.texto} />}
    </div>
  )
}

function NotaAmpliada({ comentario, onCerrar }: { comentario: Comentario; onCerrar: () => void }) {
  const cerrar = useCallback(() => onCerrar(), [onCerrar])
  useCerrarConEscape(cerrar)
  const { clase } = estiloDeNota(comentario)
  return createPortal(
    <div className="responder nota-ampliada" role="dialog" aria-modal="true" aria-label="Leer la nota completa" onClick={cerrar}>
      <article className={clases('nota', clase, 'nota-ampliada__caja')} onClick={(e) => e.stopPropagation()}>
        <button className="responder__cerrar nota-ampliada__cerrar" onClick={cerrar} aria-label="Cerrar">
          <Icono nombre="close" tam={20} />
        </button>
        <Encabezado comentario={comentario} />
        <p className="nota__texto">{comentario.texto}</p>
        <Acciones comentario={comentario} />
      </article>
    </div>,
    document.body,
  )
}

export function TarjetaDeComentario({ comentario, onQuitar, acompanamientos = [], psicologo, onAcompanado }: PropsDeTarjeta) {
  const texto = useRef<HTMLParagraphElement>(null)
  const [esLarga, setEsLarga] = useState(false)
  const [ampliada, setAmpliada] = useState(false)
  const [acompanando, setAcompanando] = useState(false)
  const { clase, estilo } = estiloDeNota(comentario)
  const puedeAcompanar = psicologo && comentario.rol !== 'psicologia'

  useLayoutEffect(() => {
    const p = texto.current
    if (p) setEsLarga(p.scrollHeight > p.clientHeight + 2)
  }, [comentario.texto])

  return (
    <li className={clases('nota', clase, comentario.estado !== 'aprobado' && 'nota--propia')} style={estilo}>
      <Encabezado comentario={comentario} onQuitar={onQuitar} />
      <p ref={texto} className="nota__texto texto-recortado">{comentario.texto}</p>
      {esLarga && <button className="leer-mas" onClick={() => setAmpliada(true)}>Leer completa</button>}
      {comentario.esMio && <EstadoPropio comentario={comentario} />}
      <Acompanamientos respuestas={acompanamientos} />
      <Acciones comentario={comentario} onAcompanar={puedeAcompanar ? () => setAcompanando(true) : undefined} />
      {ampliada && <NotaAmpliada comentario={comentario} onCerrar={() => setAmpliada(false)} />}
      {acompanando && psicologo && (
        <AcompanarComentario
          comentario={comentario}
          psicologo={psicologo}
          onCerrar={() => setAcompanando(false)}
          onPublicado={() => { setAcompanando(false); onAcompanado?.() }}
        />
      )}
    </li>
  )
}
