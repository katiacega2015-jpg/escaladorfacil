import { polarityLabel, type Reading } from "./reading";
import { ROW_OPEN_ORDER } from "./spreads";

export interface HistoryEntry {
  date: string;
  spread: string;
  cards: string[];
}

const KEY = "tarot_history";
const MAX = 30;

/** Armazenamento mínimo; em testes pode ser trocado por um Map. */
export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function loadHistory(store: KeyValueStore): HistoryEntry[] {
  try {
    const raw = JSON.parse(store.getItem(KEY) ?? "[]") as unknown;
    return Array.isArray(raw) ? (raw as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveReading(store: KeyValueStore, reading: Reading, now = new Date()): void {
  const cards = ROW_OPEN_ORDER.flatMap(r =>
    reading.rows[r].map(d => `${d.pos.label}: ${d.card.name}${d.polarity ? ` (${polarityLabel(d.polarity)})` : ""}`),
  );
  const list = [{ date: now.toISOString(), spread: reading.spread.label, cards }, ...loadHistory(store)].slice(0, MAX);
  try {
    store.setItem(KEY, JSON.stringify(list));
  } catch {
    // Armazenamento cheio ou bloqueado: o histórico é opcional.
  }
}
