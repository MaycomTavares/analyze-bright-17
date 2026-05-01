import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";
import { LayoutDashboard, Truck, Receipt, FileBarChart2, Settings, LogOut, Activity } from "lucide-react";
import { useAnalizze } from "@/lib/analizze-store";
import { cn } from "@/lib/utils";

type Item = {
  to: LinkProps["to"];
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const items: Item[] = [
  { to: "/app", label: "Painel", icon: LayoutDashboard, exact: true },
  { to: "/app/deliveries", label: "Entregas", icon: Truck },
  { to: "/app/billing", label: "Faturamento", icon: Receipt },
  { to: "/app/reports", label: "Relatórios", icon: FileBarChart2 },
  { to: "/app/settings", label: "Configurações", icon: Settings },
];

export function AnalizzeSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { logout, supabaseSync } = useAnalizze();

  return (
    <aside
      className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 text-sidebar-fg az-slide-left"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.16 0.005 285) 0%, oklch(0.12 0.004 285) 100%)",
        backdropFilter: "blur(24px)",
        borderRight: "1px solid rgb(255 255 255 / 0.06)",
      }}
    >
      <div className="px-6 pt-7 pb-8">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="az-logo-spin h-9 w-9 rounded-xl flex items-center justify-center bg-brand shadow-[0_0_20px_-2px_rgb(37_99_235_/_0.7)]">
            <Activity className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-black italic tracking-tight text-white text-lg leading-none">
              ANALIZZE
            </div>
            <div className="text-[10px] tracking-[0.2em] text-white/40 mt-1 uppercase">
              Inteligência Corporativa
            </div>
          </div>
        </div>
      </div>

      <nav className="px-3 flex-1 space-y-1">
        {items.map(({ to, label, icon: Icon, exact }, i) => {
          const active = exact ? path === to : path === to || path.startsWith(String(to) + "/");
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "az-nav-item group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium az-fade-up",
                `az-delay-${Math.min(i + 1, 6)}`,
                active
                  ? "az-nav-active bg-brand text-white shadow-[var(--shadow-glow-blue)]"
                  : "text-white/60 hover:text-white hover:bg-white/5",
              )}
            >
              <Icon className={cn("h-[18px] w-[18px] transition-transform duration-300", "group-hover:scale-110")} strokeWidth={active ? 2.4 : 2} />
              <span className="relative">{label}</span>
              {active && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-l-full bg-white/90" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-5 border-t border-white/5">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[10px] tracking-[0.18em] uppercase text-white/40">Cluster</span>
          <span className="flex items-center gap-1.5 text-[11px] text-white/70">
            <span className={cn("h-1.5 w-1.5 rounded-full", supabaseSync ? "bg-emerald-400 shadow-[0_0_8px_rgb(52_211_153)]" : "bg-zinc-500")} />
            {supabaseSync ? "Online" : "Pausado"}
          </span>
        </div>
        <button
          onClick={logout}
          className="az-btn w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}

export function AnalizzeMobileBar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 flex justify-around px-2 py-2 border-t border-white/5"
      style={{ background: "oklch(0.145 0.004 285.823 / 0.96)", backdropFilter: "blur(20px)" }}
    >
      {items.map(({ to, label, icon: Icon, exact }) => {
        const active = exact ? path === to : path === to || path.startsWith(String(to) + "/");
        return (
          <Link key={to} to={to} className={cn(
            "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition",
            active ? "text-white bg-brand shadow-[var(--shadow-glow-blue)]" : "text-white/55"
          )}>
            <Icon className="h-4 w-4" />
            <span className="text-[10px]">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}