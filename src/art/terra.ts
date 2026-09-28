import { Buf, H, SW, W, pulse, type Color } from "../engine/buf";
import { bird } from "../engine/creatures";
import { human } from "../engine/figure";
import type { ArtFn, Layers } from "../engine/layers";
import { grass, mountains, rays, rocks, sun } from "../engine/primitives";

/** Oliveira centenária: tronco retorcido e copa verde-prata. */
function olive(b: Buf, x: number, y: number, h: number): void {
  b.line(x, y, x - 2, y - h * 0.5, "#4a3a2a", 1, 4); b.line(x - 2, y - h * 0.5, x + 3, y - h, "#4a3a2a", 1, 3);
  b.line(x - 1, y - h * 0.5, x - 8, y - h * 0.8, "#4a3a2a", 1, 2); b.line(x - 3, y - 4, x - 1, y - h * 0.4, "#6a5a3a");
  for (let k = 0; k < 7; k++) { const cx = x - 10 + ((k * 7) % 22), cy = y - h - 4 + ((k * 5) % 12); b.circ(cx, cy, 5, k % 2 ? "#5a6a3a" : "#6a7a4a"); b.px(cx - 2, cy - 2, "#A8B888"); }
}

/** Trigal ondulando: talos com espigas, balanço por quadro. */
function wheat(L: Layers, y0: number, y1: number, c: Color, hi: Color): void {
  const { b, f } = L;
  b.grad(0, y0, W, y1 - y0, hi, c, 4);
  for (let y = y0 + 2, row = 0; y < y1; y += 3, row++) for (let x = (row * 3) % 5; x < W; x += 5) {
    const sw = SW[(x + row + f) % 4]!;
    b.line(x, y + 3, x + sw, y, "#B8862B"); b.px(x + sw, y - 1, hi); b.px(x + sw, y, c);
  }
}

