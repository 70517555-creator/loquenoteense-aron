import { useState } from 'react'
import type { GrupoRecursos } from '../../domain/tipos'
import { useContenido } from '../../hooks/useContenido'
import { Cargando } from '../../ui/Cargando'
import { Encabezado } from '../../ui/Encabezado'
import { Fichas } from '../../ui/Fichas'
import { Icono } from '../../ui/Icono'
import { compartirTexto } from './compartir'

const GRUPO_COMPARTIBLE = 'preguntas'
const DURACION_DE_CONFIRMACION_MS = 1_800

const numeroConDosCifras = (indice: number) => String(indice + 1).padStart(2, '0')

function useCompartirConConfirmacion() {
  const [copiado, setCopiado] = useState<string>()
  const compartir = async (texto: string) => {
    if ((await compartirTexto(texto)) !== 'copiado') return
    setCopiado(texto)
    setTimeout(() => setCopiado(undefined), DURACION_DE_CONFIRMACION_MS)
  }
  return { copiado, compartir }
}

function ListaDeRecursos({ grupo }: { grupo: GrupoRecursos }) {
  const { copiado, compartir } = useCompartirConConfirmacion()
  const sePuedeCompartir = grupo.id === GRUPO_COMPARTIBLE

  return (
    <ol className="recursos">
      {grupo.items.map((item, i) => (
        <li key={item.texto} className="tarjeta recurso">
          <span className="recurso__num mano">{numeroConDosCifras(i)}</span>
          <div className="recurso__cuerpo">
            <p className="recurso__texto">{item.texto}</p>
            {item.detalle && <p className="suave">{item.detalle}</p>}
          </div>
          {sePuedeCompartir && (
            <button className="boton-redondo" onClick={() => compartir(item.texto)} aria-label="Compartir o copiar pregunta">
              <Icono nombre={copiado === item.texto ? 'check' : 'share'} tam={20} />
            </button>
          )}
        </li>
      ))}
    </ol>
  )
}

function GruposDeRecursos({ grupos }: { grupos: GrupoRecursos[] }) {
  const [indice, setIndice] = useState(0)
  return (
    <>
      <Fichas etiqueta="Tipo de recurso" opciones={grupos.map((g) => g.titulo)} activa={indice} onCambiar={setIndice} />
      <ListaDeRecursos grupo={grupos[indice]} />
    </>
  )
}

export default function Recursos() {
  const grupos = useContenido('recursos')
  return (
    <main>
      <Encabezado titulo="Recursos para conversar" icono="book" />
      <div className="contenedor">
        {grupos ? <GruposDeRecursos grupos={grupos} /> : <Cargando />}
        <div className="consejo">
          <Icono nombre="bulb" tam={20} /> <b>Consejo:</b> no busques la respuesta perfecta. Busca el momento tranquilo.
        </div>
      </div>
    </main>
  )
}
