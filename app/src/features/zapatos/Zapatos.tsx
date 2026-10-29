import { Link } from 'react-router-dom'
import type { Escenario } from '../../domain/tipos'
import { useContenido } from '../../hooks/useContenido'
import { BarraDeProgreso } from '../../ui/BarraDeProgreso'
import { Cargando } from '../../ui/Cargando'
import { EscenaCuarto } from '../../ui/Dibujos'
import { Encabezado } from '../../ui/Encabezado'
import { Icono } from '../../ui/Icono'
import { Ilustracion } from '../../ui/Ilustracion'
import { clases } from '../../utils/clases'
import { useCuestionario } from './useCuestionario'

const LETRAS = 'ABCDEFG'

type Cuestionario = ReturnType<typeof useCuestionario>

function estadoDeOpcion(opcion: number, mejor: number, eleccion: number | null) {
  if (eleccion === null) return undefined
  if (opcion === mejor) return 'opcion--mejor'
  if (opcion === eleccion) return 'opcion--elegida'
  return 'opcion--apagada'
}

function Opciones({ escenario, cuestionario }: { escenario: Escenario; cuestionario: Cuestionario }) {
  const { eleccion, respondio, elegir } = cuestionario
  return (
    <div role="radiogroup" aria-label="Opciones">
      {escenario.opciones.map((opcion, i) => (
        <button
          key={i}
          role="radio"
          aria-checked={eleccion === i}
          className={clases('opcion', estadoDeOpcion(i, escenario.mejor, eleccion))}
          onClick={() => elegir(i)}
          disabled={respondio && i !== eleccion && i !== escenario.mejor}
        >
          <span className="opcion__letra">{LETRAS[i]}</span>
          <span>{opcion.texto}</span>
        </button>
      ))}
    </div>
  )
}

function Retroalimentacion({ escenario, eleccion }: { escenario: Escenario; eleccion: number }) {
  const acerto = eleccion === escenario.mejor
  return (
    <div className="retro" aria-live="polite">
      <b>{acerto ? '💛 Buena elección. ' : '🤔 Piénsalo otra vez. '}</b>
      {escenario.opciones[eleccion].feedback}
      {!acerto && (
        <p className="retro__extra">
          <b>Lo que suele funcionar:</b> {escenario.opciones[escenario.mejor].feedback}
        </p>
      )}
    </div>
  )
}

function Resultado({ cuestionario }: { cuestionario: Cuestionario }) {
  const { aciertos, total, mejorResultado, reiniciar } = cuestionario
  return (
    <div className="tarjeta centrado">
      <h2 className="mano titulo-grande">¡Terminaste! 🎉</h2>
      <p>
        Elegiste la respuesta que más abre el diálogo en <b>{aciertos} de {total}</b> situaciones.
      </p>
      <p className="suave">No es un examen: es un espejo. Mira qué dijeron los estudiantes.</p>
      <div className="fila">
        <Link className="boton" to="/voces">Ver voces reales <Icono nombre="arrow" tam={18} /></Link>
        <button className="boton boton--borde" onClick={reiniciar}>Repetir</button>
      </div>
      {mejorResultado > 0 && <p className="suave">Tu mejor resultado: {mejorResultado} de {total}</p>}
    </div>
  )
}

function Cuestionario({ escenarios }: { escenarios: Escenario[] }) {
  const cuestionario = useCuestionario(escenarios)
  const { escenario, paso, total, eleccion, respondio, continuar } = cuestionario
  if (!escenario) return <Resultado cuestionario={cuestionario} />

  return (
    <>
      <Ilustracion key={escenario.id} src={`/images/zapatos/${escenario.id}.webp`} className="escena" respaldo={<EscenaCuarto />} />
      <BarraDeProgreso avance={paso} total={total} className="barra-progreso--espaciada" />
      <p className="suave">Situación {paso + 1} de {total}</p>
      <h2 className="mano titulo-pregunta">{escenario.pregunta}</h2>
      <Opciones escenario={escenario} cuestionario={cuestionario} />
      {eleccion !== null && <Retroalimentacion escenario={escenario} eleccion={eleccion} />}
      <div className="fila">
        <button className="boton" onClick={continuar} disabled={!respondio}>
          Continuar <Icono nombre="arrow" tam={18} />
        </button>
      </div>
    </>
  )
}

export default function Zapatos() {
  const escenarios = useContenido('escenarios')
  return (
    <main>
      <Encabezado titulo="Ponte en mis zapatos" icono="shoe" />
      <div className="contenedor">{escenarios ? <Cuestionario escenarios={escenarios} /> : <Cargando />}</div>
    </main>
  )
}
