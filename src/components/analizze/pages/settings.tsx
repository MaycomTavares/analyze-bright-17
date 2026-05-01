import { useState } from "react";
import { Database, Key, Eye, EyeOff, RefreshCw, Check, Bell, Globe, Shield, Webhook, Zap, Users } from "lucide-react";
import { Card, PageHeader } from "../ui-bits";
import { useAnalizze } from "@/lib/analizze-store";
import { cn } from "@/lib/utils";

type TabId = "geral" | "integracoes" | "seguranca" | "notificacoes";

const tabs: { id: TabId; label: string; icon: typeof Globe }[] = [
  { id: "geral",         label: "Geral",         icon: Globe },
  { id: "integracoes",   label: "Integrações",   icon: Webhook },
  { id: "seguranca",     label: "Segurança",     icon: Shield },
  { id: "notificacoes",  label: "Notificações",  icon: Bell },
];

export function SettingsPage() {
  const [tab, setTab] = useState<TabId>("geral");

  return (
    <div>
      <PageHeader title="Configurações" subtitle="Sincronização do cluster, integrações e preferências" />

      {/* Tabs */}
      <div className="mb-6 inline-flex p-1.5 rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "az-btn relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300",
                active
                  ? "bg-brand text-white shadow-[0_6px_16px_-4px_rgb(37_99_235_/_0.45)]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div key={tab} className="az-fade-up">
        {tab === "geral" && <GeralTab />}
        {tab === "integracoes" && <IntegracoesTab />}
        {tab === "seguranca" && <SegurancaTab />}
        {tab === "notificacoes" && <NotificacoesTab />}
      </div>
    </div>
  );
}

/* ---------- GERAL ---------- */
function GeralTab() {
  const { supabaseSync, toggleSync } = useAnalizze();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [darkLogs, setDarkLogs] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Card className="p-7" delayClass="az-delay-1">
        <div className="flex items-start gap-4">
          <div className="az-card-icon h-11 w-11 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
            <Database className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-black italic tracking-tight text-slate-900 text-lg">Sincronização Supabase</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Quando ativada, cada inserção ou atualização é enviada ao seu cluster em tempo real.
            </p>
          </div>
          <Toggle on={supabaseSync} onClick={toggleSync} />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 pt-6 border-t border-slate-100">
          <Stat label="Tabelas" value="3" />
          <Stat label="Região" value="eu-c1" />
          <Stat label="Latência" value="42ms" />
        </div>
      </Card>

      <Card className="p-7" delayClass="az-delay-2">
        <div className="flex items-start gap-4 mb-5">
          <div className="az-card-icon h-11 w-11 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Zap className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-black italic tracking-tight text-slate-900 text-lg">Preferências de Operação</h3>
            <p className="text-sm text-slate-500 mt-1">Comportamento padrão do dashboard.</p>
          </div>
        </div>

        <div className="space-y-3">
          <PrefRow label="Atualização automática" hint="Atualiza KPIs a cada 30 segundos" on={autoRefresh} onClick={() => setAutoRefresh((v) => !v)} />
          <PrefRow label="Logs detalhados" hint="Exibe payload completo nas movimentações" on={darkLogs} onClick={() => setDarkLogs((v) => !v)} />
        </div>
      </Card>

      <Card className="p-7 lg:col-span-2" delayClass="az-delay-3">
        <div className="flex items-start gap-4 mb-5">
          <div className="az-card-icon h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-black italic tracking-tight text-slate-900 text-lg">Identidade do Terminal</h3>
            <p className="text-sm text-slate-500 mt-1">Informações exibidas em logs de auditoria.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome do Terminal" defaultValue="ANZ-TERMINAL-01" />
          <Field label="Operador Responsável" defaultValue="Equipe de Forecast" />
          <Field label="Fuso Horário" defaultValue="America/Sao_Paulo" />
          <Field label="Idioma" defaultValue="Português (BR)" />
        </div>
      </Card>
    </div>
  );
}

