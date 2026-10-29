import { Link } from 'react-router-dom'
import { useEnLinea } from '../../hooks/useEnLinea'
import { useSeleccionEnUrl } from '../../hooks/useSeleccionEnUrl'
import { Cargando } from '../../ui/Cargando'
import { Encabezado } from '../../ui/Encabezado'
import { Fichas } from '../../ui/Fichas'
import { ConversacionDelTema } from './ConversacionDelTema'
import { PropuestasDeTemas } from './PropuestasDeTemas'
import { TemasAnteriores } from './TemasAnteriores'
import { useTemaDeHoy } from './useForo'

function TemaDeHoy() {
  const { datos: tema, fallo } = useTemaDeHoy()
  if (fallo) return <p className="aviso-suave">No pudimos cargar el tema de hoy. Revisa tu conexión.</p>
  if (!tema) return <Cargando />
  return <ConversacionDelTema tema={tema} etiqueta="Tema de hoy" />
}

const SECCIONES = [
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
        <p className="suave">
          Un espacio anónimo para compartir y aprender entre familias, acompañados por psicología del colegio.
        </p>
        <Fichas etiqueta="Secciones del foro" opciones={SECCIONES.map((s) => s.titulo)} activa={indice} onCambiar={ir} />
        {enLinea ? <Contenido /> : <p className="aviso-suave">Para conversar en el foro necesitas internet.</p>}
        <p className="foro__equipo">
          <Link to="/privacidad#normas-del-foro">Normas del foro y privacidad</Link>
          <br />
          ¿Eres del equipo de psicología? <Link to="/psicologia">Entrar al panel</Link>
        </p>
      </div>
    </main>
  )
}
