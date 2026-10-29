import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously, type User } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'
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
