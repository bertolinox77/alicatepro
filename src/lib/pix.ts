import { createStaticPix, hasError } from "pix-utils";
import { CHAVE_PIX } from "./pricing";

export function gerarPixCopiaCola(totalCentavos: number, pedidoId: string): string {
  const pix = createStaticPix({
    pixKey: CHAVE_PIX,
    merchantName: "GUILHERME",
    merchantCity: "LONDRINA",
    transactionAmount: totalCentavos / 100,
    txid: pedidoId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 25),
  });
  if (hasError(pix)) throw new Error("Não foi possível gerar o código Pix.");
  return pix.toBRCode();
}