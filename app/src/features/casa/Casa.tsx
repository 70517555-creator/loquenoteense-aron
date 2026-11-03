import { Link } from 'react-router-dom'
import { asistenteHabitacion, habitaciones } from '../../app/habitaciones'
import { useMomentoDelDia, type Momento } from '../../hooks/useMomentoDelDia'
import { useVisitasDeHoy } from '../../hooks/useVisitasDeHoy'
import { BarraDeProgreso } from '../../ui/BarraDeProgreso'
import { Icono } from '../../ui/Icono'
import { Logo } from '../../ui/Logo'
import { PARAMETRO_ABRIR_VIDEO } from '../inicio/useVideoDeBienvenida'
import { videoDeBienvenida } from '../inicio/youtube'
import { useEpisodioNuevo } from '../podcast/useEpisodioNuevo'
import { AvisoDeEpisodio } from './AvisoDeEpisodio'
import { PreguntaDeLaSemanaEnCasa } from './PreguntaDeLaSemanaEnCasa'
import { Cielo } from './paisaje/Cielo'
import { Suelo } from './paisaje/Suelo'
import { Ventana, VentanaDelAtico } from './Ventana'

const FRASE_SEGUN_MOMENTO: Record<Momento, string> = {
  manana: 'Un nuevo día para acercarte un poquito más.',
  tarde: '¿Ya conversaron hoy? Nunca es tarde.',
  atardecer: 'La mejor hora para una caminata juntos.',
  noche: 'Antes de dormir, una pregunta puede cambiarlo todo.',
}

function Bienvenida({ momento, saludo, recorridas }: { momento: Momento; saludo: string; recorridas: number }) {
  return (
    <header className="casa__cabecera">
      <div className="casa__barra">
        <Logo />
        <span className="casa__enlaces">
          {videoDeBienvenida && (
            <Link to={`/?${PARAMETRO_ABRIR_VIDEO}`} className="casa__video">
              <Icono nombre="play" tam={16} /> Ver video
            </Link>
          )}
          <Link to="/vivido" className="casa__video">🎬 Videos</Link>
        </span>
      </div>
      <p className="casa__saludo mano">
        {saludo}{' '}
        <svg className="casa__corazon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s-8.5-4.9-8.5-11A4.6 4.6 0 0 1 12 7.2 4.6 4.6 0 0 1 20.5 10c0 6.1-8.5 11-8.5 11z" />
        </svg>
        <span className="casa__astro" aria-hidden="true" />
      </p>
      <p className="casa__frase">{FRASE_SEGUN_MOMENTO[momento]}</p>
      <p className="casa__progreso">
        Hoy recorriste <b>{recorridas}</b> de {habitaciones.length} habitaciones
      </p>
      <BarraDeProgreso avance={recorridas} total={habitaciones.length} />
      <AvisoDeEpisodio />
      <PreguntaDeLaSemanaEnCasa />
      <Link to="/privacidad" className="casa__privacidad">Privacidad y normas</Link>
    </header>
  )
}

function Techo() {
  return (
    <div className="techo" aria-hidden="true">
      <span className="chimenea"><i /><i /><i /></span>
      <span className="techo__tejas" />
    </div>
  )
}

function Entrada() {
  return (
    <>
      <div className="zocalo" aria-hidden="true">
        <div className="acceso">
          <span className="farol" />
          <span className="porton porton--cochera"><i /></span>
          <span className="porton porton--peatonal"><i /></span>
          <span className="farol farol--der" />
          <span className="escalon" />
        </div>
      </div>
      <div className="jardin" aria-hidden="true">
        <span className="arbusto" />
        <span className="flor" />
        <span className="flor flor--2" />
        <span className="arbusto arbusto--der" />
        <span className="flor flor--3" />
        <span className="flor flor--4" />
      </div>
    </>
  )
}

export default function Casa() {
  const { momento, saludo } = useMomentoDelDia()
  const { visitadasHoy } = useVisitasDeHoy()
  const fueVisitada = (id: string) => visitadasHoy.includes(id)
  const recorridas = habitaciones.filter((h) => fueVisitada(h.id)).length
  const episodioNuevo = useEpisodioNuevo()

  return (
    <main className={`casa casa--${momento}`}>
      <Cielo momento={momento} />
      <Suelo momento={momento} />
      <Bienvenida momento={momento} saludo={saludo} recorridas={recorridas} />

      <div className="edificio">
        <Techo />
        <VentanaDelAtico habitacion={asistenteHabitacion} />
        <div className="fachada">
          {habitaciones.map((habitacion, i) => (
            <Ventana key={habitacion.id} habitacion={habitacion} posicion={i} visitada={fueVisitada(habitacion.id)} nueva={habitacion.id === 'podcast' && !!episodioNuevo} />
          ))}
        </div>
        <Entrada />
      </div>
    </main>
  )
}
