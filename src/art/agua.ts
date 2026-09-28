import { Buf, H, SW, W, bay, pulse, rng, type Color } from "../engine/buf";
import { human } from "../engine/figure";
import { withSprite, type ArtFn, type Layers } from "../engine/layers";
import { mist, particles, stars, waves } from "../engine/primitives";

/** Feixes de luz vindos da superfície (água) ou das copas (bosque). */
function shafts(L: Layers, n: number, c: Color, a: number, y1 = 120): void {
  for (let k = 0; k < n; k++) {
    const x0 = 6 + k * (84 / n) + SW[(k + L.f) % 4]!;
    L.gb.poly([[x0, 0], [x0 + 5, 0], [x0 - 8, y1], [x0 - 16, y1]], c, a * (k % 2 ? 0.7 : 1));
  }
}

/** Bolhas subindo em loop. */
function bubbles(L: Layers, n: number, y0: number, y1: number): void {
  const r = rng(11);
  for (let i = 0; i < n; i++) {
    const x = (r() * W) | 0, base = r() * (y1 - y0), y = y0 + ((((base - L.f * 5) % (y1 - y0)) + (y1 - y0)) % (y1 - y0));
    L.gf.ring(x + SW[(i + L.f) % 4]!, y, i % 3 ? 1 : 1.5, "#BEE9E8", 0.7, 1);
  }
}

/** Pedra de rio coberta de limo. */
function mossRock(b: Buf, x: number, y: number, rx: number, ry: number): void {
  b.ell(x, y, rx, ry, "#4a5058"); b.ell(x - 1, y - 1, rx - 1, ry - 1, "#6a7078");
  b.ell(x - 1, y - ry + 1, rx - 1, 1.5, "#3A7A3A"); b.px(x - rx + 2, y - ry + 1, "#6ABA5A"); b.px(x + 1, y - ry, "#6ABA5A");
}

