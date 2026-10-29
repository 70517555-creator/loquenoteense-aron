export type ResultadoDeCompartir = 'compartido' | 'copiado' | 'cancelado'

export async function compartirTexto(texto: string): Promise<ResultadoDeCompartir> {
  try {
    if (navigator.share) {
      await navigator.share({ text: texto })
      return 'compartido'
    }
    await navigator.clipboard.writeText(texto)
    return 'copiado'
  } catch {
    return 'cancelado'
  }
}
