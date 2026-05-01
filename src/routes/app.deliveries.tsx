import { createFileRoute } from "@tanstack/react-router";
import { DeliveriesPage } from "@/components/analizze/pages/deliveries";

export const Route = createFileRoute("/app/deliveries")({
  component: DeliveriesPage,
});