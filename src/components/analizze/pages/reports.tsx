import { Download, Activity, BarChart3, Sigma, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, PageHeader } from "../ui-bits";
import { useAnalizze } from "@/lib/analizze-store";

const errorData = [
  { m: "Jan", mape: 5.2, vies: -1.2 },
  { m: "Fev", mape: 4.8, vies: -0.6 },
  { m: "Mar", mape: 4.1, vies: 0.4 },
  { m: "Abr", mape: 3.7, vies: 0.9 },
  { m: "Mai", mape: 3.2, vies: 1.1 },
  { m: "Jun", mape: 3.5, vies: 0.7 },
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

  const metrics = [
    { label: "MAPE", value: "3,2%", icon: Sigma, hint: "Erro Percentual Absoluto Médio" },
    { label: "Viés", value: "+1,1", icon: Activity, hint: "Índice de viés da previsão" },
    { label: "R²", value: "0,964", icon: BarChart3, hint: "Coeficiente de determinação" },
    { label: "Vazão", value: "12,4k/h", icon: Zap, hint: "Linhas processadas por hora" },
  ];

  return (
    <div>
      <PageHeader
        title="Relatórios"
        subtitle="Acurácia do modelo e métricas operacionais"
        actions={
          <button
            onClick={downloadCSV}
            className="az-btn group inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-800 shadow-sm"
          >
            <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" /> Baixar Dataset
          </button>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {metrics.map((m, i) => (
          <Card key={m.label} className="p-6" delayClass={`az-delay-${i + 1}`}>
            <m.icon className="az-card-icon h-5 w-5 text-brand mb-5" />
            <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-400">{m.label}</div>
            <div className="text-3xl md:text-[32px] font-black italic tracking-tight text-slate-900 mt-1">{m.value}</div>
            <div className="text-[11px] text-slate-500 mt-2">{m.hint}</div>
          </Card>
        ))}
      </div>

      <Card className="p-7 az-slide-left" animate={false}>
        <div className="flex items-end justify-between mb-5">
          <div>
            <h3 className="text-lg font-black italic tracking-tight text-slate-900">Tendência de Erro da Previsão</h3>
            <p className="text-xs text-slate-500 mt-0.5">MAPE e Viés — últimos 6 meses</p>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={errorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="m" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Bar dataKey="mape" fill="#2563eb" radius={[8, 8, 0, 0]} />
              <Bar dataKey="vies" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}