import { useTemporizador } from '../../hooks/useTemporizador'
import { Icono } from '../../ui/Icono'
import { clases } from '../../utils/clases'
import { formatoMinutosSegundos } from '../../utils/tiempo'

export function Reloj({ minutos }: { minutos: number }) {
  const { ms, corriendo, terminado, alternar, reiniciar } = useTemporizador(minutos)

  return (
    <>
      <div className={clases('reloj', corriendo && 'reloj--andando')} role="timer" aria-live="off">
        {formatoMinutosSegundos(ms)}
      </div>
      <div className="fila">
        {terminado ? (
          <span className="insignia">¡Tiempo cumplido! 🎉</span>
        ) : (
          <button className="boton" onClick={alternar}>
            <Icono nombre={corriendo ? 'pause' : 'play'} tam={18} /> {corriendo ? 'Pausar' : 'Empezar reto'}
          </button>
        )}
        <button className="boton boton--borde" onClick={reiniciar}>
          <Icono nombre="refresh" tam={18} /> Reiniciar
        </button>
      </div>
    </>
  )
}
