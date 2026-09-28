import { describe, expect, it } from "vitest";
import { fitScale, snapScale } from "../src/ui/layout";

const base = { cols: 1, rows: 1, rowChrome: 0, gap: 0, min: 1, max: 4, dpr: 2 };

describe("layout", () => {
  it("snapScale alinha a pixels físicos", () => {
    expect(snapScale(1.74, 2)).toBe(1.5);
    expect(snapScale(1.4, 3)).toBeCloseTo(4 / 3);
    expect(snapScale(1.9, 1)).toBe(1.75);
    expect(snapScale(0.1, 2)).toBe(0.5);
  });

  it("fitScale respeita largura, altura, mínimo e máximo", () => {
    expect(fitScale({ ...base, availW: 1000, availH: 1000 })).toBe(4);
    expect(fitScale({ ...base, availW: 180, availH: 1000 })).toBe(2);
    expect(fitScale({ ...base, availW: 1000, availH: 400 })).toBe(2.5);
    expect(fitScale({ ...base, availW: 50, availH: 50 })).toBe(1);
  });

  it("fitScale desconta vãos e cromo das fileiras", () => {
    // 3 colunas de 90 + 2 vãos de 15 = 300 → escala 1 exata
    expect(fitScale({ ...base, cols: 3, gap: 15, availW: 300, availH: 9999 })).toBe(1);
    // 3 fileiras de 160 + 3×40 de cromo = 600 → escala 1
    expect(fitScale({ ...base, rows: 3, rowChrome: 40, availW: 9999, availH: 600 })).toBe(1);
  });
});
