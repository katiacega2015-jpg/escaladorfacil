import { H, SW, W, bay, pulse, rng, type Color } from "../engine/buf";
import { raven } from "../engine/creatures";
import { human } from "../engine/figure";
import type { ArtFn, Layers } from "../engine/layers";
import { bolt, grass, mist, particles, pillar, rocks } from "../engine/primitives";

/** Rajadas de vento: traços horizontais com cauda, correndo a cada quadro. */
function gusts(L: Layers, n: number, y0: number, y1: number, c: Color, a: number, speed = 9): void {
  const r = rng(21);
  for (let i = 0; i < n; i++) {
    const y = y0 + r() * (y1 - y0), len = 8 + r() * 14, x = ((r() * 140 + L.f * speed) % 140) - 30;
    L.gf.line(x, y, x + len, y - len * 0.08, c, a); L.gf.px(x + len + 1, y - len * 0.08 - 1, c, a);
  }
}

/** Espiral de vento (vórtice) em pixels. */
function spiral(L: Layers, x: number, y: number, rad: number, c: Color, a: number): void {
  for (let t = 0; t < 18; t++) { const an = t * 0.55 + L.f * 0.6, rr = (t / 18) * rad; L.gb.px(x + Math.cos(an) * rr, y + Math.sin(an) * rr * 0.7, c, a); }
}

