import type { Card, Category, Polarity } from "../domain/types";
import { Buf, H, W, rgb, type Color } from "./buf";

/* ---------- Fonte pixel 3×5 (largura variável) com acentos ---------- */

type Bitmap = readonly string[];

const FONT: Record<string, Bitmap> = {
  A: ["010", "101", "111", "101", "101"], B: ["110", "101", "110", "101", "110"], C: ["011", "100", "100", "100", "011"],
  D: ["110", "101", "101", "101", "110"], E: ["111", "100", "110", "100", "111"], F: ["111", "100", "110", "100", "100"],
  G: ["011", "100", "101", "101", "011"], H: ["101", "101", "111", "101", "101"], I: ["111", "010", "010", "010", "111"],
  J: ["001", "001", "001", "101", "010"], K: ["101", "101", "110", "101", "101"], L: ["100", "100", "100", "100", "111"],
  M: ["10001", "11011", "10101", "10001", "10001"], N: ["1001", "1101", "1011", "1001", "1001"], O: ["010", "101", "101", "101", "010"],
  P: ["110", "101", "110", "100", "100"], Q: ["010", "101", "101", "110", "011"], R: ["110", "101", "110", "101", "101"],
  S: ["011", "100", "010", "001", "110"], T: ["111", "010", "010", "010", "010"], U: ["101", "101", "101", "101", "111"],
  V: ["101", "101", "101", "101", "010"], W: ["10001", "10001", "10101", "11011", "10001"], X: ["101", "101", "010", "101", "101"],
  Y: ["101", "101", "010", "010", "010"], Z: ["111", "001", "010", "100", "111"], " ": ["00", "00", "00", "00", "00"],
  "0": ["111", "101", "101", "101", "111"], "'": ["1", "1", "0", "0", "0"], "-": ["000", "000", "111", "000", "000"],
};
type Mark = "ac" | "gr" | "ci" | "ti" | "ce";
const ACCENTED: Record<string, [string, Mark]> = {
  Á: ["A", "ac"], À: ["A", "gr"], Â: ["A", "ci"], Ã: ["A", "ti"], É: ["E", "ac"], Ê: ["E", "ci"], Í: ["I", "ac"],
  Ó: ["O", "ac"], Ô: ["O", "ci"], Õ: ["O", "ti"], Ú: ["U", "ac"], Ç: ["C", "ce"],
};
const MARKS: Record<Exclude<Mark, "ce">, Bitmap> = { ac: ["001", "010"], gr: ["100", "010"], ci: ["010", "101"], ti: ["011", "110"] };

