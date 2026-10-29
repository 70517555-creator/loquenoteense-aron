export interface Revision {
  patron: RegExp
  consejo: string
}

export const revisiones: Revision[] = [
  { patron: /\b(siempre|nunca)\b/, consejo: '“Siempre” y “nunca” suenan a acusación. Habla de una situación concreta.' },
  { patron: /por ?que no\b/, consejo: '“¿Por qué no…?” suele sonar a reclamo. Prueba con “¿Qué pasó con…?”.' },
  { patron: /a tu edad|cuando yo era/, consejo: 'Comparar con tu juventud hace sentir que lo suyo no importa.' },
  { patron: /tu (hermano|hermana|primo|prima)|los demas|otros chicos|tus companeros/, consejo: 'Evita comparar con otros: duele y no motiva.' },
  { patron: /tienes que|debes|porque lo digo yo|te ordeno/, consejo: 'Las órdenes cierran la conversación. Explica el porqué y pide su opinión.' },
  { patron: /\b(flojo|floja|ocioso|ociosa|tonto|tonta|inutil|vago|vaga|burro|burra|malcriad[oa])\b/, consejo: 'Las etiquetas lastiman y se quedan grabadas. Describe la conducta, no a la persona.' },
  { patron: /te (quito|castigo)|vas a ver|si no .*(te|vas)/, consejo: 'Empezar con una amenaza pone a tu hijo a la defensiva.' },
]

export const consejoSobreGritos = 'Los signos de exclamación o las mayúsculas se leen como gritos.'

export const lenguajeCercano = /me siento|me preocupa|me gustaria|quiero entender|cuentame|te quiero|me importas/

export const estructuraRecomendada =
  '✍️ Una estructura que funciona:\n' +
  '1. Lo que observaste: “Vi que…”\n' +
  '2. Lo que sientes: “Me preocupa…”\n' +
  '3. Una pregunta abierta: “¿Qué está pasando?”\n' +
  '4. Tu disposición: “Quiero ayudarte”.'
