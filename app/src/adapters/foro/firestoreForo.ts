import {
  addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, where,
} from 'firebase/firestore'
import { VERSION_DE_POLITICA } from '../../content/politicas'
import { masAntiguoPrimero } from '../../domain/foro'
import type { ForoPort } from '../../ports/ForoPort'
import { aComentario, aPropuesta, aTema, sinRepetir } from './conversores'
import { db, RUTAS, sumarUnaVez, uidConSesion } from './firebase'

const MAX_TEMAS_ANTERIORES = 14

async function aprobadosYPropios(ruta: string, uid: string) {
  const coleccion = collection(db, ruta)
  const [aprobados, propios] = await Promise.all([
    getDocs(query(coleccion, where('estado', '==', 'aprobado'))),
    getDocs(query(coleccion, where('autorUid', '==', uid))),
  ])
  return [...aprobados.docs, ...propios.docs]
}

export const firestoreForo: ForoPort = {
  async temaDeLaFecha(fecha) {
    const tema = await getDoc(doc(db, RUTAS.temas, fecha))
    return tema.exists() ? aTema(tema) : null
  },

  async temasAnteriores(hasta) {
    const consulta = query(collection(db, RUTAS.temas), where('fecha', '<', hasta), orderBy('fecha', 'desc'), limit(MAX_TEMAS_ANTERIORES))
    return (await getDocs(consulta)).docs.map(aTema)
  },

  async comentarios(temaId) {
    const uid = await uidConSesion()
    const documentos = await aprobadosYPropios(RUTAS.comentarios(temaId), uid)
    return sinRepetir(documentos.map((d) => aComentario(d, uid))).sort(masAntiguoPrimero)
  },

  async comentar({ tema, texto, apodo, urgente }) {
    const autorUid = await uidConSesion()
    await addDoc(collection(db, RUTAS.comentarios(tema.id)), {
      texto, apodo, urgente, autorUid,
      temaTitulo: tema.titulo,
      rol: 'padre',
      estado: 'pendiente',
      meAyudo: 0,
      politica: VERSION_DE_POLITICA,
      creadoEn: serverTimestamp(),
    })
  },

  marcarMeAyudo: (comentario) => sumarUnaVez(doc(db, RUTAS.comentarios(comentario.temaId), comentario.id), 'meAyudo'),

  async propuestas() {
    const uid = await uidConSesion()
    const documentos = await aprobadosYPropios(RUTAS.propuestas, uid)
    return sinRepetir(documentos.map((d) => aPropuesta(d, uid))).sort((a, b) => b.votos - a.votos)
  },

  async proponer(texto, nivel) {
    const autorUid = await uidConSesion()
    await addDoc(collection(db, RUTAS.propuestas), {
      texto, nivel, autorUid,
      estado: 'pendiente',
      votos: 0,
      politica: VERSION_DE_POLITICA,
      creadoEn: serverTimestamp(),
    })
  },

  votar: (propuesta) => sumarUnaVez(doc(db, RUTAS.propuestas, propuesta.id), 'votos'),

  async reportar(ruta, texto, motivo) {
    const autorUid = await uidConSesion()
    await addDoc(collection(db, RUTAS.reportes), { ruta, texto, motivo, autorUid, creadoEn: serverTimestamp() })
  },
}