const BIG_NUMERAL: Record<string, Bitmap> = {
  I: ["111", "010", "010", "010", "010", "010", "111"],
  V: ["10001", "10001", "10001", "10001", "01010", "01010", "00100"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
};

function glyphOf(ch: string): { g: Bitmap; m: Mark | null } {
  const u = ch.toUpperCase();
  const acc = ACCENTED[u];
  if (acc) return { g: FONT[acc[0]]!, m: acc[1] };
  return { g: FONT[u] ?? FONT[" "]!, m: null };
}

export function textWidth(str: string): number {
  let w = 0;
  for (const ch of str) w += glyphOf(ch).g[0]!.length + 1;
  return Math.max(0, w - 1);
}

export function text(b: Buf, str: string, x: number, y: number, col: Color, shadow?: Color): void {
  for (const ch of str) {
    const { g, m } = glyphOf(ch), gw = g[0]!.length;
    const draw = (ox: number, oy: number, c: Color) => {
      g.forEach((row, j) => { for (let i = 0; i < gw; i++) if (row[i] === "1") b.px(x + i + ox, y + j + oy, c); });
      if (m === "ce") b.px(x + 1 + ox, y + 5 + oy, c);
      else if (m) MARKS[m].forEach((row, j) => { for (let i = 0; i < 3; i++) if (row[i] === "1") b.px(x + i + ox, y - 2 + j + oy, c); });
    };
    if (shadow) draw(1, 1, shadow);
    draw(0, 0, col);
    x += gw + 1;
  }
}

export function wrapText(str: string, maxW: number): string[] {
  const lines: string[] = [];
  let cur = "";
  for (const w of str.split(" ")) {
    const t = cur ? `${cur} ${w}` : w;
    if (textWidth(t) <= maxW || !cur) cur = t;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

function bitmap(b: Buf, rows: Bitmap, x: number, y: number, col: (i: number) => Color, outline = true): void {
  const h = rows.length, w = rows[0]!.length;
  if (outline) for (let j = 0; j < h; j++) for (let i = 0; i < w; i++)
    if (rows[j]![i] === "1") for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) b.px(x + i + dx, y + j + dy, "#000000");
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (rows[j]![i] === "1") b.px(x + i, y + j, col(i));
}

/* ---------- Identidade visual por categoria ---------- */

export const ACCENT: Record<Category, string> = { major: "#F7D070", agua: "#62B6CB", fogo: "#E07A5F", terra: "#DDA15E", ar: "#D9DCD6", special: "#FFFFFF" };
export const SHADOW: Record<Category, string> = { major: "#0E091C", agua: "#0B1A24", fogo: "#2B1717", terra: "#1B2418", ar: "#212529", special: "#050505" };
export const RIM: Record<Category, string> = { major: "#FFF3B0", agua: "#BEE9E8", fogo: "#FFD9A0", terra: "#F0D08A", ar: "#F8F9FA", special: "#FFFFFF" };

type FrameStyle = "gold" | "silver" | "dual";
const FRAME: Record<FrameStyle, [light: string, mid: string, dark: string, outer: string]> = {
  gold: ["#FFF3B0", "#F7D070", "#9A7424", "#3A2806"],
  silver: ["#F8F9FA", "#ADB5BD", "#5C636A", "#1E2226"],
  dual: ["#FFFFFF", "#ADB5BD", "#343A40", "#050505"],
};
const frameStyle = (cat: Category): FrameStyle => (cat === "major" ? "gold" : cat === "special" ? "dual" : "silver");

const CORNER: Record<Category, Bitmap> = {
  major: ["0001000", "0101010", "0011100", "1111111", "0011100", "0101010", "0001000"],
  agua: ["0001000", "0001000", "0011100", "0111110", "0111110", "0111110", "0011100"],
  fogo: ["0001000", "0011000", "0011100", "0111100", "0111110", "0111110", "0011100"],
  terra: ["0001000", "0011100", "0111110", "1111111", "0111110", "0011100", "0001000"],
  ar: ["0111100", "1000010", "1011001", "1010101", "1001101", "0100001", "0011110"],
  special: ["0011100", "0111110", "1111111", "1111111", "1111111", "0111110", "0011100"],
};

/** Moldura chanfrada de 4px (3 tons + contorno). Dourada nos Maiores, prata nos Menores. */
export function drawFrame(b: Buf, style: FrameStyle): void {
  const [light, mid, dark, outer] = FRAME[style];
  const tl = [outer, light, mid, dark], br = [outer, dark, mid, light];
  for (let k = 0; k < 4; k++) {
    const x0 = k, y0 = k, x1 = W - 1 - k, y1 = H - 1 - k;
    for (let x = x0; x <= x1; x++) { b.px(x, y0, tl[k]!); b.px(x, y1, br[k]!); }
    for (let y = y0; y <= y1; y++) { b.px(x0, y, tl[k]!); b.px(x1, y, br[k]!); }
  }
  for (const [x, y] of [[1, 1], [W - 2, 1], [1, H - 2], [W - 2, H - 2]] as const) b.px(x, y, light);
}

function corner(b: Buf, cat: Category, x: number, y: number): void {
  bitmap(b, CORNER[cat], x, y, i => (cat === "special" && i > 3 ? "#1C1C1C" : ACCENT[cat]));
}

export function vignette(b: Buf, c: Color): void {
  const C = rgb(c), d = b.d;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const dx = (x - 45) / 45, dy = (y - 72) / 80, q = dx * dx + dy * dy;
    if (q < 0.5) continue;
    const t = Math.min(0.5, (q - 0.5) * 0.8), i = (y * W + x) * 4;
    for (let k = 0; k < 3; k++) d[i + k] = d[i + k]! + (C[k]! - d[i + k]!) * t;
  }
}

/** HUD da frente: moldura, glifos de canto, numeral (ou Luz/Escuridão) e rodapé com o nome. */
export function drawHud(b: Buf, card: Card, pol: Polarity | null): void {
  drawFrame(b, frameStyle(card.cat));
  corner(b, card.cat, 6, 6);
  corner(b, card.cat, W - 13, H - 13);

  if (card.numeral) {
    const chars = card.numeral.split("");
    const w = chars.reduce((acc, ch) => acc + BIG_NUMERAL[ch]![0]!.length + 1, -1);
    let x = Math.round(45 - w / 2);
    for (const ch of chars) { bitmap(b, BIG_NUMERAL[ch]!, x, 6, () => ACCENT[card.cat]); x += BIG_NUMERAL[ch]![0]!.length + 1; }
  } else {
    const t = pol === "escuridao" ? "ESCURIDAO" : "LUZ", x = Math.round(45 - textWidth(t) / 2);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) text(b, t, x + dx, 7 + dy, "#000000");
    text(b, t, x, 7, pol === "escuridao" ? "#FF3A5A" : "#FFFFFF");
  }

  b.rect(4, H - 23, W - 8, 19, "#000000", 0.85);
  const lines = wrapText(card.name.toUpperCase(), 56).slice(0, 2);
  const y0 = lines.length === 1 ? H - 15 : H - 19;
  lines.forEach((ln, i) => text(b, ln, Math.round(45 - textWidth(ln) / 2), y0 + i * 8, "#FFFFFF", "#1A1A1A"));
}
