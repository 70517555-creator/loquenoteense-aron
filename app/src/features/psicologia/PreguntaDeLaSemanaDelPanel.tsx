import { useCallback, useState, type FormEvent } from 'react'
import { useServicios } from '../../app/servicios'
import { useAccion } from '../../hooks/useAccion'
import { useConsulta } from '../../hooks/useConsulta'
import { Cargando } from '../../ui/Cargando'
import { fechaLegible, lunesDeLaSemana } from '../../utils/tiempo'
import { preguntaPreparada } from '../foro/useForo'

export function PreguntaDeLaSemanaDelPanel() {
  const { foro, panel } = useServicios()
  const lunes = lunesDeLaSemana()
  const propia = useConsulta(useCallback(() => foro.preguntaDeLaSemana(lunes), [foro, lunes]))
  const { ocupado, error, ejecutar } = useAccion()
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')

  if (propia.cargando && propia.datos === undefined) return <Cargando />
  const actual = propia.datos ?? preguntaPreparada(lunes)

  const fijar = async (e: FormEvent) => {
    e.preventDefault()
    const pregunta = { titulo: titulo.trim(), descripcion: descripcion.trim() }
    if (!pregunta.titulo) return
    if (await ejecutar(() => panel.fijarPreguntaDeLaSemana(lunes, pregunta))) {
      setTitulo('')
      setDescripcion('')
      propia.recargar()
    }
  }
  const volverALaPreparada = async () => {
    if (confirm('¿Volver a la pregunta preparada para esta semana?') && (await ejecutar(() => panel.quitarPreguntaDeLaSemana(lunes)))) propia.recargar()
  }

  return (
    <form className="tarjeta formulario-foro" onSubmit={fijar}>
      <h3 className="titulo-tarjeta">📌 Pregunta de la semana</h3>
      <small className="suave">
        Se ve fijada arriba del foro desde el {fechaLegible(lunes)}. {propia.datos ? 'La escribió el equipo.' : 'Es una de las 6 preguntas preparadas con la encuesta; cambia sola cada lunes.'}
      </small>
      <div className="tema-anterior">
        <b>{actual.titulo}</b>
        {actual.descripcion && <small className="suave">{actual.descripcion}</small>}
      </div>
      {propia.datos && (
        <button type="button" className="enlace-discreto" disabled={ocupado} onClick={volverALaPreparada}>Volver a la pregunta preparada</button>
      )}
      <input placeholder="Escribir otra pregunta para esta semana" value={titulo} maxLength={120} onChange={(e) => setTitulo(e.target.value)} />
      <textarea rows={2} placeholder="Una línea que invite a responder (opcional)" value={descripcion} maxLength={400} onChange={(e) => setDescripcion(e.target.value)} />
      <small className="suave">Si cambias la pregunta a mitad de semana, los comentarios que ya llegaron se quedan debajo de la nueva.</small>
      {error && <p className="aviso-suave">{error}</p>}
      <button className="boton" disabled={ocupado || !titulo.trim()}>Fijar esta pregunta</button>
    </form>
  )
}
