export const clases = (...nombres: (string | false | null | undefined)[]) => nombres.filter(Boolean).join(' ')
