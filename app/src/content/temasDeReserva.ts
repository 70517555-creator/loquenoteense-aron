import type { TemaDelDia } from '../domain/foro'

type TemaDeReserva = Pick<TemaDelDia, 'titulo' | 'descripcion'>

export const temasDeReserva: TemaDeReserva[] = [
  { titulo: '¿Cómo manejan el celular en casa?', descripcion: 'Horarios, lugares sin pantalla, acuerdos que funcionaron o que no. Cuéntanos tu experiencia.' },
  { titulo: 'Cuando nuestro hijo no quiere hablar', descripcion: '¿Qué te ha ayudado a que se abra sin presionarlo?' },
  { titulo: 'Las notas y la presión', descripcion: '¿Cómo reaccionas ante una mala nota? ¿Qué te gustaría hacer distinto?' },
  { titulo: 'Sus amigos y su mundo', descripcion: '¿Cómo te acercas a conocer a sus amigos sin que lo sienta como control?' },
  { titulo: 'Poner límites con cariño', descripcion: '¿Qué límite te ha costado más y cómo lo conversaste?' },
  { titulo: 'Cambios de ánimo', descripcion: 'Un día bien, otro día molesto. ¿Cómo acompañas esos cambios?' },
  { titulo: 'Decidir su futuro', descripcion: 'Carrera, vocación, sueños. ¿Cómo apoyas sin decidir por él o ella?' },
  { titulo: 'Un momento que nos unió', descripcion: 'Comparte algo sencillo que hicieron juntos y que les hizo bien.' },
]
