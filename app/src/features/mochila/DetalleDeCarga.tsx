import { ChartBar, ChatCircleText, ChatsCircle, Door, DoorOpen, HandPalm, Heart, MagnifyingGlass } from '@phosphor-icons/react'
import { Ico } from '../../ui/Ico'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FUENTE_DE_LOS_DATOS } from '../../content/cargas'
import type { CargaDelHijo, RespuestaPosible } from '../../domain/tipos'
import { clases } from '../../utils/clases'
import { rotar } from '../../utils/listas'
import { CartasDeEstudiantes, InvitacionAEscribir } from './CartasDeEstudiantes'
import { EncuestaDeCasa } from './EncuestaDeCasa'
import { RetoDeHoy } from './RetoDeHoy'

function estadoDeRespuesta(respuesta: RespuestaPosible, elegida?: RespuestaPosible) {
  if (!elegida) return undefined
  if (respuesta === elegida) return respuesta.abre ? 'opcion--mejor' : 'opcion--elegida'
  return 'opcion--apagada'
}

function QueLeDirias({ situacion, orden }: { situacion: CargaDelHijo['situacion']; orden: number }) {
  const respuestas = rotar(situacion.respuestas, orden)
  const [elegida, setElegida] = useState<RespuestaPosible>()

  return (
    <section className="carga__bloque">
      <h3 className="carga__subtitulo"><Ico icono={ChatCircleText} /> ¿Qué le dirías?</h3>
      <p className="carga__escena">{situacion.frase}</p>
      <div role="radiogroup" aria-label="Respuestas posibles">
        {respuestas.map((respuesta) => (
          <button
            key={respuesta.texto}
            role="radio"
            aria-checked={respuesta === elegida}
            className={clases('opcion', estadoDeRespuesta(respuesta, elegida))}
            disabled={!!elegida && respuesta !== elegida}
            onClick={() => setElegida(respuesta)}
          >
            {respuesta.texto}
          </button>
        ))}
      </div>
      {elegida && (
        <div className={clases('retro', 'reaccion', elegida.abre && 'reaccion--abre')} aria-live="polite">
          <b>{elegida.abre ? <><Ico icono={DoorOpen} /> Esta respuesta abre la puerta.</> : <><Ico icono={Door} /> Esta respuesta cierra la puerta.</>}</b>
          <p className="reaccion__voz">Así se sentiría tu hijo: “{elegida.reaccion}”</p>
          <button className="enlace-discreto" onClick={() => setElegida(undefined)}>
            {elegida.abre ? 'Ver las otras respuestas' : 'Probar otra respuesta'}
          </button>
        </div>
      )}
    </section>
  )
}

export function DetalleDeCarga({ carga, orden }: { carga: CargaDelHijo; orden: number }) {
  return (
    <article className="carga">
      <h2 className="mano titulo-tarjeta">{carga.titulo}</h2>
      <blockquote className="carga__voz">
        “{carga.voz}”
        <small>Lo que tu hijo quizá no te dice</small>
      </blockquote>

      <CartasDeEstudiantes carga={carga.id} />

      <section className="carga__bloque">
        <h3 className="carga__subtitulo"><Ico icono={MagnifyingGlass} /> Lo que pasa</h3>
        <p>{carga.loQuePasa}</p>
        <div className="dato-real">
          <b><Ico icono={ChartBar} /> Lo que nos contaron en el colegio</b>
          <p>{carga.dato}</p>
          <small className="suave">{FUENTE_DE_LOS_DATOS}</small>
        </div>
      </section>

      <QueLeDirias key={carga.id} situacion={carga.situacion} orden={orden} />

      <section className="carga__bloque carga__frases">
        <div className="frases frases--evita">
          <h3 className="carga__subtitulo"><Ico icono={HandPalm} /> Mejor evita</h3>
          <ul>{carga.evita.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
        <div className="frases frases--prueba">
          <h3 className="carga__subtitulo"><Ico icono={Heart} /> Prueba decir</h3>
          <ul>{carga.prueba.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      </section>

      <RetoDeHoy carga={carga.id} reto={carga.reto} />

      <EncuestaDeCasa carga={carga.id} />
      <InvitacionAEscribir />

      <Link className="boton boton--borde carga__foro" to="/foro"><Ico icono={ChatsCircle} /> Conversa con otras familias en el foro</Link>
    </article>
  )
}
