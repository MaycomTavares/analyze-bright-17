import { useMemo } from "react";
import { Card, PageHeader } from "../ui-bits";
import { cn } from "@/lib/utils";

const months = [
  "Jun/26", "Jul/26", "Ago/26", "Set/26", "Out/26", "Nov/26",
  "Dez/26", "Jan/27", "Fev/27", "Mar/27", "Abr/27", "Mai/27", "Jun/27",
];

const products = [
  { name: "Rolamento 6204-2RS", base: 820, accuracy: 96 },
  { name: "Cilindro Hidráulico HC-220", base: 410, accuracy: 88 },
  { name: "Servo Motor SM-7K", base: 180, accuracy: 92 },
  { name: "Painel Compósito CP-XL", base: 240, accuracy: 84 },
  { name: "Engrenagem PG-12T", base: 520, accuracy: 94 },
  { name: "Estrutura Alumínio AF-90", base: 360, accuracy: 78 },
  { name: "Bobina Cobre 0.5mm", base: 610, accuracy: 91 },
  { name: "Resina Polimérica", base: 95, accuracy: 89 },
];

export function ForecastPage() {
  const rows = useMemo(
    () =>
      products.map((p, idx) => ({
        ...p,
        values: months.map((_, i) => Math.round(p.base * (1 + Math.sin((i + idx) / 2) * 0.18 + i * 0.012))),
      })),
    [],
  );

  const avgAccuracy = Math.round(products.reduce((a, b) => a + b.accuracy, 0) / products.length);
  const above = products.filter((p) => p.accuracy >= 90).length;
  const below = products.length - above;

  return (
    <div>
      <PageHeader
        title="Forecast"
        subtitle="Previsão de demanda mensal por produto — próximos 13 meses"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <Card className="p-6">
          <div className="text-[11px] tracking-[0.16em] uppercase text-slate-400 font-semibold">Acurácia média</div>
          <div className={cn("text-4xl font-black italic tracking-tight mt-2", avgAccuracy >= 90 ? "text-emerald-600" : "text-rose-600")}>
            {avgAccuracy}%
          </div>
          <div className="text-xs text-slate-500 mt-2">Média ponderada de todos os SKUs</div>
        </Card>
        <Card className="p-6" delayClass="az-delay-2">
          <div className="text-[11px] tracking-[0.16em] uppercase text-slate-400 font-semibold">Itens ≥ 90%</div>
          <div className="text-4xl font-black italic tracking-tight text-emerald-600 mt-2">{above}</div>
          <div className="text-xs text-slate-500 mt-2">Modelos confiáveis</div>
        </Card>
        <Card className="p-6" delayClass="az-delay-3">
          <div className="text-[11px] tracking-[0.16em] uppercase text-slate-400 font-semibold">Itens &lt; 90%</div>
          <div className="text-4xl font-black italic tracking-tight text-rose-600 mt-2">{below}</div>
          <div className="text-xs text-slate-500 mt-2">Necessitam revisão</div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden" animate={false}>
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-lg font-black italic tracking-tight text-slate-900">Tabela de Previsão de Demanda</h3>
          <p className="text-xs text-slate-500 mt-0.5">Volumes em unidades — destaque para taxa de acurácia</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-semibold tracking-wider uppercase text-slate-500 bg-slate-50/60">
                <th className="px-5 py-3 sticky left-0 bg-slate-50/60 z-10 min-w-[220px]">Produto</th>
                {months.map((m) => (
                  <th key={m} className="px-3 py-3 text-right whitespace-nowrap">{m}</th>
                ))}
                <th className="px-5 py-3 text-right whitespace-nowrap">Acurácia</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.name}
                  className="border-t border-slate-100 hover:bg-slate-50/60 transition az-row-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <td className="px-5 py-3 sticky left-0 bg-white z-10 font-medium text-slate-900">{r.name}</td>
                  {r.values.map((v, j) => (
                    <td key={j} className="px-3 py-3 text-right font-mono tabular-nums text-slate-700">{v}</td>
                  ))}
                  <td className="px-5 py-3 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ring-1",
                        r.accuracy >= 90
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200/70"
                          : "bg-rose-50 text-rose-700 ring-rose-200/70",
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", r.accuracy >= 90 ? "bg-emerald-500" : "bg-rose-500")} />
                      {r.accuracy}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}