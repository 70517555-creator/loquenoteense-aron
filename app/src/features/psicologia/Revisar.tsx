import { Confetti, Envelope, Heart, Sparkle, Tag, WarningCircle } from '@phosphor-icons/react'
import { Ico } from '../../ui/Ico'
import { sinGuiones } from '../foro/useApodo'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useServicios } from '../../app/servicios'
import { cargas, tituloDeCarga } from '../../content/cargas'
import { MOTIVOS_DE_RECHAZO, type Comentario, type Decision, type Propuesta, type Psicologo } from '../../domain/foro'
import { CARGA_POR_CLASIFICAR, MOTIVOS_DE_RECHAZO_DE_CARTA, type CartaDeEstudiante, type ConsejoDeCarta } from '../../domain/mochila'
import { clasificarCarta } from '../mochila/clasificarCarta'
import { pedirConsejoALaIA } from '../mochila/useConsejoDeCarta'
import { useAccion } from '../../hooks/useAccion'
import { useConsulta } from '../../hooks/useConsulta'
import { Cargando } from '../../ui/Cargando'
import { clases } from '../../utils/clases'

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
  psicologo: Psicologo
  onListo: () => void
}

function ComentarioPorRevisar({ comentario, psicologo, onListo }: PropsDeComentario) {
  const { panel } = useServicios()
  const { ocupado, error, ejecutar } = useAccion()
  const [respuesta, setRespuesta] = useState<string>()
  const firma = `${psicologo.nombre} · Psicología`

  const decidir = async (decision: Decision, motivo?: string) => {
    if (await ejecutar(() => panel.moderarComentario(comentario, decision, motivo))) onListo()
  }
  const responder = async () => {
    const texto = respuesta?.trim()
    if (texto && (await ejecutar(() => panel.responder(comentario, texto, firma)))) onListo()
  }

  return (
    <li className={clases('tarjeta', 'por-revisar', comentario.urgente && 'por-revisar--urgente')}>
      {comentario.urgente && <span className="insignia insignia--urgente"><Ico icono={WarningCircle} peso="fill" /> Posible riesgo: atender primero</span>}
      <small className="suave">Tema: {comentario.temaTitulo}</small>
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
      <small className="suave">Propuesta de tema{propuesta.nivel && ` · ${propuesta.nivel}`}</small>
      <p className="comentario__texto">{propuesta.texto}</p>
      {error && <p className="aviso-suave">{error}</p>}
      <BotonesDeModeracion ocupado={ocupado} onDecidir={decidir} />
    </li>
  )
}

function ConsejoPorAprobar({ carta, consejo, onCambiar }: { carta: CartaDeEstudiante; consejo: ConsejoDeCarta; onCambiar: (c: ConsejoDeCarta) => void }) {
  const { asistente } = useServicios()
  const [preparando, setPreparando] = useState(false)

  const preparar = useCallback(async () => {
    setPreparando(true)
    try {
      const texto = await pedirConsejoALaIA(asistente, carta)
      if (texto) onCambiar({ texto, de: 'ia' })
    } catch {
      // Sin IA: psicología puede escribirlo a mano o aprobar sin consejo.
    } finally {
      setPreparando(false)
    }
  }, [asistente, carta, onCambiar])

  useEffect(() => { if (!carta.urgente) preparar() }, [carta.urgente, preparar])

  return (
    <label className="consejo-por-aprobar">
      <span><Ico icono={Heart} /> Consejo para los papás (se publica debajo de la carta)</span>
      <textarea
        rows={5}
        value={consejo.texto}
        placeholder={preparando ? 'La IA está preparando una sugerencia…' : 'Escribe un consejo corto, o déjalo vacío para publicar la carta sola.'}
        onChange={(e) => onCambiar({ texto: e.target.value, de: 'psicologia' })}
      />
      <small className="suave">
        {consejo.de === 'ia' && consejo.texto ? 'Lo preparó la IA: léelo y cámbialo si quieres. Si lo editas, se publica como consejo de psicología.' : ''}
        {' '}<button type="button" className="enlace-discreto" disabled={preparando} onClick={preparar}>{preparando ? 'Preparando…' : <><Ico icono={Sparkle} /> Pedir otra sugerencia a la IA</>}</button>
      </small>
    </label>
  )
}

function TemaDeLaCarta({ carta, carga, onCambiar }: { carta: CartaDeEstudiante; carga?: string; onCambiar: (id: string) => void }) {
  const { asistente } = useServicios()
  const [clasificando, setClasificando] = useState(carta.carga === CARGA_POR_CLASIFICAR)
  const [sugerida, setSugerida] = useState<string>()

  useEffect(() => {
    if (carta.carga !== CARGA_POR_CLASIFICAR) return
    let vigente = true
    clasificarCarta(asistente, carta.texto, cargas)
      .then((id) => { if (vigente && id) { setSugerida(id); onCambiar(id) } })
      .catch(() => {})
      .finally(() => vigente && setClasificando(false))
    return () => { vigente = false }
  }, [asistente, carta, onCambiar])

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
  const elegirTema = useCallback((id: string) => {
    setCarga(id)
    setFalta(false)
  }, [])

  const decidir = async (decision: Decision, motivo?: string) => {
    if (decision === 'aprobado' && !carga) return setFalta(true)
    if (await ejecutar(() => panel.moderarCarta(carta, decision, motivo, consejo, carga))) onListo()
  }

  return (
    <li className={clases('tarjeta', 'por-revisar', carta.urgente && 'por-revisar--urgente')}>
      {carta.urgente && <span className="insignia insignia--urgente"><Ico icono={WarningCircle} peso="fill" /> Posible riesgo: el estudiante vio las líneas de ayuda</span>}
      <small className="suave"><Ico icono={Envelope} /> Carta de estudiante · {carta.nivel} · {carta.carga === CARGA_POR_CLASIFICAR ? 'escrita en el bolsillo secreto' : `tema: ${tituloDeCarga(carta.carga)}`}</small>
      <p className="comentario__texto">{carta.texto}</p>
      <small className="suave">Revisa que no tenga nombres, grados, secciones ni datos que permitan reconocer a alguien.</small>
      <TemaDeLaCarta carta={carta} carga={carga} onCambiar={elegirTema} />
      {falta && <p className="aviso-suave">Elige el tema antes de aprobar.</p>}
      <ConsejoPorAprobar carta={carta} consejo={consejo} onCambiar={setConsejo} />
      {error && <p className="aviso-suave">{error}</p>}
      <BotonesDeModeracion ocupado={ocupado} motivos={MOTIVOS_DE_RECHAZO_DE_CARTA} onDecidir={decidir} />
    </li>
  )
}

export function Revisar({ psicologo }: { psicologo: Psicologo }) {
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
        {datos?.comentarios.map((c) => <ComentarioPorRevisar key={c.id} comentario={c} psicologo={psicologo} onListo={recargar} />)}
        {datos?.cartas.map((c) => <CartaPorRevisar key={c.id} carta={c} onListo={recargar} />)}
        {datos?.propuestas.map((p) => <PropuestaPorRevisar key={p.id} propuesta={p} onListo={recargar} />)}
      </ul>
    </section>
  )
}
