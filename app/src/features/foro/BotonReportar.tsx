import { useState } from 'react'
import { useServicios } from '../../app/servicios'
import { MOTIVOS_DE_REPORTE } from '../../domain/foro'
import { useAccion } from '../../hooks/useAccion'

interface Props {
  ruta: string
  texto: string
}

export function BotonReportar({ ruta, texto }: Props) {
  const { foro } = useServicios()
  const { ocupado, ejecutar } = useAccion()
  const [abierto, setAbierto] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const reportar = async (motivo: string) => {
    if (await ejecutar(() => foro.reportar(ruta, texto, motivo))) setEnviado(true)
  }

  if (enviado) return <small className="suave">Gracias, psicología lo revisará.</small>
  if (!abierto) {
    return (
      <button className="enlace-discreto" onClick={() => setAbierto(true)}>
        Reportar
      </button>
    )
  }
  return (
    <div className="reporte">
      <small className="suave">¿Por qué lo reportas?</small>
      {MOTIVOS_DE_REPORTE.map((motivo) => (
        <button key={motivo} className="ficha" disabled={ocupado} onClick={() => reportar(motivo)}>
          {motivo}
        </button>
      ))}
      <button className="enlace-discreto" onClick={() => setAbierto(false)}>
        Cancelar
      </button>
    </div>
  )
}
