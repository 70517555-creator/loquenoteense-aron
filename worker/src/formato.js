const REGLAS_DE_LIMPIEZA = [
  [/^#{1,6}\s*/gm, ''],
  [/^\s*[*-]\s+/gm, '• '],
  [/\*\*(.+?)\*\*/g, '$1'],
  [/__(.+?)__/g, '$1'],
  [/(^|[^\w*])\*(?!\s)(.+?)\*(?!\w)/g, '$1$2'],
]

export const limpiarFormato = (texto) => REGLAS_DE_LIMPIEZA.reduce((t, [patron, reemplazo]) => t.replace(patron, reemplazo), texto)
