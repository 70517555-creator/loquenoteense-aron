import { Link } from 'react-router-dom'
import type { Reto } from '../../domain/tipos'
import { useContenido } from '../../hooks/useContenido'
import { useSeleccionEnUrl } from '../../hooks/useSeleccionEnUrl'
import { AnteriorSiguiente } from '../../ui/AnteriorSiguiente'
import { Cargando } from '../../ui/Cargando'
import { Encabezado } from '../../ui/Encabezado'
import { Icono } from '../../ui/Icono'
import { Ilustracion } from '../../ui/Ilustracion'
import { clases } from '../../utils/clases'
import { indiceCircular } from '../../utils/listas'
import { diaDelAnio } from '../../utils/tiempo'
import { Reloj } from './Reloj'
import { useProgresoDeRetos } from './useProgresoDeRetos'

const LARGO_MAXIMO_DE_NOTA = 800

type Progreso = ReturnType<typeof useProgresoDeRetos>

function ListaDePasos({ reto, progreso }: { reto: Reto; progreso: Progreso }) {
  return (
    <ul className="lista-pasos">
      {reto.pasos.map((paso, i) => (
        <li key={paso}>
          <label className="paso">
            <input
              type="checkbox"
              checked={progreso.pasoMarcado(reto.id, i)}
              onChange={(e) => progreso.marcarPaso(reto.id, i, e.target.checked)}
            />
            <span>{paso}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}

function Reflexion({ reto, progreso }: { reto: Reto; progreso: Progreso }) {
  return (
    <label className="reflexion">
      <span className="mano">¿Cómo te sentiste? ¿Qué descubriste?</span>
      <textarea
        rows={3}
        maxLength={LARGO_MAXIMO_DE_NOTA}
        value={progreso.notaDe(reto.id)}
        onChange={(e) => progreso.guardarNota(reto.id, e.target.value)}
        placeholder="Escribe aquí… (solo se guarda en tu celular)"
      />
    </label>
  )
}

function TarjetaDeReto({ retos }: { retos: Reto[] }) {
  const progreso = useProgresoDeRetos()
  const retoDelDia = indiceCircular(diaDelAnio(), retos.length)
  const { actual: reto, elegidoEnUrl, anterior, siguiente } = useSeleccionEnUrl(retos, 'r', retoDelDia)
  if (!reto) return <Cargando />

  const cumplido = progreso.estaCumplido(reto.id)

  return (
    <>
      <p className="suave centrado">
        🏆 Retos cumplidos: <b>{progreso.totalCumplidos}</b> de {retos.length}
      </p>
      <div className="tarjeta">
        <AnteriorSiguiente onAnterior={anterior} onSiguiente={siguiente} etiquetaAnterior="Reto anterior" etiquetaSiguiente="Reto siguiente">
          <h2 className="mano titulo-grande centrado sin-margen">{elegidoEnUrl ? 'Reto' : 'Reto de hoy'}</h2>
        </AnteriorSiguiente>

        <Ilustracion key={`imagen-${reto.id}`} src={`/images/retos/${reto.id}.webp`} className="escena" respaldo={null} />
        <h3 className="mano titulo-pregunta centrado">{reto.titulo}</h3>
        <p className="suave centrado">{reto.descripcion}</p>
        <Reloj key={`reloj-${reto.id}`} minutos={reto.minutos} />
        <ListaDePasos reto={reto} progreso={progreso} />
        <Reflexion reto={reto} progreso={progreso} />

        <div className="fila">
          <button className={clases('boton', cumplido && 'boton--exito')} onClick={() => progreso.alternarCumplido(reto.id)}>
            <Icono nombre="check" tam={18} /> {cumplido ? 'Reto cumplido' : 'Marcar como cumplido'}
          </button>
          <Link className="boton boton--borde" to="/recursos">Ver preguntas sugeridas</Link>
        </div>
      </div>
    </>
  )
}

export default function Retos() {
  const retos = useContenido('retos')
  return (
    <main>
      <Encabezado titulo="Retos en familia" icono="trophy" />
      <div className="contenedor">{retos ? <TarjetaDeReto retos={retos} /> : <Cargando />}</div>
    </main>
  )
}
