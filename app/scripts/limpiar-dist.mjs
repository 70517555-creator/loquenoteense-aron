import { existsSync, readdirSync, rmdirSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

const CARPETA_DE_SALIDA = 'dist'

function borrarArchivoPorArchivo(carpeta) {
  for (const entrada of readdirSync(carpeta, { withFileTypes: true })) {
    const ruta = join(carpeta, entrada.name)
    if (entrada.isDirectory()) borrarArchivoPorArchivo(ruta)
    else unlinkSync(ruta)
  }
  rmdirSync(carpeta)
}

if (existsSync(CARPETA_DE_SALIDA)) borrarArchivoPorArchivo(CARPETA_DE_SALIDA)
if (existsSync(CARPETA_DE_SALIDA)) throw new Error(`No se pudo borrar ${CARPETA_DE_SALIDA}/`)
