import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { formatarReais } from "@/lib/pricing";
import type { Tables } from "@/integrations/supabase/types";

type Pedido = Tables<"pedidos">;

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Área administrativa | Alicate Multifuncional" },
      { name: "description", content: "Consulta de pedidos e conferência de Pix." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCarregando(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster />
      <header className="max-w-6xl mx-auto px-5 py-5 flex items-center justify-between">
        <span className="font-display text-2xl tracking-tight">BOM<span className="text-primary">VINK</span> <span className="text-sm text-muted-foreground font-sans">admin</span></span>
        {session && <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>Sair</Button>}
      </header>
      {carregando ? null : session ? <Pedidos userId={session.user.id} /> : <Login />}
    </div>
  );
}

function Login() {
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    if (modo === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) toast.error("E-mail ou senha inválidos.");
    } else {
      const { error } = await supabase.auth.signUp({ email, password: senha, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      if (error) toast.error(error.message);
      else toast.success("Conta criada. Confirme pelo link enviado ao seu e-mail.");
    }
    setEnviando(false);
  }

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto mt-16 px-5 space-y-4">
      <h1 className="font-display text-2xl uppercase">{modo === "entrar" ? "Entrar" : "Criar conta"}</h1>
      <div className="space-y-2"><Label htmlFor="email">E-mail</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="senha">Senha</Label><Input id="senha" type="password" required minLength={6} value={senha} onChange={(e) => setSenha(e.target.value)} /></div>
      <Button variant="hero" className="w-full" disabled={enviando}>{modo === "entrar" ? "Entrar" : "Criar conta"}</Button>
      <button type="button" className="text-sm text-muted-foreground underline" onClick={() => setModo(modo === "entrar" ? "criar" : "entrar")}>
        {modo === "entrar" ? "Primeiro acesso? Criar conta" : "Já tenho conta"}
      </button>
    </form>
  );
}

function Pedidos({ userId }: { userId: string }) {
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState<"todos" | "pendentes" | "conferidos">("pendentes");

  async function carregar() {
    const { data, error } = await supabase.from("pedidos").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Não foi possível carregar os pedidos.");
    else setPedidos(data);
  }

  useEffect(() => {
    supabase.rpc("has_role", { _user_id: userId, _role: "admin" }).then(({ data }) => {
      setAdmin(!!data);
      if (data) carregar();
    });
  }, [userId]);

  async function marcar(p: Pedido, conferido: boolean) {
    const { error } = await supabase
      .from("pedidos")
      .update({ pix_conferido_em: conferido ? new Date().toISOString() : null, status: conferido ? "pix_conferido" : "aguardando_pagamento" })
      .eq("id", p.id);
    if (error) toast.error("Não foi possível atualizar.");
    else carregar();
  }

  if (admin === null) return null;
  if (!admin) return <p className="text-center mt-16 text-muted-foreground">Esta conta não tem acesso à área administrativa.</p>;

  const lista = pedidos.filter((p) => filtro === "todos" || (filtro === "conferidos" ? p.pix_conferido_em : !p.pix_conferido_em));

  return (
    <main className="max-w-6xl mx-auto px-5 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl uppercase">Pedidos</h1>
        <div className="flex gap-2">
          {(["pendentes", "conferidos", "todos"] as const).map((f) => (
            <Button key={f} size="sm" variant={filtro === f ? "hero" : "outline"} onClick={() => setFiltro(f)} className="capitalize">{f}</Button>
          ))}
        </div>
      </div>
      {lista.length === 0 && <p className="mt-10 text-muted-foreground">Nenhum pedido aqui.</p>}
      <div className="mt-6 space-y-4">
        {lista.map((p) => {
          const assunto = encodeURIComponent(`Pedido #${p.id.slice(0, 8).toUpperCase()} confirmado - Alicate Multifuncional`);
          const corpo = encodeURIComponent(`Olá ${p.nome},\n\nRecebemos seu Pix de ${formatarReais(p.total_centavos)} e seu pedido de ${p.quantidade} chave(s) elétrica(s) Alicate Multifuncional está confirmado. Em breve enviaremos o código de rastreio.\n\nObrigado!`);
          return (
            <article key={p.id} className="bg-card border border-border rounded-xl p-5 grid md:grid-cols-[1fr_auto] gap-4">
              <div className="text-sm space-y-1">
                <p className="font-bold text-base">#{p.id.slice(0, 8).toUpperCase()} · {p.nome} · {formatarReais(p.total_centavos)} · {p.quantidade} un</p>
                <p className="text-muted-foreground">{new Date(p.created_at).toLocaleString("pt-BR")}</p>
                <p>{p.email} · {p.telefone} · CPF {p.cpf}</p>
                <p className="text-muted-foreground">{p.endereco}, {p.numero}{p.complemento ? ` - ${p.complemento}` : ""} · {p.bairro} · {p.cidade}/{p.estado} · CEP {p.cep}</p>
                <p className={p.pix_conferido_em ? "text-accent font-semibold" : "text-primary font-semibold"}>
                  {p.pix_conferido_em ? `Pix conferido em ${new Date(p.pix_conferido_em).toLocaleString("pt-BR")}` : "Pix ainda não conferido"}
                </p>
              </div>
              <div className="flex flex-col gap-2 md:w-52">
                {p.pix_conferido_em ? (
                  <>
                    <Button variant="hero" asChild><a href={`mailto:${p.email}?subject=${assunto}&body=${corpo}`}>Enviar confirmação por e-mail</a></Button>
                    <Button variant="ghost" size="sm" onClick={() => marcar(p, false)}>Desfazer conferência</Button>
                  </>
                ) : (
                  <Button variant="hero" onClick={() => marcar(p, true)}>Marcar Pix como conferido</Button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
