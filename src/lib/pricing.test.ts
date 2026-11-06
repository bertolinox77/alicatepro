import { describe, it, expect } from "vitest";
import { calcularTotal, PRECO_1_CENTAVOS, PRECO_2_CENTAVOS } from "./pricing";

describe("preços", () => {
  it("1 unidade custa R$49,90", () => expect(PRECO_1_CENTAVOS).toBe(4990));
  it("kit 2 unidades custa R$79,90", () => expect(PRECO_2_CENTAVOS).toBe(7990));
  it("Pix dá 10% de desconto em 1 unidade", () => expect(calcularTotal(1, "pix")).toBe(4491));
  it("Pix dá 10% de desconto no kit", () => expect(calcularTotal(2, "pix")).toBe(7191));
});
