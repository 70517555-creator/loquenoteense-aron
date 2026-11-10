import { Confetti, Envelope, Heart, Sparkle, Tag, WarningCircle } from '@phosphor-icons/react'
import { Ico } from '../../ui/Ico'
import { sinGuiones } from '../foro/useApodo'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useServicios } from '../../app/servicios'
import { cargas, tituloDeCarga } from '../../content/cargas'
import { FIRMA_DE_PSICOLOGIA, MOTIVOS_DE_RECHAZO, type Comentario, type Decision, type Propuesta } from '../../domain/foro'
import { CARGA_POR_CLASIFICAR, MOTIVOS_DE_RECHAZO_DE_CARTA, type CartaDeEstudiante, type ConsejoDeCarta } from '../../domain/mochila'
import { hayRiesgo } from '../../domain/riesgo'
import { clasificarCarta } from '../mochila/clasificarCarta'
import { pedirConsejoALaIA } from '../mochila/useConsejoDeCarta'
import { useAccion } from '../../hooks/useAccion'
import { useAlVerse } from '../../hooks/useAlVerse'
import { useConsulta } from '../../hooks/useConsulta'
import { Cargando } from '../../ui/Cargando'
import { clases } from '../../utils/clases'
import { fechaYHora } from '../../utils/tiempo'
import { BotonEliminar } from './BotonEliminar'

interface PropsDeModeracion {
  ocupado: boolean
  motivos?: string[]
  onDecidir: (decision: Decision, motivo?: string) => void
  children?: ReactNode
}

function BotonesDeModeracion({ ocupado, motivos = MOTIVOS_DE_RECHAZO, onDecidir, children }: PropsDeModeracion) {
  const [rechazando, setRechazando] = useState(false)

  if (rechazando) {
    return (
      <div className="moderacion">
        <small className="suave">Motivo (lo verá quien escribió):</small>
        {motivos.map((motivo) => (
          <button key={motivo} className="ficha" disabled={ocupado} onClick={() => onDecidir('rechazado', motivo)}>
            {motivo}
          </button>
        ))}
        <button className="enlace-discreto" onClick={() => setRechazando(false)}>Cancelar</button>
      </div>
    )
  }
  return (
    <div className="moderacion">
      <button className="boton boton--exito" disabled={ocupado} onClick={() => onDecidir('aprobado')}>Aprobar</button>
      {children}
      <button className="boton boton--borde" disabled={ocupado} onClick={() => setRechazando(true)}>No publicar</button>
    </div>
  )
}

interface PropsDeComentario {
  comentario: Comentario
  onListo: () => void
}

function ComentarioPorRevisar({ comentario, onListo }: PropsDeComentario) {
  const { panel } = useServicios()
  const { ocupado, error, ejecutar } = useAccion()
  const [respuesta, setRespuesta] = useState<string>()
  const firma = FIRMA_DE_PSICOLOGIA

  const decidir = async (decision: Decision, motivo?: string) => {
    if (await ejecutar(() => panel.moderarComentario(comentario, decision, motivo))) onListo()
  }
  const responder = async () => {
    const texto = respuesta?.trim()
    if (texto && (await ejecutar(() => panel.responder(comentario, texto, firma)))) onListo()
  }

  return (
    <li className={clases('tarjeta', 'por-revisar', comentario.urgente && 'por-revisar--urgente')}>
      <BotonEliminar eliminar={() => panel.eliminarComentario(comentario)} onEliminado={onListo} />
      {comentario.urgente && <span className="insignia insignia--urgente"><Ico icono={WarningCircle} peso="fill" /> Posible riesgo: atender primero</span>}
      <small className="suave">Tema: {comentario.temaTitulo} · {fechaYHora(comentario.creadoEn)}</small>
      <b>{sinGuiones(comentario.apodo)}</b>
      <p className="comentario__texto">{comentario.texto}</p>
      {respuesta !== undefined && (
        <textarea rows={3} value={respuesta} onChange={(e) => setRespuesta(e.target.value)} placeholder={`Responder como ${firma}…`} />
      )}
      {error && <p className="aviso-suave">{error}</p>}
      {respuesta === undefined ? (
        <BotonesDeModeracion ocupado={ocupado} onDecidir={decidir}>
          <button className="boton boton--borde" onClick={() => setRespuesta('')}>Aprobar y responder</button>
        </BotonesDeModeracion>
      ) : (
        <div className="moderacion">
          <button className="boton" disabled={ocupado || !respuesta.trim()} onClick={responder}>Publicar respuesta</button>
          <button className="enlace-discreto" onClick={() => setRespuesta(undefined)}>Cancelar</button>
        </div>
      )}
    </li>
  )
}

