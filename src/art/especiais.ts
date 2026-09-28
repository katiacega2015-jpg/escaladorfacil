import { H, SW, W, pulse, rng, type Color, type Pt } from "../engine/buf";
import { human } from "../engine/figure";
import type { ArtFn, Layers } from "../engine/layers";
import { bolt, flame, rays, type FlamePalette } from "../engine/primitives";

const HEART = "#FF0055", HEART_D = "#A0003A", HEART_L = "#FF8AB0";
const GOLD = "#FFD700";

/** Coração anatômico (não o símbolo): ventrículos, aorta, artérias e veias; pulsa a cada 2 s. */
function heart(L: Layers, x: number, y: number, pierced: boolean): void {
  const { s, gf, gb, f } = L, p = pulse(f), k = 1 + p * 0.08;
  const P = (pts: Pt[]): Pt[] => pts.map(([dx, dy]) => [x + dx * k, y + dy * k]);
  gb.blob(x, y, 11 + p, 11 + p, HEART, 1, 0.12 + p * 0.05);
  s.poly(P([[-1, -4], [2, -5], [5, -3], [6, 0], [5, 3], [2, 6], [0, 8], [-2, 6], [-5, 3], [-5, -1], [-3, -4]]), HEART);
  s.poly(P([[1, -2], [5, -1], [5, 3], [2, 6], [0, 8], [1, 3]]), HEART_D);
  s.line(x - 3, y - 2, x - 3, y + 2, HEART_L); s.px(x - 2, y - 3, "#FFD0E0");
  s.line(x + 1, y - 3, x - 1, y + 5, "#C0003F");
  s.line(x - 1, y - 5, x - 1, y - 9, HEART, 1, 2); s.line(x - 1, y - 9, x + 3, y - 10, HEART, 1, 2); s.px(x + 4, y - 9, HEART_D);
  s.line(x - 4, y - 3, x - 6, y - 7, HEART_D, 1, 2); s.line(x + 3, y - 5, x + 5, y - 8, HEART_D);
  gf.blob(x, y + 1, 6 + p, 6 + p, HEART, 1.1, 0.22 + p * 0.1);
  gf.ring(x, y + 1, 8 + p * 2, HEART_L, 0.1 + p * 0.08, 1);
  if (pierced) {
    s.line(x + 9, y - 8, x - 7, y + 9, "#1A1A1E", 1, 2); s.px(x - 8, y + 10, "#0A0A0C");
    for (const [dx, dy] of [[5, -4], [1, 0], [-3, 4]] as const) s.poly([[x + dx, y + dy], [x + dx + 3, y + dy - 1], [x + dx + 1, y + dy + 1]], "#1A1A1E");
    for (let q = 0; q < 4; q++) { const dy = 9 + ((q * 7 + f * 3) % 26); gf.px(x - 2 + (q % 2) * 3, y + dy, HEART, 0.9); gf.px(x - 2 + (q % 2) * 3, y + dy + 1, HEART_D, 0.7); }
  }
}

/** Pétalas vermelhas caindo em diagonal (duas por partícula, balanço de 4 quadros). */
function petals(L: Layers, n: number, speed: number, cols: readonly [Color, Color]): void {
  const r = rng(7), { gf, f } = L;
  for (let i = 0; i < n; i++) {
    const x0 = r() * W, base = r() * 130, y = 8 + ((base + f * speed) % 128), x = Math.round(x0 + SW[(i + f) % 4]! * 2 + y * 0.08) % W;
    gf.px(x, y, cols[0]); gf.px(x + 1, y + 1, cols[1]); if (i % 3 === 0) gf.px(x + 1, y, cols[0], 0.6);
  }
}

