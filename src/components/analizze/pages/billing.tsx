import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CheckCircle2, Package, TrendingDown, TrendingUp } from "lucide-react";
import { Card, PageHeader } from "../ui-bits";
import { NewDocumentModal } from "../new-document-modal";
import { useAnalizze } from "@/lib/analizze-store";
import { useMemo } from "react";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

export function BillingPage() {
  const { faturamento } = useAnalizze();

  const totals = useMemo(() => {
    const sum = (s: string) => faturamento.filter((f) => f.status === s).reduce((a, b) => a + b.volume, 0);
    return { realized: sum("realized"), lost: sum("lost"), projected: sum("projected") };
  }, [faturamento]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    faturamento.forEach((f) => map.set(f.category, (map.get(f.category) || 0) + f.volume));
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [faturamento]);

  const fmt = (n: number) => n.toLocaleString("pt-BR") + " un.";

  const byClient = useMemo(
    () =>
      faturamento
        .map((f) => ({ name: f.client, volume: f.volume }))
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 6),
    [faturamento],
  );

  const cards = [
    { label: "Volume Realizado", value: totals.realized, accent: "from-emerald-500 to-emerald-600", trend: "+12,4%", up: true, icon: CheckCircle2 },
    { label: "Volume Perdido", value: totals.lost, accent: "from-rose-500 to-rose-600", trend: "-3,1%", up: false, icon: TrendingDown },
    { label: "Volume Projetado", value: totals.projected, accent: "from-brand to-indigo-600", trend: "+8,7%", up: true, icon: TrendingUp },
  ];

  return (
    <div>
      <PageHeader
        title="Faturamento"
        subtitle="Quantidade de itens previstos para venda — volume realizado, perdido e projetado"
        actions={<NewDocumentModal defaultTable="faturamento" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {cards.map((c, i) => (
          <Card key={c.label} className="p-7 relative overflow-hidden" delayClass={`az-delay-${i + 1}`}>
            <div className={`absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br ${c.accent} opacity-[0.08] blur-2xl`} />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className={`az-card-icon h-11 w-11 rounded-2xl bg-gradient-to-br ${c.accent} text-white flex items-center justify-center shadow-lg`}>
                  <c.icon className="h-5 w-5" />
                </div>
                <div className={`text-xs font-bold ${c.up ? "text-emerald-600" : "text-rose-600"}`}>{c.trend}</div>
              </div>
              <div className="mt-6">
                <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-400">{c.label}</div>
                <div className="text-4xl font-black italic tracking-tight text-slate-900 mt-2">{fmt(c.value)}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-3 p-7 az-slide-left" animate={false}>
          <h3 className="text-lg font-black italic tracking-tight text-slate-900 mb-1">Volume por Categoria</h3>
          <p className="text-xs text-slate-500 mb-4">Unidades previstas por vertical de mercado</p>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={62} outerRadius={100} paddingAngle={2}>
                    {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2.5">
              {byCategory.map((c, i) => (
                <li key={c.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-slate-700 font-medium">{c.name}</span>
                  </span>
                  <span className="font-mono text-xs text-slate-600">{fmt(c.value)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="xl:col-span-3 p-7" animate={false}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black italic tracking-tight text-slate-900">Volume por Cliente</h3>
              <p className="text-xs text-slate-500 mt-0.5">Top clientes em quantidade de itens previstos</p>
            </div>
            <Package className="h-4 w-4 text-slate-400" />
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byClient}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v: number) => fmt(v)} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="volume" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}