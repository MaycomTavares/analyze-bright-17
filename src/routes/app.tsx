import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AnalizzeProvider } from "@/components/analizze/provider";
import { AnalizzeShell } from "@/components/analizze/shell";

export const Route = createFileRoute("/app")({
  component: () => (
    <AnalizzeProvider>
      <AnalizzeShell>
        <Outlet />
      </AnalizzeShell>
    </AnalizzeProvider>
  ),
});