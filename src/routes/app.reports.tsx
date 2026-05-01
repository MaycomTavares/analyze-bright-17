import { createFileRoute } from "@tanstack/react-router";
import { ReportsPage } from "@/components/analizze/pages/reports";

export const Route = createFileRoute("/app/reports")({
  component: ReportsPage,
});