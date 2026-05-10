import { useMemo } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, PageHeader } from "../ui-bits";
import { useAnalizze } from "@/lib/analizze-store";
import { cn } from "@/lib/utils";

export function PlanningPage() {
  const { estoque, carteira } = useAnalizze();

  const rows = useMemo(() => {
    return estoque.map((item) => {
      const demand = carteira
        .filter((c) => c.product.toLowerCase().includes(item.product.split(" ")[0].toLowerCase()))
        .reduce((acc, c) => acc + (c.qtyTotal - c.qtyDone), 0);
      const diff = item.qty - demand;
      return { ...item, demand, diff };
    });
  }, [estoque, carteira]);

  const urgent = rows.filter((r) => r.diff < 0).length;
  const ok = rows.length - urgent;

  return (
    <div>
      <PageHeader
        title="Planejamento de Necessidades"
        subtitle="Comparativo entre saldo em estoque e carteira de pedidos em aberto"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg az-card-icon">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] tracking-[0.16em] uppercase text-slate-400 font-semibold">Itens cobertos</div>
              <div className="text-3xl font-black italic tracking-tight text-slate-900 mt-1">{ok}</div>
            </div>
          </div>
        </Card>
        <Card className="p-6" delayClass="az-delay-2">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg az-card-icon">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] tracking-[0.16em] uppercase text-slate-400 font-semibold">Compra/produção urgente</div>
              <div className="text-3xl font-black italic tracking-tight text-rose-600 mt-1">{urgent}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden" animate={false}>
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-lg font-black italic tracking-tight text-slate-900">Pedido vs Estoque</h3>
          <p className="text-xs text-slate-500 mt-0.5">Diferença = Estoque − Carteira de pedidos em aberto</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500 bg-slate-50/60">
                <th className="px-6 py-3.5">SKU</th>
                <th className="px-6 py-3.5">Produto</th>
                <th className="px-6 py-3.5 text-right">Estoque</th>
                <th className="px-6 py-3.5 text-right">Pedidos abertos</th>
                <th className="px-6 py-3.5 text-right">Diferença</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const urgent = r.diff < 0;
                return (
                  <tr
                    key={r.id}
                    className={cn(
                      "border-t border-slate-100 transition az-row-in",
                      urgent ? "bg-rose-50/60 hover:bg-rose-50" : "hover:bg-slate-50/60",
                    )}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-slate-700">{r.sku}</td>
                    <td className="px-6 py-4 text-slate-900 font-medium">{r.product}</td>
                    <td className="px-6 py-4 text-right font-mono tabular-nums text-slate-700">{r.qty}</td>
                    <td className="px-6 py-4 text-right font-mono tabular-nums text-slate-700">{r.demand}</td>
                    <td className={cn("px-6 py-4 text-right font-mono tabular-nums font-bold", urgent ? "text-rose-600" : "text-emerald-600")}>
                      {r.diff > 0 ? `+${r.diff}` : r.diff}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1",
                        urgent ? "bg-rose-50 text-rose-700 ring-rose-200/70" : "bg-emerald-50 text-emerald-700 ring-emerald-200/70",
                      )}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", urgent ? "bg-rose-500" : "bg-emerald-500")} />
                        {urgent ? "Comprar/Produzir" : "OK"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}