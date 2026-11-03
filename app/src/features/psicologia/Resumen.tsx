import { CalendarBlank, ChatCircleText, Envelope, Flag, HourglassMedium, HouseLine, Lightbulb, UsersThree, type Icon } from '@phosphor-icons/react'
import { Ico } from '../../ui/Ico'
import { useCallback } from 'react'
import { useServicios } from '../../app/servicios'
import { cargas } from '../../content/cargas'
import type { ResumenDelForo } from '../../domain/foro'
import { lesPasa, totalDe } from '../../domain/mochila'
import { useAccion } from '../../hooks/useAccion'
import { useConsulta } from '../../hooks/useConsulta'
import { Cargando } from '../../ui/Cargando'
import { Visitas } from './Visitas'
import { porcentaje } from '../../utils/listas'
import { fechaDeHoy } from '../../utils/tiempo'

const INDICADORES: { clave: keyof ResumenDelForo; texto: string; Icono: Icon }[] = [
  { clave: 'pendientes', texto: 'Por revisar', Icono: HourglassMedium },
  { clave: 'publicados', texto: 'Comentarios publicados', Icono: ChatCircleText },
  { clave: 'propuestas', texto: 'Temas propuestos', Icono: Lightbulb },
  { clave: 'reportes', texto: 'Reportes sin atender', Icono: Flag },
  { clave: 'temasProgramados', texto: 'Temas programados', Icono: CalendarBlank },
  { clave: 'cartas', texto: 'Cartas de estudiantes', Icono: Envelope },
  { clave: 'equipo', texto: 'Personas en el equipo', Icono: UsersThree },
]

function LoQueSeViveEnCasa() {
  const { panel } = useServicios()
  const { datos, recargar } = useConsulta(useCallback(() => panel.resultadosDeCasa(), [panel]))
  const { ocupado, error, ejecutar } = useAccion()
  if (!datos) return null

  const reiniciar = async () => {
    if (!confirm('¿Borrar todas las respuestas de "¿Esto te pasa en casa?"? Úsalo solo para limpiar las pruebas antes del lanzamiento.')) return
    if (await ejecutar(() => panel.reiniciarResultadosDeCasa())) recargar()
  }
  const filas = cargas
    .map((c) => ({ titulo: c.titulo, conteo: datos[c.id] }))
    .filter((f) => f.conteo && totalDe(f.conteo) > 0)
    .sort((a, b) => porcentaje(lesPasa(b.conteo), totalDe(b.conteo)) - porcentaje(lesPasa(a.conteo), totalDe(a.conteo)))

  return (
    <div className="tarjeta">
      <h3 className="carga__subtitulo"><Ico icono={HouseLine} /> Lo que más se vive en casa (La mochila de tu hijo)</h3>
      {filas.length ? (
        <ul className="encuesta__barras">
          {filas.map(({ titulo, conteo }) => {
            const parte = Math.round(porcentaje(lesPasa(conteo), totalDe(conteo)))
            return (
              <li key={titulo}>
                <span>{titulo}</span>
                <span className="encuesta__barra"><span style={{ width: `${parte}%` }} /></span>
                <b>{parte} %</b>
                <small className="suave">{totalDe(conteo)} familias · sí {conteo.si} · a veces {conteo.aveces} · no {conteo.no}</small>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="suave">Aún no hay respuestas de las familias.</p>
      )}
      {error && <p className="aviso-suave">{error}</p>}
      {filas.length > 0 && (
        <button className="enlace-discreto" disabled={ocupado} onClick={reiniciar}>Reiniciar resultados (borrar pruebas)</button>
      )}
    </div>
  )
}

export function Resumen() {
  const { panel } = useServicios()
  const { datos, cargando, fallo, recargar } = useConsulta(useCallback(() => panel.resumen(fechaDeHoy()), [panel]))

  if (fallo) return <p className="aviso-suave">No pudimos cargar el resumen.</p>
  if (cargando && !datos) return <Cargando />
  return (
    <section className="conversacion">
      <ul className="indicadores">
        {INDICADORES.map(({ clave, texto, Icono }) => (
          <li key={clave} className="tarjeta indicador">
            <Icono className="indicador__emoji" size={28} weight="duotone" aria-hidden="true" />
            <b className="indicador__numero">{datos?.[clave] ?? 0}</b>
            <small className="suave">{texto}</small>
          </li>
        ))}
      </ul>
      <Visitas />
      <LoQueSeViveEnCasa />
      <button className="boton boton--fantasma" onClick={recargar}>Actualizar</button>
    </section>
  )
}
