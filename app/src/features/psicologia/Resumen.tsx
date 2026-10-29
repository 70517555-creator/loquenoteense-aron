import { useCallback } from 'react'
import { useServicios } from '../../app/servicios'
import type { ResumenDelForo } from '../../domain/foro'
import { useConsulta } from '../../hooks/useConsulta'
import { Cargando } from '../../ui/Cargando'
import { fechaDeHoy } from '../../utils/tiempo'

const INDICADORES: { clave: keyof ResumenDelForo; texto: string; emoji: string }[] = [
  { clave: 'pendientes', texto: 'Por revisar', emoji: '⏳' },
  { clave: 'publicados', texto: 'Comentarios publicados', emoji: '💬' },
  { clave: 'propuestas', texto: 'Temas propuestos', emoji: '💡' },
  { clave: 'reportes', texto: 'Reportes sin atender', emoji: '🚩' },
  { clave: 'temasProgramados', texto: 'Temas programados', emoji: '📅' },
  { clave: 'equipo', texto: 'Personas en el equipo', emoji: '👥' },
]

export function Resumen() {
  const { panel } = useServicios()
  const { datos, cargando, fallo, recargar } = useConsulta(useCallback(() => panel.resumen(fechaDeHoy()), [panel]))

  if (fallo) return <p className="aviso-suave">No pudimos cargar el resumen.</p>
  if (cargando && !datos) return <Cargando />
  return (
    <section className="conversacion">
      <ul className="indicadores">
        {INDICADORES.map(({ clave, texto, emoji }) => (
          <li key={clave} className="tarjeta indicador">
            <span className="indicador__emoji" aria-hidden="true">{emoji}</span>
            <b className="indicador__numero">{datos?.[clave] ?? 0}</b>
            <small className="suave">{texto}</small>
          </li>
        ))}
      </ul>
      <button className="boton boton--fantasma" onClick={recargar}>Actualizar</button>
    </section>
  )
}
