import { Buf, H, SW, W, bay } from "../engine/buf";
import { fish } from "../engine/creatures";
import { human } from "../engine/figure";
import { withSprite, type ArtFn } from "../engine/layers";
import { grass, hills, particles, rocks, stars, waves } from "../engine/primitives";

export const AGUA_ART: Record<string, ArtFn> = {
  "O Vínculo": L => {
    const { b, s, fg, r, f } = L;
    b.grad(0, 0, W, H, "#0e3040", "#3a8a9a", 6);
    for (let i = 0; i < 6; i++) {
      const x = 6 + i * 16;
      b.line(x, 0, x + 2, 18, "#2a5a3a", 1, 2);
      for (let k = 0; k < 6; k++) b.line(x + k * 2 - 5, 10, x + k * 2 - 6, 34 + ((k * 7) % 12), k % 2 ? "#1e5a3a" : "#2A7A4A");
    }
    for (let k = 0; k < 4; k++) b.line(10 + k * 20, 0, 30 + k * 20, 60, "#FFF3B0", 0.12);
    b.grad(0, 108, W, 18, "#62B6CB", "#1B4965", 3);
    for (let i = 0; i < 8; i++) b.rect(((r() * W + f * 4) | 0) % W, 110 + ((r() * 14) | 0), 4, 1, "#FFFFFF", 0.7);
    b.grad(0, 126, W, H - 126, "#2a3a2a", "#1a2418", 3);
    human(L, { T: 44, B: 128, skin: "#6B4226", robe: "#E8B923", trim: "#FFF0A0", hair: "#1a0e08", head: "veil", veil: "#BEE9E8", armL: "fwd", armR: "fwd", l: "mirror" });
    const a = (f * Math.PI) / 4;
    fish(s, 45 + Math.cos(a) * 6, 62 - Math.abs(Math.sin(a)) * 6, 1, "#FFD34E");
    fish(s, 45 - Math.cos(a) * 6, 60 - Math.abs(Math.cos(a)) * 6, -1, "#F7B020");
    rocks(fg, r, 133, 7, "#0B1A24");
    for (let i = 0; i < 5; i++) fg.px((r() * W) | 0, 131, "#2a6a3a");
  },

  "O Oásis": L => {
    const { b, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#0e3440", "#4a9a8a", 6);
    b.rect(72, 20, 5, 100, "#3a2a1a");
    for (let i = 0; i < 12; i++) { const x = 40 + r() * 50, y = r() * 30; b.circ(x, y, 6 + r() * 5, i % 2 ? "#2a5a3a" : "#1e4a2e"); b.circ(x + 2, y + 3, 1, "#8a5a2a"); }
    b.ell(22, 102, 14, 5, "#6a7078"); b.ell(22, 100, 11, 3, "#62B6CB");
    b.line(22, 99, 22, 86 + SW[f], "#BEE9E8"); b.px(21, 86 + SW[f], "#FFFFFF");
    b.grad(0, 112, W, H - 112, "#1B4965", "#0B1A24", 3);
    for (const [x, y] of [[10, 120], [74, 126], [60, 116]] as const) { b.ell(x, y, 4, 1.5, "#2a7a4a"); b.px(x, y - 1, "#FFD1E3"); }
    human(L, {
      T: 66, B: 128, pose: "seat", skin: "#F0D8C0", robe: "#62B6CB", trim: "#BEE9E8", hairLong: true, hair: "#C05030", armL: "chest", armR: "chest",
      front: (L, { cx, T }) => {
        L.s.ell(cx, T + 48, 5, 3, "#D9DCD6"); L.s.px(cx - 2, T + 47, "#FFFFFF");
        for (let k = 0; k < 3; k++) L.gf.px(cx - 4 + k * 4, T + 52 + ((k + L.f) % 3), "#62B6CB");
      },
    });
    for (let i = 0; i < 4; i++) { const x = 10 + ((i * 23 + f * 5) % 70), y = 40 + ((i * 17) % 40); gf.line(x - 2, y, x + 2, y, "#62F0FF", 0.8); gf.px(x, y - 1, "#BEE9E8"); }
    grass(fg, r, 134, 20, "#06140e");
  },

  "A Saudade": L => {
    const { b, gb, s, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#1a3a52", "#02070c", 7);
    b.poly([[0, 0], [30, 0], [24, 14], [12, 18], [4, 12]], "#D8EEF4"); b.poly([[56, 0], [90, 0], [86, 10], [70, 20], [60, 12]], "#BEE9E8");
    for (let k = 0; k < 3; k++) gb.line(20 + k * 22, 0, 30 + k * 22, 90, "#BEE9E8", 0.12);
    for (const [x, y, d] of [[18, 64, 1], [72, 50, -1]] as const) { b.ell(x, y, 10, 3, "#061420"); b.poly([[x - d * 10, y], [x - d * 15, y - 4], [x - d * 15, y + 4]], "#061420"); }
    b.grad(0, 118, W, H - 118, "#0a1a20", "#02070c", 3);
    for (const [dx, dy] of [[-18, 0], [18, 0], [-14, -20], [14, -22], [0, -30]] as const) {
      s.line(45, 110, 45 + dx, 82 + dy, "#8A7A7A", 1, 2); s.line(45 + dx, 82 + dy, 45 + dx + (dx > 0 ? 4 : -4), 78 + dy, "#8A7A7A");
    }
    human(L, {
      T: 64, B: 126, pose: "seat", skin: "#9AB0B8", robe: "#1B4965", trim: "#62B6CB", hairLong: true, hairLen: 44, hair: "#050A10", armL: "chest", armR: "chest",
      front: (L, { cx, T }) => {
        const s = L.s;
        s.rect(cx - 7, T + 44, 14, 7, "#5a4a3a"); s.rect(cx - 7, T + 44, 14, 1, "#8a7a5a"); s.px(cx - 3, T + 43, "#FFD1E3"); s.px(cx + 2, T + 43, "#FFFFFF");
      },
    });
    particles(gf, r, 12, "#BEE9E8", f, -1, 20, 130, 3);
    for (let i = 0; i < 6; i++) { const x = (r() * W) | 0; fg.line(x, 137, x - 2, 128, "#1a1414"); fg.line(x, 132, x + 3, 127, "#1a1414"); }
    fg.rect(0, 134, W, 4, "#040a0e");
  },

  "A Miragem": L => {
    const { b, s, gf, fg, f } = L;
    b.grad(0, 0, W, H, "#7A8A98", "#D8D2C4", 6);
    waves(b, 94, 112, "#A8B0B8", "#E8ECEF", f, 2);
    b.grad(0, 112, W, H - 112, "#C8B890", "#A89870", 4);
    ([[10, 104], [76, 106]] as const).forEach(([x, y], i) => {
      b.rect(x - 5, y, 11, 10, "#D8C8A0"); b.rect(x - 3, y - 6, 7, 6, "#D8C8A0"); b.rect(x - 3, y - 8, 2, 2, "#D8C8A0"); b.rect(x + 1, y - 8, 2, 2, "#D8C8A0");
      b.rect(x + (i ? -5 : 3), y + 4, 3, 6, "#A89870"); b.px(x, y + 11 + f, "#C8B890");
    });
    const sheet = new Buf();
    human(withSprite(L, sheet), { T: 42, B: 128, skin: "#B09080", robe: "#4A6A7A", trim: "#8AB0C0", hair: "#E8E8E8", beard: "#E8E8E8", beardLong: true, armR: "hold", r: "trident", armL: "down" });
    // O corpo de Proteu se desfaz em névoa da cintura para baixo.
    const y0 = 90;
    for (let y = y0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (!sheet.d[i + 3]) continue;
      if (bay(x + f, y) < (y - y0) / 40) { sheet.d[i + 3] = 0; if (bay(x, y + f) < 0.3) gf.px(x, y, "#E8ECEF", 0.5); }
    }
    s.over(sheet);
    hills(fg, 136, 4, 0.2, f, "#8a7a5a");
  },

  "A Plenitude": L => {
    const { b, gf, fg, r, f } = L;
    b.grad(0, 0, W, 96, "#040820", "#1B4965", 6); stars(b, r, 30, 90, f);
    b.grad(0, 96, W, 30, "#1B4965", "#0B1A24", 3);
    for (let y = 118; y < 128; y += 2) for (let x = 0; x < W; x++) if ((x + y * 2 + f * 3) % 9 < 4) b.px(x, y, y % 4 ? "#BEE9E8" : "#FFFFFF");
    b.grad(0, 126, W, H - 126, "#D8C8A0", "#A89870", 3);
    const hands = human(L, { T: 42, B: 130, skin: "#8a5a3a", robe: "#F8FBFF", trim: "#62B6CB", hairLong: true, hair: "#0a0a0a", head: "crown", crownCol: "#E0E8F0", gem: "#62B6CB", armL: "open", armR: "open" });
    for (const h of [hands.L, hands.R]) {
      for (let k = 0; k < 4; k++) gf.px(h[0], h[1] + 3 + ((k * 5 + f * 2) % 18), "#FFFFFF");
      gf.blob(h[0], h[1], 4, 4, "#BEE9E8", 1, 0.3);
    }
    for (let x = 0; x < W; x += 2) fg.px(x, 135 - ((x + f) % 3 === 0 ? 1 : 0), "#FFFFFF", 0.8);
  },

  "O Sonhador": L => {
    const { b, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#14223a", "#6A8AB0", 6);
    const bridgeY = (x: number) => Math.round(84 + Math.pow((x - 45) / 45, 2) * 10);
    for (let x = 0; x < W; x++) { const y = bridgeY(x); b.rect(x, y, 1, 3, "#D03020"); b.px(x, y - 5, "#D03020"); }
    for (const x of [8, 26, 64, 82]) { const y = bridgeY(x); b.rect(x, y - 5, 2, 5, "#D03020"); b.rect(x, y + 3, 2, 16, "#8a1a10"); }
    waves(b, 104, H, "#1B4965", "#BEE9E8", f, 3);
    particles(gf, r, 16, "#FFB7D0", f, 1, 0, 130, 3);
    human(L, { T: 42, B: 128, skin: "#E8D0B0", robe: "#2A8A9A", trim: "#BEE9E8", hair: "#1a4a5a", hairLong: true, head: "horns", hornCol: "#FF8060", armR: "fwd", r: "jewel" });
    for (let x = 0; x < W; x += 3) fg.px(x, 133 + ((x + f) % 2), "#FFFFFF", 0.8);
  },

  "O Guardião das Marés": L => {
    const { b, gb, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#0E4A6A", "#020E18", 6);
    for (let k = 0; k < 5; k++) gb.line(8 + k * 18 + f, 0, k * 18 - 6 + f, 110, "#BEE9E8", 0.12);
    for (const [c, x] of [["#E07A5F", 10], ["#FFB7D0", 26], ["#62B6CB", 64], ["#E07A5F", 80]] as const) {
      b.line(x, 126, x, 108, c, 1, 2); b.line(x, 116, x - 4, 110, c); b.line(x, 114, x + 4, 106, c);
    }
    b.grad(0, 124, W, H - 124, "#0a2030", "#040c14", 3);
    for (let i = 0; i < 4; i++) {
      const x = ((i * 27 + f * 3) % 86) + 2, y = 70 + ((i * 19) % 40);
      b.ell(x, y, 3, 1.5, "#061018"); gf.px(x + 3, y - 2, "#BEFFFF"); gf.blob(x + 3, y - 2, 3, 3, "#62F0FF", 1, 0.3);
    }
    human(L, {
      T: 44, B: 130, skin: "#5A3A2A", robe: "#1B4965", trim: "#BEE9E8", hairLong: true, hair: "#050505", armL: "fwd", armR: "fwd", l: "mirror", r: "comb",
      front: (L, { cx, T }) => {
        const s = L.s;
        const pts: [number, number][] = [[cx - 18, T + 34], [cx - 12, T + 22], [cx - 8, T + 15], [cx, T + 13], [cx + 8, T + 15], [cx + 13, T + 24], [cx + 17, T + 32]];
        for (let i = 0; i < pts.length - 1; i++) s.line(pts[i]![0], pts[i]![1], pts[i + 1]![0], pts[i + 1]![1], "#C8D0D8", 1, 3);
        pts.forEach((p, i) => { if (i % 2) s.px(p[0], p[1], "#8A949E"); });
        s.ell(cx + 19, T + 33, 3, 2, "#C8D0D8"); s.px(cx + 20, T + 32, "#1a1a1a");
      },
    });
    for (let i = 0; i < 7; i++) { const x = (r() * W) | 0; fg.line(x, 137, x, 127, "#04101a", 1, 2); fg.line(x, 131, x + 3, 127, "#04101a"); }
  },
};
