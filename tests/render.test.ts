import { describe, expect, it } from "vitest";
import { DECK } from "../src/domain/deck";
import { H, W, type Frame } from "../src/engine/buf";
import { renderBack, renderFront } from "../src/engine/render";

const FRAMES: Frame[] = [0, 1, 2, 3];
const opaque = (d: Uint8ClampedArray) => { for (let i = 3; i < d.length; i += 4) if (d[i] !== 255) return false; return true; };

describe("render", () => {
  it.each(DECK.map(c => [c.name, c] as const))("%s renderiza os 4 quadros opacos e deterministicamente", (_, card) => {
    const pol = card.special ? "luz" : null;
    const frames = FRAMES.map(f => renderFront(card, pol, f));
    for (const b of frames) { expect(b.d).toHaveLength(W * H * 4); expect(opaque(b.d)).toBe(true); }
    expect(renderFront(card, pol, 0).d).toEqual(frames[0]!.d);
  });

  it("anima: quadros diferentes geram imagens diferentes", () => {
    expect(renderFront(DECK[0]!, null, 0).d).not.toEqual(renderFront(DECK[0]!, null, 1).d);
  });

  it("especiais mudam com a polaridade", () => {
    const paixao = DECK.find(c => c.special)!;
    expect(renderFront(paixao, "luz", 0).d).not.toEqual(renderFront(paixao, "escuridao", 0).d);
  });

  it("verso é opaco, determinístico e anima", () => {
    for (const f of FRAMES) expect(opaque(renderBack(f).d)).toBe(true);
    expect(renderBack(1).d).toEqual(renderBack(1).d);
    expect(renderBack(0).d).not.toEqual(renderBack(2).d);
  });

  it("verso: céu e moldura são espelhados em 180° (fora do astrolábio)", () => {
    const d = renderBack(0).d;
    let diff = 0, total = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (Math.hypot(x - 45, y - 80) < 42 || x < 4 || y < 4 || x > W - 5 || y > H - 5) continue; // moldura chanfrada tem luz de canto, por design
      const a = (y * W + x) * 4, b = ((H - 1 - y) * W + (W - 1 - x)) * 4;
      total++;
      if (d[a] !== d[b] || d[a + 1] !== d[b + 1] || d[a + 2] !== d[b + 2]) diff++;
    }
    expect(diff / total).toBeLessThan(0.03);
  });

  it("especiais renderizam as duas polaridades em todos os quadros", () => {
    for (const card of DECK.filter(c => c.special)) for (const pol of ["luz", "escuridao"] as const) for (const f of FRAMES) {
      expect(opaque(renderFront(card, pol, f).d)).toBe(true);
    }
  });
});
