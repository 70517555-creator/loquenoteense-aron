export interface Etiqueta {
  id: string
  texto: string
  color: 'crema' | 'rosa' | 'verde'
  x: number
  y: number
  giro: number
  reflexion: string
  pregunta: string
}

export interface Situacion {
  id: string
  contexto: string
  padre: string
  hijo: string
  detras: string
  pruebaHoy: string
}

export interface Opcion {
  texto: string
  feedback: string
}

export interface Escenario {
  id: string
  pregunta: string
  opciones: Opcion[]
  mejor: number
}

export interface Voz {
  id: string
  iniciales: string
  texto: string
  grado: string
}

export interface Reto {
  id: string
  titulo: string
  minutos: number
  descripcion: string
  pasos: string[]
  temas: string[]
}

export interface Tendencia {
  id: string
  titulo: string
  icono: string
  loQueVes: string[]
  loQueCuentan: string[]
  comoAcompanar: string[]
  pregunta: string
}

export interface RecursoItem {
  texto: string
  detalle?: string
  url?: string
}

export interface GrupoRecursos {
  id: string
  titulo: string
  items: RecursoItem[]
}

export interface Episodio {
  id: string
  numero: number
  titulo: string
  descripcion: string
  duracion: string
  spotifyEmbed?: string
  audioUrl?: string
}
