import { Download, Activity, TrendingDown, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, PageHeader } from "../ui-bits";
import { useAnalizze } from "@/lib/analizze-store";
import { cn } from "@/lib/utils";

type HealthLevel = "excellent" | "good" | "warning";
const healthMap: Record<HealthLevel, { dot: string; text: string; bg: string; ring: string }> = {
  excellent: { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50/70", ring: "ring-emerald-100" },
  good:      { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50/70", ring: "ring-emerald-100" },
  warning:   { dot: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50/70",   ring: "ring-amber-100" },
};

type ProductStatus = "good" | "warning" | "critical";
const productStatusMap: Record<ProductStatus, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  good:     { label: "Bom",     cls: "bg-emerald-50 text-emerald-700 ring-emerald-200/70", icon: CheckCircle2 },
  warning:  { label: "Atenção", cls: "bg-amber-50 text-amber-700 ring-amber-200/70",       icon: AlertCircle },
  critical: { label: "Crítico", cls: "bg-rose-50 text-rose-700 ring-rose-200/70",          icon: AlertCircle },
};

const healthIndicators: { label: string; value: string; level: HealthLevel }[] = [
  { label: "Qualidade dos Dados",     value: "Excelente", level: "excellent" },
  { label: "Capacidade Preditiva",    value: "Forte",     level: "good" },
  { label: "Consistência do Modelo",  value: "Alta",      level: "good" },
  { label: "Variabilidade Sazonal",   value: "Média",     level: "warning" },
  { label: "Aderência da Produção",   value: "Moderada",  level: "warning" },
  { label: "Atualização do Forecast", value: "Regular",   level: "good" },
];

const products: { name: string; forecast: number; actual: number; status: ProductStatus }[] = [
  { name: "Peça Tipo A", forecast: 1200, actual: 980,  status: "critical" },
  { name: "Peça Tipo B", forecast: 850,  actual: 780,  status: "warning" },
  { name: "Peça Tipo C", forecast: 1100, actual: 1150, status: "good" },
  { name: "Peça Tipo D", forecast: 650,  actual: 630,  status: "warning" },
  { name: "Peça Tipo E", forecast: 920,  actual: 945,  status: "good" },
];

export function ReportsPage() {
  const { carteira, faturamento, estoque } = useAnalizze();

  const downloadCSV = () => {
    const rows = [
      ["table", "id", "field1", "field2", "field3"],
      ...carteira.map((c) => ["carteira", c.id, c.product, `${c.qtyDone}/${c.qtyTotal}`, c.status]),
      ...estoque.map((e) => ["estoque", e.id, e.product, String(e.qty), e.location]),
      ...faturamento.map((f) => ["faturamento", f.id, f.client, String(f.amount), f.status]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analizze-dataset-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Relatórios de Desempenho e Acurácia"
        subtitle="Análise detalhada da saúde do processo de forecast"
        actions={
          <button
            onClick={downloadCSV}
            className="az-btn group inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-800 shadow-sm"
          >
            <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" /> Baixar Dataset
          </button>
        }
      />

      {/* KPI Gradient Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <GradientKpi
          title="Acurácia Geral (MAPE)"
          value="95%"
          hint="Taxa de acerto do modelo"
          icon={Activity}
          gradient="from-blue-500 via-blue-600 to-blue-700"
          delay="az-delay-1"
        />
        <GradientKpi
          title="Erro Absoluto Médio"
          value="82"
          hint="Unidades em média"
          icon={TrendingDown}
          gradient="from-violet-500 via-purple-600 to-fuchsia-600"
          delay="az-delay-2"
        />
        <GradientKpi
          title="Viés de Previsão"
          value="+2,1%"
          hint="Leve superestimação"
          icon={TrendingUp}
          gradient="from-emerald-500 via-emerald-600 to-teal-700"
          delay="az-delay-3"
        />
      </div>

      {/* Health Status */}
      <Card className="p-7 mb-6 az-slide-left" animate={false}>
        <div className="mb-5">
          <h3 className="text-lg font-black italic tracking-tight text-slate-900">Status da Saúde do Processo</h3>
          <p className="text-xs text-slate-500 mt-0.5">Indicadores consolidados de performance</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {healthIndicators.map((h, i) => {
            const c = healthMap[h.level];
            return (
              <div
                key={h.label}
                className={cn(
                  "az-row-in flex items-center justify-between rounded-2xl px-4 py-3.5 ring-1 transition-transform hover:scale-[1.015]",
                  c.bg, c.ring,
                )}
                style={{ animationDelay: `${80 + i * 60}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className={cn("h-2.5 w-2.5 rounded-full shadow", c.dot)} />
                  <span className="text-sm font-semibold text-slate-800">{h.label}</span>
                </div>
                <span className={cn("text-sm font-black italic tracking-tight", c.text)}>{h.value}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Products variance table */}
      <Card className="p-7 az-slide-right" animate={false}>
        <div className="mb-5">
          <h3 className="text-lg font-black italic tracking-tight text-slate-900">Produtos com Maior Variação (Previsto vs Real)</h3>
          <p className="text-xs text-slate-500 mt-0.5">Ranking de produtos com maior desvio</p>
        </div>

        <div className="overflow-hidden rounded-2xl ring-1 ring-slate-100">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/80">
              <tr className="text-left text-[11px] font-semibold tracking-[0.14em] uppercase text-slate-500">
                <th className="px-5 py-3.5">Produto</th>
                <th className="px-5 py-3.5">Previsto</th>
                <th className="px-5 py-3.5">Realizado</th>
                <th className="px-5 py-3.5">Variação</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const variance = ((p.actual - p.forecast) / p.forecast) * 100;
                const positive = variance >= 0;
                const st = productStatusMap[p.status];
                return (
                  <tr
                    key={p.name}
                    className="az-row-in border-t border-slate-100 hover:bg-slate-50/50 transition-colors"
                    style={{ animationDelay: `${100 + i * 70}ms` }}
                  >
                    <td className="px-5 py-4 font-semibold text-slate-900">{p.name}</td>
                    <td className="px-5 py-4 text-slate-700 tabular-nums">{p.forecast.toLocaleString("pt-BR")}</td>
                    <td className="px-5 py-4 text-slate-700 tabular-nums">{p.actual.toLocaleString("pt-BR")}</td>
                    <td className={cn("px-5 py-4 font-bold tabular-nums", positive ? "text-emerald-600" : "text-rose-600")}>
                      {positive ? "+" : ""}{variance.toFixed(1)}%
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn("az-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1", st.cls)}>
                        <st.icon className="h-3 w-3" />
                        {st.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-2xl bg-blue-50/60 ring-1 ring-blue-100 px-5 py-4 az-fade-up" style={{ animationDelay: "550ms" }}>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-slate-900">Recomendação do Sistema</div>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                A <span className="font-semibold">Peça Tipo A</span> apresenta desvio crítico. Revisar parâmetros de sazonalidade e validar integração com o sistema de produção para melhorar a acurácia.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function GradientKpi({
  title, value, hint, icon: Icon, gradient, delay,
}: {
  title: string; value: string; hint: string;
  icon: typeof Activity; gradient: string; delay: string;
}) {
  return (
    <div
      className={cn(
        "az-bounce-in az-card relative overflow-hidden rounded-[28px] p-6 text-white",
        "bg-gradient-to-br shadow-[0_18px_40px_-12px_rgb(15_23_42_/_0.25)]",
        gradient, delay,
      )}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -left-6 -bottom-12 h-36 w-36 rounded-full bg-black/10 blur-2xl" />
      <div className="relative">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/20">
            <Icon className="h-4.5 w-4.5" />
          </div>
          <span className="text-sm font-semibold text-white/95">{title}</span>
        </div>
        <div className="text-5xl md:text-[56px] font-black italic tracking-tight mt-5 leading-none drop-shadow-sm">
          {value}
        </div>
        <div className="text-xs text-white/80 mt-3 font-medium">{hint}</div>
      </div>
    </div>
  );
}
