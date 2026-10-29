import { useState } from 'react'
import type { DatoReal, Situacion } from '../../domain/tipos'
import { useContenido } from '../../hooks/useContenido'
import { useSeleccionEnUrl } from '../../hooks/useSeleccionEnUrl'
import { AnteriorSiguiente, Puntos } from '../../ui/AnteriorSiguiente'
import { Cargando } from '../../ui/Cargando'
import { Rostro } from '../../ui/Dibujos'
import { Encabezado } from '../../ui/Encabezado'
import { Fichas } from '../../ui/Fichas'
import { Icono } from '../../ui/Icono'
import { Ilustracion } from '../../ui/Ilustracion'

function DosMiradas({ situacion }: { situacion: Situacion }) {
  return (
    <div className="miradas">
      <div className="mirada mirada--padre">
        <Rostro piel="#c68b62" pelo="#3a2620" polo="#c8302c" />
        <b className="mano">Mamá / Papá</b>
        <p className="globo">“{situacion.padre}”</p>
      </div>
      <div className="mirada mirada--hijo">
        <Rostro piel="#a86f4c" pelo="#1f1614" polo="#1f2a44" joven />
        <b className="mano">Hijo / Hija</b>
        <p className="globo">“{situacion.hijo}”</p>
      </div>
    </div>
  )
}

function DatoDeContexto({ dato }: { dato: DatoReal }) {
  return (
    <p className="dato-real">
      <b>📊 Dato real:</b> {dato.texto}{' '}
      <a href={dato.enlace} target="_blank" rel="noopener noreferrer">Fuente: {dato.fuente}</a>
    </p>
  )
}

function LoQueHayDetras({ situacion }: { situacion: Situacion }) {
  const [revelada, setRevelada] = useState<string>()

  return (
    <div className="tarjeta centrado">
      <h2 className="mano titulo-grande">¿Quién tiene razón?</h2>
      <p className="suave">Nadie todavía. Hay más para entender.</p>
      {revelada === situacion.id ? (
        <div className="detras" aria-live="polite">
          <p>{situacion.detras}</p>
          {situacion.dato && <DatoDeContexto dato={situacion.dato} />}
          <p className="prueba-hoy">
            <Icono nombre="bulb" tam={20} /> <b>Prueba hoy:</b> {situacion.pruebaHoy}
          </p>
        </div>
      ) : (
        <button className="boton" onClick={() => setRevelada(situacion.id)}>
          Descubrir qué hay detrás <Icono nombre="arrow" tam={18} />
        </button>
      )}
    </div>
  )
}

function Situaciones({ situaciones }: { situaciones: Situacion[] }) {
  const { indice, actual, ir, anterior, siguiente } = useSeleccionEnUrl(situaciones, 's')
  if (!actual) return <Cargando />

  return (
    <>
      <Fichas etiqueta="Contexto" opciones={situaciones.map((s) => s.contexto)} activa={indice} onCambiar={ir} />
      <Ilustracion key={actual.id} src={`/images/situaciones/${actual.id}.webp`} className="escena" respaldo={null} />
      <DosMiradas situacion={actual} />
      <LoQueHayDetras situacion={actual} />
      <AnteriorSiguiente onAnterior={anterior} onSiguiente={siguiente}>
        <Puntos total={situaciones.length} activo={indice} />
      </AnteriorSiguiente>
    </>
  )
}

export default function Explorar() {
  const situaciones = useContenido('situaciones')
  return (
    <main>
      <Encabezado titulo="Explorar situaciones" icono="people" />
      <div className="contenedor">{situaciones ? <Situaciones situaciones={situaciones} /> : <Cargando />}</div>
    </main>
  )
}
