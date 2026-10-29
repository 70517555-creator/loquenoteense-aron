import { GRADOS } from '../../content/grados'
import type { ModoAsistente } from '../../ports/AssistantPort'

export interface InfoModo {
  id: ModoAsistente
  titulo: string
  icono: string
  explicacion: string
  ejemplo: string
  pideGrado?: boolean
}

export const MODOS: InfoModo[] = [
  {
    id: 'traductor',
    titulo: 'Traductor de emociones',
    icono: 'chat',
    explicacion: 'Escribe lo que te dijo tu hijo o hija y te ayudo a entender qué puede haber detrás.',
    ejemplo: 'Ej.: Me dijo “déjame en paz” y cerró la puerta',
  },
  {
    id: 'ensayo',
    titulo: 'Ensaya una conversación',
    icono: 'people',
    explicacion: 'Yo hago de tu hijo adolescente. Practica cómo hablarle y te doy consejos en cada paso.',
    ejemplo: 'Escribe lo que le dirías…',
  },
  {
    id: 'antes',
    titulo: 'Antes de hablar',
    icono: 'heart',
    explicacion: 'Escribe lo que piensas decirle y te sugiero una forma más cercana de decirlo.',
    ejemplo: 'Ej.: ¿Por qué nunca haces tus tareas?',
  },
  {
    id: 'significa',
    titulo: '¿Qué significa?',
    icono: 'globe',
    explicacion: 'Palabras, jerga o tendencias que escuchaste y no entiendes.',
    ejemplo: 'Ej.: ¿Qué significa “cringe” o “NPC”?',
  },
  {
    id: 'reto',
    titulo: 'Reto a tu medida',
    icono: 'trophy',
    explicacion: 'Cuéntame qué está pasando en casa y te propongo un reto para esta semana.',
    ejemplo: 'Ej.: Casi no conversamos y pasa mucho en el celular',
    pideGrado: true,
  },
]

export const GRADO_POR_DEFECTO = GRADOS[3]
