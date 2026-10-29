import { Link } from 'react-router-dom'
import { asistenteHabitacion, foroHabitacion, habitaciones } from '../../app/habitaciones'
import { useMomentoDelDia, type Momento } from '../../hooks/useMomentoDelDia'
import { useVisitasDeHoy } from '../../hooks/useVisitasDeHoy'
import { BarraDeProgreso } from '../../ui/BarraDeProgreso'
import { Icono } from '../../ui/Icono'
import { Logo } from '../../ui/Logo'
import { PARAMETRO_ABRIR_VIDEO } from '../inicio/useVideoDeBienvenida'
import { videoDeBienvenida } from '../inicio/youtube'
import { Cielo } from './paisaje/Cielo'
import { Suelo } from './paisaje/Suelo'
import { Balcon, Ventana, VentanaDelAtico } from './Ventana'

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
        {videoDeBienvenida && (
          <Link to={`/?${PARAMETRO_ABRIR_VIDEO}`} className="casa__video">
            <Icono nombre="play" tam={16} /> Ver video
          </Link>
        )}
      </div>
      <p className="casa__saludo mano">{saludo} 💛</p>
      <p className="casa__frase">{FRASE_SEGUN_MOMENTO[momento]}</p>
      <p className="casa__progreso">
        Hoy recorriste <b>{recorridas}</b> de {habitaciones.length} habitaciones
      </p>
      <BarraDeProgreso avance={recorridas} total={habitaciones.length} />
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
            <Ventana key={habitacion.id} habitacion={habitacion} posicion={i} visitada={fueVisitada(habitacion.id)} />
          ))}
          <Balcon habitacion={foroHabitacion} />
        </div>
        <Entrada />
      </div>
    </main>
  )
}
