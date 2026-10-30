import { config } from '../../config'
import type { EstadisticasPort } from '../../ports/EstadisticasPort'

// Usa la API REST de Firestore para no cargar el SDK de Firebase en cada visita.
const { projectId, apiKey } = config.firebase
const RAIZ = `projects/${projectId}/databases/(default)/documents`
const API = `https://firestore.googleapis.com/v1/${RAIZ}`

const DOCUMENTOS = {
  total: 'total',
  dispositivos: 'dispositivos',
  dia: (fecha: string) => `dia-${fecha}`,
}

const nombre = (id: string) => `${RAIZ}/visitas/${id}`

interface DocumentoRest {
  name: string
  fields?: { cuenta?: { integerValue?: string } }
}

const cuentaDe = (documento?: DocumentoRest) => Number(documento?.fields?.cuenta?.integerValue ?? 0)

const sumarUno = (id: string) => ({
  transform: { document: nombre(id), fieldTransforms: [{ fieldPath: 'cuenta', increment: { integerValue: '1' } }] },
})

async function pedir(ruta: string, cuerpo?: unknown) {
  const respuesta = await fetch(`${API}${ruta}?key=${apiKey}`, {
    method: cuerpo ? 'POST' : 'GET',
    headers: cuerpo ? { 'Content-Type': 'application/json' } : undefined,
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  })
  if (!respuesta.ok && respuesta.status !== 404) throw new Error(`Firestore respondió ${respuesta.status}`)
  return respuesta.status === 404 ? undefined : respuesta.json()
}

export const firestoreRest: EstadisticasPort = {
  async contarVisita(fecha, primeraVez) {
    const ids = [DOCUMENTOS.total, DOCUMENTOS.dia(fecha), ...(primeraVez ? [DOCUMENTOS.dispositivos] : [])]
    await pedir(':commit', { writes: ids.map(sumarUno) })
  },

  totalDeVisitas: async () => cuentaDe(await pedir(`/visitas/${DOCUMENTOS.total}`)),

  async resumenDeVisitas(fechas) {
    const ids = [DOCUMENTOS.total, DOCUMENTOS.dispositivos, ...fechas.map(DOCUMENTOS.dia)]
    const resultados: { found?: DocumentoRest }[] = await pedir(':batchGet', { documents: ids.map(nombre) })
    const cuentas = new Map(resultados.flatMap((r) => (r.found ? [[r.found.name.split('/').pop(), cuentaDe(r.found)] as const] : [])))
    return {
      total: cuentas.get(DOCUMENTOS.total) ?? 0,
      dispositivos: cuentas.get(DOCUMENTOS.dispositivos) ?? 0,
      dias: fechas.map((fecha) => ({ fecha, cuenta: cuentas.get(DOCUMENTOS.dia(fecha)) ?? 0 })),
    }
  },
}
