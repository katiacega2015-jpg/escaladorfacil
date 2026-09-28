import { H, SW, W, pulse } from "../engine/buf";
import { bird, wolf } from "../engine/creatures";
import { human } from "../engine/figure";
import type { ArtFn } from "../engine/layers";
import { grass, hills, mountains, pillar, rocks, tree } from "../engine/primitives";

export const TERRA_ART: Record<string, ArtFn> = {
  "A Semente": L => {
    const { b, s, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#8ECAE6", "#F4ECD0", 6);
    mountains(b, r, 84, 10, 32, "#8A9AB0", "#FFFFFF", 10);
    for (let k = 0; k < 6; k++) { const y = 88 + k * 8; b.rect(0, y, W, 8, k % 2 ? "#4A7A3A" : "#6A9A4A"); b.line(0, y, W, y, "#2A4A2A"); }
    // Mãos de argila em concha segurando o broto.
    for (const sg of [-1, 1] as const) {
      const x = 45 + sg * 2;
      s.poly([[x, 122], [x + sg * 22, 122], [x + sg * 26, 112], [x + sg * 20, 100], [x + sg * 8, 104], [x, 110]], "#8A5A3A");
      for (let k = 0; k < 4; k++) s.rect(x + sg * (10 + k * 4) - (sg < 0 ? 3 : 0), 96 + k, 3, 8, "#8A5A3A");
      s.px(x + sg * 14, 114, "#6A6A6A"); s.px(x + sg * 18, 108, "#6A6A6A"); s.px(x + sg * 8, 116, "#6A6A6A");
    }
    s.line(45, 108, 45, 74, "#5AA040", 1, 2); s.line(45, 96, 36, 86, "#5AA040"); s.line(45, 92, 54, 82, "#5AA040"); s.line(45, 86, 38, 78, "#6ABA4A");
    s.ell(45, 68, 3, 7, "#F7D070");
    for (let y = 62; y < 75; y += 2) { s.px(44, y, "#FFE066"); s.px(46, y + 1, "#D8A020"); }
    gf.blob(45, 68, 9, 11, "#FFE066", 1, 0.35 + pulse(f) * 0.08);
    gf.px(47, 76 + f * 2, "#FFE066"); gf.px(47, 77 + f * 2, "#FFF3B0", 0.7);
    fg.rect(0, 128, W, 10, "#3A2412");
    for (let i = 0; i < 10; i++) fg.px((r() * W) | 0, 127, "#3A2412");
  },

  "O Alicerce": L => {
    const { b, s, fg, r, f } = L;
    b.grad(0, 0, W, H, "#E8C890", "#F8E8C0", 6);
    b.poly([[60, 60], [74, 40], [88, 60]], "#C8A060"); b.poly([[4, 64], [16, 48], [28, 64]], "#C8A060");
    pillar(b, 34, 50, 96, 5, "#D8B070", "#F0D8A0", "#A88040"); pillar(b, 50, 62, 96, 5, "#D8B070", "#F0D8A0", "#A88040");
    b.line(36, 48, 60, 40, "#6a5a3a");
    // Geb adormecido: o corpo do gigante forma as colinas.
    s.poly([[0, 137], [0, 112], [8, 104], [20, 100], [28, 104], [40, 98], [60, 100], [72, 94], [86, 100], [90, 108], [90, 137]], "#5A7A3A");
    s.poly([[14, 102], [20, 96], [26, 102], [24, 106], [16, 106]], "#6A8A4A"); s.line(17, 101, 21, 101, "#2a3a1a"); s.px(12, 104, "#5A7A3A");
    for (let x = 4; x < 88; x += 3) s.px(x, Math.round(104 - Math.sin(x * 0.12) * 4), "#8ABA5A");
    for (const [x, y] of [[56, 90], [70, 86]] as const) { s.rect(x, y, 3, 8, "#D8B070"); s.rect(x - 1, y - 1, 5, 1, "#F0D8A0"); }
    ([[46, 96], [62, 92], [78, 96]] as const).forEach(([x, y], i) => {
      const bob = (i + f) % 2;
      s.rect(x, y - 4 + bob, 2, 4, "#3a2a1a"); s.px(x, y - 5 + bob, "#E0B080"); s.rect(x + 2, y - 4, 2, 2, "#D8B070");
    });
    rocks(fg, r, 135, 6, "#6a5030");
  },

  "A Providência": L => {
    const { b, s, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#2A1E14", "#E0A050", 6);
    tree(b, 10, 112, 40, "#4A3A2A", "#6A7A5A", 12); tree(b, 82, 112, 44, "#4A3A2A", "#6A7A5A", 12);
    for (let k = 0; k < 3; k++) b.line(30 + k * 12, 0, 40 + k * 12, 80, "#FFE0A0", 0.12);
    b.grad(0, 112, W, H - 112, "#5A4A2A", "#2A2214", 3);
    const hands = human(L, {
      T: 44, B: 130, skin: "#E0B890", robe: "#6B4A2A", trim: "#D8C090", head: "bald", hair: "#6A4A2A", beard: "#6A4A2A", armL: "open", armR: "open", l: "bread",
      front: (L, { cx, T }) => { for (const [dx, dy] of [[-3, 33], [0, 34], [3, 33]] as const) L.s.px(cx + dx, T + dy + 1, "#8a6a3a"); },
    });
    for (const h of [hands.L, hands.R]) { gf.px(h[0], h[1], "#FF2040"); gf.blob(h[0], h[1], 3, 3, "#FF6080", 1, 0.3); }
    bird(s, hands.L[0] - 2, hands.L[1] - 5, "#8A6A4A", f);
    bird(s, hands.R[0] + 1, hands.R[1] - 5, "#F4F4F4", ((f + 1) % 4) as typeof f);
    bird(s, hands.R[0] + 6, hands.R[1] - 12 - f, "#8A6A4A", f);
    wolf(s, 24, 134);
    fg.ell(70, 132, 6, 3, "#8a5a2a");
    for (const [c, x] of [["#C8102E", 68], ["#F7D070", 71], ["#8ECF6A", 73]] as const) fg.px(x, 129, c);
    grass(fg, r, 135, 20, "#1a1408");
  },

  "O Ofício": L => {
    const { b, gf, fg, r } = L;
    b.grad(0, 0, W, H, "#0A1E14", "#1E3A24", 6);
    for (let i = 0; i < 7; i++) { const x = (r() * W) | 0, h = 40 + r() * 30; b.poly([[x - 8, 112], [x, 112 - h], [x + 8, 112]], i % 2 ? "#0e2a1a" : "#123420"); }
    b.rect(2, 60, 18, 2, "#4A3020"); b.rect(2, 76, 18, 2, "#4A3020");
    for (const [x, y] of [[5, 56], [9, 54], [14, 57], [6, 72], [12, 70]] as const) b.line(x, y, x, y + 4, "#C8D0D8");
    b.grad(0, 112, W, H - 112, "#2a2a20", "#141410", 3);
    human(L, { cx: 40, T: 44, B: 130, tunic: true, skin: "#3B2418", robe: "#1E3A5A", trim: "#6ADA7A", legs: "#2a2a3a", bare: true, bareArms: true, head: "helmet", helm: "#6A7078", armR: "up", r: "hammer", armL: "hold" });
    fg.poly([[56, 122], [80, 122], [76, 127], [70, 127], [72, 137], [62, 137], [64, 127], [58, 127]], "#2a2a30");
    fg.rect(58, 120, 18, 2, "#FF9A2A"); gf.blob(66, 120, 8, 4, "#FFB020", 1, 0.35);
    for (let k = 0; k < 3; k++) { fg.circ(8 + k * 6, 134, 3, "#1a1a1e"); fg.px(8 + k * 6, 132, "#A8B0B8"); }
  },

  "O Legado": L => {
    const { b, fg } = L;
    b.grad(0, 0, W, 60, "#8ECAE6", "#D8E8F0", 4);
    b.rect(0, 60, W, 56, "#6A7078");
    for (let y = 62; y < 116; y += 5) for (let x = ((y / 5) % 2) * 6; x < W; x += 12) b.rect(x, y, 1, 5, "#4A5058");
    for (let y = 64; y < 116; y += 5) b.line(0, y, W, y, "#5A6068");
    for (let x = 0; x < W; x += 8) b.rect(x, 56, 5, 4, "#6A7078");
    for (const [x, y] of [[10, 96], [80, 96]] as const) { b.rect(x - 7, y, 14, 20, "#8A5A2A"); b.poly([[x - 9, y], [x, y - 8], [x + 9, y]], "#5A3A1A"); b.rect(x - 2, y + 10, 4, 10, "#3a2210"); }
    b.grad(0, 116, W, H - 116, "#8A8070", "#5A5040", 3);
    human(L, {
      T: 42, B: 130, skin: "#E8C8A8", robe: "#386641", trim: "#F7D070", cape: "#F4F4F4", hair: "#D8B060", beard: "#D8B060", beardLong: true, armR: "hold", r: "cornucopia", armL: "down",
      back: (L, { cx, T }) => { for (let k = 0; k < 10; k++) L.s.px(cx - 15 + ((k * 7) % 30), T + 24 + k * 9, "#1a1a1a"); },
    });
    for (const [x, y] of [[14, 132], [76, 132]] as const) { fg.poly([[x - 5, y + 5], [x, y - 8], [x + 5, y + 5]], "#8a6a2a"); fg.line(x, y - 6, x, y + 4, "#DDA15E"); }
  },

  "O Construtor": L => {
    const { b, fg, r, f } = L;
    b.grad(0, 0, W, H, "#9AD0E0", "#E0F0E8", 6);
    hills(b, 84, 16, 0.07, 1, "#6A9A8A"); hills(b, 94, 10, 0.1, 2, "#5A8A6A");
    for (let k = 0; k < 6; k++) {
      const y = 96 + k * 6;
      b.rect(0, y, W, 6, k % 2 ? "#5AA040" : "#8AD0C0");
      if (k % 2 === 0) for (let x = 0; x < W; x += 4) b.px(x + ((k * 3 + f) % 4), y + 2, "#FFFFFF", 0.5);
    }
    b.poly([[40, 137], [50, 137], [48, 96], [44, 96]], "#A09080");
    for (const [x, y] of [[16, 100], [74, 104]] as const) for (let a = 0; a <= 10; a++) { const an = Math.PI * (1 + a / 10); b.px(x + Math.cos(an) * 6, y + Math.sin(an) * 4, "#8a8a8a"); }
    human(L, { T: 44, B: 130, skin: "#E8C098", robe: "#A25A38", trim: "#DDA15E", head: "bald", hair: "#E8E8E8", beard: "#FFFFFF", beardLong: true, smile: true, armL: "hold", l: "staff", armR: "fwd", r: "grain" });
    for (let i = 0; i < 6; i++) fg.ell(38 + ((i * 5) % 16), 133 + (i % 2) * 2, 3, 1.5, "#6a5a4a");
    grass(fg, r, 136, 12, "#2a4a2a");
  },

  "O Soberano da Terra": L => {
    const { b, fg, f } = L;
    b.grad(0, 0, W, H, "#8ECAE6", "#F0E0A0", 6);
    for (const [x, y] of [[12, 70], [78, 74]] as const) { b.rect(x - 5, y, 10, 34, "#A09080"); b.circ(x, y, 5, "#8A7A6A"); b.line(x - 5, y + 8, x + 4, y + 8, "#7a6a5a"); }
    for (const [x, y] of [[30, 90], [60, 92]] as const) { tree(b, x, y + 14, 14, "#4a3020", "#3A6A2A", 7); for (let k = 0; k < 5; k++) b.px(x - 4 + k * 2, y - 2 + (k % 2) * 3, "#C8102E"); }
    b.grad(0, 100, W, H - 100, "#DDA15E", "#A87830", 4);
    for (let x = 0; x < W; x += 2) for (let y = 102; y < 136; y += 5) b.line(x, y, x + SW[(x + f) % 4]!, y - 3, "#F0C070");
    human(L, { T: 42, B: 130, skin: "#E8C098", robe: "#2A4A2A", trim: "#DDA15E", hairLong: true, hair: "#6A3A1A", head: "wheat", armL: "up", l: "torch", armR: "hold", r: "sickle" });
    for (let x = 2; x < W; x += 4) { const sw = SW[(x + f) % 4]!; fg.line(x, 137, x + sw, 126, "#6A4A1A"); fg.px(x + sw, 125, "#8A6A2A"); }
  },
};
