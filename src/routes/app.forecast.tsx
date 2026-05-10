import { createFileRoute } from "@tanstack/react-router";
import { ForecastPage } from "@/components/analizze/pages/forecast";

export const Route = createFileRoute("/app/forecast")({
  component: ForecastPage,
});