export const AGUA_ART: Record<string, ArtFn> = {
  /** Oxum no riacho entre pedras com limo, sob salgueiros; abebé de bronze e dois peixes dourados saltando entre as mãos. */
  "O Vínculo": L => {
    const { b, gb, fg, f } = L, p = pulse(f);
    b.grad(0, 0, W, 100, "#0e2a22", "#5a9a7a", 6);
    b.blob(45, 40, 36, 30, "#A8C878", 1, 0.35);
    shafts(L, 5, "#FFF3B0", 0.13, 110);
    for (let i = 0; i < 9; i++) {
      const x = 2 + i * 11, len = 30 + ((i * 13) % 26), sway = SW[(i + f) % 4]!;
      for (let k = 0; k < 5; k++) {
        const xx = x + k * 2 - 4;
        b.line(xx, 0, xx + sway, len - k * 3, k % 2 ? "#1e5a3a" : "#2A7A4A");
        if (k === 2) for (let y = 4; y < len - 6; y += 5) b.px(xx + sway * (y / len), y, "#6ABA5A");
      }
    }
    b.grad(0, 100, W, 30, "#2a6a6a", "#1B4965", 4);
    for (let y = 102; y < 128; y += 3) for (let x = (y * 7 + f * 4) % 11; x < W; x += 11) b.line(x, y, x + 4, y, y % 2 ? "#BEE9E8" : "#62B6CB", 0.7);
    b.grad(0, 128, W, H - 128, "#2a3a2a", "#141e14", 3);
    mossRock(b, 10, 108, 9, 5); mossRock(b, 80, 112, 10, 6); mossRock(b, 66, 104, 6, 3); mossRock(b, 22, 124, 8, 4);

    human(L, {
      T: 40, B: 126, detail: true, skin: "#6B4226", robe: "#E8B923", trim: "#FFF0A0", pattern: "scales", patternCol: "#C8961A",
      hair: "#1a0e08", hairLong: true, hairLen: 30, necklace: "#FFD34E", bracelets: "#FFD34E", earrings: "#FFD34E", lips: "#8a3a2a",
      armL: "fwd", armR: "fwd",
      back: (L, { cx, T, B }) => {
        // Véu d'água: cai da coroa às costas, translúcido (camada de brilho, sem contorno).
        const w = SW[L.f];
        L.gb.poly([[cx - 8, T + 1], [cx + 8, T + 1], [cx + 17 + w, B], [cx - 17 + w, B]], "#BEE9E8", 0.22);
        for (let y = T + 10; y < B; y += 7) { L.gb.px(cx - 12 - (y - T) * 0.05 + w, y, "#FFFFFF", 0.7); L.gb.px(cx + 12 + (y - T) * 0.05 + w, y + 3, "#FFFFFF", 0.7); }
      },
      front: (L, { cx, T }, h) => {
        const s = L.s, [mx, my] = h.L;
        // Abebé: leque-espelho de bronze com aro dourado.
        // Adé (coroa) dourado com franja de contas.
        s.rect(cx - 5, T - 1, 11, 2, "#FFD34E"); for (const dx of [-4, -2, 0, 2, 4]) s.px(cx + dx, T - 2 - (dx === 0 ? 1 : 0), "#FFF3B0");
        for (const dx of [-5, -3, 3, 5]) s.px(cx + dx, T + 2, "#FFD34E");
        s.rect(mx - 1, my, 2, 6, "#8a5a20");
        s.circ(mx - 2, my - 6, 5, "#B87333"); s.circ(mx - 2, my - 6, 4, "#FFE9A0"); s.circ(mx - 2, my - 6, 2.5, "#FFF8E0");
        for (let k = 0; k < 8; k++) { const an = (k * Math.PI) / 4; s.px(mx - 2 + Math.cos(an) * 5, my - 6 + Math.sin(an) * 5, "#FFD34E"); }
        L.gf.blob(mx - 2, my - 6, 8, 8, "#FFF3B0", 1, 0.3 + pulse(L.f) * 0.1); if (L.f === 1) L.gf.px(mx - 3, my - 8, "#FFFFFF");
        // Peixes dourados em arco entre as mãos.
        for (const [ph, c, dir] of [[0, "#FFD34E", 1], [2, "#F7B020", -1]] as const) {
          const t = ((L.f + ph) % 4) / 3, x = Math.round(h.L[0] + 4 + (h.R[0] - h.L[0] - 8) * t), y = Math.round(T + 30 - Math.sin(t * Math.PI) * 9), d = dir as 1 | -1;
          s.ell(x, y, 4, 2, c); s.poly([[x - d * 4, y], [x - d * 7, y - 3], [x - d * 6, y], [x - d * 7, y + 3]], c);
          s.px(x + d * 2, y - 1, "#1a1a1a"); s.line(x - 2, y - 2, x + 1, y - 3, "#FFF3B0"); s.px(x, y + 2, "#C8961A");
          for (let k = 1; k < 4; k++) L.gf.px(x - d * (k * 2 + 5), y + k, "#BEE9E8", 0.8 - k * 0.2);
        }
      },
    });
    gb.blob(45, 110, 26, 6, "#FFE9A0", 1, 0.12 + p * 0.04);
    for (let i = 0; i < 6; i++) { const x = (i * 17 + 5) % W; fg.line(x, 138, x + SW[(i + f) % 4]!, 124 - (i % 3) * 3, "#0a1a10", 1, 2); fg.px(x + SW[(i + f) % 4]!, 123 - (i % 3) * 3, "#2a5a2a"); }
    for (const [x, y] of [[4, 134], [30, 136], [58, 135], [86, 133]] as const) { fg.ell(x, y, 6, 3, "#0B1A24"); fg.ell(x - 1, y - 2, 4, 1, "#1a3a2a"); }
  },

  /** Boann sob a aveleira mágica, a concha de prata transbordando no colo; fonte circular, ninfeias e libélulas. */
  "O Oásis": L => {
    const { b, gb, s, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 112, "#0a241e", "#3a7a6a", 6);
    for (const [x, w, c] of [[6, 4, "#0e2a22"], [20, 3, "#123024"], [34, 2, "#163428"]] as const) b.rect(x, 0, w, 112, c);
    b.blob(40, 60, 30, 20, "#6AAA8A", 1, 0.3);
    b.rect(70, 16, 7, 100, "#4a3420"); b.rect(70, 16, 2, 100, "#6a4a2a"); for (let y = 22; y < 112; y += 6) b.px(74, y, "#2a1a10");
    b.line(72, 40, 58, 28, "#4a3420", 1, 3); b.line(76, 34, 88, 22, "#4a3420", 1, 3);
    for (let i = 0; i < 16; i++) {
      const x = 44 + r() * 50, y = 2 + r() * 34;
      b.circ(x, y, 5 + r() * 4, i % 3 ? "#2a6a3a" : "#1e4a2e"); b.px(x - 2, y - 2, "#6ABA5A");
      if (i % 2) { b.circ(x + 2, y + 3, 1.2, "#A0703a"); b.px(x + 2, y + 2, "#FFE9A0"); gb.px(x + 2, y + 3, "#FFD34E", 0.7); }
    }
    // Fonte de pedra circular.
    b.ell(18, 104, 15, 6, "#5a6068"); for (let k = 0; k < 8; k++) b.rect(5 + k * 3.5, 101 + (k % 2), 3, 2, k % 2 ? "#7a8088" : "#6a7078");
    b.ell(18, 102, 12, 3, "#62B6CB"); b.ell(18, 102, 8, 1.5, "#BEE9E8");
    b.line(18, 101, 18, 88 + SW[f], "#BEE9E8"); for (const sg of [-1, 1]) b.line(18, 88 + SW[f], 18 + sg * 5, 97, "#BEE9E8", 0.6);
    gb.blob(18, 96, 10, 10, "#BEE9E8", 1, 0.2);
    b.grad(0, 112, W, H - 112, "#1B4965", "#0B1A24", 3);
    for (let y = 114; y < 130; y += 3) for (let x = (y * 5 + f * 3) % 13; x < W; x += 13) b.line(x, y, x + 3, y, "#62B6CB", 0.5);

    human(L, {
      T: 62, B: 124, pose: "seat", detail: true, skin: "#F0D8C0", robe: "#62B6CB", trim: "#BEE9E8", pattern: "dots", patternCol: "#BEE9E8",
      hairLong: true, hairLen: 40, hair: "#C05030", necklace: "#D9DCD6", earrings: "#D9DCD6", lips: "#C06060", armL: "chest", armR: "chest",
      front: (L, { cx, T, B }) => {
        const s = L.s, y = T + 36;
        // Concha de prata (vieira com nervuras) transbordando água cristalina.
        s.poly([[cx - 7, y], [cx + 7, y], [cx + 5, y + 6], [cx, y + 8], [cx - 5, y + 6]], "#D9DCD6");
        for (let k = -2; k <= 2; k++) s.line(cx, y + 8, cx + k * 3, y, "#9AA4AE");
        s.line(cx - 7, y, cx + 7, y, "#FFFFFF");
        for (const sg of [-1, 1]) for (let k = 0; k < 3; k++) {
          const x0 = cx + sg * (6 + k), yy = y + 2 + ((k * 4 + L.f * 2) % (B - y - 2));
          L.gf.line(x0, y + 1, x0 + sg * 2, B - 2, "#BEE9E8", 0.35); L.gf.px(x0 + sg, yy, "#FFFFFF", 0.9);
        }
        L.gf.ell(cx, B + 1, 18, 2, "#BEE9E8", 0.35);
      },
    });
    for (const [x, y] of [[8, 120], [74, 126], [60, 116], [30, 128]] as const) { s.ell(x, y, 4, 1.5, "#2a7a4a"); s.px(x, y - 1, "#FFD1E3"); s.px(x - 1, y - 2, "#FFFFFF"); s.px(x + 1, y - 2, "#FFB7D0"); }
    for (let i = 0; i < 4; i++) {
      const x = 8 + ((i * 23 + f * 6) % 74), y = 44 + ((i * 17) % 40) + SW[(i + f) % 4]!;
      gf.line(x - 3, y, x + 3, y, "#2AA0A0"); gf.px(x + 3, y, "#62F0FF");
      gf.line(x - 1, y - 2 + (f % 2), x + 1, y - 2 + (f % 2), "#E0FFFF", 0.7); gf.line(x - 1, y + 2 - (f % 2), x + 1, y + 2 - (f % 2), "#E0FFFF", 0.5);
      gf.blob(x, y, 3, 3, "#62F0FF", 1, 0.2 + p * 0.05);
    }
    for (let i = 0; i < 12; i++) { const x = (r() * W) | 0; fg.line(x, 138, x + (i % 2 ? 2 : -2), 128 - (i % 4) * 2, "#06140e"); }
    fg.rect(0, 135, W, 3, "#06140e");
  },

  /** Sedna no trono de coral morto no abismo polar; mãos sem dedos sobre o baú de conchas; icebergs e baleias. */
  "A Saudade": L => {
    const { b, gb, s, gf, fg, f } = L, p = pulse(f);
    b.grad(0, 0, W, 16, "#6A9AB0", "#2a5a78", 3);
    b.grad(0, 16, W, H - 16, "#1a3a52", "#01050a", 7);
    for (let x = 0; x < W; x++) b.px(x, 16 + ((x + f) % 5 === 0 ? 1 : 0), "#BEE9E8", 0.8);
    for (const [x0, w, h] of [[0, 30, 12], [56, 34, 14]] as const) {
      b.poly([[x0, 16], [x0 + w * 0.3, 8], [x0 + w * 0.7, 10], [x0 + w, 16]], "#E8F6FA");
      b.poly([[x0, 16], [x0 + w, 16], [x0 + w * 0.8, 16 + h * 2], [x0 + w * 0.4, 16 + h * 2.6], [x0 + w * 0.1, 16 + h]], "#2a6a8a", 0.7);
      b.line(x0 + w * 0.3, 8, x0 + w * 0.2, 16, "#FFFFFF");
    }
    shafts(L, 4, "#BEE9E8", 0.1, 100);
    for (const [x, y, d, sz] of [[20, 58, 1, 1], [74, 44, -1, 0.7]] as const) {
      b.ell(x, y, 14 * sz, 4 * sz, "#0a2436"); b.ell(x + d * 4 * sz, y + 1, 8 * sz, 2 * sz, "#123a52");
      b.poly([[x - d * 14 * sz, y], [x - d * 20 * sz, y - 5 * sz], [x - d * 22 * sz, y - 3 * sz], [x - d * 19 * sz, y], [x - d * 22 * sz, y + 3 * sz], [x - d * 20 * sz, y + 5 * sz]], "#0a2436");
      b.line(x + d * 6 * sz, y + 2 * sz, x + d * 2 * sz, y + 7 * sz, "#0a2436", 1, 2);
    }
    b.grad(0, 118, W, H - 118, "#0a1a20", "#02070c", 3);
    for (let i = 0; i < 12; i++) b.px((i * 29) % W, 120 + ((i * 7) % 14), "#1a3a42");

    // Trono de coral morto, alvejado.
    const coral = (x0: number, y0: number, x1: number, y1: number, t: number) => { s.line(x0, y0, x1, y1, "#9A8A86", 1, t); s.line(x0 - 1, y0, x1 - 1, y1, "#C8B8B0"); };
    for (const [dx, dy] of [[-20, 4], [20, 2], [-15, -18], [15, -20], [-6, -30], [6, -32]] as const) {
      coral(45, 112, 45 + dx, 80 + dy, 3); coral(45 + dx, 80 + dy, 45 + dx + (dx > 0 ? 5 : -5), 74 + dy, 2);
      coral(45 + dx * 0.7, 88 + dy * 0.7, 45 + dx * 0.7 + (dx > 0 ? -4 : 4), 82 + dy * 0.7, 1);
      s.px(45 + dx + (dx > 0 ? 5 : -5), 73 + dy, "#E8D8D0");
    }
    human(L, {
      T: 62, B: 124, pose: "seat", detail: true, skin: "#9AB0B8", robe: "#1B4965", trim: "#62B6CB", pattern: "scales", patternCol: "#2A6A8A",
      hairLong: true, hairLen: 46, hair: "#050A10", necklace: "#BEE9E8", lips: "#5A6A78", brow: "#050A10", armL: "chest", armR: "chest",
      back: (L, { cx, T }) => {
        for (let k = 0; k < 6; k++) {
          const sg = k % 2 ? 1 : -1, x0 = cx + sg * (4 + k), wave = SW[(k + L.f) % 4]! * 2;
          L.s.line(x0, T + 2, x0 + sg * (8 + k * 2) + wave, T - 10 - k * 2, "#050A10", 1, 2);
          L.s.line(x0 + sg * (8 + k * 2) + wave, T - 10 - k * 2, x0 + sg * (12 + k * 2) - wave, T - 18 - k, "#0a1420");
        }
      },
      front: (L, { cx, T }) => {
        const s = L.s, y = T + 40;
        s.rect(cx - 9, y, 18, 9, "#4a3a2a"); s.rect(cx - 9, y, 18, 2, "#6a5a3a"); s.rect(cx - 9, y + 4, 18, 1, "#2a2a2a");
        for (const x of [cx - 7, cx + 6]) s.rect(x, y, 1, 9, "#6a6a6a");
        s.px(cx - 4, y - 1, "#FFD1E3"); s.px(cx - 3, y - 1, "#FFD1E3"); s.circ(cx + 3, y - 1, 1.2, "#E8E0D0"); s.px(cx, y - 1, "#FFFFFF");
        L.gf.blob(cx, y + 3, 6, 4, "#BEE9E8", 1, 0.2 + pulse(L.f) * 0.06);
        for (const sg of [-1, 1]) { s.rect(cx + sg * 5 - 1, y - 3, 3, 2, "#9AB0B8"); s.px(cx + sg * 5, y - 1, "#7A9098"); }
      },
    });
    bubbles(L, 10, 20, 124); particles(gf, rng(3), 16, "#8AAAB8", f, 1, 18, 130, 2, 0.6);
    gb.blob(45, 96, 20, 20, "#62B6CB", 1, 0.08 + p * 0.03);
    for (let i = 0; i < 5; i++) { const x = 4 + i * 20, sw = SW[(i + f) % 4]!; fg.line(x, 138, x + sw, 114 + (i % 2) * 6, "#061018", 1, 3); fg.line(x + sw, 120, x + sw + 4, 116, "#061018"); }
    fg.rect(0, 134, W, 4, "#02060a");
  },

  /** Proteu, pastor dos mares, se desfaz em névoa enquanto fita o horizonte; castelos de areia gigantes ruem sob a maré cinzenta. */
  "A Miragem": L => {
    const { b, gb, s, gf, fg, f } = L;
    b.grad(0, 0, W, 94, "#6A7A88", "#D8D2C4", 6);
    b.circ(66, 38, 8, "#F0ECE0"); gb.blob(66, 38, 18, 14, "#FFFFFF", 1, 0.25);
    mist(b, 70, 4, "#E8ECEF", 0.35, f);
    waves(b, 92, 110, "#8A98A4", "#E8ECEF", f, 2);
    b.grad(0, 110, W, H - 110, "#C8B890", "#9A8A68", 4);
    for (let x = 0; x < W; x++) if ((x + f * 2) % 7 < 4) b.px(x, 110 + ((x >> 2) % 2), "#FFFFFF", 0.6);
    const castle = (x: number, y: number, h: number, crumble: number) => {
      b.rect(x - 7, y - h, 14, h, "#D8C8A0"); b.rect(x - 7, y - h, 3, h, "#E8DCB8"); b.rect(x + 4, y - h, 3, h, "#B8A880");
      b.rect(x - 4, y - h - 10, 8, 10, "#D8C8A0"); b.rect(x - 4, y - h - 10, 2, 10, "#E8DCB8");
      for (let k = 0; k < 3; k++) b.rect(x - 4 + k * 3, y - h - 12, 2, 2, "#D8C8A0");
      b.rect(x - 1, y - h - 6, 2, 3, "#8a7a5a"); b.rect(x - 2, y - 8, 4, 8, "#8a7a5a");
      b.poly([[x + 7 - crumble, y - h], [x + 7, y - h + 4], [x + 7, y], [x + 11, y]], "#B8A880");
      for (let k = 0; k < 4; k++) gf.px(x + 6 + ((k * 3) % 5), y - h + 4 + ((k * 7 + f * 3) % (h - 4)), "#D8C8A0");
    };
    castle(12, 116, 26, 5); castle(78, 118, 20, 4);
    for (let i = 0; i < 3; i++) { const x = 20 + i * 24; b.ell(x, 112, 5, 2, "#5a5a5a"); b.circ(x + 4, 110, 1.5, "#6a6a6a"); b.px(x + 5, 110, "#1a1a1a"); }

    const sheet = new Buf();
    human(withSprite(L, sheet), {
      T: 40, B: 128, detail: true, profile: 1, skin: "#B09080", robe: "#4A6A7A", trim: "#8AB0C0", pattern: "scales", patternCol: "#5A7A8A",
      hair: "#E8E8E8", beard: "#E8E8E8", beardLong: true, necklace: "#E8C8B0", armR: "hold", armL: "down",
      front: (L, { cx, T }, h) => {
        const s = L.s, [x, y] = h.R, c = "#E09080", d = "#A86858";
        s.line(x, y + 26, x, y - 28, "#8a6a5a", 1, 2);
        s.rect(x - 4, y - 29, 9, 2, c); s.line(x - 4, y - 29, x - 4, y - 35, c); s.line(x, y - 29, x, y - 38, c); s.line(x + 4, y - 29, x + 4, y - 33, c);
        s.px(x - 4, y - 36, d); s.px(x + 4, y - 34, d); s.px(x - 1, y - 32, d); s.px(x + 3, y - 30, "#FFD1C8");
        for (let k = 0; k < 5; k++) s.line(cx + 2 + k, T + 11, cx + 1 + k * 1.2, T + 20, "#D8D8D8");
      },
    });
    // O corpo de Proteu se desfaz em névoa da cintura para baixo.
    const y0 = 84;
    for (let y = y0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (!sheet.d[i + 3]) continue;
      if (bay(x + f, y) < (y - y0) / 40) { sheet.d[i + 3] = 0; if (bay(x, y + f) < 0.3) gf.px(x + SW[f], y - f, "#E8ECEF", 0.55); }
    }
    s.over(sheet);
    mist(gf, 100, 3, "#F4F6F8", 0.25, f);
    fg.poly([[0, 138], [0, 128], [16, 131], [34, 134], [56, 132], [74, 128], [90, 130], [90, 138]], "#7a6a4a");
    for (const [x, y] of [[10, 132], [70, 130]] as const) { fg.poly([[x - 3, y], [x, y - 3], [x + 3, y]], "#E8D8C0"); fg.px(x, y - 1, "#C8A8A0"); }
  },

  /** Yemanjá entre o mar e o céu estrelado: vestido branco e azul perolado, pérolas escorrendo das palmas, espuma luminescente. */
  "A Plenitude": L => {
    const { b, gb, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 96, "#030618", "#1B4965", 6); stars(b, r, 36, 90, f, ["#FFFFFF", "#BEE9E8", "#E8E0FF"]);
    for (let x = 0; x < W; x++) { const y = 20 + x * 0.5; for (let k = -4; k <= 4; k++) if (bay(x, y + k) < 0.35 - Math.abs(k) * 0.07) b.px(x, y + k, "#8AA0D0", 0.5); }
    b.circ(76, 18, 5, "#F4F8FF"); b.circ(78, 17, 4, "#1a2a48"); gb.blob(76, 18, 12, 12, "#BEE9E8", 1, 0.2);
    b.grad(0, 96, W, 30, "#1B4965", "#0B1A24", 3);
    for (let y = 97; y < 124; y += 2) { const w = 3 + (y - 96) * 0.25; b.line(76 - w + SW[(y + f) % 4]!, y, 76 + w + SW[(y + f) % 4]!, y, "#BEE9E8", 0.35); }
    for (let y = 116; y < 130; y += 2) for (let x = 0; x < W; x++) if ((x + y * 2 + f * 3) % 9 < 4) b.px(x, y, y % 4 ? "#BEE9E8" : "#FFFFFF");
    b.grad(0, 126, W, H - 126, "#D8C8A0", "#A89870", 3);
    gb.rect(0, 116, W, 14, "#62F0FF", 0.12 + p * 0.05);

    const hands = human(L, {
      T: 40, B: 128, detail: true, skin: "#8a5a3a", robe: "#F8FBFF", trim: "#62B6CB", pattern: "stripes", patternCol: "#BEE9E8",
      hairLong: true, hairLen: 40, hair: "#0a0a0a", head: "crown", crownCol: "#E0E8F0", gem: "#62B6CB", necklace: "#FFFFFF", bracelets: "#E0E8F0",
      earrings: "#FFFFFF", lips: "#7a3a3a", armL: "open", armR: "open",
      back: (L, { cx, T, B }) => {
        L.s.poly([[cx - 10, T + 16], [cx + 10, T + 16], [cx + 22 + SW[L.f] * 2, B], [cx - 22 + SW[L.f] * 2, B]], "#62B6CB");
        L.s.poly([[cx - 10, T + 16], [cx - 22 + SW[L.f] * 2, B], [cx - 17, B]], "#8ACFE0");
      },
      front: (L, { cx, T }) => {
        const s = L.s, hy = T + 7;
        for (let k = -3; k <= 3; k++) { s.px(cx + k * 2, hy - 5, "#FFFFFF"); if (Math.abs(k) >= 2) { s.px(cx + k * 2 + (k > 0 ? 1 : -1), hy - 2, "#FFFFFF"); s.px(cx + k * 2 + (k > 0 ? 1 : -1), hy, "#BEE9E8"); } }
        for (let y = T + 36; y < T + 80; y += 6) s.line(cx - 5, y, cx + 5, y, "#62B6CB", 0.5);
      },
    });
    for (const [hx, hy] of [hands.L, hands.R]) {
      for (let k = 0; k < 7; k++) { const t = (k * 3 + f * 2) % 20; gf.px(hx + (hx < 45 ? -1 : 1) * Math.round(t * 0.2), hy + 3 + t * 1.6, "#FFFFFF"); if (k % 2) gf.px(hx, hy + 3 + t * 1.6 + 1, "#BEE9E8", 0.6); }
      gf.blob(hx, hy, 5, 5, "#BEE9E8", 1, 0.35 + p * 0.08);
    }
    for (let x = 0; x < W; x += 2) fg.px(x, 134 - ((x + f) % 3 === 0 ? 1 : 0), "#FFFFFF", 0.8);
    for (const [x, y] of [[8, 136], [26, 137], [70, 136], [84, 137]] as const) { fg.ell(x, y, 2.5, 1.5, "#F0E0D0"); fg.px(x, y - 1, "#FFFFFF"); }
  },

  /** Ryujin jovem: chifres de coral, quimono aquático, a joia das marés; ponte vermelha sobre ondas revoltas e sakura na espuma. */
  "O Sonhador": L => {
    const { b, gb, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 104, "#101a34", "#6A8AB0", 6);
    b.circ(20, 24, 7, "#F4E8F0"); gb.blob(20, 24, 14, 14, "#FFD1E3", 1, 0.2);
    for (let k = 0; k < 3; k++) b.blob(60 + k * 12, 30 + k * 6, 14, 3, "#8A9AC0", 1, 0.5);
    const deck = (x: number) => Math.round(80 + Math.pow((x - 45) / 45, 2) * 12);
    for (let x = 0; x < W; x++) { const y = deck(x); b.rect(x, y, 1, 3, "#D03020"); b.px(x, y + 3, "#8a1a10"); b.px(x, y - 6, "#D03020"); if (x % 2) b.px(x, y - 5, "#8a1a10", 0.5); }
    for (const x of [6, 20, 34, 56, 70, 84]) { const y = deck(x); b.rect(x, y - 7, 2, 7, "#D03020"); b.px(x, y - 8, "#F7D070"); b.rect(x, y + 3, 2, 22, "#8a1a10"); }
    // Dragão marinho arqueando entre as ondas atrás da ponte.
    for (let t = 0; t <= 20; t++) { const x = 4 + t * 4, y = 100 - Math.sin((t / 20) * Math.PI * 2 + f * 0.4) * 6; b.circ(x, y, 3, "#1a5a6a", 0.6); if (t % 2) b.px(x, y - 3, "#62B6CB", 0.6); }
    waves(b, 100, H, "#1B4965", "#BEE9E8", f, 3);
    for (let i = 0; i < 8; i++) { const x = (i * 23 + f * 5) % W, y = 106 + (i % 4) * 7; b.poly([[x - 4, y + 2], [x, y - 3], [x + 4, y + 2]], "#FFFFFF", 0.8); }
    particles(gf, r, 18, "#FFB7D0", f, 1, 0, 130, 3);

    human(L, {
      T: 42, B: 128, detail: true, skin: "#E8D0B0", robe: "#2A8A9A", trim: "#BEE9E8", pattern: "scales", patternCol: "#62B6CB",
      hair: "#1a4a5a", hairLong: true, hairLen: 36, head: "horns", hornCol: "#FF8060", sash: "#D03020", eye: "#1a3a6a",
      armL: "down", armR: "fwd",
      back: (L, { cx, T }) => {
        // Mangas largas do quimono pendendo dos antebraços, com barra clara e ondulação.
        const sw = SW[L.f], s = L.s;
        const sleeve = (x0: number, y0: number, x1: number, y1: number) => {
          s.poly([[x0, y0], [x1, y0], [x1 + 1 + sw, y1 - 2], [x1 - 2 + sw, y1], [x0 + 2 + sw, y1], [x0 - 1 + sw, y1 - 2]], "#1E7080");
          s.line(x0 + sw, y1 - 1, x1 + sw, y1 - 1, "#BEE9E8"); s.line(x0 + 1, y0 + 2, x0 + sw, y1 - 3, "#2A8A9A");
          for (let y = y0 + 4; y < y1 - 2; y += 4) s.px((x0 + x1) / 2 + sw, y, "#62B6CB");
        };
        sleeve(cx - 20, T + 26, cx - 10, T + 46);
        sleeve(cx + 8, T + 24, cx + 18, T + 40);
      },
      front: (L, { cx, T }, h) => {
        const s = L.s, hy = T + 7;
        s.rect(cx - 8, T + 30, 17, 4, "#D03020"); s.line(cx - 8, T + 31, cx + 8, T + 31, "#F7D070");
        s.line(cx - 5, hy + 3, cx - 10, hy + 7 + SW[L.f], "#1a4a5a"); s.line(cx + 5, hy + 3, cx + 10, hy + 7 - SW[L.f], "#1a4a5a");
        const [jx, jy] = h.R;
        s.circ(jx + 2, jy - 3, 3, "#BEE9E8"); s.circ(jx + 2, jy - 3, 2, "#62F0FF"); s.px(jx + 1, jy - 4, "#FFFFFF");
        L.gf.blob(jx + 2, jy - 3, 9 + pulse(L.f), 9 + pulse(L.f), "#62F0FF", 1, 0.35 + pulse(L.f) * 0.1);
        for (let k = 0; k < 4; k++) { const an = (k * Math.PI) / 2 + L.f * 0.4; L.gf.px(jx + 2 + Math.cos(an) * 6, jy - 3 + Math.sin(an) * 6, "#FFFFFF", 0.8); }
      },
    });
    gf.blob(45, 128, 22, 4, "#BEE9E8", 1, 0.15 + p * 0.05);
    for (let x = 0; x < W; x += 3) fg.px(x, 133 + ((x + f) % 2), "#FFFFFF", 0.8);
    for (let i = 0; i < 6; i++) { const x = (i * 16 + f * 3) % W; fg.ell(x, 136, 1.5, 1, "#FFB7D0"); }
    fg.rect(0, 136, W, 2, "#0B1A24");
  },

  /** Mami Wata no recife sob raios solares: jiboia prateada nos ombros, espelho e pente de marfim, peixes abissais. */
  "O Guardião das Marés": L => {
    const { b, gb, gf, fg, f } = L, p = pulse(f);
    b.grad(0, 0, W, H, "#0E4A6A", "#020E18", 7);
    shafts(L, 5, "#BEE9E8", 0.12, 118);
    // Recife: leques, coral-cérebro e esponjas-tubo.
    const fan = (x: number, y: number, rad: number, c: Color) => { for (let k = 0; k < 9; k++) { const an = Math.PI * (1.1 + k * 0.1); b.line(x, y, x + Math.cos(an) * rad, y + Math.sin(an) * rad, c); } b.ring(x, y, rad, c, 0.6, 1); };
    fan(12, 118, 14, "#C85A6A"); fan(80, 116, 12, "#E08A5F");
    for (const [x, y, c] of [[26, 122, "#A87ACF"], [64, 124, "#62B6CB"]] as const) { b.circ(x, y, 5, c); for (let k = -4; k <= 4; k += 2) b.line(x + k, y - 4, x + k + 1, y + 4, "#000000", 0.2); }
    for (const x of [34, 38, 56]) { b.rect(x, 110, 3, 16, "#E0C050"); b.rect(x, 110, 3, 1, "#8a6a20"); }
    b.grad(0, 124, W, H - 124, "#0a2030", "#040c14", 3);
    for (let i = 0; i < 5; i++) {
      const x = ((i * 27 + f * 3) % 86) + 2, y = 60 + ((i * 19) % 44), d = i % 2 ? 1 : -1;
      b.ell(x, y, 4, 2, "#061018"); b.poly([[x - d * 4, y], [x - d * 7, y - 2], [x - d * 7, y + 2]], "#061018");
      b.line(x + d * 2, y - 2, x + d * 5, y - 5, "#1a3040"); gf.px(x + d * 5, y - 6, "#BEFFFF"); gf.blob(x + d * 5, y - 6, 3, 3, "#62F0FF", 1, 0.35);
    }
    for (let i = 0; i < 9; i++) { const x = (i * 11 + f * 4) % W, y = 30 + (i % 3) * 4; b.ell(x, y, 1.5, 0.8, "#FFD34E", 0.8); }

    human(L, {
      T: 42, B: 130, detail: true, skin: "#5A3A2A", robe: "#1B4965", trim: "#BEE9E8", pattern: "scales", patternCol: "#2A8A9A",
      hairLong: true, hairLen: 38, hair: "#050505", necklace: "#FFFFFF", bracelets: "#F7D070", earrings: "#F7D070", lips: "#7a2a2a",
      armL: "fwd", armR: "fwd",
      front: (L, { cx, T }, h) => {
        const s = L.s, sil = "#C8D0D8", dk = "#8A949E", belly = "#F0F4F8";
        // Jiboia prateada: atrás do pescoço, sobre os ombros, descendo pelos braços; cabeça erguida à direita.
        const pts: [number, number][] = [[cx - 18, T + 38], [cx - 16, T + 28], [cx - 11, T + 18], [cx - 5, T + 13], [cx + 2, T + 13], [cx + 9, T + 15], [cx + 13, T + 22], [cx + 17, T + 30], [cx + 20, T + 22], [cx + 19, T + 14]];
        for (let i = 0; i < pts.length - 1; i++) {
          const [x0, y0] = pts[i]!, [x1, y1] = pts[i + 1]!;
          s.line(x0, y0, x1, y1, sil, 1, 4); s.line(x0, y0 + 1, x1, y1 + 1, belly);
          for (let t = 0; t <= 1; t += 0.34) s.px(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t - 1, dk);
        }
        const [hx, hy] = pts[pts.length - 1]!;
        s.ell(hx + 1, hy - 2, 3.5, 2.5, sil); s.px(hx + 2, hy - 3, "#1a1a1a"); s.px(hx - 1, hy - 3, dk);
        if (L.f % 2) { s.line(hx + 4, hy - 1, hx + 7, hy - 1, "#C8102E"); s.px(hx + 8, hy - 2, "#C8102E"); s.px(hx + 8, hy, "#C8102E"); }
        const [mx, my] = h.L;
        s.rect(mx - 1, my, 2, 5, "#8a5a20"); s.circ(mx - 2, my - 5, 4, "#B87333"); s.circ(mx - 2, my - 5, 3, "#DCEAF0"); s.px(mx - 3, my - 6, "#FFFFFF");
        L.gf.blob(mx - 2, my - 5, 6, 6, "#FFFFFF", 1, 0.2 + pulse(L.f) * 0.08);
        const [px, py] = h.R;
        s.rect(px - 1, py - 6, 6, 3, "#F4ECD8"); for (let k = 0; k < 6; k++) s.line(px - 1 + k, py - 3, px - 1 + k, py, "#E8DCC0");
      },
    });
    gb.blob(45, 60, 24, 30, "#62B6CB", 1, 0.08 + p * 0.03);
    bubbles(L, 12, 10, 128);
    for (let i = 0; i < 7; i++) { const x = 4 + i * 13, sw = SW[(i + f) % 4]!; fg.line(x, 138, x + sw, 124 - (i % 3) * 4, "#04101a", 1, 2); fg.line(x + sw, 130, x + sw + 3, 126, "#04101a"); }
    fg.rect(0, 135, W, 3, "#030a12");
  },
};
