import { Target, Package, TrendingUp, Calendar } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, PageHeader } from "../ui-bits";
import { NewDocumentModal } from "../new-document-modal";
import { cn } from "@/lib/utils";

const weeklyData = [
  { date: "2026-04-06", sem: "Sem 1", previsto: 1200, realizado: 1140 },
  { date: "2026-04-13", sem: "Sem 2", previsto: 1320, realizado: 1280 },
  { date: "2026-04-20", sem: "Sem 3", previsto: 1260, realizado: 1190 },
  { date: "2026-04-27", sem: "Sem 4", previsto: 1420, realizado: 1440 },
  { date: "2026-05-04", sem: "Sem 5", previsto: 1380, realizado: 1320 },
  { date: "2026-05-11", sem: "Sem 6", previsto: 1500, realizado: 1480 },
];

const trendData = [
  { date: "2026-01-15", m: "Jan", reais: 5300, previsao: 5200 },
  { date: "2026-02-15", m: "Fev", reais: 5450, previsao: 5380 },
  { date: "2026-03-15", m: "Mar", reais: 5260, previsao: 5310 },
  { date: "2026-04-15", m: "Abr", reais: 5780, previsao: 5710 },
  { date: "2026-05-15", m: "Mai", reais: 6020, previsao: 6080 },
];

const kpis = [
  {
    label: "Aderência da Produção",
    value: "92%",
    hint: "Peças entregues vs forecast do mês",
    icon: Target,
    tone: "blue",
  },
  {
    label: "Previsão Próximo Mês",
    value: "5.900",
    hint: "Unidades previstas para junho",
    icon: Package,
    tone: "emerald",
  },
  {
    label: "Acurácia do Modelo (MAPE)",
    value: "95%",
    hint: "Taxa de acerto da previsão",
    icon: TrendingUp,
    tone: "emerald",
  },
] as const;

const toneMap: Record<string, string> = {
  blue: "bg-brand text-white shadow-[0_8px_20px_-6px_rgba(37,99,235,0.55)]",
  emerald: "bg-emerald-500 text-white shadow-[0_8px_20px_-6px_rgba(16,185,129,0.55)]",
  violet: "bg-violet-500 text-white shadow-[0_8px_20px_-6px_rgba(139,92,246,0.55)]",
};

export function DashboardPage() {
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-12-31");

  const inRange = (d: string) => d >= from && d <= to;
  const filteredWeekly = useMemo(() => weeklyData.filter((w) => inRange(w.date)), [from, to]);
  const filteredTrend = useMemo(() => trendData.filter((t) => inRange(t.date)), [from, to]);

  return (
    <div>
      <PageHeader
        title="Painel"
        subtitle="Inteligência operacional em tempo real — sincronizado com o cluster Supabase"
        actions={<NewDocumentModal />}
      />

      <Card className="p-4 mb-6 flex flex-wrap items-center gap-4" animate={false}>
        <div className="flex items-center gap-2 text-slate-700">
          <Calendar className="h-4 w-4 text-brand" />
          <span className="text-sm font-semibold">Período</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold tracking-wide uppercase text-slate-500">De</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15 outline-none transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold tracking-wide uppercase text-slate-500">Até</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15 outline-none transition"
          />
        </div>
        <button
          onClick={() => { setFrom("2026-01-01"); setTo("2026-12-31"); }}
          className="ml-auto text-xs font-semibold text-brand hover:underline"
        >
          Limpar filtro
        </button>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        {kpis.map((k, i) => (
          <Card key={k.label} className="p-6" delayClass={`az-delay-${i + 1}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm text-slate-500 leading-snug">{k.label}</div>
              <div className={cn(
                "az-card-icon h-11 w-11 rounded-2xl flex items-center justify-center shrink-0",
                toneMap[k.tone],
              )}>
                <k.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="text-4xl md:text-[42px] font-black italic tracking-tight text-slate-900 mt-3 leading-none">
              {k.value}
            </div>
            <div className="text-xs text-slate-500 mt-3">{k.hint}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card className="p-7 az-slide-left" animate={false}>
          <div className="mb-5">
            <h3 className="text-lg font-bold tracking-tight text-slate-900">Produção Realizada vs Forecast</h3>
            <p className="text-xs text-slate-500 mt-0.5">Comparativo semanal — {filteredWeekly.length} semanas no período</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredWeekly} barCategoryGap="22%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="sem" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                  formatter={(v) => <span className="text-slate-600">{v === "previsto" ? "Forecast" : "Realizado"}</span>}
                />
                <Bar dataKey="previsto" name="previsto" fill="#2563eb" radius={[8, 8, 0, 0]} />
                <Bar dataKey="realizado" name="realizado" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-7 az-slide-right" animate={false}>
          <div className="mb-5">
            <h3 className="text-lg font-bold tracking-tight text-slate-900">Tendência de Vendas e Previsão</h3>
            <p className="text-xs text-slate-500 mt-0.5">Histórico filtrado pelo período selecionado</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="m" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                  formatter={(v) => <span className="text-slate-600">{v === "reais" ? "Vendas Reais" : "Previsão"}</span>}
                />
                <Line
                  type="monotone"
                  dataKey="reais"
                  name="reais"
                  stroke="#2563eb"
                  strokeWidth={2.6}
                  dot={{ r: 4, fill: "#2563eb" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="previsao"
                  name="previsao"
                  stroke="#10b981"
                  strokeWidth={2.6}
                  strokeDasharray="6 5"
                  dot={{ r: 4, fill: "#10b981" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}