export const TERRA_ART: Record<string, ArtFn> = {
  /** Pachamama: mãos de argila e pedra acolhem o broto de milho dourado que verte seiva; socalcos andinos e cordilheira nevada. */
  "A Semente": L => {
    const { b, gb, s, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 80, "#6AB0E0", "#F4ECD0", 6);
    sun(b, 70, 22, 7, "#FFFBE8", "#FFE8A0", "#FFD08a"); rays(gb, 70, 22, 16, 36, "#FFF3C0", 0.3, f * 0.04);
    mountains(b, r, 80, 14, 40, "#7A8AA8", "#FFFFFF", 9); mountains(b, r, 86, 6, 18, "#5A7A6A", null, 7);
    for (let k = 0; k < 7; k++) {
      const y = 84 + k * 7, bend = (x: number) => Math.round(Math.sin((x / W) * Math.PI) * (3 - k * 0.3));
      for (let x = 0; x < W; x++) { const yy = y - bend(x); b.rect(x, yy, 1, 7, k % 2 ? "#4A7A3A" : "#6A9A4A"); b.px(x, yy, "#8a8070"); if (x % 4 === 0) b.px(x, yy + 1, "#6a6050"); }
      for (let x = (k * 5) % 7; x < W; x += 7) b.px(x, y + 3 - bend(x), "#8ACF6A");
    }
    b.grad(0, 132, W, H - 132, "#3a2a1a", "#1a120a", 2);
    const bx = 18 + ((f * 7) % 50); b.line(bx - 4, 36, bx, 38, "#1a1a1a"); b.line(bx, 38, bx + 4, 36, "#1a1a1a");

    // Mãos de argila e pedra em concha, formando uma tigela com a terra fértil.
    const cl = "#A86A3A", lt = "#C88A5A", dk = "#6a4020", st = "#8a7a6a";
    s.poly([[20, 104], [70, 104], [67, 116], [58, 125], [32, 125], [23, 116]], cl);
    s.poly([[20, 104], [26, 104], [30, 118], [34, 125], [32, 125], [23, 116]], lt);
    s.line(45, 106, 45, 125, dk); s.line(24, 116, 32, 124, dk); s.line(66, 116, 58, 124, dk);
    for (const [x, y, rr] of [[23, 102, 3.2], [67, 102, 3.2]] as const) { s.circ(x, y, rr, cl); s.px(x - 1, y - 2, lt); }
    for (let k = 0; k < 8; k++) { const x = 29 + k * 4.6 + (k > 3 ? 1 : 0), y = 103 - (k === 3 || k === 4 ? 0 : 1); s.circ(x, y, 2.2, cl); s.px(x - 1, y - 1, lt); s.px(x, y + 2, dk); }
    for (const [x0, x1] of [[31, 26], [59, 64]] as const) { s.line(x0, 124, x1, 136, cl, 1, 6); s.line(x0 - 2, 124, x1 - 2, 136, lt); }
    s.ell(45, 105, 18, 2.5, "#3a2410"); s.ell(45, 104, 14, 1.5, "#5a3a1a");
    for (const [x, y] of [[30, 114], [38, 120], [54, 118], [61, 112]] as const) { s.rect(x, y, 3, 2, st); s.px(x, y, "#aa9a8a"); }
    // Broto de milho dourado com seiva luminosa.
    s.line(45, 116, 45, 76, "#6ABA3A", 1, 2);
    for (const [y, sg, len] of [[108, -1, 12], [100, 1, 13], [92, -1, 11], [86, 1, 9]] as const) { s.line(45, y, 45 + sg * len, y - 7, "#6ABA3A", 1, 2); s.px(45 + sg * len, y - 8, "#9AE06A"); }
    s.ell(46, 72, 3, 7, "#FFD34E"); for (let y = 67; y < 78; y += 2) { s.px(45, y, "#F0B020"); s.px(47, y + 1, "#FFF3B0"); }
    s.line(47, 64, 50, 58, "#DDA15E"); s.line(45, 65, 44, 58, "#DDA15E");
    gf.blob(46, 72, 10, 12, "#FFE066", 1, 0.3 + p * 0.1);
    for (let k = 0; k < 4; k++) { const y = 80 + ((k * 9 + f * 4) % 34); gf.px(45 + (k % 2), y, "#FFE066"); gf.px(45 + (k % 2), y + 1, "#FFD34E", 0.6); }
    gb.blob(45, 118, 24, 8, "#FFE066", 1, 0.2);
    fg.rect(0, 134, W, 4, "#1a120a"); grass(fg, r, 134, 16, "#0e1a0a");
  },

  /** Geb, o gigante adormecido de perfil: suas costas são colinas onde operários erguem pilares com cordas e prumos. */
  "O Alicerce": L => {
    const { b, gb, s, gf, fg, f } = L, p = pulse(f);
    b.grad(0, 0, W, 96, "#E8C890", "#F8ECD0", 6);
    sun(b, 20, 24, 8, "#FFFBE8", "#FFE8A0", "#FFD08a");
    b.poly([[48, 70], [60, 40], [72, 70]], "#D8B880"); b.poly([[60, 40], [72, 70], [66, 70]], "#C8A870");
    b.rect(8, 56, 26, 30, "#D0B078"); b.rect(12, 50, 18, 6, "#D0B078"); b.rect(18, 68, 6, 18, "#8a6a40");
    for (let y = 58; y < 86; y += 4) b.line(8, y, 33, y, "#B89860");
    b.grad(0, 86, W, H - 86, "#C8A870", "#8a6a40", 4);
    // Geb deitado: cabeça à esquerda, ombro, costas e quadril formando colinas.
    const skin = "#4A7A3A", hi = "#6A9A4A", dk = "#2A4A2A";
    s.poly([[4, 118], [8, 106], [18, 100], [30, 98], [40, 92], [50, 90], [60, 94], [70, 92], [80, 96], [88, 104], [90, 118]], skin);
    s.poly([[18, 100], [30, 98], [40, 92], [50, 90], [60, 94], [70, 92], [80, 96], [80, 98], [60, 97], [40, 95], [20, 102]], hi);
    // Cabeça de perfil (voltada à esquerda), olho fechado, barba cerimonial trançada; braço repousando à frente.
    s.circ(14, 104, 10, skin); s.circ(16, 101, 8, hi);
    s.poly([[5, 100], [2, 104], [4, 106], [5, 109]], skin); s.px(2, 104, dk);
    s.line(6, 101, 10, 101, dk); s.px(7, 102, dk); s.line(5, 110, 8, 110, dk);
    s.poly([[7, 112], [11, 112], [10, 120], [7, 121]], "#1a2a1a"); for (let y = 113; y < 120; y += 2) s.line(7, y, 10, y, "#3a4a3a");
    s.line(18, 102, 19, 106, dk); s.line(23, 96, 26, 110, dk);
    // O ganso sagrado de Geb pousado sobre a cabeça.
    s.ell(14, 91, 5, 2.5, "#F4F0E8"); s.line(10, 90, 8, 85, "#F4F0E8", 1, 2); s.circ(8, 84, 1.5, "#F4F0E8"); s.px(6, 84, "#E0A020"); s.px(8, 84, "#1a1a1a"); s.line(16, 90, 19, 89, "#C8C0B0");
    s.poly([[8, 95], [22, 93], [26, 99], [22, 98], [10, 99]], "#1a2a1a");
    s.line(20, 114, 40, 118, skin, 1, 4); s.line(20, 113, 40, 117, hi); s.rect(40, 116, 6, 4, skin); for (let k = 0; k < 3; k++) s.px(46, 116 + k, dk);
    for (let k = 0; k < 6; k++) s.line(10 + k * 12, 108 + (k % 2), 16 + k * 12, 112, dk);
    for (const x of [24, 46, 64]) s.line(x, 104, x + 6, 116, dk);
    // Blocos de arenito, pilares e operários com cordas e prumos.
    for (const [x, y, h] of [[30, 98, 16], [52, 90, 22], [72, 92, 12]] as const) {
      s.rect(x - 2, y - h, 5, h, "#E0C088"); s.rect(x - 2, y - h, 1, h, "#F0D8A8"); s.rect(x - 3, y - h - 2, 7, 2, "#C8A870");
      for (let yy = y - h + 4; yy < y; yy += 5) s.line(x - 2, yy, x + 2, yy, "#B89860");
    }
    s.line(52, 66, 38, 88, "#8a6a40"); s.line(52, 66, 62, 90, "#8a6a40"); s.line(52, 66, 52, 74 + SW[f], "#6a4a2a"); s.rect(51, 74 + SW[f], 3, 3, "#5a5a5a");
    const worker = (x: number, y: number, pull: number) => {
      s.rect(x - 1, y - 6, 3, 4, "#F0E6D0"); s.circ(x, y - 8, 1.5, "#8a5a3a"); s.line(x - 1, y - 2, x - 2 - pull, y, "#8a5a3a"); s.line(x + 1, y - 2, x + 2, y, "#8a5a3a");
      s.line(x + 1, y - 5, x + 5, y - 7 - pull, "#8a5a3a");
    };
    worker(40, 94, f % 2); worker(64, 94, (f + 1) % 2); worker(80, 96, 0);
    gb.blob(52, 80, 30, 20, "#FFE8A0", 1, 0.15 + p * 0.04);
    for (let k = 0; k < 4; k++) gf.px(30 + k * 12, 84 - ((k * 5 + f * 3) % 12), "#E8D8B0", 0.7);
    for (let i = 0; i < 6; i++) { const x = 6 + i * 15; fg.rect(x, 126 + (i % 2) * 2, 10, 6, "#A88858"); fg.rect(x, 126 + (i % 2) * 2, 10, 1, "#D0B078"); }
    fg.rect(0, 134, W, 4, "#6a4a20");
  },

  /** São Francisco no olival ao entardecer: hábito com cordão de três nós, estigmas, pão partilhado, aves nos braços e o lobo manso. */
  "A Providência": L => {
    const { b, gb, s, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 112, "#3A2A20", "#E8A860", 6);
    rays(gb, 45, 20, 14, 110, "#FFE0A0", 0.25, f * 0.03);
    olive(b, 10, 112, 60); olive(b, 82, 112, 56); olive(b, 66, 104, 40);
    for (let i = 0; i < 16; i++) gb.px((r() * W) | 0, (r() * 100) | 0, "#FFE0A0", (i + f) % 3 ? 0.3 : 0.8);
    b.grad(0, 112, W, H - 112, "#5a4a2a", "#2a2010", 3);
    grass(b, r, 118, 24, "#4a5a2a");

    human(L, {
      T: 42, B: 128, detail: true, skin: "#E0B890", robe: "#6A4A2A", trim: "#4a3018", pattern: "dots", patternCol: "#5a3a20",
      head: "bald", hair: "#5a3a20", beard: "#5a3a20", smile: true, armL: "open", armR: "open",
      back: (L, { cx, T }) => { L.s.ell(cx, T + 16, 9, 4, "#5A3A20"); },
      front: (L, { cx, T }, h) => {
        const s = L.s, hy = T + 7;
        for (let i = -5; i <= 5; i++) if (Math.abs(i) > 2) s.px(cx + i, hy - 4 + Math.round(Math.abs(i) / 3), "#5a3a20");
        s.line(cx - 7, T + 33, cx + 7, T + 33, "#E8DCC0"); s.line(cx - 1, T + 33, cx - 2, T + 52, "#E8DCC0");
        for (const y of [T + 40, T + 45, T + 50]) s.rect(cx - 3, y, 3, 2, "#E8DCC0");
        for (const [x, y] of [h.L, h.R]) { s.px(x, y, "#FFFFFF"); L.gf.px(x, y, "#FFE8A0"); L.gf.blob(x, y, 3, 3, "#FFE8A0", 1, 0.4 + pulse(L.f) * 0.1); }
        s.ell(h.R[0] + 3, h.R[1] + 2, 3, 2, "#D8A060"); s.px(h.R[0] + 2, h.R[1] + 1, "#F0C080");
      },
    });
    for (const [x, y, c] of [[26, 66, "#8a7a6a"], [21, 62, "#EDE0C8"], [66, 64, "#6a5a4a"]] as const) bird(s, x, y, c, f);
    bird(s, 30, 54 + SW[f], "#EDE0C8", ((f + 1) % 4) as 0 | 1 | 2 | 3);
    // Camponeses recebendo o pão.
    for (const [x, sg, hgt] of [[8, 1, 22], [80, -1, 18]] as const) {
      s.rect(x - 3, 128 - hgt, 7, hgt - 6, sg > 0 ? "#6a6a4a" : "#7a5a4a"); s.circ(x, 128 - hgt - 2, 3, "#C8966A"); s.px(x, 128 - hgt - 5, "#3a2a1a");
      s.line(x - 2, 128 - 6, x - 3, 128, "#4a3a2a"); s.line(x + 2, 128 - 6, x + 3, 128, "#4a3a2a"); s.line(x + sg * 3, 128 - hgt + 6, x + sg * 9, 128 - hgt + 4, "#C8966A");
    }
    // Lobo cinzento deitado aos pés e cestas de frutos.
    const wx = 60, wy = 128, c = "#7a7a82";
    s.ell(wx, wy - 3, 11, 3.5, c); s.ell(wx, wy - 2, 9, 2, "#9a9aa2"); s.circ(wx - 11, wy - 5, 3.5, c);
    s.poly([[wx - 13, wy - 7], [wx - 12, wy - 11], [wx - 10, wy - 7]], c); s.poly([[wx - 10, wy - 8], [wx - 8, wy - 11], [wx - 8, wy - 7]], c);
    s.rect(wx - 17, wy - 5, 4, 2, c); s.px(wx - 17, wy - 5, "#1a1a1a"); s.line(wx - 12, wy - 6, wx - 11, wy - 6, "#1a1a1a");
    s.line(wx + 11, wy - 3, wx + 17, wy - 1, c, 1, 2);
    for (const [x, fr] of [[26, "#C8302A"], [34, "#6A9A3A"]] as const) {
      s.poly([[x - 5, 124], [x + 5, 124], [x + 4, 130], [x - 4, 130]], "#8a6a3a"); for (let k = -4; k <= 4; k += 2) s.line(x + k, 124, x + k, 130, "#6a4a2a");
      for (let k = -3; k <= 3; k += 2) s.circ(x + k, 123, 1.5, fr); s.px(x, 121, "#FFE0A0");
    }
    gf.blob(45, 60, 20, 26, "#FFE0A0", 1, 0.08 + p * 0.03);
    fg.rect(0, 134, W, 4, "#1a140a"); grass(fg, r, 134, 18, "#1a140a");
  },

  /** Ogum de capacete de ferro forja enxadas e facões com foco total; oficina rústica junto à mata fechada, minério e ferramentas. */
  "O Ofício": L => {
    const { b, gb, s, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, H, "#0a1a10", "#1e3a2a", 6);
    for (let i = 0; i < 12; i++) { const x = (i * 9 + 3) % W; b.line(x, 0, x + ((i % 3) - 1) * 2, 100, "#0e2014", 1, 3); b.circ(x, 10 + (i % 4) * 8, 8, i % 2 ? "#12301e" : "#163a24"); }
    // Oficina: telhado de palha, pilares, prateleiras de ferramentas.
    b.poly([[0, 20], [90, 20], [84, 30], [6, 30]], "#6a5a3a"); for (let x = 2; x < 88; x += 3) b.line(x, 21, x - 1, 29, "#8a7a4a");
    for (const x of [6, 82]) b.rect(x, 30, 4, 90, "#3a2a1a");
    for (const y of [50, 66]) {
      b.rect(10, y, 22, 2, "#5a3a20");
      for (let k = 0; k < 5; k++) { const x = 12 + k * 4; b.line(x, y - 1, x, y - 9, "#6a4a2a"); if (k % 2) b.rect(x - 1, y - 11, 3, 3, "#A8B0B8"); else b.poly([[x, y - 9], [x + 3, y - 12], [x + 1, y - 8]], "#C8D0D8"); }
    }
    b.grad(0, 112, W, H - 112, "#2a2418", "#141008", 3);
    for (const [x, y] of [[14, 118], [22, 120], [18, 114]] as const) { b.circ(x, y, 4, "#4a3a3a"); b.px(x - 1, y - 1, "#8a6a5a"); b.px(x + 1, y, "#A87A5A"); }

    human(L, {
      cx: 38, T: 42, B: 128, tunic: true, detail: true, profile: 1, skin: "#3B2418", legs: "#3B2418", robe: "#1E3A5A", trim: "#6ADA7A",
      bare: true, bareArms: true, head: "helmet", helm: "#6A7078", bracelets: "#8A949E", necklace: "#1E5A3A", armR: "up", armL: "fwd",
      front: (L, { cx, T }, h) => {
        const s = L.s;
        for (let k = 0; k < 9; k++) s.line(cx - 8 + k * 2, T + 34, cx - 9 + k * 2 + SW[(k + L.f) % 4]!, T + 50, k % 2 ? "#3A8A3A" : "#6ADA7A");
        const [hx, hy] = h.R;
        s.line(hx, hy + 6, hx + 1, hy - 14, "#5a3a1a", 1, 2); s.rect(hx - 4, hy - 20, 10, 6, "#5a5a62"); s.rect(hx - 4, hy - 20, 10, 1, "#9a9aa2");
        const [lx, ly] = h.L; s.line(lx, ly, lx + 22, ly + 16, "#3a3a40");
      },
    });
    s.poly([[54, 110], [78, 110], [74, 115], [70, 115], [72, 128], [60, 128], [62, 115], [58, 115]], "#3a3a40"); s.rect(54, 110, 24, 1, "#6a6a70");
    s.poly([[58, 107], [70, 107], [72, 109], [58, 109]], "#FF9A2A"); s.line(58, 107, 70, 107, "#FFF3B0");
    s.rect(80, 118, 4, 10, "#5a5a62"); s.poly([[80, 118], [86, 116], [86, 121], [80, 122]], "#A8B0B8");
    gf.blob(64, 108, 10, 5, "#FFB020", 1, 0.35 + p * 0.1);
    for (let k = 0; k < 10; k++) { const an = -Math.PI * (0.1 + (k / 9) * 0.8), d = 3 + ((k * 5 + f * 4) % 10); gf.px(64 + Math.cos(an) * d * 1.4, 106 + Math.sin(an) * d, k % 2 ? "#FFD34E" : "#FFFFFF"); }
    gb.blob(64, 110, 20, 14, "#FF9A2A", 1, 0.15);
    rocks(fg, r, 134, 8, "#0a0e08");
  },

  /** Frey no pátio da fortaleza nórdica: lã verde e capa de arminho, chifre da abundância com gemas e trigo; celeiros e colheita em festa. */
  "O Legado": L => {
    const { b, gb, fg, f } = L, p = pulse(f);
    b.grad(0, 0, W, 70, "#6AA0D0", "#E8E4D0", 6);
    b.rect(0, 40, W, 60, "#8A8A92"); for (let x = 0; x < W; x += 8) b.rect(x, 36, 5, 4, "#8A8A92");
    for (let y = 44; y < 100; y += 5) for (let x = (y % 10 ? 0 : 4); x < W; x += 8) b.line(x, y, x + 6, y, "#6A6A72");
    for (const x of [4, 76]) { b.rect(x, 26, 12, 74, "#7A7A82"); for (let k = 0; k < 3; k++) b.rect(x + k * 4, 22, 3, 4, "#7A7A82"); b.rect(x + 4, 40, 3, 6, "#1a1a20"); }
    b.poly([[30, 40], [45, 30], [60, 40]], "#6a4a2a"); b.rect(40, 40, 10, 14, "#4a3020");
    for (const x of [16, 64]) {
      b.rect(x, 80, 12, 20, "#8a5a2a"); b.poly([[x - 2, 80], [x + 6, 72], [x + 14, 80]], "#6a3a1a"); b.rect(x + 4, 90, 4, 10, "#3a2010");
      for (let k = 0; k < 3; k++) { b.poly([[x + k * 4, 100], [x + 2 + k * 4, 92], [x + 4 + k * 4, 100]], "#DDA15E"); b.line(x + 2 + k * 4, 92, x + 2 + k * 4, 100, "#B8862B"); }
    }
    b.grad(0, 100, W, H - 100, "#A89868", "#6a5a3a", 4);
    for (let k = 0; k < 3; k++) { const x = 8 + k * 30 + SW[(k + f) % 4]!, y = 108; b.circ(x, y - 7, 1.5, "#E0B890"); b.rect(x - 1, y - 5, 3, 4, k % 2 ? "#8a3a2a" : "#3a5a8a"); b.line(x - 1, y - 4, x - 3, y - 7 - (f % 2), "#E0B890"); b.line(x + 1, y - 4, x + 3, y - 7 - ((f + 1) % 2), "#E0B890"); b.line(x, y - 1, x - 1 + (f % 2), y + 2, "#3a2a1a"); }

    human(L, {
      T: 42, B: 130, detail: true, skin: "#E8C098", robe: "#2A6A3A", trim: "#DDA15E", pattern: "diamonds", patternCol: "#3A7A4A",
      hair: "#C8903A", beard: "#C8903A", beardLong: true, head: "crown", crownCol: "#DDA15E", gem: "#62B6CB", necklace: "#DDA15E", bracelets: "#DDA15E",
      armL: "down", armR: "hold",
      back: (L, { cx, T, B }) => {
        L.s.poly([[cx - 11, T + 14], [cx + 11, T + 14], [cx + 20 + SW[L.f], B], [cx - 20 + SW[L.f], B]], "#F4F4F0");
        for (let y = T + 20; y < B; y += 6) for (let x = -16; x <= 16; x += 7) if (Math.abs(x) > 10) L.s.px(cx + x + ((y / 6) % 2) * 3, y, "#1a1a1a");
      },
      front: (L, { cx, T }, h) => {
        const s = L.s;
        s.ell(cx, T + 16, 11, 3, "#F4F4F0"); for (let x = -9; x <= 9; x += 4) s.px(cx + x, T + 16, "#1a1a1a");
        const [x, y] = h.R;
        s.poly([[x - 2, y + 4], [x + 4, y], [x + 10, y - 8], [x + 14, y - 14], [x + 17, y - 10], [x + 10, y + 2], [x + 2, y + 7]], "#E8DCC0");
        for (let k = 0; k < 4; k++) s.line(x + 2 + k * 3, y + 4 - k * 3, x + 5 + k * 3, y + 6 - k * 3, "#B8A880");
        s.ring(x + 15, y - 12, 3, "#DDA15E", 1, 1);
        for (const [dx, dy, c] of [[14, -15, "#62B6CB"], [17, -14, "#C8102E"], [15, -17, "#8ECF6A"], [18, -17, "#FFD34E"]] as const) s.px(x + dx, y + dy, c);
        for (let k = 0; k < 4; k++) s.line(x + 14 + k, y - 15, x + 12 + k * 2, y - 23 - k, "#DDA15E");
        L.gf.blob(x + 15, y - 15, 7, 7, "#FFE08a", 1, 0.3 + pulse(L.f) * 0.1);
        for (let k = 0; k < 3; k++) L.gf.px(x + 16 + k, y - 10 + ((k * 5 + L.f * 3) % 14), ["#62B6CB", "#C8102E", "#FFD34E"][k]!);
      },
    });
    gb.blob(45, 60, 30, 30, "#FFE8B0", 1, 0.1 + p * 0.03);
    fg.rect(0, 134, W, 4, "#3a2a1a"); for (let x = 2; x < W; x += 6) fg.line(x, 134, x + 1, 130, "#B8862B");
  },

  /** Tu Di Gong sorridente com cajado nodoso, fardo de cereais e barra de ouro; caminho de pedras entre arrozais e pontes em arco. */
  "O Construtor": L => {
    const { b, gb, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 60, "#8EC8E0", "#E8F0E0", 6);
    mountains(b, r, 60, 8, 26, "#7A9A8A", null, 8);
    for (let k = 0; k < 8; k++) {
      const y = 58 + k * 7;
      b.rect(0, y, W, 7, k % 2 ? "#5AA05A" : "#6AB06A"); b.line(0, y, W, y, "#3A7A3A");
      for (let x = (k * 3) % 6; x < W; x += 6) b.px(x, y + 3, "#9AE08A");
      for (let x = (k * 11 + f * 2) % 17; x < W; x += 17) b.line(x, y + 5, x + 4, y + 5, "#BEE9E8", 0.7);
    }
    for (let y = 58; y < 124; y++) { const x = Math.round(45 + Math.sin(y * 0.09) * (8 + (y - 58) * 0.2)), w = 2 + (y - 58) * 0.12; b.rect(x - w, y, w * 2, 1, "#B8B0A0"); if (y % 3 === 0) b.px(x, y, "#8a8070"); }
    for (const [x, y] of [[20, 72], [70, 94]] as const) { for (let t = -6; t <= 6; t++) b.px(x + t, y - Math.round(Math.cos((t / 6) * 1.4) * 4), "#9A9080"); b.rect(x - 6, y, 13, 1, "#7A7060"); }
    b.grad(0, 124, W, H - 124, "#6a5a3a", "#3a2a1a", 3);

    human(L, {
      T: 44, B: 128, detail: true, skin: "#E8C098", robe: "#B8302A", trim: "#F7D070", pattern: "stars", patternCol: "#F7D070",
      head: "bald", hair: "#E8E8E8", beard: "#FFFFFF", beardLong: true, smile: true, necklace: "#F7D070", armL: "hold", l: "staff", armR: "fwd",
      back: (L, { cx, T }) => {
        const s = L.s;
        s.ell(cx + 10, T + 14, 8, 5, "#DDA15E"); for (let k = 0; k < 6; k++) s.line(cx + 4 + k * 2, T + 12, cx + 3 + k * 2, T + 4, "#E8C070"); s.line(cx + 4, T + 14, cx + 16, T + 14, "#8a5a2a");
      },
      front: (L, { cx, T }, h) => {
        const s = L.s, hy = T + 7;
        s.rect(cx - 7, hy - 8, 15, 3, "#2a2a2a"); s.rect(cx - 9, hy - 6, 19, 1, "#1a1a1a"); for (const sg of [-1, 1]) s.rect(cx + sg * 10 - 1, hy - 6, 3, 2, "#2a2a2a");
        const [x, y] = h.R;
        s.poly([[x - 2, y - 2], [x + 8, y - 2], [x + 10, y - 7], [x + 6, y - 5], [x + 3, y - 8], [x, y - 5], [x - 4, y - 7]], "#FFD34E"); s.line(x, y - 3, x + 7, y - 3, "#FFF3B0");
        L.gf.blob(x + 3, y - 5, 8, 6, "#FFE066", 1, 0.3 + pulse(L.f) * 0.1);
      },
    });
    gb.blob(45, 70, 26, 26, "#FFF3C0", 1, 0.08 + p * 0.03);
    fg.rect(0, 134, W, 4, "#2a1e10"); grass(fg, r, 134, 16, "#1a2a10");
  },

  /** Deméter coroada de espigas, foice dourada e tocha, manto verde-musgo; trigal infinito, silos de pedra e macieiras carregadas. */
  "O Soberano da Terra": L => {
    const { b, gb, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 88, "#6AA8D8", "#F4E8C0", 6);
    for (const x of [8, 78]) { b.rect(x - 6, 50, 12, 40, "#9A9082"); b.ell(x, 50, 6, 4, "#8A8072"); b.rect(x - 6, 50, 3, 40, "#B8B0A0"); for (let y = 56; y < 90; y += 6) b.line(x - 6, y, x + 5, y, "#7A7062"); }
    for (const x of [24, 64]) { b.rect(x - 1, 70, 3, 18, "#5a3a20"); for (let k = 0; k < 6; k++) b.circ(x - 6 + ((k * 5) % 12), 64 + ((k * 3) % 8), 5, k % 2 ? "#3A7A3A" : "#2A6A2A"); for (let k = 0; k < 5; k++) b.circ(x - 5 + k * 2.5, 62 + ((k * 7) % 10), 1.2, "#D02A2A"); }
    b.rect(0, 130, W, H - 130, "#8a6a20");
    wheat(L, 84, 134, "#D8A030", "#FFE08A");
    rays(gb, 45, 10, 12, 60, "#FFF3C0", 0.25, f * 0.03);

    human(L, {
      T: 40, B: 128, detail: true, skin: "#E8C098", robe: "#D8A030", trim: "#2A4A2A", pattern: "diamonds", patternCol: "#B8862B",
      hairLong: true, hairLen: 36, hair: "#6A3A1A", head: "wheat", necklace: "#FFD34E", bracelets: "#FFD34E", earrings: "#FFD34E",
      cape: "#2A4A2A", armL: "up", l: "torch", armR: "hold", r: "sickle",
    });
    gf.blob(45, 40, 14, 12, "#FFE08A", 1, 0.12 + p * 0.05);
    for (let i = 0; i < 12; i++) { const x = (r() * W) | 0, sw = SW[(i + f) % 4]!; fg.line(x, 138, x + sw, 128 - (i % 3) * 2, "#8a6a20"); fg.px(x + sw, 127 - (i % 3) * 2, "#FFE08A"); }
    fg.rect(0, 136, W, 2, "#5a4010");
  },
};
