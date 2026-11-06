import { useAccion } from '../../hooks/useAccion'
import { Icono } from '../../ui/Icono'

const CONFIRMACION = '¿Eliminar para siempre? No se publicará, se borra del todo y no se puede recuperar.'

// La X del panel: borra de verdad (para lo que no debe quedar guardado), a diferencia de "No publicar".
export function BotonEliminar({ eliminar, onEliminado }: { eliminar: () => Promise<void>; onEliminado: () => void }) {
  const { ocupado, ejecutar } = useAccion()
  const confirmarYEliminar = async () => {
    if (confirm(CONFIRMACION) && (await ejecutar(eliminar))) onEliminado()
  }
  return (
    <button className="comentario__quitar por-revisar__eliminar" disabled={ocupado} onClick={confirmarYEliminar} aria-label="Eliminar para siempre" title="Eliminar para siempre">
      <Icono nombre="close" tam={16} />
    </button>
  )
}
