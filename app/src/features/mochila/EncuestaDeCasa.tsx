import { useCallback, useState } from 'react'
import { useServicios } from '../../app/servicios'
import {
  CONTEO_VACIO, MINIMO_PARA_PORCENTAJE, OPCIONES_DE_CASA, lesPasa, totalDe, type ConteoDeCasa, type RespuestaDeCasa,
} from '../../domain/mochila'
import { useAccion } from '../../hooks/useAccion'
import { useConsulta } from '../../hooks/useConsulta'
import { porcentaje } from '../../utils/listas'

function Resultado({ conteo, miRespuesta }: { conteo: ConteoDeCasa; miRespuesta: RespuestaDeCasa }) {
  const total = totalDe(conteo)
  if (total < MINIMO_PARA_PORCENTAJE) {
    return (
      <p className="encuesta__nota">
        💛 Gracias. {total === 1 ? <>Eres la <b>primera familia</b> en responder.</> : <>Eres de las primeras <b>{total}</b> familias en responder.</>}
        {' '}Cuando seamos más, aquí verás lo que se vive en las casas del colegio.
      </p>
    )
  }
  return (
    <>
      <p className="encuesta__titular">
        <b>{Math.round(porcentaje(lesPasa(conteo), total))} %</b> de las familias dicen que esto les pasa en casa
      </p>
      <ul className="encuesta__barras">
        {OPCIONES_DE_CASA.map(({ valor, texto }) => {
          const parte = Math.round(porcentaje(conteo[valor], total))
          return (
            <li key={valor} className={valor === miRespuesta ? 'encuesta__mia' : undefined}>
              <span>{texto}{valor === miRespuesta && ' (tú)'}</span>
              <span className="encuesta__barra"><span style={{ width: `${parte}%` }} /></span>
              <b>{parte} %</b>
            </li>
          )
        })}
      </ul>
      <small className="suave">{total} familias del Cristo Moreno respondieron. No estás solo/a.</small>
    </>
  )
}

export function EncuestaDeCasa({ carga }: { carga: string }) {
  const { mochila } = useServicios()
  const { datos, cargando, fallo } = useConsulta(useCallback(() => mochila.resultadoDeCasa(carga), [mochila, carga]))
  const { ocupado, error, ejecutar } = useAccion()
  const [respondida, setRespondida] = useState<RespuestaDeCasa>()
  const miRespuesta = datos?.miRespuesta ?? respondida
  const conteo = datos?.conteo ?? CONTEO_VACIO
  const conteoFinal = respondida && !datos?.miRespuesta ? { ...conteo, [respondida]: conteo[respondida] + 1 } : conteo

  const responder = async (respuesta: RespuestaDeCasa) => {
    if (await ejecutar(() => mochila.responderDeCasa(carga, respuesta))) setRespondida(respuesta)
  }

  return (
    <section className="carga__bloque encuesta">
      <h3 className="carga__subtitulo">🏠 ¿Esto te pasa en casa?</h3>
      {fallo && !datos ? (
        <p className="suave">No pudimos cargar lo que responden otras familias. Revisa tu internet o inténtalo más tarde.</p>
      ) : miRespuesta ? (
        <Resultado conteo={conteoFinal} miRespuesta={miRespuesta} />
      ) : (
        <>
          <div className="encuesta__opciones">
            {OPCIONES_DE_CASA.map(({ valor, texto }) => (
              <button key={valor} className="boton boton--borde" disabled={ocupado || cargando} onClick={() => responder(valor)}>
                {texto}
              </button>
            ))}
          </div>
          <small className="suave">Es anónimo. Responde y mira qué dicen las demás familias.</small>
          {error && <p className="aviso-suave">{error}</p>}
        </>
      )}
    </section>
  )
}
