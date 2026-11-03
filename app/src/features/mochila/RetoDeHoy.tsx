import { Check, Smiley, SmileyMeh, SmileySad, Timer } from '@phosphor-icons/react'
import { Ico } from '../../ui/Ico'
import { CLAVES_DE_PROGRESO } from '../../app/clavesDeProgreso'
import { usePersistente } from '../../hooks/usePersistente'
import { clases } from '../../utils/clases'
import { fechaDeHoy } from '../../utils/tiempo'

// El valor guardado es la carita que se usaba antes; se mantiene para no perder lo que ya marcó cada familia.
const CARITAS = [
  { valor: '\u{1F60A}', texto: 'Me fue bien', Icono: Smiley },
  { valor: '\u{1F610}', texto: 'Más o menos', Icono: SmileyMeh },
  { valor: '\u{1F623}', texto: 'Me costó', Icono: SmileySad },
]

const ME_COSTO = CARITAS[2].valor

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
      <span><Ico icono={Timer} /> Reto de 10 minutos para hoy</span>
      <p>{reto}</p>
      {hecho?.fecha !== fechaDeHoy() ? (
        <button className="boton boton--exito reto-hecho" onClick={() => guardar({ fecha: fechaDeHoy() })}><Ico icono={Check} peso="bold" /> Lo hice hoy</button>
      ) : (
        <div className="caritas">
          <small>¡Bien hecho! ¿Cómo te fue?</small>
          <div>
            {CARITAS.map(({ valor, texto, Icono }) => (
              <button
                key={valor}
                className={clases('carita', hecho.carita === valor && 'carita--elegida')}
                aria-label={texto}
                title={texto}
                aria-pressed={hecho.carita === valor}
                onClick={() => guardar({ ...hecho, carita: valor })}
              >
                <Icono size={30} weight={hecho.carita === valor ? 'fill' : 'duotone'} />
              </button>
            ))}
          </div>
          {hecho.carita === ME_COSTO && <small>Está bien que cueste. Inténtalo otro día: cada intento cuenta.</small>}
        </div>
      )}
    </div>
  )
}
