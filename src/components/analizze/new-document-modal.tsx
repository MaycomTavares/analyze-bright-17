import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useAnalizze, type DeliveryStatus } from "@/lib/analizze-store";
import { cn } from "@/lib/utils";

type Table = "carteira" | "estoque" | "faturamento";

export function NewDocumentModal({ defaultTable = "carteira" }: { defaultTable?: Table }) {
  const [open, setOpen] = useState(false);
  const [table, setTable] = useState<Table>(defaultTable);
  const { addCarteira, addEstoque, addFaturamento } = useAnalizze();

  // shared form state
  const [product, setProduct] = useState("");
  const [qty, setQty] = useState("");
  const [qtyTotal, setQtyTotal] = useState("");
  const [status, setStatus] = useState<DeliveryStatus>("on-time");
  const [deadline, setDeadline] = useState("");
  const [sku, setSku] = useState("");
  const [location, setLocation] = useState("");
  const [client, setClient] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [finStatus, setFinStatus] = useState<"realized" | "lost" | "projected">("projected");

  const reset = () => {
    setProduct(""); setQty(""); setQtyTotal(""); setDeadline("");
    setSku(""); setLocation(""); setClient(""); setCategory(""); setAmount("");
  };

  const submit = () => {
    if (table === "carteira") {
      addCarteira({ product, qtyDone: Number(qty) || 0, qtyTotal: Number(qtyTotal) || 1, status, deadline: deadline || new Date().toISOString().slice(0, 10) });
    } else if (table === "estoque") {
      addEstoque({ sku, product, qty: Number(qty) || 0, location });
    } else {
      addFaturamento({ client, category, amount: Number(amount) || 0, status: finStatus, date: new Date().toISOString().slice(0, 10) });
    }
    reset();
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition shadow-sm"
      >
        <Plus className="h-4 w-4" /> Novo Documento
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg p-7 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-black italic tracking-tight text-slate-900">Novo Documento</h3>
                <p className="text-xs text-slate-500 mt-0.5">Inserir um registro na tabela selecionada do Supabase</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5 mb-5 p-1 bg-slate-100 rounded-xl">
              {(["carteira", "estoque", "faturamento"] as Table[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTable(t)}
                  className={cn(
                    "py-2 rounded-lg text-xs font-semibold capitalize transition",
                    table === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {table === "carteira" && (
                <>
                  <Field label="Produto" value={product} onChange={setProduct} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Qtd. produzida" value={qty} onChange={setQty} type="number" />
                    <Field label="Qtd. total" value={qtyTotal} onChange={setQtyTotal} type="number" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Select label="Status" value={status} onChange={(v) => setStatus(v as DeliveryStatus)} options={["on-time", "delayed", "critical"]} />
                    <Field label="Prazo" value={deadline} onChange={setDeadline} type="date" />
                  </div>
                </>
              )}
              {table === "estoque" && (
                <>
                  <Field label="SKU" value={sku} onChange={setSku} />
                  <Field label="Produto" value={product} onChange={setProduct} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Quantidade" value={qty} onChange={setQty} type="number" />
                    <Field label="Localização" value={location} onChange={setLocation} />
                  </div>
                </>
              )}
              {table === "faturamento" && (
                <>
                  <Field label="Cliente" value={client} onChange={setClient} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Categoria" value={category} onChange={setCategory} />
                    <Field label="Valor (R$)" value={amount} onChange={setAmount} type="number" />
                  </div>
                  <Select label="Status" value={finStatus} onChange={(v) => setFinStatus(v as "realized" | "lost" | "projected")} options={["realized", "lost", "projected"]} />
                </>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100">
                Cancelar
              </button>
              <button onClick={submit} className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand text-white hover:opacity-90 shadow-[0_4px_12px_-2px_rgb(37_99_235_/_0.4)]">
                Inserir em {table}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold tracking-wide uppercase text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15 outline-none transition"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold tracking-wide uppercase text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/15 outline-none transition capitalize"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}