/* ---------- INTEGRAÇÕES ---------- */
function IntegracoesTab() {
  const integrations = [
    { name: "Supabase Cluster", desc: "Banco de dados primário e auth", status: "Conectado", color: "emerald", icon: Database },
    { name: "Webhooks de Produção", desc: "Eventos para sistemas ERP", status: "Conectado", color: "emerald", icon: Webhook },
    { name: "Slack Notifications", desc: "Alertas críticos no canal #ops", status: "Inativo",   color: "slate",   icon: Bell },
    { name: "Google Sheets Export", desc: "Sincronização semanal de relatórios", status: "Conectado", color: "emerald", icon: Globe },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {integrations.map((it, i) => (
        <Card key={it.name} className="p-6" delayClass={`az-delay-${i + 1}`}>
          <div className="flex items-start gap-4">
            <div className="az-card-icon h-12 w-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <it.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-black italic text-slate-900">{it.name}</h4>
                <span
                  className={cn(
                    "az-badge text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-full ring-1",
                    it.color === "emerald"
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-slate-100 text-slate-600 ring-slate-200",
                  )}
                >
                  {it.status}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1">{it.desc}</p>
              <button className="az-btn text-xs font-semibold text-brand mt-4 hover:underline">
                {it.status === "Conectado" ? "Configurar →" : "Conectar →"}
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ---------- SEGURANÇA ---------- */
function SegurancaTab() {
  const [show, setShow] = useState(false);
  const [apiKey, setApiKey] = useState("sbp_live_8f3a4c12d9b7e6a5f0123456789abcde");
  const [serviceKey, setServiceKey] = useState("svc_role_J3kL9mN2oP4qR6sT8uV0wX2yZ4");
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 1800); };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Card className="p-7 lg:col-span-2" delayClass="az-delay-1">
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
          <KeyField label="Chave Anon do Projeto"  value={apiKey}     onChange={setApiKey}     masked={!show} />
          <KeyField label="Chave Service Role"     value={serviceKey} onChange={setServiceKey} masked={!show} />
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

      <Card className="p-7" delayClass="az-delay-2">
        <div className="flex items-start gap-4">
          <div className="az-card-icon h-11 w-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-black italic tracking-tight text-slate-900 text-lg">Autenticação 2FA</h3>
            <p className="text-sm text-slate-500 mt-1">Adicione uma camada extra de segurança no login do terminal.</p>
          </div>
          <Toggle on={true} onClick={() => {}} />
        </div>
      </Card>

      <Card className="p-7" delayClass="az-delay-3">
        <div className="flex items-start gap-4">
          <div className="az-card-icon h-11 w-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-black italic tracking-tight text-slate-900 text-lg">Sessões ativas</h3>
            <p className="text-sm text-slate-500 mt-1">3 dispositivos conectados a este terminal.</p>
            <button className="az-btn text-xs font-semibold text-brand mt-3 hover:underline">Gerenciar sessões →</button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ---------- NOTIFICAÇÕES ---------- */
function NotificacoesTab() {
  const [items, setItems] = useState([
    { key: "critical", label: "Alertas críticos",       hint: "Lotes com risco alto ou atrasos severos", on: true },
    { key: "delay",    label: "Atrasos de produção",    hint: "Notifica quando um lote excede SLA",      on: true },
    { key: "billing",  label: "Movimentações de receita", hint: "Faturas realizadas, perdidas ou previstas", on: false },
    { key: "weekly",   label: "Resumo semanal",         hint: "Envio de relatório consolidado às segundas", on: true },
  ]);
  const toggle = (k: string) => setItems((arr) => arr.map((i) => i.key === k ? { ...i, on: !i.on } : i));

  return (
    <Card className="p-7" delayClass="az-delay-1">
      <div className="flex items-start gap-4 mb-5">
        <div className="az-card-icon h-11 w-11 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
          <Bell className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-black italic tracking-tight text-slate-900 text-lg">Canais de notificação</h3>
          <p className="text-sm text-slate-500 mt-1">Escolha quais eventos disparam alertas no terminal.</p>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((i) => (
          <PrefRow key={i.key} label={i.label} hint={i.hint} on={i.on} onClick={() => toggle(i.key)} />
        ))}
      </div>
    </Card>
  );
}

/* ---------- shared bits ---------- */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-slate-400">{label}</div>
      <div className="text-lg font-black italic tracking-tight text-slate-900 mt-0.5">{value}</div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-slate-500">{label}</span>
      <input
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15 outline-none transition"
      />
    </label>
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

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={cn("az-btn relative h-7 w-12 rounded-full shrink-0 transition-colors", on ? "bg-brand" : "bg-slate-300")}
    >
      <span className={cn("absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300", on && "translate-x-5")} />
    </button>
  );
}

function PrefRow({ label, hint, on, onClick }: { label: string; hint: string; on: boolean; onClick: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50/70 ring-1 ring-slate-100 px-4 py-3.5 transition-transform hover:scale-[1.01]">
      <div>
        <div className="text-sm font-semibold text-slate-900">{label}</div>
        <div className="text-xs text-slate-500 mt-0.5">{hint}</div>
      </div>
      <Toggle on={on} onClick={onClick} />
    </div>
  );
}
