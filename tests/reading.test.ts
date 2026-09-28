import { describe, expect, it } from "vitest";
import { DECK } from "../src/domain/deck";
import { meaningOf, Reading, shuffle } from "../src/domain/reading";
import { cardCount, SPREADS } from "../src/domain/spreads";
import type { Spread } from "../src/domain/types";
import { rng } from "../src/engine/buf";

const spread = (id: string): Spread => SPREADS.find(s => s.id === id)!;
const revealAll = (r: Reading, row: "meio" | "baixo" | "cima") => r.rows[row].forEach(d => r.reveal(d, 1));

describe("tiragens", () => {
  it("usam só primos ≤ 7", () => {
    expect(SPREADS.map(cardCount)).toEqual([2, 3, 5, 7]);
  });

  it.each(["g3", "g5", "g7"])("%s distribui todas as cartas sem repetir", id => {
    const r = new Reading(spread(id), DECK, rng(1));
    const all = [...r.rows.meio, ...r.rows.baixo, ...r.rows.cima];
    expect(all).toHaveLength(cardCount(spread(id)));
    expect(new Set(all.map(d => d.card.id)).size).toBe(all.length);
  });
});

describe("Lei das Fileiras", () => {
  it("abre meio → baixo → cima, nessa ordem", () => {
    const r = new Reading(spread("g7"), DECK, rng(2));
    expect(r.reveal(r.rows.cima[0]!, 1)).toBe(false);
    expect(r.reveal(r.rows.baixo[0]!, 1)).toBe(false);
    revealAll(r, "meio");
    expect(r.isUnlocked("baixo")).toBe(true);
    expect(r.isUnlocked("cima")).toBe(false);
    revealAll(r, "baixo");
    expect(r.isUnlocked("cima")).toBe(true);
    revealAll(r, "cima");
    expect(r.complete).toBe(true);
    expect(r.hint()).toBeNull();
  });

  it("não revela a mesma carta duas vezes", () => {
    const r = new Reading(spread("g3"), DECK, rng(3));
    const d = r.rows.meio[0]!;
    expect(r.reveal(d, 10)).toBe(true);
    expect(r.reveal(d, 20)).toBe(false);
    expect(d.revealStart).toBe(10);
  });
});

describe("Grau 2 (Causa ou Consequência)", () => {
  it("só pede a escolha depois do Presente e não conta como completo antes da 2ª carta", () => {
    const r = new Reading(spread("g2"), DECK, rng(4));
    expect(r.awaitingChoice).toBe(false);
    revealAll(r, "meio");
    expect(r.awaitingChoice).toBe(true);
    expect(r.complete).toBe(false);
  });

  it.each([["causa", "baixo", "A Causa"], ["consequencia", "cima", "A Consequência"]] as const)("%s põe a carta em %s", (kind, row, label) => {
    const r = new Reading(spread("g2"), DECK, rng(5));
    revealAll(r, "meio");
    r.choose(kind);
    expect(r.rows[row]).toHaveLength(1);
    expect(r.rows[row][0]!.pos.label).toBe(label);
    expect(r.isUnlocked(row)).toBe(true);
    r.reveal(r.rows[row][0]!, 1);
    expect(r.complete).toBe(true);
    expect(r.rows.meio[0]!.card.id).not.toBe(r.rows[row][0]!.card.id);
  });

  it("ignora escolha antes da hora", () => {
    const r = new Reading(spread("g2"), DECK, rng(6));
    r.choose("causa");
    expect(r.rows.baixo).toHaveLength(0);
  });
});

describe("significados", () => {
  it("cartas especiais usam Luz ou Escuridão", () => {
    const paixao = DECK.find(c => c.name === "A Paixão")!;
    if (!paixao.special) throw new Error("A Paixão deveria ser especial");
    expect(meaningOf({ card: paixao, polarity: "luz" })).toBe(paixao.light);
    expect(meaningOf({ card: paixao, polarity: "escuridao" })).toBe(paixao.dark);
  });

  it("cartas especiais sempre recebem polaridade; as demais nunca", () => {
    for (let seed = 0; seed < 30; seed++) {
      const r = new Reading(spread("g7"), DECK, rng(seed));
      for (const d of [...r.rows.meio, ...r.rows.baixo, ...r.rows.cima]) expect(d.polarity === null).toBe(!d.card.special);
    }
  });
});

it("shuffle mantém os elementos", () => {
  expect(shuffle([1, 2, 3, 4, 5], rng(9)).sort()).toEqual([1, 2, 3, 4, 5]);
});
