import { ART } from "../art";
import type { Card, Polarity } from "../domain/types";
import { Buf, H, W, hashStr, pulse, rng, type Frame } from "./buf";
import { drawFrame, drawHud, RIM, SHADOW, vignette } from "./hud";
import { makeLayers } from "./layers";
import { crescent } from "./primitives";

/** Renderiza a frente de uma lâmina num quadro de animação (0-3). Determinístico. */
export function renderFront(card: Card, pol: Polarity | null, f: Frame): Buf {
  const L = makeLayers(f, pol, rng(hashStr(card.name)));
  const art = ART[card.name];
  if (art) art(L);
  else L.b.grad(0, 0, W, H, "#222222", "#000000");

  const out = L.b;
  if (pol === "escuridao") out.map((r, g, b) => [r * 0.45 + 22, g * 0.3, b * 0.4 + 10]);
  out.over(L.gb);
  L.s.rim(RIM[card.cat], 0.45, 0.78);
  L.s.outline("#0A0A0A");
  out.over(L.s);
  out.over(L.gf);
  out.over(L.fg);
  vignette(out, SHADOW[card.cat]);
  drawHud(out, card, pol);
  return out;
}

const ZODIAC: readonly (readonly string[])[] = [
  ["11011", "10101", "00100", "00100", "00100"], ["10001", "01110", "10001", "10001", "01110"], ["11111", "01010", "01010", "01010", "11111"],
  ["01111", "10010", "00000", "01001", "11110"], ["01100", "10010", "01010", "00010", "00011"], ["11010", "10101", "10101", "10111", "00010"],
  ["00100", "01010", "11011", "00000", "11111"], ["11010", "10101", "10101", "10101", "00011"], ["00111", "00011", "00101", "01000", "10000"],
  ["10100", "01010", "01010", "01011", "00011"], ["01010", "10101", "00000", "01010", "10101"], ["10001", "01010", "11111", "01010", "10001"],
];

/** Verso comum a todo o baralho: astrolábio dourado sobre céu da Prússia, espelhado em 180°. */
export function renderBack(f: Frame): Buf {
  const b = new Buf(), glow = new Buf(), p = pulse(f);
  b.rect(0, 0, W, H, "#080D1A");
  for (const [x, y, rx, ry] of [[18, 30, 20, 12], [68, 52, 16, 10], [24, 110, 18, 10]] as const) {
    b.blob(x, y, rx, ry, "#1F1133", 1.2); b.blob(W - 1 - x, H - 1 - y, rx, ry, "#1F1133", 1.2);
  }
  const r = rng(52);
  for (let i = 0; i < 34; i++) {
    const x = (r() * W) | 0, y = (r() * H) | 0, c = i % 3 ? "#FFFFFF" : "#62F0FF", a = (i + f) % 4 === 0 ? 0.3 : 1;
    b.px(x, y, c, a); b.px(W - 1 - x, H - 1 - y, c, a);
    if (i % 7 === 0 && (i + f) % 4 === 2) { b.px(x - 1, y, c, 0.5); b.px(x + 1, y, c, 0.5); b.px(x, y - 1, c, 0.5); b.px(x, y + 1, c, 0.5); }
  }
  const cx = 45, cy = 80;
  b.ring(cx, cy, 39, "#453205", 1, 1); b.ring(cx, cy, 38, "#D4AF37", 1, 1); b.ring(cx, cy, 37, "#8A6818", 1, 1);
  b.ring(cx, cy, 25, "#D4AF37", 1, 1); b.ring(cx, cy, 24, "#453205", 1, 1);
  ZODIAC.forEach((glyph, k) => {
    const an = ((k * 30 - 90) * Math.PI) / 180, an2 = ((k * 30 + 15 - 90) * Math.PI) / 180;
    b.line(cx + Math.cos(an2) * 26, cy + Math.sin(an2) * 26, cx + Math.cos(an2) * 36, cy + Math.sin(an2) * 36, "#8A6818");
    const gx = Math.round(cx + Math.cos(an) * 31 - 2), gy = Math.round(cy + Math.sin(an) * 31 - 2);
    glyph.forEach((row, j) => { for (let i = 0; i < 5; i++) if (row[i] === "1") b.px(gx + i, gy + j, "#D4AF37"); });
  });
  b.ring(cx, cy, 19, "#8A6818", 1, 2);
  for (let k = 0; k < 24; k++) { const an = ((k * 15 + f * 3.75) * Math.PI) / 180; b.px(cx + Math.cos(an) * 20, cy + Math.sin(an) * 20, "#D4AF37"); }
  for (let k = 0; k < 4; k++) {
    const an = (k * Math.PI) / 2;
    b.line(cx + Math.cos(an) * 10, cy + Math.sin(an) * 10, cx + Math.cos(an) * 23, cy + Math.sin(an) * 23, "#D4AF37");
    b.circ(cx + Math.cos(an) * 23, cy + Math.sin(an) * 23, 1, "#F7D070");
  }
  for (let k = 0; k < 8; k++) {
    const an = (k * Math.PI) / 4 + Math.PI / 8;
    b.line(cx + Math.cos(an) * 9, cy + Math.sin(an) * 9, cx + Math.cos(an) * 13, cy + Math.sin(an) * 13, "#F7D070");
  }
  b.circ(cx, cy, 8, "#F7D070"); b.circ(cx, cy, 7, "#D4AF37");
  crescent(b, cx + 3, cy, 7, "#D9DCD6", -5);
  b.ell(cx, cy, 4, 2, "#FFFFFF"); b.circ(cx, cy, 1.2, "#62F0FF"); b.px(cx, cy, "#080D1A");
  glow.blob(cx, cy, 10, 10, "#62F0FF", 1, 0.15 + p * 0.08);
  for (const [x, y] of [[cx, 20], [cx, H - 21]] as const) { b.poly([[x - 4, y], [x, y - 4], [x + 4, y], [x, y + 4]], "#D4AF37"); b.px(x, y, "#FFF3B0"); }
  b.over(glow);
  drawFrame(b, "gold");
  return b;
}
