import { H, SW, W, pulse, rng, type Color, type Pt } from "../engine/buf";
import { human } from "../engine/figure";
import type { ArtFn, Layers } from "../engine/layers";
import { bolt, flame, mist, rays, rocks } from "../engine/primitives";

const EMBER: readonly [Color, Color, Color] = ["#FFF3B0", "#FF9A2A", "#E0321B"];

/** Rachaduras incandescentes (corpo de brasa, chão de lava resfriando). */
function glowCracks(L: Layers, paths: readonly (readonly Pt[])[], c: Color, glow: Color): void {
  const p = pulse(L.f);
  for (const path of paths) for (let i = 0; i < path.length - 1; i++) {
    const [x0, y0] = path[i]!, [x1, y1] = path[i + 1]!;
    L.s.line(x0, y0, x1, y1, c); L.gf.line(x0, y0, x1, y1, glow, 0.3 + p * 0.1, 2);
  }
}

/** Faíscas subindo em espiral leve, como vaga-lumes de fogo. */
function sparks(L: Layers, n: number, y0: number, y1: number, seed: number): void {
  const r = rng(seed), h = y1 - y0;
  for (let i = 0; i < n; i++) {
    const x = r() * W, base = r() * h, y = y0 + ((((base - L.f * 6) % h) + h) % h), sw = SW[(i + L.f) % 4]!;
    L.gf.px(x + sw, y, i % 3 ? "#FFB020" : "#FFF3B0"); if (i % 4 === 0) L.gf.blob(x + sw, y, 2, 2, "#FF9A2A", 1, 0.4);
  }
}

