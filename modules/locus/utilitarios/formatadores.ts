/**
 * Formata um numero com zeros a esquerda.
 *
 * Usado nas colunas numericas das tabelas ("03", "08"). Numeros com mais
 * digitos que o minimo sao devolvidos sem alteracao.
 *
 * @example
 * formatarNumeroPadded(3)   // "03"
 * formatarNumeroPadded(105) // "105"
 */
export function formatarNumeroPadded(valor: number, digitos = 2): string {
  return String(valor).padStart(digitos, "0");
}
