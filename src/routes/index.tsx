import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { QRCodeSVG } from "qrcode.react";
import {
  BatteryFull, Zap, Lightbulb, RotateCcw, Truck, ShieldCheck, Clock, Wrench, Check, Copy, QrCode, Flame,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import hero from "@/assets/chave-hero.jpg";
import { calcularTotal, formatarReais, CHAVE_PIX, PRECO_1_CENTAVOS, PRECO_2_CENTAVOS } from "@/lib/pricing";
import { criarPedido } from "@/lib/pedidos.functions";
import { gerarPixCopiaCola } from "@/lib/pix";
import { pedidoSchema, type PedidoInput } from "@/lib/pedidos.schema";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chave Catraca Elétrica Bomvink 12V | Oferta Leve 2" },
      { name: "description", content: "Chave catraca elétrica sem fio Bomvink 12V, 60Nm, 2 baterias e 7 soquetes. R$119 ou 2 por R$187. 10% off no Pix." },
      { property: "og:title", content: "Chave Catraca Elétrica Sem Fio Bomvink 12V 60Nm" },
      { property: "og:description", content: "Catraca elétrica sem fio 12V com 60Nm de torque, 2 baterias, LED e 7 soquetes. R$119 ou 2 por R$187, com 10% off no Pix." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function useCountdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      setLeft(end.getTime() - now.getTime());
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  if (left === null) return "--:--:--";
  const h = Math.floor(left / 3.6e6), m = Math.floor((left % 3.6e6) / 6e4), s = Math.floor((left % 6e4) / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

const beneficios = [
  { icon: Zap, t: "60Nm de torque", d: "Força para soltar e apertar parafusos sem esforço." },
  { icon: BatteryFull, t: "2 baterias 2000mAh", d: "Uma carrega enquanto a outra trabalha." },
  { icon: Lightbulb, t: "LED integrado", d: "Ilumina cantos escuros do motor." },
  { icon: RotateCcw, t: "Reversível", d: "Aperta e afrouxa com um toque." },
];

const kit = ["1 Chave catraca elétrica 12V 3/8\"", "2 Baterias 2000mAh", "1 Carregador bivolt", "7 Soquetes", "1 Adaptador 1/4\""];

function Index() {
  const tempo = useCountdown();
  const [qtd, setQtd] = useState<1 | 2>(2);
  const irCheckout = (q: 1 | 2) => {
    setQtd(q);
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <div className="sticky top-0 z-40 bg-gradient-primary text-primary-foreground text-center text-sm font-semibold py-2 px-3 flex items-center justify-center gap-2">
        <Flame className="size-4" /> Últimas 8 unidades · Frete grátis · Promoção termina em <span className="font-display tabular-nums">{tempo}</span>
      </div>

      <header className="max-w-6xl mx-auto px-5 py-5 flex items-center justify-between">
        <span className="font-display text-2xl tracking-tight">BOM<span className="text-primary">VINK</span></span>
        <span className="text-xs text-muted-foreground flex items-center gap-1"><Truck className="size-4" /> Frete grátis para todo o Brasil</span>
      </header>

      <section className="relative bg-gradient-hero">
        <div className="max-w-6xl mx-auto px-5 pb-16 pt-4 grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary border border-primary/40 rounded-full px-3 py-1 mb-4">Mais vendida da semana</span>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.05] uppercase">Chave catraca elétrica <span className="text-primary">sem fio</span></h1>
            <p className="mt-4 text-lg text-muted-foreground">Termine a manutenção do carro em minutos, até nos espaços mais apertados. 12V, 60Nm, 2 baterias e 7 soquetes.</p>
            <div className="mt-6 flex items-end gap-3">
              
              <span className="font-display text-4xl text-primary">{formatarReais(PRECO_1_CENTAVOS)}</span>
            </div>
            <p className="text-sm text-accent font-semibold mt-1">ou {formatarReais(calcularTotal(1, "pix"))} no Pix (10% off)</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
              <span className="flex items-center gap-1 rounded-full bg-primary/15 text-primary px-3 py-1"><Flame className="size-4" /> Últimas 8 unidades</span>
              <span className="flex items-center gap-1 rounded-full bg-accent/15 text-accent px-3 py-1"><Truck className="size-4" /> Frete grátis</span>
              <span className="rounded-full border border-border px-3 py-1 tabular-nums">Termina em {tempo}</span>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button variant="hero" size="lg" className="h-14 text-base" onClick={() => irCheckout(2)}>Quero 2 por {formatarReais(PRECO_2_CENTAVOS)}</Button>
              <Button variant="outline" size="lg" className="h-14" onClick={() => irCheckout(1)}>Comprar 1 unidade</Button>
            </div>
            <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><ShieldCheck className="size-4 text-accent" /> Compra segura</span>
              <span className="flex items-center gap-1"><Truck className="size-4 text-accent" /> Frete grátis</span>
              <span className="flex items-center gap-1"><RotateCcw className="size-4 text-accent" /> 7 dias para devolução</span>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img src={hero} alt="Chave catraca elétrica Bomvink com baterias, carregador e soquetes" width={1024} height={1024} className="rounded-2xl shadow-glow w-full" />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="font-display text-3xl uppercase text-center">Por que todo mecânico quer uma</h2>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {beneficios.map((b) => (
            <div key={b.t} className="bg-card border border-border rounded-xl p-5">
              <b.icon className="size-8 text-primary" />
              <h3 className="mt-3 font-bold">{b.t}</h3>
              <p className="text-sm text-muted-foreground mt-1">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/50 border-y border-border">
        <div className="max-w-6xl mx-auto px-5 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl uppercase">Kit completo na caixa</h2>
            <ul className="mt-6 space-y-3">
              {kit.map((k) => (
                <li key={k} className="flex items-center gap-3"><Check className="size-5 text-accent shrink-0" /> {k}</li>
              ))}
            </ul>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <Wrench className="size-8 text-primary" />
            <p className="mt-3 text-lg">Ideal para troca de óleo, freios, motor, motos e qualquer trabalho em locais apertados onde a catraca manual não gira.</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="font-display text-3xl uppercase text-center">Escolha sua oferta</h2>
        <p className="text-center text-muted-foreground mt-2 flex items-center justify-center gap-2"><Clock className="size-4" /> Preço promocional válido até {tempo}</p>
        <div className="mt-10 grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Oferta qtd={1} onEscolher={irCheckout} />
          <Oferta qtd={2} destaque onEscolher={irCheckout} />
        </div>
      </section>

      <Checkout qtd={qtd} setQtd={setQtd} />

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Bomvink. Todos os direitos reservados.
      </footer>
    </div>
  );
}

function Oferta({ qtd, destaque, onEscolher }: { qtd: 1 | 2; destaque?: boolean; onEscolher: (q: 1 | 2) => void }) {
  const total = qtd === 2 ? PRECO_2_CENTAVOS : PRECO_1_CENTAVOS;
  const economia = qtd === 2 ? PRECO_1_CENTAVOS * 2 - PRECO_2_CENTAVOS : 0;
  return (
    <div className={`relative rounded-2xl p-6 border ${destaque ? "border-primary bg-card shadow-glow" : "border-border bg-card"}`}>
      {destaque && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground text-xs font-bold uppercase px-3 py-1 rounded-full">Mais escolhida</span>}
      <h3 className="font-display text-xl uppercase">{qtd === 1 ? "1 Unidade" : "Leve 2 unidades"}</h3>
      <p className="font-display text-4xl text-primary mt-3">{formatarReais(total)}</p>
      {economia > 0 && <p className="text-accent text-sm font-semibold">Economize {formatarReais(economia)} ({formatarReais(PRECO_2_CENTAVOS / 2)} cada)</p>}
      <p className="text-sm text-muted-foreground mt-1">ou {formatarReais(calcularTotal(qtd, "pix"))} no Pix</p>
      <Button variant={destaque ? "hero" : "outline"} className="w-full h-12 mt-5" onClick={() => onEscolher(qtd)}>Escolher</Button>
    </div>
  );
}

const vazio = { nome: "", email: "", telefone: "", cpf: "", cep: "", endereco: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "" };

function Checkout({ qtd, setQtd }: { qtd: 1 | 2; setQtd: (q: 1 | 2) => void }) {
  const forma = "pix" as const;
  const criarPedidoFn = useServerFn(criarPedido);
  const [f, setF] = useState(vazio);
  const [enviando, setEnviando] = useState(false);
  const [pagamento, setPagamento] = useState<{ total: number; codigoPix: string; dados: PedidoInput } | null>(null);
  const [pedido, setPedido] = useState<{ id: string; total: number } | null>(null);
  const total = calcularTotal(qtd, forma);

  const set = (k: keyof typeof vazio) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  async function buscarCep(cep: string) {
    const c = cep.replace(/\D/g, "");
    if (c.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${c}/json/`).then((x) => x.json());
      if (!r.erro) setF((p) => ({ ...p, endereco: r.logradouro || p.endereco, bairro: r.bairro || p.bairro, cidade: r.localidade || p.cidade, estado: r.uf || p.estado }));
    } catch { /* ignora */ }
  }

  function prepararPagamento(e: React.FormEvent) {
    e.preventDefault();
    const dados = pedidoSchema.safeParse({ ...f, complemento: f.complemento || undefined, quantidade: qtd, forma_pagamento: forma });
    if (!dados.success) {
      toast.error("Confira os dados preenchidos e tente novamente.");
      return;
    }
    const codigoPix = gerarPixCopiaCola(total, crypto.randomUUID());
    setPagamento({ total, codigoPix, dados: dados.data });
  }

  async function enviar() {
    if (!pagamento || enviando) return;
    setEnviando(true);
    try {
      const r = await criarPedidoFn({ data: pagamento.dados });
      setPedido(r);
    } catch {
      toast.error("Não foi possível enviar o pedido. Não pague novamente; tente enviar mais uma vez.");
    } finally {
      setEnviando(false);
    }
  }

  if (pedido) {
    return (
      <section id="checkout" className="max-w-xl mx-auto px-5 py-16">
        <div className="bg-card border border-primary rounded-2xl p-6 text-center">
          <Check className="size-12 text-accent mx-auto" />
          <h2 className="font-display text-2xl uppercase mt-3">Pedido recebido!</h2>
          <p className="text-muted-foreground mt-1">Pedido #{pedido.id.slice(0, 8).toUpperCase()} · {formatarReais(pedido.total)}</p>
          <p className="mt-5 text-sm text-muted-foreground">Assim que conferirmos o seu Pix, você receberá a confirmação do pedido por e-mail. O pedido só é confirmado após o pagamento.</p>
        </div>
      </section>
    );
  }

  if (pagamento) {
    return (
      <section id="checkout" className="max-w-xl mx-auto px-5 py-16">
        <div className="border border-primary rounded-md p-5 text-center">
          <QrCode className="size-10 text-accent mx-auto" />
          <h2 className="font-display text-2xl uppercase mt-3">Pague com Pix</h2>
          <p className="text-muted-foreground mt-2">{formatarReais(pagamento.total)} · {pagamento.dados.quantidade} {pagamento.dados.quantidade === 1 ? "unidade" : "unidades"}</p>
          <div className="mt-6 space-y-4 text-left">
            <h3 className="font-semibold text-center">Pagamento via Pix · 10% de desconto</h3>
            <div className="mx-auto w-fit rounded-md bg-pix-paper p-3">
              <QRCodeSVG value={pagamento.codigoPix} size={224} marginSize={2} level="M" className="block h-auto max-w-full" title="QR Code para pagamento Pix" />
            </div>
            <p className="text-center text-sm text-muted-foreground">Recebedor: Guilherme</p>
            <div className="space-y-2">
              <Label htmlFor="pix-copia-cola">Pix copia e cola</Label>
              <Input id="pix-copia-cola" readOnly value={pagamento.codigoPix} onFocus={(e) => e.target.select()} />
              <Button variant="hero" className="w-full" onClick={async () => {
                try {
                  await navigator.clipboard.writeText(pagamento.codigoPix);
                  toast.success("Código Pix copiado!");
                } catch {
                  toast.error("Não foi possível copiar. Selecione e copie o código acima.");
                }
              }}><Copy className="size-4" /> Copiar código Pix</Button>
            </div>
            <p className="break-all text-xs text-muted-foreground">Chave Pix: {CHAVE_PIX}</p>
            <p className="text-sm text-muted-foreground">Valor exato: <b className="text-foreground">{formatarReais(pagamento.total)}</b>. Confira o titular no seu banco antes de pagar.</p>
            <p className="text-sm text-muted-foreground">Pague no seu banco e envie o pedido abaixo. Após conferirmos o Pix, enviamos a confirmação do pedido para o seu e-mail.</p>
            <Button variant="hero" className="w-full h-12 whitespace-normal" disabled={enviando} onClick={enviar}>{enviando ? "Enviando..." : "Enviar pedido"}</Button>
            <Button variant="ghost" className="w-full" disabled={enviando} onClick={() => setPagamento(null)}>Voltar aos dados</Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="checkout" className="bg-secondary/40 border-t border-border">
      <form onSubmit={prepararPagamento} className="max-w-xl mx-auto px-5 py-16 space-y-6">
        <h2 className="font-display text-3xl uppercase text-center">Finalizar compra</h2>

        <div className="grid grid-cols-2 gap-3">
          {([1, 2] as const).map((q) => (
            <Button variant="outline" type="button" key={q} onClick={() => setQtd(q)} aria-pressed={qtd === q} className={`h-auto flex-col items-start rounded-md p-4 text-left transition ${qtd === q ? "border-primary bg-card" : "border-border"}`}>
              <span className="font-bold block">{q === 1 ? "1 unidade" : "2 unidades"}</span>
              <span className="text-primary font-display">{formatarReais(calcularTotal(q, forma))}</span>
            </Button>
          ))}
        </div>

        <div className="grid gap-3">
          <Campo id="nome" label="Nome completo" v={f.nome} on={set("nome")} />
          <div className="grid grid-cols-2 gap-3">
            <Campo id="email" label="E-mail" type="email" v={f.email} on={set("email")} />
            <Campo id="telefone" label="WhatsApp" v={f.telefone} on={set("telefone")} />
          </div>
          <Campo id="cpf" label="CPF" v={f.cpf} on={set("cpf")} />
          <div className="grid grid-cols-3 gap-3">
            <Campo id="cep" label="CEP" v={f.cep} on={(e) => { set("cep")(e); buscarCep(e.target.value); }} />
            <div className="col-span-2"><Campo id="endereco" label="Endereço" v={f.endereco} on={set("endereco")} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Campo id="numero" label="Número" v={f.numero} on={set("numero")} />
            <div className="col-span-2"><Campo id="complemento" label="Complemento" v={f.complemento} on={set("complemento")} required={false} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Campo id="bairro" label="Bairro" v={f.bairro} on={set("bairro")} />
            <Campo id="cidade" label="Cidade" v={f.cidade} on={set("cidade")} />
            <Campo id="estado" label="UF" v={f.estado} on={set("estado")} />
          </div>
        </div>

        <div className="flex items-center gap-3 border-y border-border py-4">
          <QrCode className="size-6 text-accent shrink-0" />
          <div><span className="font-bold">Pix</span><p className="text-sm text-accent">10% de desconto</p></div>
        </div>

        <div className="flex justify-between items-center border-t border-border pt-4">
          <span className="text-muted-foreground">Total</span>
          <span className="font-display text-3xl text-primary">{formatarReais(total)}</span>
        </div>
        <Button type="submit" variant="hero" size="lg" className="w-full h-14 text-base" disabled={enviando}>
          Continuar para pagamento Pix
        </Button>
        <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1"><ShieldCheck className="size-4" /> Seus dados estão protegidos</p>
      </form>
    </section>
  );
}

function Campo({ id, label, v, on, type = "text", required = true }: { id: string; label: string; v: string; on: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; required?: boolean }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={v} onChange={on} required={required} className="h-11 bg-background" />
    </div>
  );
}
