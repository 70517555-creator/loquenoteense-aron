import { useCallback, useState, type ReactNode } from 'react'
import { useServicios } from '../../app/servicios'
import { tituloDeCarga } from '../../content/cargas'
import { MOTIVOS_DE_RECHAZO, type Comentario, type Decision, type Propuesta, type Psicologo } from '../../domain/foro'
import { MOTIVOS_DE_RECHAZO_DE_CARTA, type CartaDeEstudiante } from '../../domain/mochila'
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
      {comentario.urgente && <span className="insignia insignia--urgente">⚠️ Posible riesgo: atender primero</span>}
      <small className="suave">Tema: {comentario.temaTitulo}</small>
      <b>{comentario.apodo}</b>
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

function CartaPorRevisar({ carta, onListo }: { carta: CartaDeEstudiante; onListo: () => void }) {
  const { panel } = useServicios()
  const { ocupado, error, ejecutar } = useAccion()

  const decidir = async (decision: Decision, motivo?: string) => {
    if (await ejecutar(() => panel.moderarCarta(carta, decision, motivo))) onListo()
  }

  return (
    <li className={clases('tarjeta', 'por-revisar', carta.urgente && 'por-revisar--urgente')}>
      {carta.urgente && <span className="insignia insignia--urgente">⚠️ Posible riesgo: el estudiante vio las líneas de ayuda</span>}
      <small className="suave">✉️ Carta de estudiante · {carta.nivel} · tema: {tituloDeCarga(carta.carga)}</small>
      <p className="comentario__texto">{carta.texto}</p>
      <small className="suave">Revisa que no tenga nombres, grados, secciones ni datos que permitan reconocer a alguien.</small>
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
      {sinPendientes && <p className="suave centrado">🎉 No hay nada por revisar.</p>}
      <ul className="lista-panel">
        {datos?.comentarios.map((c) => <ComentarioPorRevisar key={c.id} comentario={c} psicologo={psicologo} onListo={recargar} />)}
        {datos?.cartas.map((c) => <CartaPorRevisar key={c.id} carta={c} onListo={recargar} />)}
        {datos?.propuestas.map((p) => <PropuestaPorRevisar key={p.id} propuesta={p} onListo={recargar} />)}
      </ul>
    </section>
  )
}
