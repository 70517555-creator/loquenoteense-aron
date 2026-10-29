import { Timestamp, type DocumentSnapshot } from 'firebase/firestore'
import type { Comentario, Propuesta, Psicologo, Reporte, TemaDelDia } from '../../domain/foro'

const fecha = (valor: unknown) => (valor instanceof Timestamp ? valor.toDate() : new Date())

export const aTema = (d: DocumentSnapshot): TemaDelDia => ({
  id: d.id,
  titulo: d.get('titulo'),
  descripcion: d.get('descripcion') ?? '',
  fecha: d.get('fecha'),
})

export const aComentario = (d: DocumentSnapshot, uid?: string): Comentario => ({
  id: d.id,
  temaId: d.ref.parent.parent?.id ?? '',
  temaTitulo: d.get('temaTitulo') ?? '',
  texto: d.get('texto'),
  apodo: d.get('apodo'),
  rol: d.get('rol'),
  estado: d.get('estado'),
  urgente: Boolean(d.get('urgente')),
  meAyudo: d.get('meAyudo') ?? 0,
  creadoEn: fecha(d.get('creadoEn')),
  esMio: d.get('autorUid') === uid,
  motivoRechazo: d.get('motivoRechazo'),
  respondeA: d.get('respondeA'),
})

export const aPropuesta = (d: DocumentSnapshot, uid?: string): Propuesta => ({
  id: d.id,
  texto: d.get('texto'),
  nivel: d.get('nivel'),
  estado: d.get('estado'),
  votos: d.get('votos') ?? 0,
  creadoEn: fecha(d.get('creadoEn')),
  esMia: d.get('autorUid') === uid,
  motivoRechazo: d.get('motivoRechazo'),
  fechaProgramada: d.get('fechaProgramada'),
})

export const aReporte = (d: DocumentSnapshot): Reporte => ({
  id: d.id,
  ruta: d.get('ruta'),
  texto: d.get('texto'),
  motivo: d.get('motivo'),
  creadoEn: fecha(d.get('creadoEn')),
})

export const aPsicologo = (d: DocumentSnapshot): Psicologo => ({
  correo: d.id,
  nombre: d.get('nombre'),
  coordinador: Boolean(d.get('coordinador')),
})

export const sinRepetir = <T extends { id: string }>(lista: T[]) => [...new Map(lista.map((x) => [x.id, x])).values()]
