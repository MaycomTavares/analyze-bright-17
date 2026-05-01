import { create } from "zustand";

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

interface State {
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

const id = () => Math.random().toString(36).slice(2, 8).toUpperCase();
const now = () => new Date().toISOString();

const seedCarteira: CarteiraLot[] = [
  { id: "LOT-A0F2", product: "Industrial Bearing 6204-2RS", qtyDone: 820, qtyTotal: 1000, status: "on-time", deadline: "2026-05-12" },
  { id: "LOT-B71C", product: "Hydraulic Cylinder HC-220", qtyDone: 140, qtyTotal: 500, status: "delayed", deadline: "2026-05-04" },
  { id: "LOT-C9D3", product: "Servo Motor SM-7K", qtyDone: 45, qtyTotal: 300, status: "critical", deadline: "2026-05-02" },
  { id: "LOT-D44E", product: "Composite Panel CP-XL", qtyDone: 980, qtyTotal: 1000, status: "on-time", deadline: "2026-05-18" },
  { id: "LOT-E812", product: "Precision Gear PG-12T", qtyDone: 220, qtyTotal: 600, status: "delayed", deadline: "2026-05-09" },
  { id: "LOT-F019", product: "Aluminum Frame AF-90", qtyDone: 410, qtyTotal: 450, status: "on-time", deadline: "2026-05-15" },
];

const seedEstoque: EstoqueItem[] = [
  { id: "INV-001", sku: "SKU-44021", product: "Steel Rod 12mm", qty: 1240, location: "WH-A / R3" },
  { id: "INV-002", sku: "SKU-44022", product: "Copper Coil 0.5mm", qty: 560, location: "WH-A / R7" },
  { id: "INV-003", sku: "SKU-44023", product: "Polymer Resin", qty: 88, location: "WH-B / R1" },
];

const seedFaturamento: FaturamentoEntry[] = [
  { id: "FT-1001", client: "Volkfeld GmbH", category: "Automotive", amount: 184230, status: "realized", date: "2026-04-22" },
  { id: "FT-1002", client: "Northwind Energy", category: "Energy", amount: 92500, status: "realized", date: "2026-04-25" },
  { id: "FT-1003", client: "Atlas Robotics", category: "Robotics", amount: 56800, status: "projected", date: "2026-05-05" },
  { id: "FT-1004", client: "Lumen Aerospace", category: "Aerospace", amount: 32100, status: "lost", date: "2026-04-19" },
  { id: "FT-1005", client: "Helix Pharma", category: "Pharma", amount: 71400, status: "projected", date: "2026-05-09" },
  { id: "FT-1006", client: "Cobalt Mining Co.", category: "Mining", amount: 128900, status: "realized", date: "2026-04-28" },
];

export const useAnalizze = create<State>((set, get) => ({
  authed: false,
  syncing: false,
  supabaseSync: true,
  carteira: seedCarteira,
  estoque: seedEstoque,
  faturamento: seedFaturamento,
  movements: [
    { id: id(), table: "carteira", action: "Updated LOT-B71C status → delayed", ts: now() },
    { id: id(), table: "estoque", action: "Inventory check WH-A completed", ts: now() },
    { id: id(), table: "faturamento", action: "Invoice FT-1006 marked realized", ts: now() },
    { id: id(), table: "carteira", action: "New lot LOT-F019 inserted", ts: now() },
  ],
  login: async (terminal, secret) => {
    if (!terminal || !secret) return false;
    set({ syncing: true });
    await new Promise((r) => setTimeout(r, 1400));
    set({ syncing: false, authed: true });
    return true;
  },
  logout: () => set({ authed: false }),
  toggleSync: () => set({ supabaseSync: !get().supabaseSync }),
  addCarteira: (l) =>
    set((s) => ({
      carteira: [{ id: `LOT-${id()}`, ...l }, ...s.carteira],
      movements: [{ id: id(), table: "carteira", action: `Inserted lot for ${l.product}`, ts: now() }, ...s.movements].slice(0, 12),
    })),
  addEstoque: (l) =>
    set((s) => ({
      estoque: [{ id: `INV-${id()}`, ...l }, ...s.estoque],
      movements: [{ id: id(), table: "estoque", action: `Inventory added: ${l.product}`, ts: now() }, ...s.movements].slice(0, 12),
    })),
  addFaturamento: (l) =>
    set((s) => ({
      faturamento: [{ id: `FT-${id()}`, ...l }, ...s.faturamento],
      movements: [{ id: id(), table: "faturamento", action: `Invoice for ${l.client} (${l.status})`, ts: now() }, ...s.movements].slice(0, 12),
    })),
}));