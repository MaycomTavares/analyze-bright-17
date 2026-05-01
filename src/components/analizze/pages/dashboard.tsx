import { TrendingUp, TrendingDown, Truck, DollarSign, Target, Gauge, Database, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, PageHeader } from "../ui-bits";
import { NewDocumentModal } from "../new-document-modal";
import { useAnalizze } from "@/lib/analizze-store";
import { cn } from "@/lib/utils";

const forecastData = [
  { m: "Jan", previsto: 420, real: 410 },
  { m: "Fev", previsto: 460, real: 470 },
  { m: "Mar", previsto: 500, real: 488 },
  { m: "Abr", previsto: 540, real: 558 },
  { m: "Mai", previsto: 580, real: 565 },
  { m: "Jun", previsto: 610, real: 632 },
  { m: "Jul", previsto: 650, real: 670 },
  { m: "Ago", previsto: 680, real: 695 },
  { m: "Set", previsto: 710, real: 702 },
];

const kpis = [
  { label: "Eficiência", value: "94,2%", trend: 3.4, up: true, icon: Gauge },
  { label: "OTIF", value: "88,7%", trend: 1.2, up: true, icon: Truck },
  { label: "Receita", value: "R$ 1,84M", trend: 6.8, up: true, icon: DollarSign },
  { label: "Acurácia", value: "96,1%", trend: -0.4, up: false, icon: Target },
] as const;

export function DashboardPage() {
  const { movements } = useAnalizze();

  return (
    <div>
      <PageHeader
        title="Painel"
        subtitle="Inteligência operacional em tempo real — sincronizado com o cluster Supabase"
        actions={<NewDocumentModal />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {kpis.map((k) => (
          <Card key={k.label} className="p-6">
            <div className="flex items-start justify-between">
              <div className="h-11 w-11 rounded-2xl bg-slate-50 flex items-center justify-center">
                <k.icon className="h-5 w-5 text-slate-700" />
              </div>
              <div className={cn(
                "inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full",
                k.up ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"
              )}>
                {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {k.up ? "+" : ""}{k.trend}%
              </div>
            </div>
            <div className="mt-5">
              <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-400">{k.label}</div>
              <div className="text-3xl md:text-[34px] font-black italic tracking-tight text-slate-900 mt-1.5">{k.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-2 p-7">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h3 className="text-lg font-black italic tracking-tight text-slate-900">Previsto vs Real</h3>
              <p className="text-xs text-slate-500 mt-0.5">Últimos 9 meses · unidades (mil)</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand" /> Previsto</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Real</span>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="m" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="previsto" stroke="#2563eb" strokeWidth={2.4} fill="url(#g1)" />
                <Area type="monotone" dataKey="real" stroke="#10b981" strokeWidth={2.4} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-black italic tracking-tight text-slate-900">Movimentações Recentes</h3>
              <p className="text-xs text-slate-500 mt-0.5">Eventos do Supabase em tempo real</p>
            </div>
            <Database className="h-4 w-4 text-slate-400" />
          </div>
          <ul className="space-y-3">
            {movements.slice(0, 7).map((m) => (
              <li key={m.id} className="flex items-start gap-3 group">
                <div className={cn(
                  "mt-1 h-2 w-2 rounded-full shrink-0",
                  m.table === "carteira" ? "bg-brand" : m.table === "estoque" ? "bg-amber-500" : "bg-emerald-500"
                )} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-800 leading-snug">{m.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">{m.table}</span>
                    <span className="text-[10px] text-slate-400">·</span>
                    <span className="text-[10px] text-slate-400">{new Date(m.ts).toLocaleTimeString()}</span>
                  </div>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-brand transition" />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}