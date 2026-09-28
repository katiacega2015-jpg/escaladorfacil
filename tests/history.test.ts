import { describe, expect, it } from "vitest";
import { DECK } from "../src/domain/deck";
import { loadHistory, saveReading, type KeyValueStore } from "../src/domain/history";
import { Reading } from "../src/domain/reading";
import { SPREADS } from "../src/domain/spreads";
import { rng } from "../src/engine/buf";

const memoryStore = (): KeyValueStore => {
  const m = new Map<string, string>();
  return { getItem: k => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v) };
};

describe("histórico", () => {
  it("salva leituras mais recentes primeiro e limita a 30", () => {
    const store = memoryStore();
    for (let i = 0; i < 35; i++) saveReading(store, new Reading(SPREADS[1]!, DECK, rng(i)), new Date(2026, 0, 1, 0, i));
    const list = loadHistory(store);
    expect(list).toHaveLength(30);
    expect(list[0]!.date > list[1]!.date).toBe(true);
    expect(list[0]!.cards).toHaveLength(3);
  });

  it("tolera dado corrompido", () => {
    const store = memoryStore();
    store.setItem("tarot_history", "{não é json");
    expect(loadHistory(store)).toEqual([]);
  });
});
