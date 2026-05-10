import { createFileRoute } from "@tanstack/react-router";
import { PlanningPage } from "@/components/analizze/pages/planning";

export const Route = createFileRoute("/app/planning")({
  component: PlanningPage,
});