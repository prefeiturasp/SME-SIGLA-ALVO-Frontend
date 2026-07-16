// Utilitarios para o campo "Processo SEI", que aceita apenas digitos.

// Remove todos os caracteres nao numericos de um texto.
export const apenasDigitos = (valor: string): string => valor.replace(/\D/g, "");