export const AR_ART: Record<string, ArtFn> = {
  /** Atena de elmo coríntio prateado: a lança corta a névoa e abre o céu azul; coruja em voo rasante no desfiladeiro. */
  "A Lucidez": L => {
    const { b, gb, s, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, H, "#5A6068", "#A8B0B8", 6);
    const ox = 78, oy = 14;
    for (let y = 0; y < 60; y++) for (let x = 36; x < W; x++) { const d = Math.hypot(x - ox, (y - oy) * 1.1); if (d < 28 && bay(x, y) < 1.5 - d / 22) b.px(x, y, d < 10 ? "#BEE6F6" : d < 18 ? "#8ECAE6" : "#6AAAD0"); }
    gb.blob(ox, oy, 16, 14, "#FFFFFF", 1, 0.3 + p * 0.06);
    b.poly([[0, 0], [16, 0], [22, 40], [14, 80], [20, 120], [0, 126]], "#3a3e44"); b.poly([[90, 60], [76, 80], [80, 120], [90, 124]], "#3a3e44");
    for (let y = 10; y < 120; y += 7) { b.line(2, y, 14, y + 2, "#4a4e56"); b.line(80, y + 60 > 124 ? 124 : y + 60, 88, y + 62 > 124 ? 124 : y + 62, "#4a4e56"); }
    b.grad(0, 118, W, H - 118, "#4a4e56", "#24282e", 3);
    mist(b, 70, 5, "#E0E4E8", 0.35, f);

    human(L, {
      T: 44, B: 128, detail: true, skin: "#E8D0B8", robe: "#E4E6EA", trim: "#8ECAE6", pattern: "stripes", patternCol: "#C8CCD2",
      head: "helmet", helm: "#C8D0D8", crest: "#2A4A8A", hair: "#6A4A2A", hairLong: true, hairLen: 26, eye: "#3A5A8A", armR: "hold", armL: "chest",
      back: (L, { cx, T }) => { L.s.circ(cx - 12, T + 30, 10, "#B8862B"); L.s.circ(cx - 12, T + 30, 8, "#D8A840"); L.s.ring(cx - 12, T + 30, 5, "#8a6a20", 1, 1); L.s.px(cx - 12, T + 30, "#FFF3B0"); },
      front: (L, { cx, T }, h) => {
        const s = L.s, hy = T + 7;
        s.rect(cx - 4, hy - 1, 3, 1, "#2a2a30"); s.rect(cx + 2, hy - 1, 3, 1, "#2a2a30"); s.rect(cx - 1, hy - 1, 3, 5, "#C8D0D8");
        s.poly([[cx - 6, T + 16], [cx + 6, T + 16], [cx + 5, T + 26], [cx - 5, T + 26]], "#B8B0A0");
        s.circ(cx, T + 21, 2.5, "#8a7a5a"); s.px(cx - 1, T + 20, "#2a2a2a"); s.px(cx + 1, T + 20, "#2a2a2a");
        for (const dx of [-3, -1, 1, 3]) s.px(cx + dx, T + 18 + (dx % 2 ? 0 : 1), "#4a6a3a");
        const [x, y] = h.R;
        s.line(x - 10, y + 20, x + 22, y - 38, "#7a5a3a"); s.poly([[x + 19, y - 36], [x + 25, y - 38], [x + 25, y - 45]], "#EEF2F6");
        gf.line(x + 25, y - 45, ox - 6, oy + 10, "#FFFFFF", 0.5); gf.blob(x + 24, y - 42, 5, 5, "#FFFFFF", 1, 0.4 + pulse(L.f) * 0.1);
      },
    });
    // Coruja cinza em voo rasante.
    const wx = 20 + f * 4, wy = 40 + SW[f], up = f % 2 ? -5 : 2;
    s.ell(wx, wy, 4, 3, "#8a8a90"); s.circ(wx + 3, wy - 3, 3, "#9a9aa0"); s.px(wx + 2, wy - 4, "#FFD34E"); s.px(wx + 4, wy - 4, "#FFD34E"); s.px(wx + 5, wy - 2, "#3a3a3a");
    s.poly([[wx - 2, wy - 1], [wx - 14, wy + up], [wx - 10, wy + 3]], "#7a7a80"); s.poly([[wx + 1, wy - 1], [wx + 10, wy + up - 2], [wx + 7, wy + 2]], "#7a7a80");
    for (let k = 0; k < 3; k++) s.line(wx - 12 + k * 3, wy + up + 1, wx - 10 + k * 3, wy + 2, "#5a5a60");
    gusts(L, 10, 30, 120, "#FFFFFF", 0.4);
    rocks(fg, r, 134, 8, "#1a1c20");
  },

  /** Hipnos com asinhas nas têmporas: o ramo de papoula goteja orvalho sobre a espada embainhada; templo em ruínas ao entardecer. */
  "A Trégua": L => {
    const { b, gb, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 112, "#4A3A6A", "#E8A080", 6);
    for (const [x, y, w] of [[8, 20, 22], [54, 12, 28], [30, 40, 18]] as const) { for (let i = 0; i <= w; i += 4) b.circ(x + i, y - ((i * 7) % 5) / 2, 4 + ((i * 3) % 3), "#F4C8C0"); b.rect(x - 2, y + 1, w + 4, 3, "#D8A0A0"); }
    b.poly([[6, 64], [44, 56], [48, 60], [10, 68]], "#C8B8A8"); b.line(6, 64, 44, 56, "#E8DCD0");
    pillar(b, 4, 64, 118, 8, "#B8B0A4", "#E0D8CC", "#8A8278"); pillar(b, 74, 76, 118, 8, "#B8B0A4", "#E0D8CC", "#8A8278");
    b.poly([[74, 76], [82, 76], [80, 72], [76, 74]], "#B8B0A4"); pillar(b, 62, 94, 118, 6, "#A8A094", "#D0C8BC", "#7A7268");
    b.ell(24, 116, 10, 3, "#A8A094"); b.rect(56, 112, 10, 6, "#A8A094");
    b.grad(0, 112, W, H - 112, "#4A6A3A", "#2A3A1E", 3);
    grass(b, r, 118, 40, "#6A8A4A");
    for (const [x, y] of [[12, 114], [70, 110], [78, 116]] as const) { b.line(x, y + 4, x, y, "#4a7a3a"); b.circ(x, y - 1, 1.5, "#D02030"); }

    human(L, {
      T: 44, B: 128, detail: true, skin: "#E8D0C0", robe: "#E8E4F0", trim: "#9A8AC0", pattern: "dots", patternCol: "#C8C0DC",
      head: "templewings", hair: "#3a2a4a", hairLong: true, hairLen: 22, armL: "fwd", armR: "chest", lips: "#A06070",
      front: (L, { cx, T }, h) => {
        const s = L.s, hy = T + 7;
        s.line(cx - 3, hy, cx - 2, hy, "#3a2a4a"); s.line(cx + 2, hy, cx + 3, hy, "#3a2a4a"); s.px(cx - 3, hy - 1, "#E8D0C0"); s.px(cx + 3, hy - 1, "#E8D0C0");
        const [x, y] = h.L;
        s.line(x, y, x - 8, y - 10, "#4a7a3a"); s.line(x - 4, y - 5, x - 10, y - 4, "#4a7a3a");
        for (const [px, py] of [[x - 8, y - 11], [x - 11, y - 5]] as const) { s.circ(px, py, 2, "#D02030"); s.px(px, py, "#1a0a0a"); s.px(px - 1, py - 1, "#FF6070"); }
        for (let k = 0; k < 3; k++) { const dy = (k * 6 + L.f * 3) % 18; L.gf.px(x - 8 + (k % 2) * -3, y - 8 + dy, "#BEE9E8"); }
        s.rect(cx - 14, T + 44, 24, 3, "#4a3a2a"); s.rect(cx - 14, T + 44, 24, 1, "#6a5a3a"); s.rect(cx + 10, T + 43, 3, 5, "#B8862B"); s.rect(cx + 13, T + 44, 4, 3, "#8a6a3a");
        s.px(cx - 6, T + 44, "#BEE9E8");
      },
    });
    gb.blob(45, 60, 30, 30, "#FFD8C8", 1, 0.08 + p * 0.03);
    for (let k = 0; k < 3; k++) gf.px(48 + k * 4, 44 - ((k * 3 + f * 2) % 10), "#FFFFFF", 0.6);
    fg.rect(0, 134, W, 4, "#1a2410"); grass(fg, r, 134, 18, "#1a2410");
  },

  /** Enlil conduz a barca de junco por correntes invisíveis, rosto voltado para trás; do mar agitado à lagoa espelhada na névoa. */
  "A Travessia": L => {
    const { b, gb, s, fg, f } = L;
    b.grad(0, 0, W, 90, "#6A7A88", "#E8ECEF", 6);
    for (let y = 90; y < H; y++) for (let x = 0; x < W; x++) {
      const calm = x > 44, t = (y - 90) / 70;
      const c = calm ? (((x + y) % 7 === 0 && y % 3 === 0) ? "#FFFFFF" : t < 0.5 ? "#C8D4DC" : "#A8B8C4") : ((x + y * 2 + f * 3) % 9 < 3 ? "#E8ECEF" : (y + (x >> 2) + f) % 4 < 2 ? "#3A5A6A" : "#2A4A5A");
      b.px(x, y, c);
    }
    for (let x = 0; x < 44; x += 6) b.poly([[x, 92 + (x % 12 ? 0 : 2)], [x + 3, 86 + SW[(x + f) % 4]!], [x + 6, 92]], "#E8ECEF");
    mist(b, 70, 5, "#FFFFFF", 0.35, f); mist(b, 96, 4, "#FFFFFF", 0.3, f);

    // Barca esguia de junco com pontas curvas; reflexo na lagoa calma.
    const hy = 112;
    s.poly([[18, hy - 10], [22, hy - 2], [30, hy + 3], [60, hy + 3], [70, hy - 2], [74, hy - 12], [70, hy - 6], [60, hy], [30, hy], [22, hy - 5]], "#C8A860");
    for (const x of [26, 34, 44, 54, 64]) s.line(x, hy - 1, x, hy + 3, "#8a6a30");
    s.line(24, hy - 1, 68, hy - 1, "#E8D090");
    for (let x = 30; x < 62; x++) gb.px(x, hy + 8 + ((x + f) % 3 === 0 ? 1 : 0), "#C8A860", 0.35);
    human(L, {
      cx: 44, T: 42, B: hy, detail: true, profile: -1, skin: "#C8966A", robe: "#6A7A9A", trim: "#DDA15E", pattern: "scales", patternCol: "#8A9ABA",
      beard: "#1a1410", beardLong: true, hair: "#1a1410", head: "crown", crownCol: "#DDA15E", gem: "#62B6CB", armR: "hold", armL: "down",
      front: (L, { cx, T, B }, h) => {
        const s = L.s, hy2 = T + 7;
        for (let k = 0; k < 3; k++) { s.line(cx - 6, hy2 - 8 + k * 2, cx - 9, hy2 - 10 + k * 3, "#DDA15E"); s.line(cx + 6, hy2 - 8 + k * 2, cx + 9, hy2 - 10 + k * 3, "#DDA15E"); }
        for (let y = T + 40; y < B - 2; y += 4) for (let x = -10; x <= 10; x += 3) s.px(cx + x, y, "#E8ECEF", 0.5);
        const [x, y] = h.R; s.line(x - 4, y + 36, x + 6, y - 30, "#6a4a2a", 1, 2);
      },
    });
    gusts(L, 12, 40, 110, "#FFFFFF", 0.5, 7);
    fg.rect(0, 136, W, 2, "#8A98A4");
  },

  /** A Morrígan no manto de penas de corvo, três espadas cravadas formando a jaula ilusória; pântano cinzento e corvos nos galhos. */
  "A Armadilha": L => {
    const { b, gb, s, gf, fg, f } = L, p = pulse(f);
    b.grad(0, 0, W, 110, "#1a1c22", "#5a6068", 6);
    const branch = (x: number, y: number, sg: 1 | -1) => {
      b.line(x, 118, x + sg * 2, y, "#14161a", 1, 3);
      b.line(x + sg * 2, y + 14, x + sg * 16, y + 4, "#14161a", 1, 2); b.line(x + sg * 10, y + 8, x + sg * 14, y - 2, "#14161a");
      b.line(x + sg * 2, y + 4, x - sg * 8, y - 6, "#14161a", 1, 2);
    };
    branch(8, 40, 1); branch(82, 34, -1);
    raven(b, 22, 50, 1, f); raven(b, 68, 44, -1, ((f + 1) % 4) as 0 | 1 | 2 | 3); raven(b, 4, 36, 1, ((f + 2) % 4) as 0 | 1 | 2 | 3);
    b.grad(0, 110, W, H - 110, "#3a4038", "#1a1e18", 3);
    for (let y = 112; y < 132; y += 3) for (let x = (y * 5 + f * 2) % 13; x < W; x += 13) b.line(x, y, x + 4, y, "#6a7068", 0.5);
    mist(b, 88, 5, "#9AA0A8", 0.3, f);

    human(L, {
      T: 44, B: 128, detail: true, skin: "#D0D0D8", robe: "#14141c", trim: "#3A4A7A", pattern: "scales", patternCol: "#2A3050",
      head: "hood", hoodCol: "#101018", eye: "#8A1A2A", lips: "#4a2a3a", armL: "open", armR: "open",
      back: (L, { cx, T, B }) => {
        const s = L.s, w = SW[L.f];
        s.poly([[cx - 9, T + 10], [cx + 9, T + 10], [cx + 24 + w, B], [cx - 24 + w, B]], "#0a0a12");
        for (let y = T + 16; y < B; y += 4) for (let x = -22; x <= 22; x += 4) { const t = (y - T) / (B - T); if (Math.abs(x) < 9 + 15 * t) s.px(cx + x + w * t + ((y / 4) % 2) * 2, y, "#2A3050"); }
      },
    });
    // Três espadas cravadas e as barras de névoa da jaula.
    for (const [x, y] of [[14, 126], [76, 126], [45, 136]] as const) {
      s.rect(x, y - 24, 2, 22, "#C8D0D8"); s.rect(x, y - 24, 1, 22, "#FFFFFF"); s.rect(x - 3, y - 26, 8, 2, "#8a8a92"); s.rect(x, y - 30, 2, 4, "#3a2a1a"); s.circ(x + 1, y - 31, 1.5, "#8a8a92");
      gf.blob(x + 1, y - 14, 3, 12, "#BEC8FF", 1, 0.15 + p * 0.05);
    }
    for (let k = 0; k < 7; k++) { const x = 12 + k * 11; for (let y = 40; y < 128; y += 2) if (bay(x, y + f) < 0.45) gb.px(x + Math.round(Math.sin(y * 0.1 + k) * 1), y, "#C8D0D8", 0.35); }
    for (let k = 0; k < 4; k++) { const y = 70 + k * 16; for (let x = 10; x < 80; x += 3) if ((x + k + f) % 5 < 2) gb.px(x, y + Math.round(Math.sin(x * 0.3) * 2), "#C8D0D8", 0.3); }
    for (let i = 0; i < 6; i++) { const x = 4 + i * 16; fg.line(x, 138, x + SW[(i + f) % 4]!, 126, "#0e100c"); fg.line(x + 2, 138, x + 3, 128, "#0e100c"); }
  },

  /** Hel, metade bela e metade cadavérica, com a foice gasta, olha impassível para baixo; precipício congelado sob tempestade de chumbo. */
  "O Abismo": L => {
    const { b, gb, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, H, "#2a2e36", "#0a0c10", 6);
    for (let i = 0; i < 7; i++) b.blob(((i * 19 + f * 2) % 110) - 10, 10 + (i % 3) * 10, 18, 7, i % 2 ? "#3a3e46" : "#4a4e56", 1.1, 0.9);
    if (f === 2) { bolt(b, rng(8), 70, 14, 60, "#C8D0E0", 0.8); gb.blob(70, 30, 16, 20, "#C8D0E0", 1, 0.2); }
    // Beira do precipício de gelo com pingentes e o abismo à direita.
    b.poly([[0, 104], [58, 100], [64, 106], [62, H], [0, H]], "#8A9AA8"); b.poly([[0, 104], [58, 100], [60, 103], [0, 108]], "#D8E4EC");
    for (let x = 10; x < 60; x += 5) b.poly([[x, 108], [x + 2, 108], [x + 1, 114 + ((x * 3) % 6)]], "#BEE9E8");
    b.grad(64, 104, 26, H - 104, "#101418", "#000000", 4);
    for (let y = 110; y < H; y += 4) b.line(0, y, 60, y + 1, "#6A7A88", 0.5);
    for (const [x, a] of [[8, 0.3], [18, -0.4], [52, 0.5]] as const) { b.line(x, 104, x + Math.sin(a) * 14, 104 - Math.cos(a) * 14, "#5a4a3a"); b.px(x + Math.sin(a) * 14, 103 - Math.cos(a) * 14, "#8A949E"); }
    particles(gf, r, 26, "#FFFFFF", f, 1, 0, 132, 3, 0.8);

    human(L, {
      T: 40, B: 102, detail: true, skin: "#E8E0E0", robe: "#1a1a24", trim: "#6A7A88", pattern: "diamonds", patternCol: "#2a2a36",
      hairLong: true, hairLen: 34, hair: "#0a0a10", head: "half", eye: "#3A4A6A", armR: "hold", r: "scythe", armL: "down",
      back: (L, { cx, T, B }) => { L.s.poly([[cx - 10, T + 14], [cx, T + 14], [cx, B], [cx - 18 + SW[L.f], B]], "#3a3a44"); },
      front: (L, { cx, T }) => {
        const s = L.s, hy = T + 7;
        s.rect(cx - 6, hy - 8, 13, 2, "#4a4a52"); for (const dx of [-5, -1, 3]) s.poly([[cx + dx, hy - 8], [cx + dx + 1, hy - 12], [cx + dx + 2, hy - 8]], "#4a4a52");
        s.px(cx - 2, hy + 1, "#3A4A6A"); s.px(cx + 2, hy + 1, "#8A1A2A");
        for (let y = T + 18; y < T + 60; y += 4) { s.px(cx + 3, y, "#B8B0A8"); s.px(cx + 5, y + 1, "#B8B0A8"); }
      },
    });
    gb.blob(45, 60, 12, 16, "#8A9AB8", 1, 0.1 + p * 0.03);
    for (let i = 0; i < 5; i++) { const x = 4 + i * 11; fg.poly([[x, 138], [x + 3, 130 - (i % 2) * 3], [x + 6, 138]], "#1a1e24"); }
    fg.rect(0, 136, W, 2, "#0a0c10");
  },

  /** Fujin esmeralda de cabelos espetados carrega o saco de ventos no alto de uma nuvem de tempestade; vendavais em espiral. */
  "O Desafiante": L => {
    const { b, gf, fg, f } = L, p = pulse(f);
    b.grad(0, 0, W, H, "#2a3240", "#6A7888", 6);
    for (const [x, y, rr] of [[14, 30, 9], [74, 22, 11], [20, 80, 8], [78, 74, 10], [50, 16, 6]] as const) spiral(L, x, y, rr, "#C8D0D8", 0.7);
    for (let k = 0; k < 6; k++) b.blob(k * 18, 50 + (k % 2) * 10, 16, 5, "#4a5462", 1, 0.6);
    for (let k = 0; k < 9; k++) { b.circ(k * 11, 116 + (k % 2) * 3, 12, k % 2 ? "#C8CCD4" : "#B0B6C0"); b.circ(k * 11 - 3, 112 + (k % 2) * 3, 6, "#E0E4EA"); }
    b.grad(0, 124, W, H - 124, "#9AA0AA", "#5A606A", 3);
    if (f === 1 || f === 3) { bolt(b, rng(90 + f), 8 + f * 14, 60, 104, "#E8ECFF", 0.9); }

    human(L, {
      T: 46, B: 118, tunic: true, detail: true, skin: "#3AA060", legs: "#3AA060", robe: "#E8C040", trim: "#1a1a1a", pattern: "stripes", patternCol: "#1a1a1a",
      bare: true, bareArms: true, head: "spiky", hair: "#C8D0D8", eye: "#FFD34E", eyeGlow: "#FFD34E", brow: "#1a3a1a", armL: "up", armR: "up",
      back: (L, { cx, T }) => {
        // O saco de ventos: pano claro que se arqueia por cima dos ombros, pronto para ser desatado.
        const s = L.s, w = SW[L.f];
        for (let t = 0; t <= 24; t++) { const an = Math.PI * (t / 24), x = cx + Math.cos(an) * 30, y = T + 6 - Math.sin(an) * 18 + (t % 3 === 0 ? w : 0); s.circ(x, y, 6 - Math.abs(t - 12) * 0.12, "#DCE4EC"); }
        for (let t = 2; t <= 22; t += 4) { const an = Math.PI * (t / 24); s.px(cx + Math.cos(an) * 30, T + 3 - Math.sin(an) * 18, "#A8B4C0"); }
        s.line(cx + 30, T + 10, cx + 36 + w * 2, T + 22, "#E8C040", 1, 2); s.line(cx - 30, T + 10, cx - 36 - w * 2, T + 20, "#E8C040", 1, 2);
        L.gb.blob(cx, T - 6, 34, 14, "#FFFFFF", 1, 0.12);
      },
      front: (L, { cx, T }) => {
        const s = L.s, hy = T + 7;
        s.px(cx - 2, hy + 4, "#FFFFFF"); s.px(cx + 2, hy + 4, "#FFFFFF"); s.line(cx - 2, hy + 3, cx + 2, hy + 3, "#1a2a1a");
        s.line(cx - 5, T + 20, cx - 2, T + 26, "#2A8048"); s.line(cx + 5, T + 20, cx + 2, T + 26, "#2A8048");
        for (let x = -9; x <= 9; x += 3) s.px(cx + x, T + 36 + ((x / 3) % 2), "#8a6a20");
      },
    });
    gusts(L, 16, 20, 126, "#E8ECEF", 0.55, 12);
    gf.blob(45, 40, 30, 16, "#FFFFFF", 1, 0.06 + p * 0.03);
    for (let k = 0; k < 6; k++) fg.circ(k * 17, 136, 8, k % 2 ? "#8A909A" : "#7A808A");
  },

  /** Iansã com o eruexim de crina prateada e a espada de cobre, olhos de tempestade; céu partido entre raios e o olho calmo do furacão. */
  "O Soberano do Ar": L => {
    const { b, gb, gf, fg, f } = L, p = pulse(f);
    for (let y = 0; y < 120; y++) for (let x = 0; x < W; x++) {
      const calm = Math.hypot(x - 64, (y - 40) * 1.1) < 22;
      b.px(x, y, calm ? (y < 40 ? "#8ECAE6" : "#A8D8EE") : x + (y - 60) * 0.3 < 46 ? (y % 6 < 3 ? "#1a1e2e" : "#22283a") : "#3a4a6a");
    }
    for (let t = 0; t < 60; t++) { const an = t * 0.35 + f * 0.25, rr = 22 + t * 0.5; b.px(64 + Math.cos(an) * rr, 40 + Math.sin(an) * rr * 0.8, "#C8D8E8", 0.6); }
    gb.blob(64, 40, 18, 16, "#FFFFFF", 1, 0.2 + p * 0.05);
    bolt(b, rng(60 + f), 8 + f * 6, 4, 100, "#FFFFFF"); if (f % 2) bolt(b, rng(80 + f), 24 - f * 3, 10, 80, "#C8D0FF");
    gb.blob(12 + f * 6, 50, 14, 30, "#C8D0FF", 1, 0.15);
    for (let k = 0; k < 10; k++) b.circ(k * 10, 104 + (k % 2) * 2, 8, k % 2 ? "#4a5470" : "#3a4460");
    // Búfalos correndo em silhueta sobre as nuvens.
    for (let k = 0; k < 3; k++) {
      const x = ((k * 32 + f * 5) % 110) - 10, y = 99 + (k % 2) * 3;
      b.ell(x, y, 7, 3.5, "#07080e"); b.circ(x + 7, y - 1, 3, "#07080e"); b.line(x + 8, y - 4, x + 11, y - 6, "#07080e"); b.line(x + 6, y - 4, x + 4, y - 7, "#07080e");
      for (const dx of [-5, -2, 3, 5]) b.line(x + dx, y + 3, x + dx + ((f + k + dx) % 2 ? 1 : -1), y + 7, "#07080e");
    }
    b.grad(0, 112, W, H - 112, "#2a2e40", "#12141e", 3);

    human(L, {
      T: 42, B: 128, detail: true, skin: "#5A3424", robe: "#8A1A2A", trim: "#F4F0E8", pattern: "diamonds", patternCol: "#B83040",
      hairLong: true, hairLen: 30, hair: "#0a0a0a", head: "crown", crownCol: "#B87333", gem: "#FFFFFF", eye: "#8ECAE6", eyeGlow: "#8ECAE6",
      necklace: "#F4F0E8", bracelets: "#B87333", earrings: "#B87333", armL: "up", l: "eruexim", armR: "up", r: "coppersword",
      back: (L, { cx, T, B }) => {
        const w = SW[L.f] * 2;
        L.s.poly([[cx - 9, T + 15], [cx + 9, T + 15], [cx + 24 + w, B - 6], [cx + 14 + w, B], [cx - 16 + w, B], [cx - 26 + w, B - 8]], "#5A0A18");
        L.s.line(cx - 26 + w, B - 8, cx - 9, T + 16, "#B83040");
      },
      front: (L, { cx, T }) => {
        const s = L.s, hy = T + 7;
        for (const dx of [-5, -3, -1, 1, 3, 5]) { s.px(cx + dx, hy - 4, "#F4F0E8"); if (Math.abs(dx) > 2) s.px(cx + dx, hy - 2, "#B83040"); }
      },
    });
    gusts(L, 14, 30, 124, "#FFFFFF", 0.45, 11);
    gf.blob(45, 50, 8, 6, "#8ECAE6", 1, 0.2 + p * 0.1);
    for (let k = 0; k < 6; k++) fg.circ(k * 17 + 4, 138, 7, "#1a1e2a");
  },
};