/** Coluna de mármore canelada, inteira (capitel) ou partida (topo irregular). */
function column(L: Layers, x: number, top: number, bot: number, w: number, broken: boolean, tone: readonly [Color, Color, Color]): void {
  const { b } = L, [lt, md, dk] = tone;
  b.rect(x, top, w, bot - top, md);
  b.rect(x, top, 2, bot - top, lt); b.rect(x + w - 2, top, 2, bot - top, dk);
  for (let fx = x + 3; fx < x + w - 2; fx += 2) b.line(fx, top + 2, fx, bot - 3, dk, 0.35);
  b.rect(x - 2, bot - 3, w + 4, 3, lt); b.rect(x - 2, bot - 1, w + 4, 1, dk);
  if (broken) {
    const jag: Pt[] = [[x - 1, top + 1]];
    for (let i = 0; i <= w; i += 2) jag.push([x + i, top - ((i * 7 + w) % 5)]);
    jag.push([x + w + 1, top + 1]);
    b.poly(jag, md); b.line(x, top + 1, x + w, top - 1, lt);
  } else {
    b.rect(x - 3, top - 4, w + 6, 4, lt); b.rect(x - 2, top - 1, w + 4, 1, dk);
    b.circ(x - 2, top - 2, 1.5, md); b.circ(x + w + 1, top - 2, 1.5, md);
  }
}

/** Leão de Ishtar sobre pedestal (portal da Babilônia), de perfil, olhando para o centro. */
function lion(L: Layers, x: number, y: number, sg: 1 | -1, dark: boolean): void {
  const { b, gf } = L, body = dark ? "#8A8A8E" : "#DCDCDC", mane = dark ? "#6A6A70" : "#B8B8BC", sh = dark ? "#4A4A50" : "#9A9A9E";
  b.rect(x - 8, y, 16, 9, dark ? "#7A7A80" : "#CFCFCF"); b.rect(x - 8, y, 16, 1, "#F2F2F2"); b.rect(x - 9, y + 8, 18, 2, sh);
  for (let q = 0; q < 3; q++) b.rect(x - 6 + q * 5, y + 3, 3, 3, sh, 0.6);
  b.ell(x - sg, y - 4, 6, 3, body);
  for (const dx of [-5, -2, 2, 4]) b.rect(x + dx, y - 3, 2, 3, body);
  b.circ(x + sg * 5, y - 8, 4, mane); b.circ(x + sg * 6, y - 7, 2.5, body);
  b.px(x + sg * 8, y - 7, sh); b.px(x + sg * 7, y - 8, dark ? "#FFFFFF" : "#2A2A2A");
  b.line(x - sg * 6, y - 5, x - sg * 9, y - 9, body); b.px(x - sg * 9, y - 10, mane);
  if (dark) {
    b.line(x - 2, y - 7, x + 1, y + 6, "#2A2A2E"); b.line(x + 1, y + 6, x - 1, y + 9, "#2A2A2E");
    gf.px(x + sg * 7, y - 8, "#FFFFFF", 0.8);
  }
}

/** Rama de roseira com espinhos e rosas (primeiro plano). */
function roseVine(L: Layers, pts: Pt[], roses: readonly Pt[], wilted: boolean): void {
  const { fg, f } = L;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i]!, [x1, y1] = pts[i + 1]!;
    fg.line(x0, y0, x1, y1, "#0C0C0E", 1, 2);
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    fg.poly([[mx, my], [mx + 3, my - 2], [mx + 1, my + 1]], "#0C0C0E"); fg.poly([[mx - 1, my + 1], [mx - 4, my], [mx - 1, my - 1]], "#0C0C0E");
    if (i % 2) fg.ell(mx + 3, my + 2, 2.5, 1.2, "#1C1C20");
  }
  roses.forEach(([x, y], i) => {
    const dy = wilted ? 1 : 0;
    fg.circ(x, y + dy, 3, wilted ? "#5A0020" : HEART_D); fg.circ(x, y + dy, 2, wilted ? "#7A0028" : HEART);
    fg.px(x - 1, y - 1 + dy, wilted ? "#8A1A3A" : "#FF5A8A"); fg.px(x, y + dy, HEART_D); fg.px(x + 1, y - 1 + dy, HEART_D);
    if (wilted && (i + f) % 2) fg.px(x, y + 5 + f, HEART_D);
  });
}

