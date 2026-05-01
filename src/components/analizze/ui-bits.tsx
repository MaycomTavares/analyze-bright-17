import { Loader2 } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  hover = true,
  animate = true,
  delayClass,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  animate?: boolean;
  delayClass?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-[32px] border border-slate-100/80 p-6",
        "shadow-[var(--shadow-card)]",
        hover && "az-card",
        animate && "az-bounce-in",
        delayClass,
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Spinner({ label = "Carregando" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-slate-500">
      <Loader2 className="h-6 w-6 animate-spin text-brand" />
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
      <div>
        <h1 className="text-3xl md:text-4xl font-black italic tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatusBadge({ status }: { status: "on-time" | "delayed" | "critical" }) {
  const map = {
    "on-time": "bg-emerald-50 text-emerald-700 ring-emerald-200/70",
    delayed: "bg-amber-50 text-amber-700 ring-amber-200/70",
    critical: "bg-rose-50 text-rose-700 ring-rose-200/70",
  } as const;
  const label = { "on-time": "No prazo", delayed: "Atrasado", critical: "Crítico" }[status];
  return (
    <span className={cn("az-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 cursor-default", map[status])}>
      <span className={cn(
        "h-1.5 w-1.5 rounded-full",
        status === "on-time" ? "bg-emerald-500" : status === "delayed" ? "bg-amber-500" : "bg-rose-500"
      )} />
      {label}
    </span>
  );
}