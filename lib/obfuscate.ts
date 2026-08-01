/**
 * Ofuscação simples (string invertida + base64) para dificultar a raspagem
 * automatizada de contatos sensíveis (e-mail, telefone) por bots que só leem
 * o HTML bruto. Não é segurança real — um scraper sofisticado rodando um
 * navegador de verdade ainda consegue ler o que um humano lê. O objetivo é
 * só elevar o custo o bastante pra barrar a maioria dos bots simples de
 * coleta em massa (regex por "mailto:", "wa.me/", padrão de e-mail etc.
 * direto no HTML bruto, sem executar JS).
 */
export function decodeObfuscated(encoded: string): string {
  try {
    return atob(encoded).split('').reverse().join('')
  } catch {
    return ''
  }
}
