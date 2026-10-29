import { useSearchParams } from 'react-router-dom'
import { indiceCircular } from '../utils/listas'

interface ConId {
  id: string
}

export function useSeleccionEnUrl<T extends ConId>(lista: T[], parametro: string, indicePorDefecto = 0) {
  const [params, setParams] = useSearchParams()
  const indiceEnUrl = lista.findIndex((item) => item.id === params.get(parametro))
  const elegidoEnUrl = indiceEnUrl >= 0
  const indice = elegidoEnUrl ? indiceEnUrl : indicePorDefecto

  const ir = (nuevoIndice: number) => {
    const destino = lista[indiceCircular(nuevoIndice, lista.length)]
    setParams({ [parametro]: destino.id }, { replace: true })
  }

  return {
    indice,
    actual: lista[indice] as T | undefined,
    elegidoEnUrl,
    ir,
    anterior: () => ir(indice - 1),
    siguiente: () => ir(indice + 1),
  }
}
