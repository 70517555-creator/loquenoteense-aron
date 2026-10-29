import { addDoc, collection, doc, getDoc, getDocs, increment, query, serverTimestamp, where, writeBatch } from 'firebase/firestore'
import { VERSION_DE_POLITICA } from '../../content/politicas'
import { masRecientePrimero } from '../../domain/foro'
import type { MochilaPort } from '../../ports/MochilaPort'
import { aCartaDeEstudiante, aConteoDeCasa } from './conversores'
import { db, RUTAS, sumarUnaVez, uidConSesion } from './firebase'

export const firestoreMochila: MochilaPort = {
  async resultadoDeCasa(carga) {
    const uid = await uidConSesion()
    const ref = doc(db, RUTAS.encuesta, carga)
    const [conteo, voto] = await Promise.all([getDoc(ref), getDoc(doc(ref, RUTAS.votos, uid))])
    return { conteo: aConteoDeCasa(conteo), miRespuesta: voto.exists() ? voto.get('respuesta') : undefined }
  },

  async responderDeCasa(carga, respuesta) {
    const uid = await uidConSesion()
    const ref = doc(db, RUTAS.encuesta, carga)
    const lote = writeBatch(db)
    lote.set(ref, { [respuesta]: increment(1) }, { merge: true })
    lote.set(doc(ref, RUTAS.votos, uid), { respuesta, creadoEn: serverTimestamp() })
    await lote.commit()
  },

  async cartas(carga) {
    const uid = await uidConSesion()
    const consulta = query(collection(db, RUTAS.cartas), where('estado', '==', 'aprobado'), where('carga', '==', carga))
    return (await getDocs(consulta)).docs.map((d) => aCartaDeEstudiante(d, uid)).sort(masRecientePrimero)
  },

  async misCartas() {
    const uid = await uidConSesion()
    const propias = await getDocs(query(collection(db, RUTAS.cartas), where('autorUid', '==', uid)))
    return propias.docs.map((d) => aCartaDeEstudiante(d, uid)).sort(masRecientePrimero)
  },

  async escribirCarta({ carga, texto, nivel, urgente }) {
    const autorUid = await uidConSesion()
    await addDoc(collection(db, RUTAS.cartas), {
      carga, texto, nivel, urgente, autorUid,
      estado: 'pendiente',
      meHizoPensar: 0,
      politica: VERSION_DE_POLITICA,
      creadoEn: serverTimestamp(),
    })
  },

  meHizoPensar: (carta) => sumarUnaVez(doc(db, RUTAS.cartas, carta.id), 'meHizoPensar'),
}
