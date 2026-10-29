import { Link } from 'react-router-dom'
import type { Habitacion } from '../../app/habitaciones'
import { Icono } from '../../ui/Icono'
import { Ilustracion } from '../../ui/Ilustracion'
import { clases } from '../../utils/clases'

const RETRASO_DE_ENTRADA_MS = 60

interface Props {
  habitacion: Habitacion
  posicion: number
  visitada: boolean
}

export function Ventana({ habitacion, posicion, visitada }: Props) {
  return (
    <Link
      to={habitacion.ruta}
      className={clases('ventana', visitada && 'ventana--visitada')}
      style={{ animationDelay: `${posicion * RETRASO_DE_ENTRADA_MS}ms` }}
    >
      <span className="ventana__marco">
        <span className="ventana__vidrio">
          <Ilustracion
            src={`/images/casa/${habitacion.id}.webp`}
            className="ventana__img"
            respaldo={<Icono nombre={habitacion.icono} tam={36} className="ventana__icono" />}
          />
          <span className="ventana__luz" />
        </span>
      </span>
      <b className="ventana__titulo">{habitacion.titulo}</b>
      {visitada && (
        <span className="ventana__marca" aria-label="visitada">
          <Icono nombre="check" tam={14} />
        </span>
      )}
    </Link>
  )
}

function Claraboya() {
  return (
    <span className="claraboya" aria-hidden="true">
      <span className="claraboya__vela" />
      <span className="claraboya__taza">
        <i />
        <i />
      </span>
    </span>
  )
}

export function VentanaDelAtico({ habitacion }: { habitacion: Habitacion }) {
  return (
    <Link to={habitacion.ruta} className="ventana ventana--atico">
      <span className="medalla">
        <Claraboya />
      </span>
      <span className="ventana__titulo atico__titulo">
        <b>{habitacion.titulo}</b>
        <small>{habitacion.frase}</small>
      </span>
    </Link>
  )
}

const FAMILIAS_EN_EL_BALCON = 5
const BURBUJAS_DE_CONVERSACION = 3

export function Balcon({ habitacion }: { habitacion: Habitacion }) {
  return (
    <Link to={habitacion.ruta} className="ventana balcon">
      <span className="balcon__letrero">
        <Icono nombre={habitacion.icono} tam={14} /> Tema de hoy
      </span>
      <span className="ventana__marco">
        <span className="balcon__sala">
          <span className="balcon__familias" aria-hidden="true">
            {Array.from({ length: FAMILIAS_EN_EL_BALCON }, (_, i) => <i key={i} />)}
          </span>
          <span className="balcon__burbujas" aria-hidden="true">
            {Array.from({ length: BURBUJAS_DE_CONVERSACION }, (_, i) => <i key={i} />)}
          </span>
          <span className="balcon__baranda" aria-hidden="true" />
        </span>
      </span>
      <b className="ventana__titulo balcon__titulo">
        {habitacion.titulo}
        <small>{habitacion.frase}</small>
      </b>
    </Link>
  )
}
