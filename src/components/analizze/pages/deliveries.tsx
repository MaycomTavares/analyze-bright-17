import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, PageHeader, StatusBadge } from "../ui-bits";
import { NewDocumentModal } from "../new-document-modal";
import { useAnalizze } from "@/lib/analizze-store";

export function DeliveriesPage() {
  const { carteira } = useAnalizze();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "on-time" | "delayed" | "critical">("all");

  const rows = useMemo(() => {
    return carteira.filter((r) =>
      (filter === "all" || r.status === filter) &&
      (q === "" || r.product.toLowerCase().includes(q.toLowerCase()) || r.id.toLowerCase().includes(q.toLowerCase()))
    );
  }, [carteira, q, filter]);

  return (
    <div>
      <PageHeader
        title="Entregas"
        subtitle="Controle de entregas — lotes de produção"
        actions={<NewDocumentModal defaultTable="carteira" />}
      />

      <Card className="p-0 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-5 border-b border-slate-100">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por ID ou produto..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/15 outline-none transition"
            />
          </div>
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            {([
              { v: "all", l: "Todos" },
              { v: "on-time", l: "No prazo" },
              { v: "delayed", l: "Atrasados" },
              { v: "critical", l: "Críticos" },
            ] as const).map((f) => (
              <button
                key={f.v}
                onClick={() => setFilter(f.v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filter === f.v ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f.l}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500 bg-slate-50/50">
                <th className="px-6 py-3.5">ID</th>
                <th className="px-6 py-3.5">Produto</th>
                <th className="px-6 py-3.5 w-[260px]">Quantidade</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Prazo</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const pct = Math.round((r.qtyDone / r.qtyTotal) * 100);
                return (
                  <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-mono text-xs text-slate-700">{r.id}</td>
                    <td className="px-6 py-4 text-slate-900 font-medium">{r.product}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: r.status === "critical" ? "#ef4444" : r.status === "delayed" ? "#f59e0b" : "#2563eb",
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono text-slate-600 tabular-nums w-20 text-right">
                          {r.qtyDone}/{r.qtyTotal}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-xs">{r.deadline}</td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400 text-sm">Nenhum lote corresponde ao filtro atual.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}