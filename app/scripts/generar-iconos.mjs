import { mkdirSync, writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const AZUL = [31, 42, 68], CREMA = [251, 241, 230], ROJO = [200, 48, 44], AMBAR = [242, 184, 75]

function dentro(px, py, pol) {
  let c = false
  for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) {
    const [xi, yi] = pol[i], [xj, yj] = pol[j]
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c
  }
  return c
}

function color(x, y, margen) {
  const s = (v) => (v - margen) / (1 - 2 * margen)
  const u = s(x), v = s(y)
  const casa = [[0.5, 0.18], [0.84, 0.47], [0.76, 0.47], [0.76, 0.82], [0.24, 0.82], [0.24, 0.47], [0.16, 0.47]]
  const techo = [[0.5, 0.14], [0.9, 0.49], [0.83, 0.53], [0.5, 0.25], [0.17, 0.53], [0.1, 0.49]]
  if (dentro(u, v, techo)) return ROJO
  if (u > 0.43 && u < 0.57 && v > 0.6 && v < 0.82) return AZUL
  if (u > 0.3 && u < 0.4 && v > 0.55 && v < 0.65) return AMBAR
  if (dentro(u, v, casa)) return CREMA
  return AZUL
}

function png(tam, margen) {
  const ss = 3, filas = []
  for (let y = 0; y < tam; y++) {
    const fila = Buffer.alloc(1 + tam * 4)
    for (let x = 0; x < tam; x++) {
      let r = 0, g = 0, b = 0
      for (let sy = 0; sy < ss; sy++) for (let sx = 0; sx < ss; sx++) {
        const c = color((x + (sx + 0.5) / ss) / tam, (y + (sy + 0.5) / ss) / tam, margen)
        r += c[0]; g += c[1]; b += c[2]
      }
      const n = ss * ss
      fila.set([r / n, g / n, b / n, 255], 1 + x * 4)
    }
    filas.push(fila)
  }
  const crc = (buf) => { let c = -1; for (const b of buf) { c ^= b; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)) } return (c ^ -1) >>> 0 }
  const trozo = (tipo, datos) => {
    const t = Buffer.from(tipo), l = Buffer.alloc(4), c = Buffer.alloc(4)
    l.writeUInt32BE(datos.length); c.writeUInt32BE(crc(Buffer.concat([t, datos])))
    return Buffer.concat([l, t, datos, c])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(tam, 0); ihdr.writeUInt32BE(tam, 4); ihdr.set([8, 6, 0, 0, 0], 8)
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    trozo('IHDR', ihdr), trozo('IDAT', deflateSync(Buffer.concat(filas))), trozo('IEND', Buffer.alloc(0)),
  ])
}

mkdirSync('public/icons', { recursive: true })
writeFileSync('public/icons/icon-192.png', png(192, 0.04))
writeFileSync('public/icons/icon-512.png', png(512, 0.04))
writeFileSync('public/icons/icon-512-maskable.png', png(512, 0.14))
console.log('Íconos generados en public/icons')
