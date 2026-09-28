/**
 * Gera folhas de contato PNG de todas as lâminas para revisar a arte sem abrir o app.
 * Uso: npm run sheets -- [quadro 0-3] [escala]   → tools/out/*.png
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DECK } from "../src/domain/deck";
import { H, W, type Buf, type Frame } from "../src/engine/buf";
import { renderBack, renderFront } from "../src/engine/render";
import { encodePng } from "./png";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "out");
const frame = Number(process.argv[2] ?? 0) as Frame;
const scale = Number(process.argv[3] ?? 3);
const COLS = 8, GAP = 4, BG = [40, 40, 48] as const;

function sheet(bufs: Buf[], cols: number, file: string): void {
  const rows = Math.ceil(bufs.length / cols);
  const sw = cols * (W * scale + GAP) + GAP, sh = rows * (H * scale + GAP) + GAP;
  const out = new Uint8Array(sw * sh * 4);
  for (let i = 0; i < out.length; i += 4) { out[i] = BG[0]; out[i + 1] = BG[1]; out[i + 2] = BG[2]; out[i + 3] = 255; }
  bufs.forEach((b, idx) => {
    const ox = GAP + (idx % cols) * (W * scale + GAP), oy = GAP + Math.floor(idx / cols) * (H * scale + GAP);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const s = (y * W + x) * 4, a = b.d[s + 3]! / 255;
      for (let dy = 0; dy < scale; dy++) for (let dx = 0; dx < scale; dx++) {
        const d = ((oy + y * scale + dy) * sw + (ox + x * scale + dx)) * 4;
        for (let k = 0; k < 3; k++) out[d + k] = b.d[s + k]! * a + BG[k]! * (1 - a);
        out[d + 3] = 255;
      }
    }
  });
  writeFileSync(join(OUT, file), encodePng(sw, sh, out));
}

mkdirSync(OUT, { recursive: true });
const t0 = performance.now();
const fronts = DECK.map(c => renderFront(c, c.special ? "luz" : null, frame));
for (let i = 0; i < fronts.length; i += COLS) sheet(fronts.slice(i, i + COLS), COLS, `cartas-${i / COLS}.png`);
sheet([renderBack(0), renderBack(2)], 2, "verso.png");
console.log(`${DECK.length} lâminas em ${Math.round(performance.now() - t0)} ms → ${OUT}`);
