import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  AnalizzeContext,
  type AnalizzeState,
  type CarteiraLot,
  type EstoqueItem,
  type FaturamentoEntry,
  type MovementEvent,
  id,
  now,
  seedCarteira,
  seedEstoque,
  seedFaturamento,
} from "@/lib/analizze-store";

export function AnalizzeProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [supabaseSync, setSupabaseSync] = useState(true);
  const [carteira, setCarteira] = useState<CarteiraLot[]>(seedCarteira);
  const [estoque, setEstoque] = useState<EstoqueItem[]>(seedEstoque);
  const [faturamento, setFaturamento] = useState<FaturamentoEntry[]>(seedFaturamento);
  const [movements, setMovements] = useState<MovementEvent[]>([
    { id: id(), table: "carteira", action: "Status do LOT-B71C atualizado → atrasado", ts: now() },
    { id: id(), table: "estoque", action: "Inventário GAL-A concluído", ts: now() },
    { id: id(), table: "faturamento", action: "Fatura FT-1006 marcada como realizada", ts: now() },
    { id: id(), table: "carteira", action: "Novo lote LOT-F019 inserido", ts: now() },
  ]);

  const pushMovement = useCallback((m: Omit<MovementEvent, "id" | "ts">) => {
    setMovements((prev) => [{ id: id(), ts: now(), ...m }, ...prev].slice(0, 12));
  }, []);

  const login = useCallback(async (terminal: string, secret: string) => {
    if (!terminal || !secret) return false;
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSyncing(false);
    setAuthed(true);
    return true;
  }, []);

  const value = useMemo<AnalizzeState>(
    () => ({
      authed,
      syncing,
      supabaseSync,
      carteira,
      estoque,
      faturamento,
      movements,
      login,
      logout: () => setAuthed(false),
      toggleSync: () => setSupabaseSync((v) => !v),
      addCarteira: (l) => {
        setCarteira((prev) => [{ id: `LOT-${id()}`, ...l }, ...prev]);
        pushMovement({ table: "carteira", action: `Lote inserido: ${l.product}` });
      },
      addEstoque: (l) => {
        setEstoque((prev) => [{ id: `INV-${id()}`, ...l }, ...prev]);
        pushMovement({ table: "estoque", action: `Estoque adicionado: ${l.product}` });
      },
      addFaturamento: (l) => {
        setFaturamento((prev) => [{ id: `FT-${id()}`, ...l }, ...prev]);
        pushMovement({ table: "faturamento", action: `Fatura para ${l.client} (${l.status})` });
      },
    }),
    [authed, syncing, supabaseSync, carteira, estoque, faturamento, movements, login, pushMovement],
  );

  return <AnalizzeContext.Provider value={value}>{children}</AnalizzeContext.Provider>;
}