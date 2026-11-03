import { doc, getDoc, increment, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore'
import { REACCIONES, sinReacciones } from '../../domain/podcast'
import type { PodcastPort } from '../../ports/PodcastPort'
import { db, RUTAS, uidConSesion } from './firebase'

export const firestorePodcast: PodcastPort = {
  async reacciones(episodio) {
    const uid = await uidConSesion()
    const ref = doc(db, RUTAS.reacciones, episodio)
    const [conteo, voto] = await Promise.all([getDoc(ref), getDoc(doc(ref, RUTAS.votos, uid))])
    const total = sinReacciones()
    for (const r of REACCIONES) total[r] = conteo.get(r) ?? 0
    return { conteo: total, miReaccion: voto.exists() ? voto.get('reaccion') : undefined, compartido: conteo.get('compartido') ?? 0 }
  },

  async reaccionar(episodio, reaccion) {
    const uid = await uidConSesion()
    const ref = doc(db, RUTAS.reacciones, episodio)
    const lote = writeBatch(db)
    lote.set(ref, { [reaccion]: increment(1) }, { merge: true })
    lote.set(doc(ref, RUTAS.votos, uid), { reaccion, creadoEn: serverTimestamp() })
    await lote.commit()
  },

  async contarCompartido(episodio) {
    await uidConSesion()
    await setDoc(doc(db, RUTAS.reacciones, episodio), { compartido: increment(1) }, { merge: true })
  },
}
