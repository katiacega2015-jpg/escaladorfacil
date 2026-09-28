import { ART } from "../art";
import type { Card, Polarity } from "../domain/types";
import { Buf, H, W, bay, hashStr, pulse, rng, type Frame } from "./buf";
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

/** Os 12 signos (Áries → Peixes) em matriz 7×7, conforme a bíblia visual. */
const ZODIAC: readonly (readonly string[])[] = [
  ["0110110", "1001001", "1001001", "0001000", "0001000", "0001000", "0001000"],
  ["1000001", "0100010", "0011100", "0100010", "0100010", "0100010", "0011100"],
  ["1111111", "0100010", "0100010", "0100010", "0100010", "0100010", "1111111"],
  ["0011110", "0100001", "0110000", "0000000", "0000110", "1000010", "0111100"],
  ["0011100", "0100010", "0100010", "0010010", "0110010", "0110101", "0000010"],
  ["1010100", "1111110", "1010101", "1010101", "1010110", "1010100", "0001000"],
  ["0011100", "0100010", "0100010", "1100011", "0000000", "1111111", "0000000"],
  ["1010100", "1111110", "1010100", "1010100", "1010101", "1010011", "0000111"],
  ["0001111", "0000011", "0000101", "1001001", "0110000", "0110000", "1001000"],
  ["1000100", "1101010", "0101010", "0101011", "0101101", "0100110", "0000100"],
  ["0000000", "0101010", "1010101", "0000000", "0101010", "1010101", "0000000"],
  ["1000001", "0100010", "0100010", "1111111", "0100010", "0100010", "1000001"],
];

const G1 = "#F7D070", G2 = "#D4AF37", G3 = "#8A6818", G4 = "#453205";

/** Estrela de 8 pontas pequena (cantos e medalhões). */
function star8(b: Buf, x: number, y: number, r: number, c: string, core: string): void {
  for (let k = 0; k < 8; k++) { const an = (k * Math.PI) / 4, len = k % 2 ? r * 0.55 : r; b.line(x, y, x + Math.cos(an) * len, y + Math.sin(an) * len, c); }
  b.px(x, y, core);
}

/**
 * Verso comum a todo o baralho: astrolábio dourado sobre o céu da Prússia.
 * Fundo, moldura e ornamentos são espelhados em 180° para não denunciar a orientação no embaralhar.
 */
