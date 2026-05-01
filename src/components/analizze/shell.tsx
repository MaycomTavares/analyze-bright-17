import { type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useAnalizze } from "@/lib/analizze-store";
import { AnalizzeSidebar, AnalizzeMobileBar } from "./sidebar";
import { LoginScreen } from "./login";
import { Spinner } from "./ui-bits";

export function AnalizzeShell({ children }: { children: ReactNode }) {
  const { authed, syncing } = useAnalizze();
  const path = useRouterState({ select: (r) => r.location.pathname });

  if (syncing && !authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-6 h-14 w-14 rounded-2xl bg-brand flex items-center justify-center shadow-[0_0_40px_rgb(37_99_235_/_0.6)] animate-pulse">
            <span className="font-black italic text-white text-xl">A</span>
          </div>
          <Spinner label="Sincronizando com o Cluster Supabase..." />
        </div>
      </div>
    );
  }

  if (!authed) return <LoginScreen />;

  return (
    <div className="min-h-screen flex bg-surface">
      <AnalizzeSidebar />
      <main className="flex-1 min-w-0 px-5 md:px-10 py-8 pb-24 md:pb-10">
        <div key={path} className="az-fade-up">
          {children}
        </div>
      </main>
      <AnalizzeMobileBar />
    </div>
  );
}