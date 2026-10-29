import { config } from '../../config'
import type { RespuestaAsistente } from '../../ports/AssistantPort'
import { vinetas } from './conversacion'

export function respuestaDeRiesgo(): RespuestaAsistente {
  const lineasDeAyuda = vinetas(config.ayuda.map((linea) => `${linea.nombre} — ${linea.detalle}`))
  return {
    fuente: 'guia',
    alerta: true,
    texto: [
      'Gracias por confiar y contarlo. Lo que describes es importante y no tienes que enfrentarlo solo o sola.',
      `Si hay peligro inmediato, llama ahora:\n${lineasDeAyuda}`,
      'Mantente cerca de tu hijo o hija, escúchale sin juzgar y no lo dejes solo si crees que puede hacerse daño. ' +
        `También puedes comunicarte con el área de psicología del ${config.colegio}.`,
    ].join('\n\n'),
  }
}
