import { useState } from 'react'
import type { TemaDelDia } from '../../domain/foro'
import { Cargando } from '../../ui/Cargando'
import { Icono } from '../../ui/Icono'
import { fechaLegible } from '../../utils/tiempo'
import { ConversacionDelTema } from './ConversacionDelTema'
import { useTemasAnteriores } from './useForo'

export function TemasAnteriores() {
  const { datos: temas, cargando, fallo } = useTemasAnteriores()
  const [elegido, setElegido] = useState<TemaDelDia>()

  if (elegido) {
    return (
      <>
        <button className="boton boton--fantasma" onClick={() => setElegido(undefined)}>
          <Icono nombre="back" tam={18} /> Ver todos los temas
        </button>
        <ConversacionDelTema tema={elegido} etiqueta="Tema anterior" />
      </>
    )
  }
  if (fallo) return <p className="aviso-suave">No pudimos cargar los temas. Revisa tu conexión.</p>
  if (cargando) return <Cargando />
  if (!temas?.length) return <p className="suave centrado">Aquí aparecerán los temas de días anteriores.</p>
  return (
    <ul className="temas-anteriores">
      {temas.map((tema) => (
        <li key={tema.id}>
          <button className="tarjeta tema-anterior" onClick={() => setElegido(tema)}>
            <small className="suave">{fechaLegible(tema.fecha)}</small>
            <b>{tema.titulo}</b>
            <Icono nombre="next" tam={18} />
          </button>
        </li>
      ))}
    </ul>
  )
}
