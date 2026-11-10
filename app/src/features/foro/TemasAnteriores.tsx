import { Archive, CalendarBlank, ChatsCircle } from '@phosphor-icons/react'
import { useState } from 'react'
import type { TemaDelDia } from '../../domain/foro'
import { Cargando } from '../../ui/Cargando'
import { Ico } from '../../ui/Ico'
import { Icono } from '../../ui/Icono'
import { fechaLegible } from '../../utils/tiempo'
import { ConversacionDelTema } from './ConversacionDelTema'
import { useSemanasAnteriores, useTemasAnteriores, type SemanaArchivada } from './useForo'

interface Elegido {
  tema: TemaDelDia
  etiqueta: string
}

const semanaDel = (lunes: string) => `Semana del ${fechaLegible(lunes).replace(/^lunes,?\s*/i, '')}`
const comentarios = (n: number) => `${n} ${n === 1 ? 'comentario' : 'comentarios'}`

function PreguntasPasadas({ onElegir }: { onElegir: (e: Elegido) => void }) {
  const { datos: semanas, cargando, fallo } = useSemanasAnteriores()
  if (fallo) return <p className="aviso-suave">No pudimos cargar las preguntas pasadas. Revisa tu conexión.</p>
  if (cargando && !semanas) return <Cargando />
  if (!semanas?.length) return <p className="suave">Aquí se guardarán las preguntas de cada semana con sus respuestas.</p>
  return (
    <ul className="temas-anteriores archivo">
      {semanas.map(({ tema, publicados }: SemanaArchivada) => (
        <li key={tema.id}>
          <button className="tarjeta tema-anterior archivo__semana" onClick={() => onElegir({ tema, etiqueta: semanaDel(tema.fecha) })}>
            <small className="archivo__fecha"><Ico icono={CalendarBlank} /> {semanaDel(tema.fecha)}</small>
            <b>{tema.titulo}</b>
            <span className="archivo__cuantos"><Ico icono={ChatsCircle} /> {comentarios(publicados)}</span>
            <Icono nombre="next" tam={18} />
          </button>
        </li>
      ))}
    </ul>
  )
}

function TemasDeDias({ onElegir }: { onElegir: (e: Elegido) => void }) {
  const { datos: temas, cargando, fallo } = useTemasAnteriores()
  if (fallo) return <p className="aviso-suave">No pudimos cargar los temas. Revisa tu conexión.</p>
  if (cargando && !temas) return <Cargando />
  if (!temas?.length) return null
  return (
    <>
      <h2 className="mano titulo-tarjeta sin-margen archivo__subtitulo">Temas de días anteriores</h2>
      <ul className="temas-anteriores">
        {temas.map((tema) => (
          <li key={tema.id}>
            <button className="tarjeta tema-anterior" onClick={() => onElegir({ tema, etiqueta: 'Tema anterior' })}>
              <small className="suave">{fechaLegible(tema.fecha)}</small>
              <b>{tema.titulo}</b>
              <Icono nombre="next" tam={18} />
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

// El archivo del foro: las preguntas de semanas pasadas (con las respuestas de las familias y de psicología) y los temas de otros días.
export function TemasAnteriores() {
  const [elegido, setElegido] = useState<Elegido>()

  if (elegido) {
    return (
      <>
        <button className="boton boton--borde archivo__volver" onClick={() => setElegido(undefined)}>
          <Icono nombre="back" tam={18} /> Volver al archivo
        </button>
        <ConversacionDelTema tema={elegido.tema} etiqueta={elegido.etiqueta} />
      </>
    )
  }
  return (
    <section className="archivo-del-foro">
      <h2 className="mano titulo-tarjeta sin-margen"><Ico icono={Archive} /> Preguntas de semanas pasadas</h2>
      <PreguntasPasadas onElegir={setElegido} />
      <TemasDeDias onElegir={setElegido} />
    </section>
  )
}
