import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously, type User } from 'firebase/auth'
import { doc, increment, initializeFirestore, serverTimestamp, writeBatch, type DocumentReference } from 'firebase/firestore'
import { config } from '../../config'

const app = initializeApp(config.firebase)

export const auth = getAuth(app)
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true })

export const RUTAS = {
  temas: 'temas',
  comentarios: (temaId: string) => `temas/${temaId}/comentarios`,
  propuestas: 'propuestas',
  reportes: 'reportes',
  psicologos: 'psicologos',
  votos: 'votos',
  cartas: 'cartas',
  encuesta: 'encuesta',
} as const

export async function usuarioActual(): Promise<User | null> {
  await auth.authStateReady()
  return auth.currentUser
}

let sesionAnonima: Promise<User> | undefined

export async function uidConSesion(): Promise<string> {
  const usuario = await usuarioActual()
  if (usuario) return usuario.uid
  sesionAnonima ??= signInAnonymously(auth).then(({ user }) => user)
  return (await sesionAnonima).uid
}

export async function sumarUnaVez(ref: DocumentReference, campo: string) {
  const uid = await uidConSesion()
  const lote = writeBatch(db)
  lote.update(ref, { [campo]: increment(1) })
  lote.set(doc(ref, RUTAS.votos, uid), { creadoEn: serverTimestamp() })
  await lote.commit()
}
