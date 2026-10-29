import { retos } from '../../../content/retos'
import type { Reto } from '../../../domain/tipos'
import { enumerar, respuestaDeLaGuia, ultimoMensajeDelPadre, type EstrategiaDeRespuesta } from '../conversacion'
import { detectarTema } from '../temas'
import { normalizar } from '../../../utils/texto'

const AJUSTE_PRIMARIA = 'Como es más pequeño, hazlo en forma de juego y en un momento corto.'
const AJUSTE_ADOLESCENTE = 'Como es adolescente, respeta si al inicio no quiere; vuelve a proponerlo otro día sin presionar.'

function elegirReto(texto: string): Reto {
  const tema = detectarTema(normalizar(texto))
  const relacionados = tema ? retos.filter((r) => r.temas.includes(tema.id)) : []
  const candidatos = relacionados.length ? relacionados : retos
  return candidatos[new Date().getDate() % candidatos.length]
}

const ajusteSegunGrado = (grado?: string) =>
  grado?.toLowerCase().includes('prim') ? AJUSTE_PRIMARIA : AJUSTE_ADOLESCENTE

export const retoAMedida: EstrategiaDeRespuesta = ({ mensajes, grado }) => {
  const reto = elegirReto(ultimoMensajeDelPadre(mensajes))
  const texto = [
    `🎯 Tu reto para esta semana: ${reto.titulo} (${reto.minutos} min)\n${reto.descripcion}`,
    enumerar(reto.pasos),
    ajusteSegunGrado(grado),
  ].join('\n\n')
  return respuestaDeLaGuia(texto, [{ texto: `Ir al reto: ${reto.titulo}`, ruta: `/retos?r=${reto.id}` }])
}
