import { createFileRoute } from "@tanstack/react-router";
import { InventoryPage } from "@/components/analizze/pages/inventory";

export const Route = createFileRoute("/app/inventory")({
  component: InventoryPage,
});