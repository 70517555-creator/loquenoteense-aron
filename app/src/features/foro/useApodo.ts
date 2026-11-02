import { CLAVES_DE_PROGRESO } from '../../app/clavesDeProgreso'
import { GRADOS } from '../../content/grados'
import { usePersistente } from '../../hooks/usePersistente'

export const PARENTESCOS = ['Mamá', 'Papá', 'Apoderada', 'Apoderado', 'Abuela', 'Abuelo']
export const SIN_GRADO = 'Prefiero no decirlo'
export const OPCIONES_DE_GRADO = [SIN_GRADO, ...GRADOS]

export interface Apodo {
  parentesco: string
  grado: string
}

const APODO_INICIAL: Apodo = { parentesco: PARENTESCOS[0], grado: SIN_GRADO }

// Antes los grados se escribían con guion ("3.° – 5.°"); se muestran siempre con "a".
export const sinGuiones = (texto: string) => texto.replace(/\s*[–—]\s*/g, ' a ')

export const textoDelApodo = ({ parentesco, grado }: Apodo) =>
  grado === SIN_GRADO ? parentesco : `${parentesco} · ${sinGuiones(grado)}`

export function useApodo() {
  const [guardado, setApodo] = usePersistente<Apodo>(CLAVES_DE_PROGRESO.apodoDelForo, APODO_INICIAL)
  const apodo = { ...guardado, grado: sinGuiones(guardado.grado) }
  const cambiar = (cambio: Partial<Apodo>) => setApodo((previo) => ({ ...previo, ...cambio }))
  return { apodo, texto: textoDelApodo(apodo), cambiar }
}
