import type { CartaDeEstudiante, NuevaCartaDeEstudiante, RespuestaDeCasa, ResultadoDeCasa } from '../domain/mochila'

export interface MochilaPort {
  resultadoDeCasa(carga: string): Promise<ResultadoDeCasa>
  responderDeCasa(carga: string, respuesta: RespuestaDeCasa): Promise<void>
  cartas(carga: string): Promise<CartaDeEstudiante[]>
  misCartas(): Promise<CartaDeEstudiante[]>
  escribirCarta(carta: NuevaCartaDeEstudiante): Promise<void>
  meHizoPensar(carta: CartaDeEstudiante): Promise<void>
}
