import { useState } from "react";
import { Database, Key, Eye, EyeOff, RefreshCw, Check } from "lucide-react";
import { Card, PageHeader } from "../ui-bits";
import { useAnalizze } from "@/lib/analizze-store";

export function SettingsPage() {
  const { supabaseSync, toggleSync } = useAnalizze();
  const [show, setShow] = useState(false);
  const [apiKey, setApiKey] = useState("sbp_live_8f3a4c12d9b7e6a5f0123456789abcde");
  const [serviceKey, setServiceKey] = useState("svc_role_J3kL9mN2oP4qR6sT8uV0wX2yZ4");
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div>
      <PageHeader title="Configurações" subtitle="Sincronização do cluster e credenciais de integração" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-7" delayClass="az-delay-1">
          <div className="flex items-start gap-4">
            <div className="az-card-icon h-11 w-11 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
              <Database className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-black italic tracking-tight text-slate-900 text-lg">Sincronização Supabase</h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Quando ativada, cada inserção ou atualização é enviada ao seu cluster Supabase em tempo real.
              </p>
            </div>
            <button
              role="switch"
              aria-checked={supabaseSync}
              onClick={toggleSync}
              className={`az-btn relative h-7 w-12 rounded-full shrink-0 ${supabaseSync ? "bg-brand" : "bg-slate-300"}`}
            >
              <span className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${supabaseSync ? "translate-x-5" : ""}`} />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 pt-6 border-t border-slate-100">
            <Stat label="Tabelas" value="3" />
            <Stat label="Região" value="eu-c1" />
            <Stat label="Latência" value="42ms" />
          </div>
        </Card>

        <Card className="p-7" delayClass="az-delay-2">
          <div className="flex items-start gap-4 mb-5">
            <div className="az-card-icon h-11 w-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Key className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-black italic tracking-tight text-slate-900 text-lg">Chaves de API</h3>
              <p className="text-sm text-slate-500 mt-1">Gerencie as chaves do projeto e service-role.</p>
            </div>
            <button onClick={() => setShow((s) => !s)} className="az-btn text-slate-400 hover:text-slate-700 p-1">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="space-y-4">
            <KeyField label="Chave Anon do Projeto" value={apiKey} onChange={setApiKey} masked={!show} />
            <KeyField label="Chave Service Role" value={serviceKey} onChange={setServiceKey} masked={!show} />
          </div>

          <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100">
            <button className="az-btn group text-xs text-slate-500 inline-flex items-center gap-1.5 hover:text-slate-800">
              <RefreshCw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" /> Rotacionar chaves
            </button>
            <button
              onClick={save}
              className="az-btn inline-flex items-center gap-2 bg-brand text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 shadow-[0_4px_12px_-2px_rgb(37_99_235_/_0.4)]"
            >
              {saved ? <span className="inline-flex items-center gap-1.5 az-scale-in"><Check className="h-4 w-4" /> Salvo</span> : "Salvar alterações"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-slate-400">{label}</div>
      <div className="text-lg font-black italic tracking-tight text-slate-900 mt-0.5">{value}</div>
    </div>
  );
}

function KeyField({ label, value, onChange, masked }: { label: string; value: string; onChange: (v: string) => void; masked: boolean }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-slate-500">{label}</span>
      <input
        type={masked ? "password" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-mono focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15 outline-none transition"
      />
    </label>
  );
}