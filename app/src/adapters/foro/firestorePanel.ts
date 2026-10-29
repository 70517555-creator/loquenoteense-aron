import { GoogleAuthProvider, signInWithPopup, signOut, type User } from 'firebase/auth'
import {
  collection, collectionGroup, deleteDoc, doc, getCountFromServer, getDoc, getDocs, orderBy, query, serverTimestamp,
  setDoc, updateDoc, where, writeBatch, type Query,
} from 'firebase/firestore'
import { config } from '../../config'
import { MOTIVO_AL_RETIRAR, masAntiguoPrimero, masRecientePrimero, type Comentario, type Decision } from '../../domain/foro'
import type { PanelDePsicologiaPort } from '../../ports/ForoPort'
import { aComentario, aPropuesta, aPsicologo, aReporte, aTema } from './conversores'
import { auth, db, RUTAS, usuarioActual } from './firebase'

const proveedorGoogle = new GoogleAuthProvider()

const urgentesPrimero = (a: Comentario, b: Comentario) => Number(b.urgente) - Number(a.urgente) || masAntiguoPrimero(a, b)

const cambiosDeModeracion = (decision: Decision, motivo?: string) =>
  decision === 'rechazado' ? { estado: decision, motivoRechazo: motivo } : { estado: decision }

const refDeComentario = (comentario: Comentario) => doc(db, RUTAS.comentarios(comentario.temaId), comentario.id)

const NOMBRE_POR_DEFECTO = 'Coordinación'

const contar = async (consulta: Query) => (await getCountFromServer(consulta)).data().count

async function registrarALaDuena(usuario: User, correo: string) {
  const ref = doc(db, RUTAS.psicologos, correo)
  await setDoc(ref, { nombre: usuario.displayName ?? NOMBRE_POR_DEFECTO, coordinador: true, agregadoPor: correo })
  return getDoc(ref)
}

async function psicologoDe(usuario: User | null) {
  if (!usuario?.email || usuario.isAnonymous) return null
  const correo = usuario.email.toLowerCase()
  const ficha = await getDoc(doc(db, RUTAS.psicologos, correo)).catch(() => null)
  if (ficha?.exists()) return aPsicologo(ficha)
  if (correo !== config.correoDeLaDuena) return null
  return aPsicologo(await registrarALaDuena(usuario, correo))
}

async function correoActual() {
  const usuario = await usuarioActual()
  return usuario?.email?.toLowerCase() ?? ''
}

export const firestorePanel: PanelDePsicologiaPort = {
  sesionActual: async () => psicologoDe(await usuarioActual()),

  async entrarConGoogle() {
    const { user } = await signInWithPopup(auth, proveedorGoogle)
    const psicologo = await psicologoDe(user)
    if (!psicologo) await signOut(auth)
    return psicologo
  },

  salir: () => signOut(auth),

  async pendientes() {
    const [comentarios, propuestas] = await Promise.all([
      getDocs(query(collectionGroup(db, 'comentarios'), where('estado', '==', 'pendiente'))),
      getDocs(query(collection(db, RUTAS.propuestas), where('estado', '==', 'pendiente'))),
    ])
    return {
      comentarios: comentarios.docs.map((d) => aComentario(d)).sort(urgentesPrimero),
      propuestas: propuestas.docs.map((d) => aPropuesta(d)).sort(masAntiguoPrimero),
    }
  },

  moderarComentario: (comentario, decision, motivo) => updateDoc(refDeComentario(comentario), cambiosDeModeracion(decision, motivo)),

  moderarPropuesta: (propuesta, decision, motivo) =>
    updateDoc(doc(db, RUTAS.propuestas, propuesta.id), cambiosDeModeracion(decision, motivo)),

  async responder(comentario, texto, nombre) {
    const usuario = await usuarioActual()
    const lote = writeBatch(db)
    if (comentario.estado === 'pendiente') lote.update(refDeComentario(comentario), { estado: 'aprobado' })
    lote.set(doc(collection(db, RUTAS.comentarios(comentario.temaId))), {
      texto,
      apodo: nombre,
      respondeA: comentario.apodo,
      temaTitulo: comentario.temaTitulo,
      rol: 'psicologia',
      estado: 'aprobado',
      urgente: false,
      meAyudo: 0,
      autorUid: usuario?.uid,
      creadoEn: serverTimestamp(),
    })
    await lote.commit()
  },

  async propuestasAprobadas() {
    const aprobadas = await getDocs(query(collection(db, RUTAS.propuestas), where('estado', '==', 'aprobado')))
    return aprobadas.docs.map((d) => aPropuesta(d)).sort((a, b) => b.votos - a.votos)
  },

  async temasProgramados(desde) {
    const consulta = query(collection(db, RUTAS.temas), where('fecha', '>=', desde), orderBy('fecha'))
    return (await getDocs(consulta)).docs.map(aTema)
  },

  async programarTema(tema, propuesta) {
    const ref = doc(db, RUTAS.temas, tema.fecha)
    if ((await getDoc(ref)).exists()) throw new Error('Ya hay un tema programado para esa fecha.')
    const lote = writeBatch(db)
    lote.set(ref, { ...tema, creadoPor: await correoActual(), creadoEn: serverTimestamp() })
    if (propuesta) lote.update(doc(db, RUTAS.propuestas, propuesta.id), { fechaProgramada: tema.fecha })
    await lote.commit()
  },

  borrarTema: (tema) => deleteDoc(doc(db, RUTAS.temas, tema.id)),

  async reportes() {
    const reportes = await getDocs(collection(db, RUTAS.reportes))
    return reportes.docs.map(aReporte).sort(masRecientePrimero)
  },

  resolverReporte: (reporte) => deleteDoc(doc(db, RUTAS.reportes, reporte.id)),

  async ocultarReportado(reporte) {
    const lote = writeBatch(db)
    lote.update(doc(db, reporte.ruta), cambiosDeModeracion('rechazado', MOTIVO_AL_RETIRAR))
    lote.delete(doc(db, RUTAS.reportes, reporte.id))
    await lote.commit()
  },

  async resumen(hoy) {
    const comentarios = collectionGroup(db, 'comentarios')
    const [publicados, pendientes, propuestas, reportes, temasProgramados, equipo] = await Promise.all([
      contar(query(comentarios, where('estado', '==', 'aprobado'))),
      contar(query(comentarios, where('estado', '==', 'pendiente'))),
      contar(collection(db, RUTAS.propuestas)),
      contar(collection(db, RUTAS.reportes)),
      contar(query(collection(db, RUTAS.temas), where('fecha', '>=', hoy))),
      contar(collection(db, RUTAS.psicologos)),
    ])
    return { publicados, pendientes, propuestas, reportes, temasProgramados, equipo }
  },

  async publicados() {
    const publicados = await getDocs(query(collectionGroup(db, 'comentarios'), where('estado', '==', 'aprobado')))
    return publicados.docs.map((d) => aComentario(d)).sort(masRecientePrimero)
  },

  async equipo() {
    const equipo = await getDocs(collection(db, RUTAS.psicologos))
    return equipo.docs.map(aPsicologo).sort((a, b) => a.nombre.localeCompare(b.nombre))
  },

  async agregarAlEquipo({ correo, nombre, coordinador }) {
    await setDoc(doc(db, RUTAS.psicologos, correo.trim().toLowerCase()), {
      nombre: nombre.trim(),
      coordinador,
      agregadoPor: await correoActual(),
    })
  },

  quitarDelEquipo: (psicologo) => deleteDoc(doc(db, RUTAS.psicologos, psicologo.correo)),
}
