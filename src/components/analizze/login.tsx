import { useState, type FormEvent } from "react";
import { Activity, KeyRound, Terminal, ArrowRight } from "lucide-react";
import { useAnalizze } from "@/lib/analizze-store";

export function LoginScreen() {
  const { login } = useAnalizze();
  const [terminal, setTerminal] = useState("");
  const [secret, setSecret] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    const ok = await login(terminal, secret);
    if (!ok) setErr("Terminal ID ou Secret Key inválidos.");
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-slate-950">
      {/* Ambient grid + glow */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255 / 0.5) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-brand opacity-30 blur-[140px]" />
      <div className="absolute -bottom-40 -right-20 h-[420px] w-[420px] rounded-full bg-indigo-600 opacity-25 blur-[140px]" />

      <div className="relative z-10 flex flex-col justify-between p-10 lg:w-1/2 text-white az-fade-in">
        <div className="flex items-center gap-3 az-fade-up">
          <div className="az-logo-spin az-pulse-glow h-10 w-10 rounded-xl bg-brand flex items-center justify-center shadow-[0_0_24px_rgb(37_99_235_/_0.7)]">
            <Activity className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-black italic tracking-tight text-xl leading-none">ANALIZZE</div>
            <div className="text-[10px] tracking-[0.22em] text-white/40 mt-1 uppercase">Inteligência Corporativa</div>
          </div>
        </div>
        <div className="hidden lg:block max-w-md az-fade-up az-delay-2">
          <h2 className="text-4xl font-black italic tracking-tight leading-[1.05] mb-4">
            Decisões em tempo real.<br />
            <span className="text-brand-glow">Inteligência sob medida.</span>
          </h2>
          <p className="text-white/55 text-sm leading-relaxed">
            Autentique-se com seu Terminal ID para acessar previsões em tempo real,
            controle de entregas, faturamento e dados operacionais sincronizados.
          </p>
        </div>
        <div className="text-[11px] text-white/30 tracking-wider uppercase az-fade-in az-delay-4">
          v3.2 · Cluster eu-central-1 · Seguro
        </div>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md bg-white/[0.04] backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl az-bounce-in"
        >
          <div className="mb-7 az-fade-up az-delay-2">
            <div className="text-[10px] tracking-[0.22em] uppercase text-brand-glow font-semibold">Acesso Seguro</div>
            <h1 className="text-2xl font-black italic tracking-tight text-white mt-2">Entrar no Cluster</h1>
            <p className="text-sm text-white/50 mt-1.5">Informe suas credenciais de terminal para continuar.</p>
          </div>

          <div className="space-y-4">
            <label className="block az-fade-up az-delay-3">
              <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-white/50">Terminal ID</span>
              <div className="mt-2 relative">
                <Terminal className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  value={terminal}
                  onChange={(e) => setTerminal(e.target.value)}
                  placeholder="TRM-2026-A1"
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-mono placeholder:text-white/25 focus:border-brand focus:ring-2 focus:ring-brand/30 outline-none transition"
                />
              </div>
            </label>

            <label className="block az-fade-up az-delay-4">
              <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-white/50">Secret Key</span>
              <div className="mt-2 relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm font-mono placeholder:text-white/25 focus:border-brand focus:ring-2 focus:ring-brand/30 outline-none transition"
                />
              </div>
            </label>

            {err && <div className="text-xs text-rose-400 az-fade-in">{err}</div>}

            <button
              type="submit"
              className="az-btn az-fade-up az-delay-5 w-full mt-2 inline-flex items-center justify-center gap-2 bg-brand text-white font-semibold py-3 rounded-xl hover:bg-brand-glow shadow-[0_8px_24px_-6px_rgb(37_99_235_/_0.6)]"
            >
              Autenticar <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40 az-fade-in az-delay-6">
            <span>Criptografia ponta-a-ponta</span>
            <span className="font-mono">SHA-256 · TLS 1.3</span>
          </div>
        </form>
      </div>
    </div>
  );
}