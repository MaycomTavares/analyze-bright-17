import { useMemo } from "react";
import { Boxes, Clock, DollarSign } from "lucide-react";
import { Card, PageHeader } from "../ui-bits";
import { NewDocumentModal } from "../new-document-modal";
import { useAnalizze } from "@/lib/analizze-store";
import { cn } from "@/lib/utils";

const STALE_DAYS = 60;

const fmtBRL = (n: number) => "R$ " + n.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
const daysSince = (iso: string) => Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));

export function InventoryPage() {
  const { estoque } = useAnalizze();

  const enriched = useMemo(
    () =>
      estoque.map((e) => {
        const idle = daysSince(e.lastMovement);
        return { ...e, idle, totalValue: e.qty * e.cost, isStale: idle >= STALE_DAYS };
      }),
    [estoque],
  );

  const stale = enriched.filter((e) => e.isStale);
  const totalValue = enriched.reduce((a, b) => a + b.totalValue, 0);
  const staleValue = stale.reduce((a, b) => a + b.totalValue, 0);

  return (
    <div>
      <PageHeader
        title="Gestão de Estoque"
        subtitle="Saldo, valor monetário e análise de itens parados"
        actions={<NewDocumentModal defaultTable="estoque" />}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-brand text-white flex items-center justify-center shadow-lg az-card-icon">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] tracking-[0.16em] uppercase text-slate-400 font-semibold">SKUs em estoque</div>
              <div className="text-3xl font-black italic tracking-tight text-slate-900 mt-1">{enriched.length}</div>
            </div>
          </div>
        </Card>
        <Card className="p-6" delayClass="az-delay-2">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg az-card-icon">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] tracking-[0.16em] uppercase text-slate-400 font-semibold">Valor total estocado</div>
              <div className="text-3xl font-black italic tracking-tight text-slate-900 mt-1">{fmtBRL(totalValue)}</div>
            </div>
          </div>
        </Card>
        <Card className="p-6" delayClass="az-delay-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg az-card-icon">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[11px] tracking-[0.16em] uppercase text-slate-400 font-semibold">Capital parado ({stale.length} itens)</div>
              <div className="text-3xl font-black italic tracking-tight text-rose-600 mt-1">{fmtBRL(staleValue)}</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden mb-6" animate={false}>
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-lg font-black italic tracking-tight text-slate-900">Itens em Estoque</h3>
          <p className="text-xs text-slate-500 mt-0.5">Posição completa do inventário</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500 bg-slate-50/60">
                <th className="px-6 py-3.5">SKU</th>
                <th className="px-6 py-3.5">Produto</th>
                <th className="px-6 py-3.5">Local</th>
                <th className="px-6 py-3.5 text-right">Qtd.</th>
                <th className="px-6 py-3.5 text-right">Custo unit.</th>
                <th className="px-6 py-3.5 text-right">Valor total</th>
                <th className="px-6 py-3.5 text-right">Última mov.</th>
              </tr>
            </thead>
            <tbody>
              {enriched.map((e, i) => (
                <tr key={e.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition az-row-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="px-6 py-4 font-mono text-xs text-slate-700">{e.sku}</td>
                  <td className="px-6 py-4 text-slate-900 font-medium">{e.product}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-xs">{e.location}</td>
                  <td className="px-6 py-4 text-right font-mono tabular-nums text-slate-700">{e.qty}</td>
                  <td className="px-6 py-4 text-right font-mono tabular-nums text-slate-700">{fmtBRL(e.cost)}</td>
                  <td className="px-6 py-4 text-right font-mono tabular-nums font-semibold text-slate-900">{fmtBRL(e.totalValue)}</td>
                  <td className="px-6 py-4 text-right text-slate-600 font-mono text-xs">{e.lastMovement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden" animate={false}>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black italic tracking-tight text-slate-900">Itens Sem Movimentação</h3>
            <p className="text-xs text-slate-500 mt-0.5">Estoque parado há mais de {STALE_DAYS} dias</p>
          </div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full ring-1 ring-rose-200/70">
            {stale.length} {stale.length === 1 ? "item" : "itens"}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500 bg-slate-50/60">
                <th className="px-6 py-3.5">SKU</th>
                <th className="px-6 py-3.5">Produto</th>
                <th className="px-6 py-3.5 text-right">Qtd. parada</th>
                <th className="px-6 py-3.5 text-right">Lead time inativo</th>
                <th className="px-6 py-3.5 text-right">Capital imobilizado</th>
              </tr>
            </thead>
            <tbody>
              {stale.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-slate-400 text-sm">Nenhum item parado — estoque saudável.</td></tr>
              )}
              {stale.map((e, i) => (
                <tr key={e.id} className="border-t border-slate-100 bg-rose-50/40 hover:bg-rose-50 transition az-row-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="px-6 py-4 font-mono text-xs text-slate-700">{e.sku}</td>
                  <td className="px-6 py-4 text-slate-900 font-medium">{e.product}</td>
                  <td className="px-6 py-4 text-right font-mono tabular-nums text-slate-700">{e.qty}</td>
                  <td className={cn("px-6 py-4 text-right font-mono tabular-nums font-bold", e.idle > 120 ? "text-rose-700" : "text-amber-700")}>
                    {e.idle} dias
                  </td>
                  <td className="px-6 py-4 text-right font-mono tabular-nums font-bold text-rose-700">{fmtBRL(e.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}