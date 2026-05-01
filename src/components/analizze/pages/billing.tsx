import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AlertTriangle, CheckCircle2, Info, TrendingDown, TrendingUp } from "lucide-react";
import { Card, PageHeader } from "../ui-bits";
import { NewDocumentModal } from "../new-document-modal";
import { useAnalizze } from "@/lib/analizze-store";
import { useMemo } from "react";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

export function BillingPage() {
  const { faturamento } = useAnalizze();

  const totals = useMemo(() => {
    const sum = (s: string) => faturamento.filter((f) => f.status === s).reduce((a, b) => a + b.amount, 0);
    return { realized: sum("realized"), lost: sum("lost"), projected: sum("projected") };
  }, [faturamento]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    faturamento.forEach((f) => map.set(f.category, (map.get(f.category) || 0) + f.amount));
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [faturamento]);

  const fmt = (n: number) => "$" + n.toLocaleString("en-US");

  const cards = [
    { label: "Realized", value: totals.realized, accent: "from-emerald-500 to-emerald-600", trend: "+12.4%", up: true, icon: CheckCircle2 },
    { label: "Lost", value: totals.lost, accent: "from-rose-500 to-rose-600", trend: "-3.1%", up: false, icon: TrendingDown },
    { label: "Projected", value: totals.projected, accent: "from-brand to-indigo-600", trend: "+8.7%", up: true, icon: TrendingUp },
  ];

  const alerts = [
    { type: "warn", text: "FT-1004 Lumen Aerospace marked as lost — review reason." },
    { type: "info", text: "Projected revenue for May exceeds Q2 target by 4.2%." },
    { type: "warn", text: "Helix Pharma payment overdue by 6 days." },
    { type: "ok", text: "April collection rate reached 96.8%." },
  ];

  return (
    <div>
      <PageHeader
        title="Billing"
        subtitle="Faturamento — realized, lost and projected"
        actions={<NewDocumentModal defaultTable="faturamento" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {cards.map((c) => (
          <Card key={c.label} className="p-7 relative overflow-hidden">
            <div className={`absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br ${c.accent} opacity-[0.08] blur-2xl`} />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${c.accent} text-white flex items-center justify-center shadow-lg`}>
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
        <Card className="xl:col-span-2 p-7">
          <h3 className="text-lg font-black italic tracking-tight text-slate-900 mb-1">Category Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">Revenue split by industry vertical</p>
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

        <Card className="p-6">
          <h3 className="text-lg font-black italic tracking-tight text-slate-900 mb-4">Financial Alerts</h3>
          <ul className="space-y-3">
            {alerts.map((a, i) => {
              const Icon = a.type === "warn" ? AlertTriangle : a.type === "ok" ? CheckCircle2 : Info;
              const color = a.type === "warn" ? "text-amber-600 bg-amber-50" : a.type === "ok" ? "text-emerald-600 bg-emerald-50" : "text-brand bg-brand/10";
              return (
                <li key={i} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 transition">
                  <span className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-slate-700 leading-snug">{a.text}</span>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}