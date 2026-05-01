import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/analizze/pages/dashboard";

export const Route = createFileRoute("/app/")({
  component: DashboardPage,
});