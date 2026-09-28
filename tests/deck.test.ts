import { describe, expect, it } from "vitest";
import { ART } from "../src/art";
import { DECK, toRoman } from "../src/domain/deck";

describe("baralho", () => {
  it("tem 52 lâminas: 22 maiores, 7 por elemento e 2 especiais", () => {
    const count = (cat: string) => DECK.filter(c => c.cat === cat).length;
    expect(DECK).toHaveLength(52);
    expect(count("major")).toBe(22);
    for (const el of ["agua", "fogo", "terra", "ar"]) expect(count(el)).toBe(7);
    expect(count("special")).toBe(2);
  });

  it("tem ids sequenciais e nomes únicos", () => {
    expect(DECK.map(c => c.id)).toEqual([...Array(52).keys()]);
    expect(new Set(DECK.map(c => c.name)).size).toBe(52);
  });

  it("numera maiores de 0 a XXI e graus de I a VII", () => {
    expect(DECK[0]!.numeral).toBe("0");
    expect(DECK[21]!.numeral).toBe("XXI");
    expect(DECK.filter(c => c.cat === "agua").map(c => c.numeral)).toEqual(["I", "II", "III", "IV", "V", "VI", "VII"]);
    expect(DECK.filter(c => c.special).every(c => c.numeral === null)).toBe(true);
  });

  it("toda lâmina tem arte registrada", () => {
    expect(DECK.filter(c => !ART[c.name]).map(c => c.name)).toEqual([]);
    expect(Object.keys(ART)).toHaveLength(52);
  });

  it("converte romanos", () => {
    expect([1, 4, 9, 14, 19].map(toRoman)).toEqual(["I", "IV", "IX", "XIV", "XIX"]);
  });
});
