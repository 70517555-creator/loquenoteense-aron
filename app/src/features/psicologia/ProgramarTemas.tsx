import { useCallback, useState, type FormEvent } from 'react'
import { useServicios } from '../../app/servicios'
import type { Propuesta, TemaDelDia } from '../../domain/foro'
import { useAccion } from '../../hooks/useAccion'
import { useConsulta } from '../../hooks/useConsulta'
import { Cargando } from '../../ui/Cargando'
import { fechaDeHoy, fechaLegible } from '../../utils/tiempo'

interface Borrador {
  titulo: string
  descripcion: string
  fecha: string
  propuesta?: Propuesta
}

const borradorVacio = (): Borrador => ({ titulo: '', descripcion: '', fecha: fechaDeHoy() })

function useDatosDeTemas() {
  const { panel } = useServicios()
  const programados = useConsulta(useCallback(() => panel.temasProgramados(fechaDeHoy()), [panel]))
  const propuestas = useConsulta(useCallback(() => panel.propuestasAprobadas(), [panel]))
  const recargar = () => {
    programados.recargar()
    propuestas.recargar()
  }
  return { programados, propuestas, recargar }
}

function FormularioDeTema({ borrador, onCambiar, onGuardado }: { borrador: Borrador; onCambiar: (b: Borrador) => void; onGuardado: () => void }) {
  const { panel } = useServicios()
  const { ocupado, error, ejecutar } = useAccion()

  const guardar = async (e: FormEvent) => {
    e.preventDefault()
    const tema = { titulo: borrador.titulo.trim(), descripcion: borrador.descripcion.trim(), fecha: borrador.fecha }
    if (!tema.titulo || !tema.fecha) return
    if (await ejecutar(() => panel.programarTema(tema, borrador.propuesta))) onGuardado()
  }

  return (
    <form className="tarjeta formulario-foro" onSubmit={guardar}>
      <h3 className="titulo-tarjeta">Programar un tema del día</h3>
      {borrador.propuesta && <small className="suave">Basado en una propuesta de los padres ({borrador.propuesta.votos} votos)</small>}
      <label>
        Fecha
        <input type="date" min={fechaDeHoy()} value={borrador.fecha} onChange={(e) => onCambiar({ ...borrador, fecha: e.target.value })} />
      </label>
      <input placeholder="Título del tema" value={borrador.titulo} maxLength={120} onChange={(e) => onCambiar({ ...borrador, titulo: e.target.value })} />
      <textarea
        rows={3}
        placeholder="Una pregunta o idea para abrir la conversación"
        value={borrador.descripcion}
        maxLength={400}
        onChange={(e) => onCambiar({ ...borrador, descripcion: e.target.value })}
      />
      {error && <p className="aviso-suave">{error}</p>}
      <button className="boton" disabled={ocupado || !borrador.titulo.trim()}>Programar</button>
    </form>
  )
}

function TemaProgramado({ tema, onBorrado }: { tema: TemaDelDia; onBorrado: () => void }) {
  const { panel } = useServicios()
  const { ocupado, ejecutar } = useAccion()
  const borrar = async () => {
    if (confirm(`¿Quitar el tema "${tema.titulo}"?`) && (await ejecutar(() => panel.borrarTema(tema)))) onBorrado()
  }
  return (
    <li className="tarjeta tema-anterior">
      <small className="suave">{fechaLegible(tema.fecha)}</small>
      <b>{tema.titulo}</b>
      <button className="enlace-discreto" disabled={ocupado} onClick={borrar}>Quitar</button>
    </li>
  )
}

export function ProgramarTemas() {
  const { programados, propuestas, recargar } = useDatosDeTemas()
  const [borrador, setBorrador] = useState(borradorVacio)

  const alGuardar = () => {
    setBorrador(borradorVacio())
    recargar()
  }
  const usarPropuesta = (propuesta: Propuesta) => setBorrador({ ...borrador, titulo: propuesta.texto, propuesta })
  const sinProgramar = propuestas.datos?.filter((p) => !p.fechaProgramada) ?? []

  return (
    <section className="conversacion">
      <FormularioDeTema borrador={borrador} onCambiar={setBorrador} onGuardado={alGuardar} />

      <h3 className="titulo-tarjeta">Próximos temas</h3>
      {programados.cargando && !programados.datos && <Cargando />}
      {programados.datos?.length === 0 && <p className="suave">No hay temas programados. Si un día no hay tema, se muestra uno de reserva.</p>}
      <ul className="lista-panel">
        {programados.datos?.map((t) => <TemaProgramado key={t.id} tema={t} onBorrado={recargar} />)}
      </ul>

      <h3 className="titulo-tarjeta">Propuestas de los padres más votadas</h3>
      {sinProgramar.length === 0 && <p className="suave">Aún no hay propuestas aprobadas sin programar.</p>}
      <ul className="lista-panel">
        {sinProgramar.map((p) => (
          <li key={p.id} className="tarjeta tema-anterior">
            <small className="suave">👍 {p.votos}{p.nivel && ` · ${p.nivel}`}</small>
            <b>{p.texto}</b>
            <button className="enlace-discreto" onClick={() => usarPropuesta(p)}>Usar como tema</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
