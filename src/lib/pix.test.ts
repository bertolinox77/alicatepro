import { describe, expect, it } from "vitest";
import { hasError, isStaticPix, parsePix } from "pix-utils";
import { gerarPixCopiaCola } from "./pix";
import { pedidoSchema } from "./pedidos.schema";

describe("pagamento somente Pix", () => {
  it("aceita Pix e rejeita cartão nos pedidos", () => {
    expect(pedidoSchema.shape.forma_pagamento.safeParse("pix").success).toBe(true);
    expect(pedidoSchema.shape.forma_pagamento.safeParse("cartao").success).toBe(false);
  });
  it.each([4491, 7191])("gera Pix válido com chave fornecida e valor %i", (total) => {
    const pix = parsePix(gerarPixCopiaCola(total, "12345678-1234-1234-1234-123456789012"));
    expect(hasError(pix)).toBe(false);
    if (hasError(pix) || !isStaticPix(pix)) throw new Error("Pix inválido");
    expect(pix.pixKey).toBe("e9de5848-9477-4f49-bb61-f46c03d49093");
    expect(pix.transactionAmount).toBe(total / 100);
    expect(pix.merchantName).toBe("GUILHERME");
    expect(pix.merchantCity).toBe("LONDRINA");
  });
});