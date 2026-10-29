import { Link } from 'react-router-dom'
import type { Tendencia } from '../../domain/tipos'
import { useContenido } from '../../hooks/useContenido'
import { useSeleccionEnUrl } from '../../hooks/useSeleccionEnUrl'
import { Cargando } from '../../ui/Cargando'
import { ArteIcono } from '../../ui/Dibujos'
import { Encabezado } from '../../ui/Encabezado'
import { Fichas } from '../../ui/Fichas'
import { Icono } from '../../ui/Icono'
import { Ilustracion } from '../../ui/Ilustracion'

function FichaDeTendencia({ tendencia }: { tendencia: Tendencia }) {
  return (
    <article className="tarjeta">
      <Ilustracion
        key={tendencia.id}
        src={`/images/mundo/${tendencia.id}.webp`}
        className="escena"
        respaldo={<ArteIcono icono={tendencia.icono} />}
      />
      <h2 className="mano titulo-grande">{tendencia.titulo}</h2>

      <h3 className="mano subtitulo">Lo que quizá ves…</h3>
      <ul>{tendencia.loQueVes.map((texto) => <li key={texto}>{texto}</li>)}</ul>

      <h3 className="mano subtitulo">Lo que ellos cuentan…</h3>
      <ul>{tendencia.loQueCuentan.map((texto) => <li key={texto}>“{texto}”</li>)}</ul>

      <h3 className="mano subtitulo">Cómo acompañar</h3>
      <ul className="lista-check">
        {tendencia.comoAcompanar.map((texto) => (
          <li key={texto}><Icono nombre="check" tam={16} /> {texto}</li>
        ))}
      </ul>

      <div className="retro retro--rosa">{tendencia.pregunta}</div>
      <Link className="boton boton--borde" to="/asistente?modo=significa">
        <Icono nombre="spark" tam={18} /> ¿Escuchaste una palabra que no entiendes?
      </Link>
    </article>
  )
}

function Tendencias({ tendencias }: { tendencias: Tendencia[] }) {
  const { indice, actual, ir } = useSeleccionEnUrl(tendencias, 't')
  if (!actual) return <Cargando />
  return (
    <>
      <Fichas etiqueta="Tema" opciones={tendencias.map((t) => t.titulo)} activa={indice} onCambiar={ir} />
      <FichaDeTendencia tendencia={actual} />
    </>
  )
}

export default function Mundo() {
  const tendencias = useContenido('tendencias')
  return (
    <main>
      <Encabezado titulo="El mundo de hoy" icono="globe" />
      <div className="contenedor">{tendencias ? <Tendencias tendencias={tendencias} /> : <Cargando />}</div>
    </main>
  )
}
