export const PRECO_1_CENTAVOS = 4990;
export const PRECO_2_CENTAVOS = 7990;
export const DESCONTO_PIX = 0.1;

export type FormaPagamento = "pix";

export function calcularTotal(quantidade: 1 | 2, forma: FormaPagamento): number {
  const base = quantidade === 2 ? PRECO_2_CENTAVOS : PRECO_1_CENTAVOS;
  return forma === "pix" ? Math.round(base * (1 - DESCONTO_PIX)) : base;
}

export function formatarReais(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const CHAVE_PIX = "e9de5848-9477-4f49-bb61-f46c03d49093";
