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

  it("verso é opaco", () => {
    for (const f of FRAMES) expect(opaque(renderBack(f).d)).toBe(true);
  });
});
