import { CLAVES_DE_PROGRESO } from '../../app/clavesDeProgreso'
import { usePersistente } from '../../hooks/usePersistente'
import { clases } from '../../utils/clases'
import { fechaDeHoy } from '../../utils/tiempo'

const CARITAS = [
  { emoji: '😊', texto: 'Me fue bien' },
  { emoji: '😐', texto: 'Más o menos' },
  { emoji: '😣', texto: 'Me costó' },
]

const ME_COSTO = '😣'

interface RetoHecho {
  fecha: string
  carita?: string
}

export function RetoDeHoy({ carga, reto }: { carga: string; reto: string }) {
  const [hechos, setHechos] = usePersistente<Record<string, RetoHecho>>(CLAVES_DE_PROGRESO.retosDeLaMochila, {})
  const hecho = hechos[carga]
  const guardar = (cambio: RetoHecho) => setHechos((previos) => ({ ...previos, [carga]: cambio }))

  return (
    <div className="pregunta-guia carga__reto">
      <span>⏱️ Reto de 10 minutos para hoy</span>
      <p>{reto}</p>
      {hecho?.fecha !== fechaDeHoy() ? (
        <button className="boton boton--exito reto-hecho" onClick={() => guardar({ fecha: fechaDeHoy() })}>✓ Lo hice hoy</button>
      ) : (
        <div className="caritas">
          <small>¡Bien hecho! ¿Cómo te fue?</small>
          <div>
            {CARITAS.map(({ emoji, texto }) => (
              <button
                key={emoji}
                className={clases('carita', hecho.carita === emoji && 'carita--elegida')}
                aria-label={texto}
                title={texto}
                aria-pressed={hecho.carita === emoji}
                onClick={() => guardar({ ...hecho, carita: emoji })}
              >
                {emoji}
              </button>
            ))}
          </div>
          {hecho.carita === ME_COSTO && <small>Está bien que cueste. Inténtalo otro día: cada intento cuenta.</small>}
        </div>
      )}
    </div>
  )
}
