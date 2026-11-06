import { z } from "zod";

export const pedidoSchema = z.object({
  nome: z.string().trim().min(3).max(120),
  email: z.string().trim().email().max(200),
  telefone: z.string().trim().min(10).max(20),
  cpf: z.string().trim().min(11).max(14),
  cep: z.string().trim().min(8).max(9),
  endereco: z.string().trim().min(3).max(200),
  numero: z.string().trim().min(1).max(20),
  complemento: z.string().trim().max(100).optional(),
  bairro: z.string().trim().min(2).max(100),
  cidade: z.string().trim().min(2).max(100),
  estado: z.string().trim().length(2),
  quantidade: z.union([z.literal(1), z.literal(2)]),
  forma_pagamento: z.literal("pix"),
});

export type PedidoInput = z.infer<typeof pedidoSchema>;