export function renderBack(f: Frame): Buf {
  const b = new Buf(), glow = new Buf(), p = pulse(f), r = rng(52);
  const both = (fn: (x: number, y: number) => void, x: number, y: number) => { fn(x, y); fn(W - 1 - x, H - 1 - y); };

  // Céu: nebulosas pontilhadas (Bayer) e estrelas cintilantes, tudo espelhado.
  b.rect(0, 0, W, H, "#080D1A");
  for (const [x0, y0, rx, ry, c] of [[16, 30, 22, 13, "#1F1133"], [70, 50, 16, 10, "#1F1133"], [22, 112, 18, 10, "#1F1133"], [30, 40, 10, 6, "#2A1848"], [64, 22, 9, 5, "#16244A"]] as const) {
    for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) {
      const d = (x * x) / (rx * rx) + (y * y) / (ry * ry);
      if (d <= 1 && bay(x0 + x, y0 + y) < (1 - d) * 0.9) both((xx, yy) => b.px(xx, yy, c), x0 + x, y0 + y);
    }
  }
  for (let i = 0; i < 36; i++) {
    const x = (r() * W) | 0, y = (r() * H) | 0, c = i % 3 ? "#FFFFFF" : "#62F0FF", tw = (i + f) % 4;
    both((xx, yy) => {
      b.px(xx, yy, c, tw === 0 ? 0.35 : 1);
      if (i % 6 === 0 && tw === 2) { b.px(xx - 1, yy, c, 0.5); b.px(xx + 1, yy, c, 0.5); b.px(xx, yy - 1, c, 0.5); b.px(xx, yy + 1, c, 0.5); }
    }, x, y);
  }
  for (const [x0, y0, x1, y1] of [[12, 16, 20, 24], [20, 24, 16, 34], [72, 118, 80, 126]] as const) both((xx, yy) => b.line(xx, yy, xx + (x1 - x0) * (xx === x0 ? 1 : -1), yy + (y1 - y0) * (yy === y0 ? 1 : -1), "#62B6CB", 0.25), x0, y0);

  // Moldura interna ornamental: filete duplo, estrelas nos cantos, losangos no meio dos lados.
  const m = 7;
  for (const [x0, y0, x1, y1] of [[m, m, W - 1 - m, m], [m, H - 1 - m, W - 1 - m, H - 1 - m], [m, m, m, H - 1 - m], [W - 1 - m, m, W - 1 - m, H - 1 - m]] as const) b.line(x0, y0, x1, y1, G3);
  for (let x = m + 3; x < W - m - 3; x += 2) { b.px(x, m + 2, G4); b.px(x, H - 1 - m - 2, G4); }
  for (let y = m + 3; y < H - m - 3; y += 2) { b.px(m + 2, y, G4); b.px(W - 1 - m - 2, y, G4); }
  for (const [x, y] of [[m, m], [W - 1 - m, m], [m, H - 1 - m], [W - 1 - m, H - 1 - m]] as const) { b.circ(x, y, 3, "#080D1A"); star8(b, x, y, 3, G2, G1); }
  for (const [x, y] of [[m, 80], [W - 1 - m, 80]] as const) { b.poly([[x - 2, y], [x, y - 3], [x + 2, y], [x, y + 3]], G2); b.px(x, y, G1); }
  b.circ(45, 20, 5, "#080D1A"); b.ring(45, 20, 5, G3, 1, 1); star8(b, 45, 20, 4, G2, "#FFF3B0");
  for (const [x, y] of [[45, 20], [44, H - 21]] as const) glow.blob(x, y, 6, 6, G1, 1, 0.15 + p * 0.05);

  // Simetria exata de 180°: a metade de baixo é a de cima girada (o arredondamento dos traços não desalinha).
  for (let y = H / 2; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4, j = ((H - 1 - y) * W + (W - 1 - x)) * 4;
    b.d[i] = b.d[j]!; b.d[i + 1] = b.d[j + 1]!; b.d[i + 2] = b.d[j + 2]!; b.d[i + 3] = b.d[j + 3]!;
  }

  // Astrolábio.
  const cx = 45, cy = 80;
  b.circ(cx, cy, 38, "#0B1226");
  b.ring(cx, cy, 39, G4, 1, 1); b.ring(cx, cy, 38, G2, 1, 1); b.ring(cx, cy, 37, G3, 1, 1);
  for (let k = 0; k < 72; k++) {
    const an = ((k * 5 + f * 1.25) * Math.PI) / 180, long = k % 6 === 0, r0 = long ? 33 : 35;
    b.line(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0, cx + Math.cos(an) * 36, cy + Math.sin(an) * 36, long ? G2 : G3);
  }
  ZODIAC.forEach((glyph, k) => {
    const an = ((k * 30 - 90) * Math.PI) / 180, an2 = ((k * 30 + 15 - 90) * Math.PI) / 180;
    b.line(cx + Math.cos(an2) * 25, cy + Math.sin(an2) * 25, cx + Math.cos(an2) * 32, cy + Math.sin(an2) * 32, G3);
    const gx = Math.round(cx + Math.cos(an) * 28.5 - 3), gy = Math.round(cy + Math.sin(an) * 28.5 - 3);
    glyph.forEach((row, j) => { for (let i = 0; i < 7; i++) if (row[i] === "1") b.px(gx + i, gy + j, k === (f * 3) % 12 ? G1 : G2); });
  });
  b.ring(cx, cy, 24, G2, 1, 1); b.ring(cx, cy, 23, G4, 1, 1);
  // Engrenagem de ponteiros celestes (gira no sentido oposto) e os quatro marcos de solstícios e equinócios.
  for (let k = 0; k < 24; k++) { const an = ((k * 15 - f * 3.75) * Math.PI) / 180; b.rect(Math.round(cx + Math.cos(an) * 21) - 1, Math.round(cy + Math.sin(an) * 21) - 1, 2, 2, k % 2 ? G3 : G2); }
  b.ring(cx, cy, 19, G3, 1, 1);
  for (let k = 0; k < 4; k++) {
    const an = (k * Math.PI) / 2, ex = cx + Math.cos(an) * 19, ey = cy + Math.sin(an) * 19;
    b.line(cx + Math.cos(an) * 10, cy + Math.sin(an) * 10, ex, ey, G2);
    b.poly([[ex + Math.cos(an) * 3, ey + Math.sin(an) * 3], [ex + Math.cos(an + 1.6) * 2, ey + Math.sin(an + 1.6) * 2], [ex + Math.cos(an - 1.6) * 2, ey + Math.sin(an - 1.6) * 2]], G1);
  }
  for (let k = 0; k < 4; k++) { const an = (k * Math.PI) / 2 + Math.PI / 4; b.line(cx + Math.cos(an) * 10, cy + Math.sin(an) * 10, cx + Math.cos(an) * 15, cy + Math.sin(an) * 15, G3); }
  // Núcleo: sol radiante entrelaçado à lua crescente, com o olho místico ao centro.
  for (let k = 0; k < 16; k++) { const an = (k * Math.PI) / 8, len = k % 2 ? 11 : 14; b.line(cx + Math.cos(an) * 9, cy + Math.sin(an) * 9, cx + Math.cos(an) * len, cy + Math.sin(an) * len, k % 2 ? G3 : G1); }
  b.circ(cx, cy, 8, G1); b.circ(cx, cy, 7, G2); b.ring(cx, cy, 8, G4, 1, 1);
  crescent(b, cx + 3, cy, 7, "#D9DCD6", -5); crescent(b, cx + 3, cy, 6, "#F4F6F8", -5);
  b.ell(cx, cy, 4.5, 2.2, "#FFFFFF"); b.line(cx - 5, cy, cx + 5, cy, "#453205");
  b.circ(cx, cy, 1.6, "#62F0FF"); b.px(cx, cy, "#080D1A"); b.px(cx - 1, cy - 1, "#FFFFFF");
  glow.blob(cx, cy, 11, 11, "#62F0FF", 1, 0.14 + p * 0.07);
  glow.ring(cx, cy, 38, G1, 0.08 + p * 0.05, 1);
  b.over(glow);
  drawFrame(b, "gold");
  return b;
}