function PropuestaPorRevisar({ propuesta, onListo }: { propuesta: Propuesta; onListo: () => void }) {
  const { panel } = useServicios()
  const { ocupado, error, ejecutar } = useAccion()

  const decidir = async (decision: Decision, motivo?: string) => {
    if (await ejecutar(() => panel.moderarPropuesta(propuesta, decision, motivo))) onListo()
  }

  return (
    <li className="tarjeta por-revisar">
      <BotonEliminar eliminar={() => panel.eliminarPropuesta(propuesta)} onEliminado={onListo} />
      <small className="suave">Propuesta de tema{propuesta.nivel && ` · ${propuesta.nivel}`} · {fechaYHora(propuesta.creadoEn)}</small>
      <p className="comentario__texto">{propuesta.texto}</p>
      {error && <p className="aviso-suave">{error}</p>}
      <BotonesDeModeracion ocupado={ocupado} onDecidir={decidir} />
    </li>
  )
}

const SIN_RESPUESTA_DE_LA_IA = 'La IA no respondió esta vez. Inténtalo otra vez en un minuto o escribe el consejo tú.'
const CARTA_CON_RIESGO = 'Esta carta tiene señales de riesgo: por seguridad la IA no prepara consejos para estas cartas. Si decides publicarla, escribe tú el consejo.'

function ConsejoPorAprobar({ carta, consejo, visible, onCambiar }: { carta: CartaDeEstudiante; consejo: ConsejoDeCarta; visible: boolean; onCambiar: (c: ConsejoDeCarta) => void }) {
  const { asistente } = useServicios()
  const [preparando, setPreparando] = useState(false)
  const [sinRespuesta, setSinRespuesta] = useState(false)
  const conRiesgo = carta.urgente || hayRiesgo(carta.texto)

  const preparar = useCallback(async (primero: boolean) => {
    setPreparando(true)
    setSinRespuesta(false)
    try {
      const texto = await pedirConsejoALaIA(asistente, carta, primero)
      if (texto) onCambiar({ texto, de: 'ia' })
      else setSinRespuesta(primero)
    } catch {
      setSinRespuesta(primero)
    } finally {
      setPreparando(false)
    }
  }, [asistente, carta, onCambiar])

  // Solo pide a la IA cuando la carta aparece en pantalla: psicología puede leerlas en el orden que quiera.
  useEffect(() => { if (visible && !conRiesgo) preparar(false) }, [visible, conRiesgo, preparar])

  return (
    <label className="consejo-por-aprobar">
      <span><Ico icono={Heart} /> Consejo para los papás (se publica debajo de la carta)</span>
      <textarea
        rows={5}
        value={consejo.texto}
        placeholder={preparando ? 'La IA está preparando una sugerencia… (puede tardar si hay muchas cartas)' : 'Escribe un consejo corto, o déjalo vacío para publicar la carta sola.'}
        onChange={(e) => onCambiar({ texto: e.target.value, de: 'psicologia' })}
      />
      {conRiesgo && <small className="aviso-suave">{CARTA_CON_RIESGO}</small>}
      {!conRiesgo && sinRespuesta && !consejo.texto && <small className="aviso-suave">{SIN_RESPUESTA_DE_LA_IA}</small>}
      <small className="suave">
        {consejo.de === 'ia' && consejo.texto ? 'Lo preparó la IA: léelo y cámbialo si quieres. Si lo editas, se publica como consejo de psicología.' : ''}
        {' '}{!conRiesgo && <button type="button" className="enlace-discreto" disabled={preparando} onClick={() => preparar(true)}>{preparando ? 'Preparando…' : <><Ico icono={Sparkle} /> {consejo.texto ? 'Pedir otra sugerencia a la IA' : 'Pedir sugerencia a la IA'}</>}</button>}
      </small>
    </label>
  )
}

