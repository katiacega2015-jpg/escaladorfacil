import { H, SW, W, bay, rng } from "../engine/buf";
import { owl, raven } from "../engine/creatures";
import { human } from "../engine/figure";
import type { ArtFn } from "../engine/layers";
import { bolt, cloud, grass, mist, particles, pillar, rocks, splitSky, waves } from "../engine/primitives";

export const AR_ART: Record<string, ArtFn> = {
  "A Lucidez": L => {
    const { b, s, fg, r, f } = L;
    b.grad(0, 0, W, H, "#8A9098", "#C8CCD0", 6);
    b.blob(74, 16, 26, 20, "#4AB0F0", 1.6); b.blob(74, 16, 14, 10, "#8AD8FF", 1.4);
    b.poly([[0, 0], [14, 0], [20, 40], [12, 80], [18, 118], [0, 118]], "#5A5048"); b.poly([[90, 40], [80, 60], [84, 90], [76, 118], [90, 118]], "#5A5048");
    for (let y = 10; y < 118; y += 9) { b.line(0, y, 16, y + 2, "#6a6058"); b.line(78, y + 30, 90, y + 28, "#6a6058"); }
    for (let k = 0; k < 5; k++) for (let x = 0; x < W; x++) if ((x - f * 3 + k * 11) % 17 < 6) b.px(x, 40 + k * 12, "#E8ECEF", 0.35);
    b.grad(0, 118, W, H - 118, "#6a6058", "#3a3430", 3);
    human(L, { T: 44, B: 130, skin: "#F0D8C0", robe: "#D9DCD6", trim: "#8ECAE6", armor: "#C8D0D8", head: "helmet", helm: "#C8D0D8", crest: "#2A4A8A", hair: "#3a2a1a", armR: "hold", r: "spearD", armL: "down" });
    owl(s, 16, 30, f);
    rocks(fg, r, 134, 7, "#2A2622");
  },

  "A Trégua": L => {
    const { b, fg, r } = L;
    b.grad(0, 0, W, H, "#3A3A5A", "#E8A080", 7);
    cloud(b, 8, 30, 24, "#F0D8D0", "#C8A0A0"); cloud(b, 56, 20, 28, "#F0D8D0", "#C8A0A0"); cloud(b, 36, 52, 16, "#E0C0C0", "#B89090");
    pillar(b, 8, 70, 116, 7, "#B8B0A8", "#E0D8D0", "#7A7068"); b.poly([[7, 70], [16, 70], [14, 64], [10, 67]], "#B8B0A8");
    pillar(b, 74, 82, 116, 7, "#B8B0A8", "#E0D8D0", "#7A7068");
    b.grad(0, 116, W, H - 116, "#4A6A3A", "#2A4020", 3);
    human(L, {
      T: 44, B: 130, skin: "#F0D8C0", robe: "#D9DCD6", trim: "#8ECAE6", hair: "#3a2a1a", head: "templewings", armL: "fwd", l: "poppy", armR: "hold",
      front: (L, { cx, T }) => { L.s.rect(cx + 2, T + 34, 20, 2, "#5A4A3A"); L.s.rect(cx + 1, T + 33, 3, 4, "#F7D070"); L.gf.px(cx + 10, T + 32 + L.f, "#BEE9E8"); },
    });
    grass(fg, r, 134, 30, "#1a2a12");
  },

  "A Travessia": L => {
    const { b, s, gf, f } = L;
    b.grad(0, 0, W, H, "#B8C0C8", "#E8ECEF", 6);
    waves(b, 80, 98, "#3A5060", "#FFFFFF", f, 3);
    b.grad(0, 98, W, H - 98, "#B0C8D0", "#8AA8B8", 4);
    for (let y = 102; y < H; y += 4) b.line(4, y, 86, y, "#D0E0E8", 0.4);
    mist(b, 60, 4, "#FFFFFF", 0.35, f);
    s.poly([[12, 112], [78, 112], [72, 120], [18, 120]], "#C8A860");
    for (let x = 16; x < 76; x += 4) s.line(x, 112, x + 2, 120, "#8A7040");
    s.line(12, 112, 8, 104, "#C8A860", 1, 2); s.line(78, 112, 82, 104, "#C8A860", 1, 2);
    human(L, { T: 26, B: 111, skin: "#B08060", robe: "#8ECAE6", trim: "#F8F9FA", hair: "#2a1a10", beard: "#2a1a10", armL: "fwd", armR: "fwd", r: "staff", noFeet: true });
    gf.poly([[18, 122], [72, 122], [78, 128], [12, 128]], "#C8A860", 0.25);
  },

  "A Armadilha": L => {
    const { b, s, fg, r, f } = L;
    b.grad(0, 0, W, H, "#26292C", "#5A6064", 6);
    const branch = (pts: [number, number][]) => { for (let i = 0; i < pts.length - 1; i++) b.line(pts[i]![0], pts[i]![1], pts[i + 1]![0], pts[i + 1]![1], "#0a0a0c", 1, 2); };
    branch([[0, 30], [14, 36], [22, 28], [30, 34]]); branch([[90, 20], [74, 30], [66, 24], [60, 32]]); branch([[0, 70], [10, 64], [16, 72]]);
    raven(b, 22, 26, 1, f); raven(b, 66, 22, -1, ((f + 2) % 4) as typeof f); raven(b, 12, 62, 1, ((f + 1) % 4) as typeof f);
    // Névoa formando grades ilusórias.
    for (let x = 6; x < W; x += 10) for (let y = 40; y < 118; y++) if (bay(x + f, y) < 0.5) b.px(x, y, "#8A9098", 0.25);
    b.grad(0, 112, W, H - 112, "#2a3230", "#141a18", 3);
    b.rect(44, 86, 2, 26, "#9AA4AE"); b.rect(41, 90, 8, 2, "#6a6a70");
    human(L, {
      T: 44, B: 130, skin: "#D8D0C8", robe: "#16161E", trim: "#3A4A6A", hairLong: true, hair: "#050508", cape: "#0E0E14", armL: "down", armR: "down",
      back: (L, { cx, T, B }) => { for (let y = T + 18; y < B; y += 4) for (let x = cx - 16; x <= cx + 16; x += 4) L.s.px(x + ((y / 4) % 2) * 2, y, "#2a3a5a"); },
    });
    for (const [x, y] of [[20, 112], [70, 114]] as const) {
      s.rect(x, y, 2, 20, "#9AA4AE"); s.rect(x, y, 1, 20, "#E0E6EE"); s.rect(x - 3, y - 2, 8, 2, "#6a6a70"); s.rect(x, y - 6, 2, 4, "#3a2a1a");
    }
    grass(fg, r, 134, 20, "#0a100e");
  },

  "O Abismo": L => {
    const { b, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#1E222A", "#5A6070", 6);
    for (let i = 0; i < 8; i++) b.blob((r() * W) | 0, (r() * 50) | 0, 18, 7, "#3A3E48", 1.3);
    b.grad(62, 100, 28, H - 100, "#0a0c10", "#000000", 3);
    b.poly([[0, 100], [64, 100], [68, 110], [62, 137], [0, 137]], "#A8C0D0");
    b.line(0, 100, 64, 100, "#E0F0F8"); b.line(64, 100, 68, 110, "#E0F0F8");
    for (const [x0, y0, x1, y1] of [[10, 100, 14, 86], [26, 100, 22, 88], [54, 100, 58, 90]] as const) { b.line(x0, y0, x1, y1, "#5A4A3A"); b.px(x1, y1, "#8a8a8a"); }
    human(L, { cx: 40, T: 36, B: 100, head: "half", skin: "#E8D8D0", robe: "#2A2A3A", trim: "#8A9AA8", hairLong: true, hair: "#0a0a0a", armR: "hold", r: "scythe", armL: "down" });
    particles(gf, r, 18, "#FFFFFF", f, 1, 0, 136, 4, 0.8);
    fg.rect(0, 128, 62, 10, "#8AA0B0");
  },

  "O Desafiante": L => {
    const { b, fg, f } = L;
    b.grad(0, 0, W, H, "#2A3040", "#6A7890", 6);
    ([[16, 30], [74, 40], [20, 80], [70, 90]] as const).forEach(([cx, cy]) => {
      for (let t = 0; t < 26; t++) { const an = t * 0.35 + f * 0.5, rad = t * 0.35; b.px(cx + Math.cos(an) * rad, cy + Math.sin(an) * rad, "#A8B4C8", 0.7); }
    });
    for (let i = 0; i < 10; i++) b.blob(i * 10, 118 + (i % 3) * 2, 10, 7, i % 2 ? "#C8D0D8" : "#A8B0BC", 1.3);
    b.rect(0, 124, W, H - 124, "#C8D0D8");
    human(L, {
      T: 46, B: 124, tunic: true, skin: "#2A9A5A", robe: "#F4F4F4", trim: "#C8D0D8", legs: "#2A9A5A", bare: true, bareArms: true, head: "spiky", hair: "#0A3A1A", eye: "#FFE066", armL: "up", armR: "up",
      back: (L, { cx, T }) => {
        for (let a = 0; a <= 20; a++) { const an = Math.PI * (1 + a / 20); L.s.circ(cx + Math.cos(an) * 20, T + 10 + Math.sin(an) * 14, 5, a % 4 ? "#A8C8D8" : "#8AB0C0"); }
        L.s.line(cx - 20, T + 10, cx - 24, T + 16, "#6a5a3a"); L.s.line(cx + 20, T + 10, cx + 24, T + 16, "#6a5a3a");
      },
    });
    for (let i = 0; i < 8; i++) fg.circ(i * 12 + ((f * 2) % 6), 136, 5, "#E8EEF2");
  },

  "O Soberano do Ar": L => {
    const { b, fg, f } = L;
    splitSky(b, (x, y) => x - (45 + Math.sin(y * 0.08) * 8), ["#101418", "#2A2E36"], ["#8ECAE6", "#D8EEF8"]);
    bolt(b, rng(11 + f), 14 + f * 4, 0, 100, "#E0F0FF");
    if (f % 2) bolt(b, rng(31 + f), 30, 10, 70, "#BEE9E8");
    for (const [x, y] of [[12, 40], [26, 56], [8, 70]] as const) {
      b.ell(x, y, 6, 3, "#1A1E24"); b.circ(x - 6, y - 1, 2, "#1A1E24"); b.line(x - 7, y - 3, x - 9, y - 5, "#1A1E24");
      b.rect(x - 4, y + 2, 1, 3, "#1A1E24"); b.rect(x + 3, y + 2, 1, 3, "#1A1E24");
    }
    for (let i = 0; i < 8; i++) b.blob(i * 12, 122, 10, 6, i % 2 ? "#C8D0D8" : "#8A94A0", 1.2);
    b.rect(0, 126, W, H - 126, "#6A7480");
    human(L, { T: 44, B: 128, skin: "#5A3A2A", robe: "#7A2A3A", trim: "#B87333", hair: "#0a0a0a", hairLong: true, head: "crown", crownCol: "#B87333", gem: "#62F0FF", eye: "#62F0FF", eyeGlow: "#62F0FF", armL: "fwd", l: "eruexim", armR: "up", r: "coppersword" });
    for (let i = 0; i < 7; i++) fg.circ(i * 14 + SW[f], 137, 6, "#4A5460");
  },
};
