import { useCallback } from 'react'
import { useServicios } from '../../app/servicios'
import { DIAS_EN_EL_RESUMEN } from '../../domain/estadisticas'
import { useConsulta } from '../../hooks/useConsulta'
import { porcentaje } from '../../utils/listas'
import { fechaDeHoy } from '../../utils/tiempo'

const MS_POR_DIA = 86_400_000
const DIA_CORTO = new Intl.DateTimeFormat('es-PE', { weekday: 'short', day: 'numeric' })

function ultimasFechas(cantidad: number) {
  const hoy = Date.now()
  return Array.from({ length: cantidad }, (_, i) => fechaDeHoy(new Date(hoy - i * MS_POR_DIA)))
}

const legible = (fecha: string) => {
  const [anio, mes, dia] = fecha.split('-').map(Number)
  return DIA_CORTO.format(new Date(anio, mes - 1, dia))
}

export function Visitas() {
  const { estadisticas } = useServicios()
  const { datos, fallo } = useConsulta(useCallback(() => estadisticas.resumenDeVisitas(ultimasFechas(DIAS_EN_EL_RESUMEN)), [estadisticas]))
  if (fallo) return <p className="aviso-suave">No pudimos cargar las visitas.</p>
  if (!datos) return null
  const [hoy, ...anteriores] = datos.dias
  const semana = datos.dias.slice(0, 7).reduce((suma, d) => suma + d.cuenta, 0)
  const maximo = Math.max(1, ...datos.dias.map((d) => d.cuenta))

  return (
    <div className="tarjeta">
      <h3 className="carga__subtitulo">👪 Visitas de las familias</h3>
      <ul className="indicadores">
        <li className="indicador"><b className="indicador__numero">{hoy.cuenta}</b><small className="suave">Hoy</small></li>
        <li className="indicador"><b className="indicador__numero">{semana}</b><small className="suave">Últimos 7 días</small></li>
        <li className="indicador"><b className="indicador__numero">{datos.total}</b><small className="suave">Visitas en total</small></li>
        <li className="indicador"><b className="indicador__numero">{datos.dispositivos}</b><small className="suave">Celulares distintos</small></li>
      </ul>
      <ul className="encuesta__barras visitas__dias">
        {[hoy, ...anteriores].map(({ fecha, cuenta }) => (
          <li key={fecha}>
            <span>{legible(fecha)}</span>
            <span className="encuesta__barra"><span style={{ width: `${porcentaje(cuenta, maximo)}%` }} /></span>
            <b>{cuenta}</b>
          </li>
        ))}
      </ul>
      <small className="suave">Cada celular cuenta una vez por día. No guardamos quién entró.</small>
    </div>
  )
}
