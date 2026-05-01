import { createFileRoute } from "@tanstack/react-router";
import { BillingPage } from "@/components/analizze/pages/billing";

export const Route = createFileRoute("/app/billing")({
  component: BillingPage,
});