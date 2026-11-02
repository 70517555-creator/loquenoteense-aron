import { Link, useSearchParams } from 'react-router-dom'
import { useEnLinea } from '../../hooks/useEnLinea'
import { useSeleccionEnUrl } from '../../hooks/useSeleccionEnUrl'
import { Cargando } from '../../ui/Cargando'
import { Encabezado } from '../../ui/Encabezado'
import { Fichas } from '../../ui/Fichas'
import { ConversacionDelTema } from './ConversacionDelTema'
import { PropuestasDeTemas } from './PropuestasDeTemas'
import { TemasAnteriores } from './TemasAnteriores'
import { PARAMETRO_RESPONDER, usePreguntaDeLaSemana, useTemaDeHoy } from './useForo'

function TemaDeHoy() {
  const { datos: tema, fallo } = useTemaDeHoy()
  if (fallo) return <p className="aviso-suave">No pudimos cargar el tema de hoy. Revisa tu conexión.</p>
  if (!tema) return <Cargando />
  return <ConversacionDelTema tema={tema} etiqueta="Tema de hoy" />
}

function PreguntaDeLaSemana() {
  const { datos: pregunta, fallo } = usePreguntaDeLaSemana()
  const [params] = useSearchParams()
  if (fallo) return <p className="aviso-suave">No pudimos cargar la pregunta de la semana. Revisa tu conexión.</p>
  if (!pregunta) return <Cargando />
  return <ConversacionDelTema tema={pregunta} etiqueta="📌 Pregunta de la semana" autor="💬 Psicología pregunta" enfocar={params.has(PARAMETRO_RESPONDER)} />
}

const SECCIONES = [
  { id: 'semana', titulo: 'Pregunta de la semana', Contenido: PreguntaDeLaSemana },
  { id: 'hoy', titulo: 'Tema de hoy', Contenido: TemaDeHoy },
  { id: 'propuestas', titulo: 'Temas propuestos', Contenido: PropuestasDeTemas },
  { id: 'anteriores', titulo: 'Anteriores', Contenido: TemasAnteriores },
]

export default function Foro() {
  const enLinea = useEnLinea()
  const { indice, ir } = useSeleccionEnUrl(SECCIONES, 'seccion')
  const { Contenido } = SECCIONES[indice]

  return (
    <main>
      <Encabezado titulo="Entre padres" icono="chat" />
      <div className="contenedor foro">
        <Fichas etiqueta="Secciones del foro" opciones={SECCIONES.map((s) => s.titulo)} activa={indice} onCambiar={ir} />
        {enLinea ? <Contenido /> : <p className="aviso-suave">Para conversar en el foro necesitas internet.</p>}
        <p className="suave centrado">
          🔒 Un espacio anónimo para compartir y aprender entre familias, acompañados por psicología del colegio.
        </p>
        <p className="foro__equipo">
          <Link to="/privacidad#normas-del-foro">Normas del foro y privacidad</Link>
          <br />
          ¿Eres del equipo de psicología? <Link to="/psicologia">Entrar al panel</Link>
        </p>
      </div>
    </main>
  )
}
