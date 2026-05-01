import { Target, Package, DollarSign, TrendingUp, Database, ArrowUpRight } from "lucide-react";
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
import { useAnalizze } from "@/lib/analizze-store";
import { cn } from "@/lib/utils";

const weeklyData = [
  { sem: "Sem 1", previsto: 1200, realizado: 1140 },
  { sem: "Sem 2", previsto: 1320, realizado: 1280 },
  { sem: "Sem 3", previsto: 1260, realizado: 1190 },
  { sem: "Sem 4", previsto: 1420, realizado: 1440 },
];

const trendData = [
  { m: "Jan", reais: 5300, previsao: 5200 },
  { m: "Fev", reais: 5450, previsao: 5380 },
  { m: "Mar", reais: 5260, previsao: 5310 },
  { m: "Abr", reais: 5780, previsao: 5710 },
  { m: "Mai", reais: 6020, previsao: 6080 },
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
    label: "Faturamento Projetado",
    value: "R$ 412k",
    hint: "Baseado no forecast atual",
    icon: DollarSign,
    tone: "violet",
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
  const { movements } = useAnalizze();

  return (
    <div>
      <PageHeader
        title="Painel"
        subtitle="Inteligência operacional em tempo real — sincronizado com o cluster Supabase"
        actions={<NewDocumentModal />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <Card className="p-7 az-slide-left" animate={false}>
          <div className="mb-5">
            <h3 className="text-lg font-bold tracking-tight text-slate-900">Produção Realizada vs Forecast</h3>
            <p className="text-xs text-slate-500 mt-0.5">Comparativo semanal</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barCategoryGap="22%">
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
            <p className="text-xs text-slate-500 mt-0.5">Histórico dos últimos 5 meses</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-3 p-6 az-slide-right" animate={false}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold tracking-tight text-slate-900">Movimentações Recentes</h3>
              <p className="text-xs text-slate-500 mt-0.5">Eventos do Supabase em tempo real</p>
            </div>
            <Database className="h-4 w-4 text-slate-400" />
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            {movements.slice(0, 7).map((m, i) => (
              <li
                key={m.id}
                className="flex items-start gap-3 group az-row-in p-2 -mx-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                style={{ animationDelay: `${i * 70}ms` }}
              >
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
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}