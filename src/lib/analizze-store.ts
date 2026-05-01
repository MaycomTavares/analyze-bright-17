import { createContext, useContext } from "react";

export type DeliveryStatus = "on-time" | "delayed" | "critical";

export interface CarteiraLot {
  id: string;
  product: string;
  qtyDone: number;
  qtyTotal: number;
  status: DeliveryStatus;
  deadline: string;
}

export interface EstoqueItem {
  id: string;
  sku: string;
  product: string;
  qty: number;
  location: string;
}

export interface FaturamentoEntry {
  id: string;
  client: string;
  category: string;
  amount: number;
  status: "realized" | "lost" | "projected";
  date: string;
}

export interface MovementEvent {
  id: string;
  table: "carteira" | "estoque" | "faturamento";
  action: string;
  ts: string;
}

export interface AnalizzeState {
  authed: boolean;
  syncing: boolean;
  supabaseSync: boolean;
  carteira: CarteiraLot[];
  estoque: EstoqueItem[];
  faturamento: FaturamentoEntry[];
  movements: MovementEvent[];
  login: (terminal: string, secret: string) => Promise<boolean>;
  logout: () => void;
  toggleSync: () => void;
  addCarteira: (l: Omit<CarteiraLot, "id">) => void;
  addEstoque: (l: Omit<EstoqueItem, "id">) => void;
  addFaturamento: (l: Omit<FaturamentoEntry, "id">) => void;
}

export const id = () => Math.random().toString(36).slice(2, 8).toUpperCase();
export const now = () => new Date().toISOString();

export const seedCarteira: CarteiraLot[] = [
  { id: "LOT-A0F2", product: "Rolamento Industrial 6204-2RS", qtyDone: 820, qtyTotal: 1000, status: "on-time", deadline: "2026-05-12" },
  { id: "LOT-B71C", product: "Cilindro Hidráulico HC-220", qtyDone: 140, qtyTotal: 500, status: "delayed", deadline: "2026-05-04" },
  { id: "LOT-C9D3", product: "Servo Motor SM-7K", qtyDone: 45, qtyTotal: 300, status: "critical", deadline: "2026-05-02" },
  { id: "LOT-D44E", product: "Painel Compósito CP-XL", qtyDone: 980, qtyTotal: 1000, status: "on-time", deadline: "2026-05-18" },
  { id: "LOT-E812", product: "Engrenagem de Precisão PG-12T", qtyDone: 220, qtyTotal: 600, status: "delayed", deadline: "2026-05-09" },
  { id: "LOT-F019", product: "Estrutura de Alumínio AF-90", qtyDone: 410, qtyTotal: 450, status: "on-time", deadline: "2026-05-15" },
];

export const seedEstoque: EstoqueItem[] = [
  { id: "INV-001", sku: "SKU-44021", product: "Barra de Aço 12mm", qty: 1240, location: "GAL-A / R3" },
  { id: "INV-002", sku: "SKU-44022", product: "Bobina de Cobre 0.5mm", qty: 560, location: "GAL-A / R7" },
  { id: "INV-003", sku: "SKU-44023", product: "Resina Polimérica", qty: 88, location: "GAL-B / R1" },
];

export const seedFaturamento: FaturamentoEntry[] = [
  { id: "FT-1001", client: "Volkfeld GmbH", category: "Automotivo", amount: 184230, status: "realized", date: "2026-04-22" },
  { id: "FT-1002", client: "Northwind Energia", category: "Energia", amount: 92500, status: "realized", date: "2026-04-25" },
  { id: "FT-1003", client: "Atlas Robótica", category: "Robótica", amount: 56800, status: "projected", date: "2026-05-05" },
  { id: "FT-1004", client: "Lumen Aeroespacial", category: "Aeroespacial", amount: 32100, status: "lost", date: "2026-04-19" },
  { id: "FT-1005", client: "Helix Farma", category: "Farmacêutico", amount: 71400, status: "projected", date: "2026-05-09" },
  { id: "FT-1006", client: "Cobalto Mineração", category: "Mineração", amount: 128900, status: "realized", date: "2026-04-28" },
];

export const AnalizzeContext = createContext<AnalizzeState | null>(null);

export function useAnalizze(): AnalizzeState {
  const ctx = useContext(AnalizzeContext);
  if (!ctx) throw new Error("useAnalizze must be used inside AnalizzeProvider");
  return ctx;
}