export const FOGO_ART: Record<string, ArtFn> = {
  /** Agni de duas faces montado no carneiro de bronze, tocha recém-acesa; planície de basalto sob a aurora. */
  "A Centelha": L => {
    const { b, gb, s, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 60, "#14060E", "#6A1A3A", 6); b.grad(0, 60, W, 44, "#6A1A3A", "#F09A5A", 6);
    b.blob(45, 100, 44, 10, "#FFD08a", 1.1, 0.6);
    for (let k = 0; k < 4; k++) b.blob(10 + k * 24, 30 + (k % 2) * 12, 16, 3, "#8A2A4A", 1, 0.5);
    b.grad(0, 102, W, H - 102, "#2a1e22", "#0e0a0c", 4);
    for (let y = 104, row = 0; y < 132; y += 4 + row, row++) for (let x = (row % 2) * 5; x < W; x += 10) { b.poly([[x, y], [x + 4, y - 1], [x + 8, y], [x + 8, y + 3], [x + 4, y + 4], [x, y + 3]], row % 2 ? "#241a1e" : "#2e2226"); b.line(x, y, x + 4, y - 1, "#4a3a3e"); }
    sparks(L, 24, 40, 128, 5);

    // Carneiro de bronze de perfil, com chifres espiralados.
    const rx = 46, ry = 128, br = "#B87333", bl = "#E0A060", bd = "#7a4a1a";
    s.ell(rx + 2, ry - 10, 19, 8, br); s.ell(rx + 2, ry - 14, 17, 3, bl);
    for (let k = 0; k < 12; k++) s.px(rx - 12 + k * 2.5, ry - 11 + (k % 2) * 2, bd);
    for (const [dx, lift] of [[-11, f % 2], [-6, 0], [8, 0], [13, (f + 1) % 2]] as const) { s.rect(rx + dx, ry - 5, 3, 9 - lift, br); s.rect(rx + dx, ry + 3 - lift, 3, 1, "#3a2010"); }
    for (let k = 0; k < 14; k++) s.ring(rx - 12 + k * 2.4, ry - 12 + (k % 3) * 2, 1, "#D89050", 1, 1);
    s.poly([[rx - 14, ry - 16], [rx - 20, ry - 24], [rx - 28, ry - 22], [rx - 31, ry - 16], [rx - 27, ry - 12], [rx - 16, ry - 9]], br);
    s.line(rx - 28, ry - 16, rx - 31, ry - 16, bd); s.px(rx - 30, ry - 15, "#1a0a00"); s.px(rx - 25, ry - 20, "#1a0a00"); s.px(rx - 24, ry - 21, "#FFF3B0");
    s.ring(rx - 19, ry - 21, 5, "#F7D070", 1, 2); s.ring(rx - 19, ry - 21, 2.5, "#B8862B", 1, 1); s.px(rx - 22, ry - 15, "#F7D070");
    s.poly([[rx + 18, ry - 12], [rx + 23, ry - 16 + SW[f]], [rx + 20, ry - 9]], br);
    gb.blob(rx, ry - 10, 22, 10, "#FFB020", 1, 0.15);

    human(L, {
      cx: 48, T: 46, B: 110, pose: "seat", detail: true, skin: "#C0302A", robe: "#F4A300", trim: "#9E2A2B", pattern: "diamonds", patternCol: "#E07A5F",
      hair: "#1a0808", head: "twoface", necklace: "#F7D070", bracelets: "#F7D070", earrings: "#F7D070", armL: "chest", armR: "up",
      front: (L, { cx, T }, h) => {
        const s = L.s, [tx, ty] = h.R;
        for (let k = 0; k < 4; k++) flame(s, cx - 4 + k * 3, T - 1, 4 + ((k + L.f) % 2) * 2, L.f, EMBER);
        s.rect(tx, ty - 14, 1, 16, "#6a3a1a"); s.rect(tx - 1, ty - 15, 3, 2, "#F7D070");
        flame(s, tx, ty - 16, 9, L.f, ["#FFFFFF", "#FFD34E", "#FF7A1A"]);
        L.gb.blob(tx, ty - 22, 14, 14, "#FFD08a", 1, 0.35 + pulse(L.f) * 0.1);
        for (let k = 0; k < 5; k++) L.gf.px(tx + SW[(k + L.f) % 4]! * 2, ty - 26 - ((k * 5 + L.f * 3) % 18), "#FFF3B0");
      },
    });
    gf.blob(45, 100, 30, 8, "#FF9A2A", 1, 0.08 + p * 0.04);
    rocks(fg, r, 134, 8, "#0a0608");
  },

  /** Héstia de véu açafrão cuidando da lareira circular de pedra no salão de madeira com guirlandas de trigo. */
  "A Fogueira": L => {
    const { b, gb, s, gf, fg, f } = L, p = pulse(f);
    b.grad(0, 0, W, 118, "#4A2410", "#1E0E06", 6);
    for (let x = 0; x < W; x += 9) { b.rect(x, 0, 8, 118, x % 18 ? "#3E1E0C" : "#46220E"); b.line(x + 8, 0, x + 8, 118, "#1A0A04"); for (let y = 10 + (x % 7); y < 118; y += 23) b.circ(x + 4, y, 1, "#2a1206"); }
    b.rect(0, 8, W, 5, "#2a1206"); b.rect(0, 8, W, 1, "#6a3a1a");
    for (let x = 0; x < W; x++) { const y = Math.round(20 + Math.sin(x * 0.14) * 6); b.px(x, y, "#8a6a3a"); if (x % 3 === 0) { b.line(x, y, x - 2, y + 5, "#DDA15E"); b.px(x - 2, y + 5, "#FFD34E"); } }
    for (const x of [14, 76]) { b.rect(x - 4, 44, 9, 12, "#1a0a04"); b.rect(x - 3, 45, 7, 10, "#FFB060"); b.line(x, 45, x, 55, "#6a3a1a"); b.line(x - 3, 50, x + 3, 50, "#6a3a1a"); gb.blob(x, 50, 8, 8, "#FFB060", 1, 0.25); }
    for (const x of [26, 62]) { b.line(x, 13, x, 30, "#2a1206"); b.ell(x, 32, 3, 2, "#3a3a40"); }
    b.grad(0, 118, W, H - 118, "#3a2010", "#1a0e06", 3);
    for (let x = 0; x < W; x += 10) b.line(x, 118, x - 6, H, "#2a1206");
    gb.blob(45, 116, 44, 34, "#FFB020", 1, 0.3 + p * 0.04);

    human(L, {
      T: 58, B: 120, pose: "seat", detail: true, skin: "#E8C098", robe: "#8A3A1A", trim: "#F4A300", pattern: "dots", patternCol: "#C85A2A",
      hairLong: true, hairLen: 30, hair: "#3a1a0a", necklace: "#F4A300", lips: "#A04030", armL: "fwd", armR: "fwd",
      back: (L, { cx, T }) => { L.s.poly([[cx - 8, T - 1], [cx + 8, T - 1], [cx + 13 + SW[L.f], T + 40], [cx - 13 + SW[L.f], T + 40]], "#F4A300"); },
      front: (L, { cx, T }) => {
        L.gf.poly([[cx - 8, T + 1], [cx + 8, T + 1], [cx + 9, T + 6], [cx - 9, T + 6]], "#F4A300", 0.55);
        L.gf.blob(cx, T + 20, 16, 12, "#FFB020", 1, 0.18);
      },
    });
    s.ell(45, 128, 20, 6, "#4A4040"); for (let k = 0; k < 10; k++) s.rect(27 + k * 3.8, 124 + (k % 2), 3, 3, k % 2 ? "#6a6060" : "#5a5050");
    s.ell(45, 127, 15, 3, "#1a0a04");
    for (const [x, h] of [[39, 9], [45, 12], [51, 9], [42, 7], [48, 7]] as const) flame(s, x, 128, h, f);
    gf.blob(45, 118, 16, 12, "#FFB020", 1, 0.35 + p * 0.06);
    sparks(L, 6, 96, 124, 9);
    fg.rect(0, 135, W, 3, "#120804");
  },

  /** Hefesto de avental de couro ergue o martelo colossal sobre a espada incandescente; caverna vulcânica com rios de lava. */
  "A Forja": L => {
    const { b, gb, s, gf, fg, f } = L, p = pulse(f);
    b.grad(0, 0, W, H, "#1A0404", "#3A0E0A", 6);
    b.poly([[0, 0], [18, 0], [12, 50], [4, 96], [0, 100]], "#0a0202"); b.poly([[90, 0], [72, 0], [80, 44], [86, 90], [90, 96]], "#0a0202");
    for (const x of [26, 40, 58, 66]) b.poly([[x - 3, 0], [x + 3, 0], [x, 8 + (x % 9)]], "#120404");
    // Rio de lava serpenteando ao fundo.
    for (let x = 0; x < W; x++) { const y = Math.round(96 + Math.sin(x * 0.12) * 3); b.rect(x, y, 1, 6, "#FF6020"); if ((x + f * 3) % 7 < 2) b.px(x, y + 1 + (x % 3), "#FFD34E"); b.px(x, y, "#FFB060"); }
    gb.blob(45, 98, 50, 12, "#FF6020", 1, 0.35 + p * 0.05);
    for (let k = 0; k < 3; k++) { const x = 16 + k * 28 + f * 2; b.blob(x, 84 - k * 8, 8, 3, "#5a2a1a", 1, 0.5); }
    b.grad(0, 104, W, H - 104, "#2a0e0a", "#120402", 3);

    human(L, {
      cx: 36, T: 40, B: 130, tunic: true, detail: true, skin: "#B07050", robe: "#6A4424", trim: "#3a2410", legs: "#3a2a1a", feet: "#2a1a0e",
      bare: true, bareArms: true, beard: "#1a0a04", hair: "#1a0a04", bracelets: "#8a8a8a", armR: "up", armL: "fwd",
      front: (L, { cx, T }, h) => {
        const s = L.s;
        s.line(cx - 5, T + 21, cx - 3, T + 25, "#8a5038"); s.line(cx + 5, T + 21, cx + 3, T + 25, "#8a5038"); s.line(cx - 4, T + 28, cx + 4, T + 28, "#8a5038");
        s.poly([[cx - 7, T + 26], [cx + 7, T + 26], [cx + 9, T + 56], [cx - 9, T + 56]], "#5A3A20"); s.line(cx - 7, T + 26, cx + 7, T + 26, "#8a6a4a");
        s.line(cx - 6, T + 15, cx - 6, T + 26, "#3a2410"); s.line(cx + 6, T + 15, cx + 6, T + 26, "#3a2410");
        const [hx, hy] = h.R;
        s.line(hx, hy + 8, hx + 2, hy - 16, "#5a3a1a", 1, 2);
        s.rect(hx - 6, hy - 24, 16, 9, "#4a4a52"); s.rect(hx - 6, hy - 24, 16, 2, "#8a8a92"); s.rect(hx - 6, hy - 17, 16, 2, "#2a2a30");
        const [lx, ly] = h.L;
        s.line(lx, ly, lx + 30, ly + 22, "#3a3a40"); s.line(lx + 1, ly - 1, lx + 30, ly + 20, "#5a5a60");
      },
    });
    // Bigorna de pedra e espada incandescente, centelhas no impacto.
    s.poly([[52, 108], [80, 108], [76, 114], [70, 114], [72, 128], [58, 128], [60, 114], [54, 114]], "#3a3a40"); s.rect(52, 108, 28, 1, "#6a6a70"); s.poly([[80, 108], [86, 108], [80, 111]], "#3a3a40");
    s.rect(54, 105, 24, 3, "#FF9A2A"); s.rect(56, 105, 18, 1, "#FFF3B0"); s.rect(76, 104, 4, 5, "#5a3a1a");
    gf.blob(64, 106, 12, 6, "#FFB020", 1, 0.4 + p * 0.1);
    for (let k = 0; k < 16; k++) { const an = -Math.PI * (0.05 + (k / 15) * 0.9), d = 3 + ((k * 5 + f * 4) % 14); gf.px(64 + Math.cos(an) * d * 1.5, 104 + Math.sin(an) * d, k % 3 ? "#FFD34E" : "#FFFFFF"); }
    sparks(L, 8, 60, 104, 13);
    rocks(fg, rng(4), 134, 8, "#0a0202");
  },

  /** Xangô de peito nu e manto vermelho, oxê erguido; topo de pedreira sob tempestade seca de relâmpagos vermelhos. */
  "O Ímpeto": L => {
    const { b, gb, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, H, "#0a0206", "#5A1A14", 7);
    for (let k = 0; k < 5; k++) b.blob(k * 22, 18 + (k % 2) * 10, 20, 6, "#2a0a0a", 1.1, 0.8);
    bolt(b, rng(40 + f), 10 + f * 20, 8, 96, "#FF4A3A"); gb.blob(10 + f * 20, 40, 16, 30, "#FF4A3A", 1, 0.15);
    if (f % 2) { bolt(b, rng(70 + f), 70 - f * 8, 6, 80, "#FF8A6A"); gb.blob(70 - f * 8, 30, 12, 20, "#FF8A6A", 1, 0.2); }
    // Pedreira em degraus cortados.
    for (let k = 0; k < 6; k++) {
      const y = 96 + k * 6, x0 = k * 5;
      b.rect(x0, y, W - x0 * 2, 6, k % 2 ? "#5a4a44" : "#4a3a34"); b.rect(x0, y, W - x0 * 2, 1, "#7a6a64");
      for (let x = x0 + 4; x < W - x0; x += 9) b.line(x, y + 1, x + 1, y + 5, "#3a2a24");
    }
    b.grad(0, 132, W, H - 132, "#2a1e1a", "#1a120e", 2);

    human(L, {
      T: 42, B: 130, detail: true, skin: "#3B2418", robe: "#9E2A2B", trim: "#FFFFFF", pattern: "dots", patternCol: "#FFFFFF",
      cape: "#7A1A1A", bare: true, bareArms: true, hair: "#0a0a0a", head: "crown", crownCol: "#B87333", gem: "#FFFFFF", brow: "#050505",
      necklace: "#FFFFFF", bracelets: "#B87333", armR: "up", r: "axe2", armL: "open",
      front: (L, { cx, T }) => {
        const s = L.s, hy = T + 7;
        s.line(cx - 4, hy - 2, cx - 1, hy - 1, "#050505"); s.line(cx + 1, hy - 1, cx + 4, hy - 2, "#050505");
        for (let k = -6; k <= 6; k++) s.px(cx + k, T + 17 + Math.round(Math.abs(k) / 3), k % 2 ? "#C8102E" : "#FFFFFF");
        for (let k = -5; k <= 5; k++) s.px(cx + k, T + 20 + Math.round(Math.abs(k) / 2), k % 2 ? "#FFFFFF" : "#C8102E");
        s.line(cx - 4, T + 22, cx - 2, T + 26, "#2a1810"); s.line(cx + 4, T + 22, cx + 2, T + 26, "#2a1810");
      },
    });
    gf.blob(45, 20, 12, 10, "#FF4A3A", 1, 0.1 + p * 0.05);
    rocks(fg, r, 134, 8, "#0a0404");
  },

  /** Xiuhtecuhtli, velho senhor das cinzas: corpo de carvão em brasa, feixe de tochas dos anos; campo de batalha fumegante. */
  "A Brasa": L => {
    const { b, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 112, "#2A2020", "#6A5A54", 6);
    for (let i = 0; i < 8; i++) b.blob(((i * 17 + f * 2) % 100) - 5, 16 + i * 11, 16, 6, i % 2 ? "#8A8078" : "#5a504a", 1, 0.6);
    for (const x of [12, 30, 70, 82]) { for (let y = 60; y < 110; y += 3) b.px(x + Math.round(Math.sin(y * 0.2 + f) * 2), y, "#9A9088", 0.4); }
    b.grad(0, 108, W, H - 108, "#2a2220", "#140e0c", 3);
    for (const [x, a] of [[8, -0.3], [20, 0.4], [74, -0.5], [84, 0.2]] as const) { b.line(x, 118, x + Math.sin(a) * 20, 118 - Math.cos(a) * 20, "#3a302a", 1, 1); }
    for (const [x, y] of [[26, 116], [66, 118]] as const) { b.circ(x, y, 5, "#3a302a"); b.ring(x, y, 5, "#5a4a3a", 1, 1); b.px(x, y, "#8a7a5a"); }

    human(L, {
      T: 44, B: 130, detail: true, skin: "#1E1A1A", robe: "#3A2A24", trim: "#40C0B0", pattern: "diamonds", patternCol: "#4a3a30",
      hair: "#6A6A6A", beard: "#8A8A8A", necklace: "#40C0B0", bracelets: "#40C0B0", armL: "hold", armR: "hold",
      back: (L, { cx, T }) => {
        // Xiuhmolpilli: o feixe de tochas (os anos atados), pesado sobre o ombro.
        const s = L.s;
        for (let k = 0; k < 6; k++) { s.line(cx - 6 + k * 3, T + 34, cx + 2 + k * 3, T - 6, k % 2 ? "#5a3820" : "#4a3020", 1, 2); flame(s, cx + 2 + k * 3, T - 7, 5 + ((k + L.f) % 3), L.f, EMBER); }
        for (const t of [0.3, 0.65]) s.line(cx - 6 + 8 * t, T + 34 - 40 * t, cx + 12 + 8 * t, T + 34 - 40 * t, "#40C0B0", 1, 2);
        L.gb.blob(cx + 8, T - 10, 16, 10, "#FFB020", 1, 0.3 + pulse(L.f) * 0.08);
      },
      front: (L, { cx, T }) => {
        const s = L.s, hy = T + 7;
        s.rect(cx - 7, hy - 7, 15, 3, "#40C0B0"); s.rect(cx - 7, hy - 7, 15, 1, "#8AF0E0");
        for (const [dx, h] of [[-6, 6], [-3, 9], [0, 11], [3, 9], [6, 6]] as const) s.line(cx + dx, hy - 7, cx + dx + (dx > 0 ? 1 : dx < 0 ? -1 : 0), hy - 7 - h, dx === 0 ? "#40C0B0" : "#2A8A7A");
        s.poly([[cx - 4, T + 18], [cx + 4, T + 18], [cx + 2, T + 24], [cx, T + 22], [cx - 2, T + 24]], "#40C0B0");
      },
    });
    glowCracks(L, [
      [[39, 52], [41, 57], [38, 60]], [[48, 64], [51, 70], [49, 76]], [[41, 80], [44, 88], [42, 96]], [[33, 70], [31, 78]], [[55, 72], [57, 80]], [[45, 100], [48, 112], [46, 124]],
    ], "#FF7A1A", "#FFB020");
    gf.blob(45, 80, 16, 30, "#FF6A1A", 1, 0.06 + p * 0.03);
    mist(gf, 96, 3, "#8A8078", 0.25, f);
    fg.rect(0, 131, W, 7, "#140E0C");
    for (let i = 0; i < 20; i++) { const x = (r() * W) | 0, y = 130 + ((r() * 6) | 0); fg.px(x, y, (i + f) % 3 ? "#FF3A1A" : "#FFB020"); if (i % 5 === 0) gf.blob(x, y, 3, 2, "#FF6A1A", 1, 0.4); }
  },

  /** Pele corre descalça sobre a lava recém-resfriada, cabelos de labareda; vulcão em erupção e o mar fervendo. */
  "O Desbravador": L => {
    const { b, gb, gf, fg, f } = L, p = pulse(f);
    b.grad(0, 0, W, 108, "#1E0630", "#8A3A6A", 6);
    b.poly([[4, 108], [36, 36], [54, 36], [90, 100], [90, 108]], "#1a0a14"); b.poly([[36, 36], [45, 34], [54, 36], [60, 60], [40, 70]], "#2a1020");
    for (const [x0, x1] of [[40, 26], [50, 64], [46, 44]] as const) { for (let y = 38; y < 106; y += 2) { const x = Math.round(x0 + ((x1 - x0) * (y - 38)) / 68 + Math.sin(y * 0.3) * 1.5); b.rect(x, y, 2, 2, "#FF6020"); if ((y + f * 2) % 6 < 2) b.px(x, y, "#FFD34E"); } }
    for (let k = 0; k < 16; k++) { const an = -Math.PI * (0.15 + k * 0.045), d = 4 + ((k * 5 + f * 4) % 22); gf.rect(45 + Math.cos(an) * d, 34 + Math.sin(an) * d * 1.6, 2, 2, k % 2 ? "#FFD34E" : "#FF6020"); }
    gb.blob(45, 32, 18, 14, "#FF6020", 1, 0.45 + p * 0.08);
    for (let k = 0; k < 4; k++) b.blob(30 + k * 10, 20 - k * 4, 10, 4, "#4a2a3a", 1, 0.6);
    b.grad(62, 98, 28, 20, "#1B4965", "#0B1A24", 2);
    for (let k = 0; k < 4; k++) b.blob(70 + k * 5, 96 - ((k * 5 + f * 3) % 14), 6, 4, "#FFFFFF", 1, 0.45);
    b.grad(0, 108, W, H - 108, "#1a0a10", "#0a0408", 3);
    for (let y = 110; y < 134; y += 5) for (let x = (y * 3) % 11; x < W; x += 11) b.line(x, y, x + 5, y + 1, "#FF4010", 0.5 + ((x + f) % 3) * 0.15);

    human(L, {
      cx: 42, T: 42, B: 128, pose: "run", detail: true, skin: "#A06A4A", legs: "#A06A4A", robe: "#9E2A2B", trim: "#FFD34E", pattern: "stripes", patternCol: "#E07A5F",
      head: "flamehair", necklace: "#FFD34E", bracelets: "#FFD34E", smile: true, lips: "#8a2a2a", armL: "open", armR: "fwd",
      back: (L, { cx, T }) => {
        for (let k = 0; k < 6; k++) { const y = T + 2 + k * 3, len = 12 + k * 2 + SW[(L.f + k) % 4]! * 2; L.s.line(cx - 4, y, cx - 4 - len, y + 4 + k, k % 2 ? "#FF9A2A" : "#E0321B", 1, 2); L.s.px(cx - 4 - len, y + 4 + k, "#FFF3B0"); }
        L.gb.blob(cx - 12, T + 8, 14, 10, "#FF6020", 1, 0.35);
      },
    });
    gf.blob(42, 128, 12, 3, "#FF6020", 1, 0.3);
    for (let i = 0; i < 8; i++) { const x = (i * 13 + 3) % W; fg.poly([[x - 5, 138], [x - 2, 131 - (i % 3)], [x + 3, 133], [x + 6, 138]], "#0A0508"); fg.line(x - 2, 133, x + 2, 136, "#FF4010"); }
  },

  /** Surya no trono de fogo solar esculpido: lótus de fogo e cetro flamejante; sala do trono cósmica e estandartes ao calor. */
  "O Soberano da Chama": L => {
    const { b, gb, s, gf, fg, f } = L, p = pulse(f);
    b.grad(0, 0, W, 112, "#5A2A06", "#F7C060", 6);
    rays(gb, 45, 60, 20, 80, "#FFF3B0", 0.3, f * 0.04);
    for (const x of [4, 20, 62, 78]) {
      const o = SW[(x + f) % 4]!;
      b.poly([[x, 0], [x + 8, 0], [x + 8 + o, 42], [x + 4 + o, 48], [x + o, 42]], "#9E2A2B"); b.line(x + 1, 0, x + 1 + o, 40, "#C8403A");
      b.rect(x, 6, 8, 2, "#F7D070"); b.circ(x + 4 + o, 28, 2, "#F7D070"); b.px(x + 4 + o, 28, "#FF9A2A");
    }
    for (let y = 10; y < 110; y += 6) for (let x = (y * 3 + f * 2) % 14; x < W; x += 14) b.px(x + SW[(y + f) % 4]!, y, "#FFE8B0", 0.35);
    b.grad(0, 112, W, H - 112, "#8a4a10", "#4a2206", 3);
    for (let k = 0; k < 4; k++) { b.rect(8 + k * 5, 112 + k * 5, 74 - k * 10, 5, k % 2 ? "#6a3408" : "#7a3c0a"); b.rect(8 + k * 5, 112 + k * 5, 74 - k * 10, 1, "#F7C060"); }

    // Trono: disco solar esculpido em chamas, braços em leão estilizado.
    s.circ(45, 66, 28, "#F7D070"); s.circ(45, 66, 25, "#FF9A2A"); s.ring(45, 66, 20, "#F7D070", 1, 1);
    for (let k = 0; k < 16; k++) { const an = (k * Math.PI) / 8 + f * 0.05; flame(s, Math.round(45 + Math.cos(an) * 29), Math.round(66 + Math.sin(an) * 29) + 3, 5 + ((k + f) % 3), f, ["#FFFFFF", "#FFD34E", "#FF7A1A"]); }
    for (const sg of [-1, 1]) { s.rect(45 + sg * 18 - 3, 94, 7, 22, "#D8A020"); s.circ(45 + sg * 18, 94, 4, "#F7D070"); s.px(45 + sg * 18, 93, "#9E2A2B"); }
    gb.blob(45, 66, 34, 34, "#FFB020", 1, 0.35 + p * 0.06);
    human(L, {
      T: 56, B: 118, pose: "seat", detail: true, skin: "#D08040", robe: "#F4A300", trim: "#9E2A2B", pattern: "diamonds", patternCol: "#FFD34E",
      head: "rays12", hair: "#3a1a0a", halo: "#FFE08a", necklace: "#FFFFFF", bracelets: "#F7D070", earrings: "#F7D070", armL: "fwd", armR: "fwd", l: "firelotus", r: "scepter",
    });
    gf.blob(45, 64, 12, 10, "#FFFFFF", 1, 0.12 + p * 0.06);
    fg.rect(0, 134, W, 4, "#2a1204");
  },
};

