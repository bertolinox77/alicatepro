import { createServerFn } from "@tanstack/react-start";
import { calcularTotal } from "./pricing";
import { pedidoSchema } from "./pedidos.schema";
export type { PedidoInput } from "./pedidos.schema";

export const criarPedido = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => pedidoSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const total = calcularTotal(data.quantidade, data.forma_pagamento);
    const { data: row, error } = await supabaseAdmin
      .from("pedidos")
      .insert({ ...data, complemento: data.complemento ?? null, estado: data.estado.toUpperCase(), total_centavos: total })
      .select("id")
      .single();
    if (error) {
      console.error(error);
      throw new Error("Não foi possível registrar o pedido.");
    }
    return { id: row.id as string, total };
  });
