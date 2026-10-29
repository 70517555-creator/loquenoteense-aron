import { Link } from 'react-router-dom'
import { useServicios } from '../../app/servicios'
import { useInstalar } from '../../hooks/useInstalar'
import { Icono } from '../../ui/Icono'
import { Logo } from '../../ui/Logo'
import { FotoPortada } from './FotoPortada'
import { fraseDeLaVisita } from './fraseDeLaVisita'
import { useVideoDeBienvenida } from './useVideoDeBienvenida'
import { VideoBienvenida } from './VideoBienvenida'

const ACCESOS_DIRECTOS = [
  { ruta: '/explorar', texto: 'Explorar' },
  { ruta: '/retos', texto: 'Retos' },
  { ruta: '/voces', texto: 'Voces' },
  { ruta: '/mundo', texto: 'Tendencias' },
]

function MenuSuperior() {
  return (
    <header className="portada__barra">
      <Logo />
      <nav className="portada__menu" aria-label="Secciones">
        {ACCESOS_DIRECTOS.map((acceso) => (
          <Link key={acceso.ruta} to={acceso.ruta}>{acceso.texto}</Link>
        ))}
      </nav>
    </header>
  )
}

function InvitacionAInstalar() {
  const { puedeInstalar, mostrarAyudaIPhone, instalar } = useInstalar()
  if (puedeInstalar) {
    return (
      <button className="boton boton--fantasma" onClick={instalar}>
        <Icono nombre="download" tam={18} /> Instalar en mi celular
      </button>
    )
  }
  if (mostrarAyudaIPhone) {
    return (
      <p className="portada__ios">
        En iPhone: toca <b>Compartir</b> y luego <b>“Agregar a inicio”</b>.
      </p>
    )
  }
  return null
}

export default function Inicio() {
  const { progreso } = useServicios()
  const { video, abierto, abrir, cerrar } = useVideoDeBienvenida()

  return (
    <main className="portada">
      {video && abierto && <VideoBienvenida video={video} onCerrar={cerrar} />}
      <FotoPortada />
      <div className="portada__velo" />
      <MenuSuperior />

      <section className="portada__heroe">
        <p className="nota-pegada">{fraseDeLaVisita(progreso)}</p>
        <h1 className="portada__titulo">Lo que no te enseñaron</h1>
        <p className="portada__bajada">Un espacio para entender, escuchar y construir juntos.</p>
        <div className="portada__acciones">
          <Link to="/casa" className="boton boton--claro boton--grande">
            Comenzar <Icono nombre="arrow" tam={20} />
          </Link>
          {video && (
            <button className="boton boton--fantasma" onClick={abrir}>
              <Icono nombre="play" tam={18} /> Ver video
            </button>
          )}
        </div>
        <p className="portada__nota-chica">Situaciones reales. Voces de estudiantes. Retos para tu familia.</p>
        <InvitacionAInstalar />
      </section>

      <p className="portada__lema">Diferentes miradas, un mismo amor ♡</p>
    </main>
  )
}