function TemaDeLaCarta({ carta, carga, visible, onCambiar }: { carta: CartaDeEstudiante; carga?: string; visible: boolean; onCambiar: (id: string) => void }) {
  const { asistente } = useServicios()
  const [clasificando, setClasificando] = useState(carta.carga === CARGA_POR_CLASIFICAR)
  const [sugerida, setSugerida] = useState<string>()

  useEffect(() => {
    if (!visible || carta.carga !== CARGA_POR_CLASIFICAR) return
    let vigente = true
    clasificarCarta(asistente, carta.texto, cargas)
      .then((id) => { if (vigente && id) { setSugerida(id); onCambiar(id) } })
      .catch(() => {})
      .finally(() => vigente && setClasificando(false))
    return () => { vigente = false }
  }, [asistente, carta, visible, onCambiar])

  return (
    <label className="consejo-por-aprobar">
      <span><Ico icono={Tag} /> Tema de la mochila donde se publicará</span>
      <select value={carga ?? ''} onChange={(e) => onCambiar(e.target.value)}>
        <option value="" disabled>{clasificando ? 'La IA está eligiendo el tema…' : 'Elige el tema'}</option>
        {cargas.map((c) => <option key={c.id} value={c.id}>{c.titulo}</option>)}
      </select>
      {sugerida && <small className="suave">Lo eligió la IA leyendo la carta. Cámbialo si no corresponde.</small>}
    </label>
  )
}

function CartaPorRevisar({ carta, onListo }: { carta: CartaDeEstudiante; onListo: () => void }) {
  const { panel } = useServicios()
  const { ocupado, error, ejecutar } = useAccion()
  const [consejo, setConsejo] = useState<ConsejoDeCarta>({ texto: '', de: 'ia' })
  const [carga, setCarga] = useState<string | undefined>(carta.carga === CARGA_POR_CLASIFICAR ? undefined : carta.carga)
  const [falta, setFalta] = useState(false)
  const tarjeta = useRef<HTMLLIElement>(null)
  const visible = useAlVerse(tarjeta)
  const elegirTema = useCallback((id: string) => {
    setCarga(id)
    setFalta(false)
  }, [])

  const decidir = async (decision: Decision, motivo?: string) => {
    if (decision === 'aprobado' && !carga) return setFalta(true)
    if (await ejecutar(() => panel.moderarCarta(carta, decision, motivo, consejo, carga))) onListo()
  }

  return (
    <li ref={tarjeta} className={clases('tarjeta', 'por-revisar', carta.urgente && 'por-revisar--urgente')}>
      <BotonEliminar eliminar={() => panel.eliminarCarta(carta)} onEliminado={onListo} />
      {carta.urgente && <span className="insignia insignia--urgente"><Ico icono={WarningCircle} peso="fill" /> Posible riesgo: el estudiante vio las líneas de ayuda</span>}
      <small className="suave"><Ico icono={Envelope} /> Carta de estudiante · {carta.nivel} · {carta.carga === CARGA_POR_CLASIFICAR ? 'escrita en el bolsillo secreto' : `tema: ${tituloDeCarga(carta.carga)}`} · {fechaYHora(carta.creadoEn)}</small>
      <p className="comentario__texto">{carta.texto}</p>
      <small className="suave">Revisa que no tenga nombres, grados, secciones ni datos que permitan reconocer a alguien.</small>
      <TemaDeLaCarta carta={carta} carga={carga} visible={visible} onCambiar={elegirTema} />
      {falta && <p className="aviso-suave">Elige el tema antes de aprobar.</p>}
      <ConsejoPorAprobar carta={carta} consejo={consejo} visible={visible} onCambiar={setConsejo} />
      {error && <p className="aviso-suave">{error}</p>}
      <BotonesDeModeracion ocupado={ocupado} motivos={MOTIVOS_DE_RECHAZO_DE_CARTA} onDecidir={decidir} />
    </li>
  )
}

export function Revisar() {
  const { panel } = useServicios()
  const { datos, cargando, fallo, recargar } = useConsulta(useCallback(() => panel.pendientes(), [panel]))

  if (fallo) return <p className="aviso-suave">No pudimos cargar los pendientes.</p>
  if (cargando && !datos) return <Cargando />
  const sinPendientes = !datos?.comentarios.length && !datos?.propuestas.length && !datos?.cartas.length

  return (
    <section className="conversacion">
      <button className="boton boton--fantasma" onClick={recargar}>Actualizar</button>
      {sinPendientes && <p className="suave centrado"><Ico icono={Confetti} /> No hay nada por revisar.</p>}
      <ul className="lista-panel">
        {datos?.comentarios.map((c) => <ComentarioPorRevisar key={c.id} comentario={c} onListo={recargar} />)}
        {datos?.cartas.map((c) => <CartaPorRevisar key={c.id} carta={c} onListo={recargar} />)}
        {datos?.propuestas.map((p) => <PropuestaPorRevisar key={p.id} propuesta={p} onListo={recargar} />)}
      </ul>
    </section>
  )
}
