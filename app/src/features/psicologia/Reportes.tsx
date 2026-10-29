import { useCallback } from 'react'
import { useServicios } from '../../app/servicios'
import type { Reporte } from '../../domain/foro'
import { useAccion } from '../../hooks/useAccion'
import { useConsulta } from '../../hooks/useConsulta'
import { Cargando } from '../../ui/Cargando'

function TarjetaDeReporte({ reporte, onResuelto }: { reporte: Reporte; onResuelto: () => void }) {
  const { panel } = useServicios()
  const { ocupado, ejecutar } = useAccion()
  const atender = async (accion: (r: Reporte) => Promise<void>) => {
    if (await ejecutar(() => accion(reporte))) onResuelto()
  }

  return (
    <li className="tarjeta por-revisar">
      <span className="insignia insignia--suave">{reporte.motivo}</span>
      <p className="comentario__texto">{reporte.texto}</p>
      <small className="suave">{reporte.creadoEn.toLocaleString('es-PE')}</small>
      <div className="moderacion">
        <button className="boton boton--urgente" disabled={ocupado} onClick={() => atender(panel.ocultarReportado)}>Ocultar</button>
        <button className="boton boton--borde" disabled={ocupado} onClick={() => atender(panel.resolverReporte)}>Dejarlo publicado</button>
      </div>
    </li>
  )
}

export function Reportes() {
  const { panel } = useServicios()
  const { datos, cargando, fallo, recargar } = useConsulta(useCallback(() => panel.reportes(), [panel]))

  if (fallo) return <p className="aviso-suave">No pudimos cargar los reportes.</p>
  if (cargando && !datos) return <Cargando />
  if (!datos?.length) return <p className="suave centrado">No hay reportes. 🙌</p>
  return (
    <ul className="lista-panel">
      {datos.map((r) => <TarjetaDeReporte key={r.id} reporte={r} onResuelto={recargar} />)}
    </ul>
  )
}