export const ESPECIAIS_ART: Record<string, ArtFn> = {
  /**
   * Ishtar/Inanna em escala de cinza pura; o coração anatômico (#FF0055) e as rosas são a única cor.
   * Luz: véu nupcial luminoso, pombas e eclipse anular brilhante. Escuridão: a armadura de espinhos
   * avança sobre o véu, o coração sangra trespassado e as rosas murcham.
   */
  "A Paixão": L => {
    const { b, gb, s, fg, f } = L, p = pulse(f), dark = L.pol === "escuridao";

    b.grad(0, 0, W, 108, dark ? "#030303" : "#141416", dark ? "#34343A" : "#A8A8B0", 7);
    const ex = 45, ey = 21;
    rays(gb, ex, ey, 20, 46, dark ? "#8A8A90" : "#FFFFFF", dark ? 0.12 : 0.28, f * 0.03);
    gb.blob(ex, ey, 22, 22, "#FFFFFF", 1, dark ? 0.1 : 0.3 + p * 0.06);
    b.circ(ex, ey, 10, dark ? "#6A6A70" : "#FFFFFF"); b.ring(ex, ey, 11, dark ? "#3A3A40" : "#D8D8DE", 1, 1);
    b.circ(ex, ey, dark ? 9 : 8, "#050505");
    for (let k = 0; k < 12; k++) { const an = (k * Math.PI) / 6 + f * 0.1, rr = 12 + ((k + f) % 3); b.px(ex + Math.cos(an) * rr, ey + Math.sin(an) * rr, "#F4F4F4", dark ? 0.3 : 0.8); }

    // Palácio ao longe: frontão partido e colunata baixa.
    const far = dark ? "#3A3A40" : "#8E8E96";
    b.rect(14, 62, 62, 4, far); b.poly([[14, 62], [45, 50], [58, 55], [52, 58], [60, 62]], far);
    for (let x = 16; x < 76; x += 7) b.rect(x, 66, 3, x > 60 ? 18 : 38, far);
    b.rect(12, 102, 66, 3, far);

    const tone = dark ? (["#9A9AA0", "#6A6A70", "#3A3A40"] as const) : (["#FFFFFF", "#D6D6DA", "#8A8A90"] as const);
    column(L, 1, 36, 108, 9, false, tone); column(L, 80, 48, 108, 9, true, tone);
    column(L, 14, 70, 108, 6, true, tone); column(L, 70, 60, 108, 6, false, tone);
    b.poly([[0, 30], [22, 30], [26, 34], [18, 36], [0, 36]], tone[1]); b.line(0, 30, 22, 30, tone[0]);

    // Piso de mármore em perspectiva com veios e rachaduras.
    b.grad(0, 106, W, H - 106, dark ? "#5A5A60" : "#CFCFD4", dark ? "#1A1A1E" : "#6A6A70", 4);
    for (let y = 108, row = 0; y < H; y += 3 + row, row++) b.line(0, y, W, y, dark ? "#2A2A2E" : "#9A9AA0", 0.6);
    for (let k = -6; k <= 6; k++) b.line(45 + k * 5, 106, 45 + k * 16, H, dark ? "#2A2A2E" : "#9A9AA0", 0.5);
    for (const [x0, y0, x1, y1] of [[8, 112, 20, 122], [20, 122, 18, 130], [64, 110, 74, 118], [74, 118, 84, 120]] as const) b.line(x0, y0, x1, y1, "#3A3A40");
    b.ell(24, 112, 7, 2.5, tone[1]); b.ell(18, 112, 2, 2.5, tone[0]); b.rect(62, 108, 8, 4, tone[1]); b.rect(62, 108, 8, 1, tone[0]);
    lion(L, 13, 112, 1, dark); lion(L, 77, 112, -1, dark);

    if (!dark) {
      for (const [x, y, ph] of [[20, 44, 0], [68, 38, 2]] as const) {
        const up = (f + ph) % 2;
        s.ell(x, y, 2.5, 1.2, "#FFFFFF"); s.px(x + 3, y - 1, "#FFFFFF"); s.px(x + 4, y - 1, "#9A9A9A");
        s.line(x - 1, y, x - 4, y - 3 + up * 4, "#F0F0F0"); s.line(x + 1, y, x + 3, y - 4 + up * 4, "#F0F0F0");
      }
    }

    const cx = 45, T = 38, B = 128;
    human(L, {
      cx, T, B, detail: true, skin: "#D2D2D2", robe: "#F4F4F4", trim: "#9A9A9E", pattern: "dots", patternCol: "#FFFFFF",
      hairLong: true, hairLen: 42, hair: dark ? "#141414" : "#2A2A2A", brow: "#1A1A1A", eye: "#101010", lips: "#6E6E72",
      eyeGlow: dark ? "#FFFFFF" : undefined, necklace: "#FFFFFF", earrings: "#FFFFFF", bracelets: "#8A8A8E", armL: "chest", armR: "chest",
      back: (L, { cx, T, B }) => {
        // Véu nupcial translúcido na camada de brilho (sem contorno), caindo à esquerda.
        const w = SW[L.f] * 2, gb = L.gb;
        if (!dark) {
          gb.poly([[cx - 3, T + 1], [cx - 9, T + 8], [cx - 27 + w, B], [cx - 6, B]], "#FFFFFF", 0.2);
          gb.poly([[cx - 4, T + 2], [cx - 8, T + 10], [cx - 20 + w, B], [cx - 8, B]], "#FFFFFF", 0.28);
          for (let y = T + 20; y < B; y += 5) gb.px(cx - 11 - (y - T) * 0.13 + w, y, "#FFFFFF", 0.7);
          gb.line(cx - 9, T + 8, cx - 27 + w, B, "#FFFFFF", 0.5);
        } else {
          const rag: Pt[] = [[cx - 4, T + 2], [cx - 9, T + 10]];
          for (let i = 0; i <= 8; i++) rag.push([cx - 21 + i * 1.6 + w, B - 16 + (i % 2 ? 9 : 0)]);
          rag.push([cx - 7, B - 12]);
          gb.poly(rag, "#B8B8BC", 0.22);
        }
      },
      front: (L, { cx, T, B }) => {
        const s = L.s, gf = L.gf, hy = T + 7, sw = SW[L.f];
        // Metade direita: armadura de espinhos.
        const edge = (y: number) => (y < T + 33 ? cx + 9 - (y - T - 15) * 0.1 : cx + 7 + ((y - T - 33) / (B - T - 33)) * (6 + sw));
        const plate = dark ? "#2E2E34" : "#44444C", hiP = dark ? "#3E3E46" : "#5A5A64", loP = "#26262C";
        const wav = (y: number) => edge(y) + ((y >> 2) % 2);
        const body: Pt[] = [[cx + 1, T + 15], [cx + 9, T + 15]];
        for (let y = T + 18; y <= B; y += 4) body.push([wav(y), y]);
        body.push([cx + 1, B]);
        s.poly(body, plate);
        for (let y = T + 21; y < B - 2; y += 8) {
          const x1 = edge(y);
          for (let x = cx + 2; x < x1; x++) { const cy = y + Math.round(Math.sin(((x - cx) / (x1 - cx)) * Math.PI) * 1.5); s.px(x, cy, hiP); s.px(x, cy + 1, loP); }
        }
        s.line(cx + 1, T + 15, cx + 1, B, dark ? "#5A5A64" : "#7A7A86");
        for (let y = T + 22, i = 0; y < B - 4; y += dark ? 9 : 13, i++) {
          const x = edge(y) + 1, len = (dark ? 6 : 4) + (i % 2);
          s.poly([[x, y - 2], [x + len, y - 2 - (i % 2 ? 2 : 1)], [x, y + 1]], "#1A1A1E"); s.px(x + len - 1, y - 2 - (i % 2 ? 2 : 1), "#B8B8C0");
        }
        s.ell(cx + 10, T + 16, 5, 3, plate); s.line(cx + 6, T + 14, cx + 14, T + 14, "#6A6A74");
        for (const [dx, h] of [[7, 5], [10, 7], [13, 5]] as const) s.poly([[cx + dx - 1, T + 14], [cx + dx + 1, T + 14], [cx + dx + 1, T + 14 - h]], "#1E1E22");
        const sx = cx + 9, sy = T + 17, hx = cx + 4, hyy = T + 27, exx = (sx + hx) / 2 + 2, eyy = (sy + hyy) / 2 + 2;
        s.line(sx, sy, exx, eyy, plate, 1, 3); s.line(exx, eyy, hx, hyy, plate, 1, 3); s.px(exx + 2, eyy - 1, "#1E1E22");
        if (dark) for (const [x0, y0, x1, y1] of [[cx + 1, T + 20, cx - 6, T + 17], [cx + 1, T + 31, cx - 5, T + 36], [cx - 5, T + 36, cx - 8, T + 46]] as const) {
          s.line(x0, y0, x1, y1, "#1E1E22", 1, 2); s.px((x0 + x1) / 2, (y0 + y1) / 2 - 2, "#1E1E22");
        }
        // Cabeça: véu nupcial à esquerda, tiara de espinhos à direita, estrela de Ishtar na fronte.
        gf.poly([[cx, hy - 8], [cx - 7, hy - 7], [cx - 10, hy + 2], [cx - 11, T + 24], [cx - 5, T + 17], [cx - 1, hy - 3]], "#FFFFFF", dark ? 0.18 : 0.4);
        gf.line(cx - 7, hy - 7, cx - 11, T + 24, "#FFFFFF", dark ? 0.3 : 0.7);
        for (let k = 0; k < 4; k++) s.poly([[cx + 1 + k * 2, hy - 6], [cx + 2 + k * 2, hy - 11 - (k % 2) * 2], [cx + 3 + k * 2, hy - 6]], "#1E1E22");
        s.line(cx - 6, hy - 5, cx + 7, hy - 5, "#8A8A8E");
        const st = dark ? "#8A8A8E" : "#FFFFFF";
        s.px(cx - 1, hy - 7, st); s.px(cx - 1, hy - 9, st); s.px(cx - 1, hy - 5, st); s.px(cx - 3, hy - 7, st); s.px(cx + 1, hy - 7, st);
        s.px(cx - 2, hy - 8, st); s.px(cx, hy - 8, st); s.px(cx - 2, hy - 6, st); s.px(cx, hy - 6, st);
        if (!dark) gf.blob(cx - 1, hy - 7, 4, 4, "#FFFFFF", 1, 0.35 + pulse(L.f) * 0.1);
        heart(L, cx, T + 25, dark);
        for (const [x, c] of [[cx - 5, "#D2D2D2"], [cx + 5, plate]] as const) { s.px(x, T + 24, c); s.px(x, T + 26, c); s.px(x, T + 28, c); }
      },
    });

    petals(L, dark ? 22 : 14, dark ? 7 : 4, dark ? ["#8A0030", "#4A0018"] : [HEART, HEART_D]);
    const vineL: Pt[] = dark ? [[0, 140], [6, 124], [3, 110], [10, 98], [8, 86]] : [[0, 140], [8, 128], [5, 118], [14, 112]];
    const vineR: Pt[] = dark ? [[90, 140], [84, 124], [88, 112], [80, 100], [84, 90]] : [[90, 140], [82, 128], [86, 120], [78, 114]];
    roseVine(L, vineL, dark ? [[6, 124], [9, 100], [4, 112]] : [[8, 128], [14, 112], [4, 120]], dark);
    roseVine(L, vineR, dark ? [[84, 124], [80, 102]] : [[82, 128], [78, 114]], dark);
    for (let x = 18; x < 74; x += 7) fg.line(x, 138, x + 3, 134 - ((x * 3) % 4), "#0C0C0E", 1, 2);
    fg.rect(0, 136, W, 4, "#0C0C0E");
  },

  /**
   * Prometeu/Lúcifer: titã de mármore fendido sobe os últimos degraus da pirâmide de obsidiana,
   * de costas e rosto de perfil, com a coroa de chamas douradas trançada em espinhos de ferro.
   * Luz: veios de luz branca e o fogo roubado na mão erguida. Escuridão: veios de magma,
   * lascas se soltando, raios na tempestade e tronos partidos.
   */
  "A Ambição": L => {
    const { b, gb, s, gf, fg, f } = L, p = pulse(f), dark = L.pol === "escuridao";
    const vein = dark ? "#FF6A1A" : "#FFF3B0", core = dark ? "#FFD27A" : "#FFFFFF", glow = dark ? "#FF4A10" : GOLD;
    const crownPal: FlamePalette = dark ? ["#FFE070", "#FF9A1A", "#C0300A"] : ["#FFFFFF", GOLD, "#E09A00"];

    b.grad(0, 0, W, 104, dark ? "#030304" : "#1A1A20", dark ? "#26262C" : "#8C8C98", 7);
    const sr = rng(31);
    for (let i = 0; i < 22; i++) { const x = (sr() * W) | 0, y = (sr() * 60) | 0; b.px(x, y, "#FFFFFF", (i + f) % 4 ? 0.35 : 0.9); }
    rays(gb, 45, 14, 18, 60, dark ? "#FF7A2A" : GOLD, dark ? 0.1 : 0.2, f * 0.04);
    gb.blob(45, 14, 26, 22, glow, 1, (dark ? 0.12 : 0.24) + p * 0.05);

    // Pirâmide de obsidiana: faces, aresta central, reflexos neon.
    b.poly([[45, 12], [112, 106], [-22, 106]], "#08080B");
    b.poly([[45, 12], [112, 106], [45, 106]], "#14141A");
    b.line(45, 12, 112, 106, "#5E5E6E"); b.line(45, 12, -22, 106, "#24242C"); b.line(45, 12, 45, 106, "#2A2A34");
    for (let k = 0; k < 6; k++) { const t = (k + 1) / 7, x = 45 + 67 * t, y = 12 + 94 * t; if ((k + f) % 3 === 0) { b.px(x - 1, y, "#FFFFFF"); gb.px(x - 1, y, "#FFFFFF", 0.6); } }
    for (const [x0, y0, x1, y1] of [[58, 40, 70, 60], [28, 50, 20, 70], [62, 70, 80, 84]] as const) b.line(x0, y0, x1, y1, "#1E1E26");

    // Mar de nuvens cinzentas ao redor da base.
    const cl = dark ? (["#2A2A30", "#3C3C44"] as const) : (["#9A9AA6", "#D0D0DA"] as const);
    for (let i = 0; i < 12; i++) { const x = (i * 9 + (i % 2) * 4 + f) % 104 - 7, y = 96 + (i % 3) * 3; b.blob(x, y, 10, 5, cl[0], 1.1); b.blob(x - 1, y - 2, 7, 3, cl[1], 1.1, 0.8); }
    if (dark && f % 2) { bolt(b, rng(40 + f), 12 + f * 9, 84, 104, "#D8D8E8"); gb.blob(14 + f * 9, 96, 12, 8, "#C8C8E0", 1, 0.2); }

    // Escadaria colossal: degraus largos embaixo, afinando até o ápice.
    b.grad(0, 104, W, H - 104, "#1A1A20", "#08080A", 3);
    const rises = [9, 9, 9, 8, 7, 6, 5, 5, 4, 4, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2];
    const steps: [number, number][] = [];
    let y = 124, hw = 62;
    for (const rise of rises) { steps.push([y, hw]); y -= rise; hw = Math.max(2, hw * 0.84); if (y < 14) break; }
    for (let i = steps.length - 1; i >= 0; i--) {
      const [ty, w] = steps[i]!, rise = rises[i]!;
      b.rect(45 - w, ty, w * 2, rise, i % 2 ? "#1C1C22" : "#222229");
      b.rect(45 - w, ty, w * 2, 1, dark ? "#4A4A54" : "#7A7A88");
      b.rect(45 + w * 0.3, ty + 1, w * 0.7, rise - 1, "#2C2C34", 0.6);
    }

    // Titã de costas.
    const cx = 45, T = 39, marble = dark ? "#34343A" : "#3E3E46", lt = dark ? "#4A4A52" : "#5E5E68", dk = "#232328";
    const P = (pts: Pt[], c: Color) => s.poly(pts.map(([x, y]) => [cx + x, T + y] as Pt), c);
    const Ln = (x0: number, y0: number, x1: number, y1: number, c: Color, t = 1) => s.line(cx + x0, T + y0, cx + x1, T + y1, c, 1, t);
    Ln(-15, 20, -19, 33, dk, 5); Ln(-19, 33, -18, 45, dk, 4); s.circ(cx - 18, T + 46, 2.2, dk);
    Ln(-5, 50, -7, 63, marble, 6); Ln(-7, 63, -7, 75, marble, 5); Ln(-8, 64, -8, 73, lt); s.rect(cx - 10, T + 75, 6, 2, dk);
    Ln(5, 50, 8, 58, marble, 6); Ln(8, 58, 8, 66, marble, 5); Ln(9, 59, 10, 64, lt); s.rect(cx + 6, T + 66, 5, 2, dk);
    P([[-9, 43], [9, 43], [10, 52], [4, 56], [-3, 54], [-10, 52]], "#18181C");
    Ln(-2, 52, -3 + SW[f], 62, "#18181C", 2); Ln(-6, 46, 6, 46, "#2E2E36");
    P([[-4, 12], [4, 12], [15, 17], [15, 22], [10, 34], [8, 44], [-8, 44], [-10, 34], [-15, 22], [-15, 17]], marble);
    P([[-4, 12], [-15, 17], [-15, 22], [-10, 34], [-8, 44], [-3, 44], [-4, 30]], dk);
    P([[4, 12], [13, 17], [10, 22], [5, 18]], lt);
    Ln(0, 16, 0, 43, "#1C1C22"); Ln(1, 17, 1, 42, lt);
    Ln(-3, 20, -9, 22, "#1C1C22"); Ln(-9, 22, -8, 29, "#1C1C22"); Ln(3, 20, 9, 22, "#1C1C22"); Ln(9, 22, 8, 29, "#1C1C22");
    Ln(8, 30, 6, 38, "#1C1C22"); Ln(-8, 30, -6, 38, "#1C1C22");
    s.circ(cx - 14, T + 19, 4, dk); s.circ(cx + 14, T + 19, 4, marble); s.px(cx + 15, T + 17, lt); s.px(cx + 14, T + 16, lt);
    Ln(15, 19, 21, 8, marble, 5); Ln(21, 8, 22, -4, marble, 4); Ln(22, 9, 23, 0, lt);
    for (const dx of [-2, 0, 2]) Ln(22 + dx * 0.5, -5, 22 + dx, -9, marble);
    s.rect(cx - 4, T + 10, 8, 5, marble);
    s.circ(cx, T + 6, 7, marble); s.circ(cx - 2, T + 6, 6, dk); s.ell(cx - 3, T + 3, 3, 2, "#1C1C22");
    // Perfil voltado ao ápice: testa, sobrancelha, nariz, boca, queixo e orelha.
    s.px(cx + 7, T + 2, marble); s.px(cx + 7, T + 3, marble); s.px(cx + 8, T + 4, lt); s.px(cx + 8, T + 5, marble); s.px(cx + 9, T + 6, marble);
    s.px(cx + 9, T + 7, marble); s.px(cx + 8, T + 8, dk); s.px(cx + 8, T + 9, marble); s.px(cx + 7, T + 10, marble); s.px(cx + 6, T + 11, marble); s.px(cx + 5, T + 12, marble);
    s.line(cx + 5, T + 4, cx + 8, T + 4, lt);
    s.ell(cx + 1, T + 7, 1.5, 2, "#1C1C22"); s.px(cx + 1, T + 7, lt);
    s.px(cx + 6, T + 5, core); gf.px(cx + 6, T + 5, vein, 0.8); gf.px(cx + 7, T + 5, vein, 0.4);
    const cracks: Pt[][] = [
      [[-6, 16], [-4, 22], [-7, 27], [-5, 34]], [[3, 18], [6, 24], [4, 30], [8, 38]], [[-1, 33], [2, 38], [0, 43]],
      [[-16, 22], [-18, 29]], [[17, 15], [19, 10], [21, 3]], [[-6, 55], [-7, 62], [-6, 70]], [[-2, 2], [-4, 6]],
    ];
    if (dark) cracks.push([[10, 20], [13, 26], [11, 31]], [[-12, 26], [-9, 31]], [[7, 55], [8, 62]], [[-3, 8], [2, 12], [-1, 14]]);
    for (const path of cracks) for (let i = 0; i < path.length - 1; i++) {
      const [x0, y0] = path[i]!, [x1, y1] = path[i + 1]!;
      Ln(x0, y0, x1, y1, vein); gf.line(cx + x0, T + y0, cx + x1, T + y1, glow, 0.35 + p * 0.1, 2);
      if (i === 0) gf.px(cx + x0, T + y0, core);
    }
    if (dark) {
      for (const [x, y2] of [[-11, 30], [7, 26]] as const) { s.circ(cx + x, T + y2, 1.5, "#0A0A0C"); s.ring(cx + x, T + y2, 2, vein, 1, 1); }
      for (let q = 0; q < 6; q++) { const yy = T + 30 + ((q * 11 + f * 6) % 70); gf.rect(cx - 16 + ((q * 13) % 34), yy, 2, 1, "#4A4A52"); }
    } else {
      flame(s, cx + 22, T - 9, 8, f, ["#FFFFFF", GOLD, "#E09A00"]);
      gf.blob(cx + 22, T - 14, 8, 8, GOLD, 1, 0.3 + p * 0.1);
    }

    // Coroa de chamas douradas trançada com espinhos de ferro.
    for (let k = 0; k < 7; k++) { const x = cx - 7 + k * 2.3, arc = Math.abs(k - 3) * 0.7; flame(s, Math.round(x), Math.round(T - 1 + arc), 5 + ((k + f) % 3) * 2, f, crownPal); }
    s.line(cx - 7, T, cx + 7, T, "#1E1E22", 1, 2);
    for (let k = 0; k < 6; k++) { const x = cx - 6 + k * 2.5; s.line(x, T, x + (k % 2 ? 2 : -2), T - 5 - (k % 3), "#2A2A30"); s.px(x + (k % 2 ? 2 : -2), T - 6 - (k % 3), "#5A5A64"); }
    gf.blob(cx, T - 7, 13, 8, glow, 1, 0.3 + p * 0.14);
    gb.blob(cx + 2, T + 6, 13, 12, dark ? "#FF6A2A" : "#FFE9A0", 1, 0.3 + p * 0.06);
    for (let k = 0; k < 12; k++) {
      const x = cx + ((k * 13) % 23) - 11 + SW[(k + f) % 4]!, yy = T - 6 - ((k * 7 + f * 5) % 32);
      gf.px(x, yy, k % 3 ? (dark ? "#FF9A3A" : "#FFE070") : core); if (k % 2) gf.px(x, yy + 1, glow, 0.5);
    }

    // Primeiro plano: tronos vazios e cetros oxidados nos degraus de baixo.
    const throne = (x: number, broken: boolean) => {
      const c = "#1E1E24", h = dark ? "#4A4A56" : "#6A6A78";
      fg.rect(x, 112, 3, 22, c); fg.rect(x + 11, broken ? 122 : 112, 3, broken ? 12 : 22, c);
      fg.rect(x, 124, 14, 3, c); fg.rect(x + 1, 127, 2, 7, c); fg.rect(x + 11, 127, 2, 7, c);
      fg.poly([[x - 1, 112], [x + 1, 108], [x + 3, 112]], c); if (!broken) fg.poly([[x + 10, 112], [x + 12, 108], [x + 14, 112]], c);
      fg.line(x, 112, x, 133, h); fg.line(x, 124, x + 13, 124, h); fg.line(x - 1, 112, x + 3, 112, h);
      if (!broken) fg.line(x + 10, 112, x + 14, 112, h);
      fg.rect(x + 3, 118, 8, 6, "#2A2A32"); fg.rect(x + 3, 118, 8, 1, h);
      if (broken) fg.poly([[x + 14, 121], [x + 18, 131], [x + 15, 132]], c);
    };
    throne(2, dark); throne(74, dark);
    for (const [x0, y0, x1, y1] of [[18, 133, 32, 128], [58, 130, 70, 134]] as const) {
      fg.line(x0, y0, x1, y1, "#6A5A3A", 1, 2); fg.line(x0, y0 - 1, x1, y1 - 1, "#8A7A4A");
      fg.circ(x1, y1 - 1, 2, "#4A5A40"); fg.px(x1, y1 - 2, "#7A8A5A");
    }
    fg.rect(0, 135, W, 3, "#0A0A0C");
  },
};
