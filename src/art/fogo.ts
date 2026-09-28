import { H, SW, W, pulse, rng } from "../engine/buf";
import { ram } from "../engine/creatures";
import { human } from "../engine/figure";
import type { ArtFn } from "../engine/layers";
import { bolt, flame, particles, rocks } from "../engine/primitives";

export const FOGO_ART: Record<string, ArtFn> = {
  "A Centelha": L => {
    const { b, s, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#14060E", "#E07A5F", 7);
    b.grad(0, 108, W, H - 108, "#2a1e1e", "#120c0c", 4);
    for (let i = 0; i < 8; i++) { const x = (r() * W) | 0, y = 110 + ((r() * 20) | 0); b.line(x, y, x + 6, y + 2, "#3a2a2a"); }
    particles(gf, r, 20, "#FFB020", f, -1, 30, 130, 4); particles(gf, r, 8, "#FFF3B0", f, -1, 40, 120, 6);
    ram(s, 26, 130, "#B87333");
    human(L, { cx: 52, T: 44, B: 130, skin: "#C0302A", robe: "#E07A5F", trim: "#F4F1DE", hair: "#1a0808", head: "twoface", armR: "up", r: "torch" });
    rocks(fg, r, 134, 8, "#0a0606");
  },

  "A Fogueira": L => {
    const { b, gb, gf, fg, f } = L;
    b.grad(0, 0, W, H, "#4A2410", "#1E0E06", 6);
    for (let x = 4; x < W; x += 8) b.line(x, 0, x, 118, "#1A0A04");
    for (let x = 0; x < W; x++) { const y = Math.round(22 + Math.sin(x * 0.2) * 4); if (x % 2 === 0) b.px(x, y, "#DDA15E"); if (x % 6 === 0) b.px(x, y + 1, "#FFD34E"); }
    b.grad(0, 118, W, H - 118, "#3a2010", "#1a0e06", 3);
    gb.blob(45, 118, 40, 30, "#FFB020", 1, 0.3);
    human(L, { T: 60, B: 122, pose: "seat", skin: "#E8C098", robe: "#8A3A1A", trim: "#F4A300", head: "veil", veil: "#F4A300", armL: "fwd", armR: "fwd" });
    fg.ell(45, 131, 18, 5, "#4A4040"); fg.ell(45, 130, 14, 3, "#1a0a04");
    flame(fg, 39, 130, 8, f); flame(fg, 45, 130, 11, f); flame(fg, 51, 130, 8, f);
    gf.blob(45, 122, 14, 10, "#FFB020", 1, 0.35 + pulse(f) * 0.05);
  },

  "A Forja": L => {
    const { b, gb, gf, fg, f } = L;
    b.grad(0, 0, W, H, "#1A0404", "#3A0E0A", 6);
    b.poly([[0, 0], [16, 0], [10, 60], [0, 90]], "#0a0202"); b.poly([[90, 0], [74, 0], [82, 50], [90, 80]], "#0a0202");
    b.rect(0, 100, W, 6, "#FF6020");
    for (let x = 0; x < W; x++) if ((x + f * 3) % 7 < 2) b.px(x, 101 + (x % 3), "#FFD34E");
    gb.blob(45, 103, 50, 10, "#FF6020", 1, 0.35);
    b.grad(0, 106, W, H - 106, "#2a0e0a", "#120402", 3);
    human(L, { cx: 36, T: 42, B: 130, tunic: true, skin: "#B07050", robe: "#5A3A20", trim: "#8a6a4a", legs: "#3a2a1a", bare: true, bareArms: true, beard: "#1a0a04", hair: "#1a0a04", armR: "up", r: "hammer", armL: "hold" });
    fg.poly([[52, 122], [76, 122], [72, 127], [66, 127], [68, 137], [58, 137], [60, 127], [54, 127]], "#3a3a40"); fg.rect(52, 122, 24, 1, "#6a6a70");
    fg.rect(54, 120, 20, 2, "#FF9A2A"); fg.rect(56, 120, 14, 1, "#FFF3B0");
    for (let k = 0; k < 10; k++) { const an = -Math.PI * (k / 9), d = 3 + ((k + f * 3) % 8); gf.px(62 + Math.cos(an) * d * 1.4, 119 + Math.sin(an) * d, k % 2 ? "#FFD34E" : "#FFFFFF"); }
    gf.blob(64, 120, 10, 5, "#FFB020", 1, 0.35);
  },

  "O Ímpeto": L => {
    const { b, fg, r, f } = L;
    b.grad(0, 0, W, H, "#120404", "#5A1A14", 6);
    bolt(b, rng(40 + f), 10 + f * 20, 0, 90, "#FF4A3A");
    if (f % 2) bolt(b, rng(70 + f), 70 - f * 8, 0, 70, "#FF8A6A");
    for (let k = 0; k < 5; k++) b.rect(k * 4, 100 + k * 6, W - k * 8, 6, k % 2 ? "#5a4a44" : "#4a3a34");
    b.grad(0, 130, W, H - 130, "#2a1e1a", "#1a120e", 2);
    human(L, { T: 44, B: 130, skin: "#3B2418", robe: "#9E2A2B", trim: "#FFFFFF", cape: "#7A1A1A", bare: true, bareArms: true, hair: "#0a0a0a", head: "crown", crownCol: "#B87333", gem: "#FFFFFF", armR: "up", r: "axe2", armL: "open" });
    rocks(fg, r, 134, 8, "#0a0404");
  },

  "A Brasa": L => {
    const { b, fg, r, f } = L;
    b.grad(0, 0, W, H, "#2A2020", "#6A5A54", 6);
    for (let i = 0; i < 7; i++) b.blob(((i * 17 + f * 2) % 100) - 5, 20 + i * 12, 14, 6, "#8A8078", 1, 0.6);
    b.grad(0, 114, W, H - 114, "#2a2220", "#140e0c", 3);
    human(L, {
      T: 46, B: 130, skin: "#1E1A1A", robe: "#3A2A24", trim: "#E07A5F", hair: "#6A6A6A", beard: "#8A8A8A", armL: "hold", armR: "hold",
      back: (L, { cx, T }) => {
        for (let k = 0; k < 4; k++) { L.s.line(cx + 4 + k * 3, T + 30, cx + 8 + k * 3, T - 6, "#4a3020", 1, 2); flame(L.s, cx + 8 + k * 3, T - 7, 6, L.f); }
        L.gb.blob(cx + 13, T - 10, 12, 8, "#FFB020", 1, 0.3);
      },
      front: (L, { cx, T }) => {
        for (const [x0, y0, x1, y1] of [[cx - 6, T + 2, cx - 2, T + 10], [cx + 2, T + 20, cx + 6, T + 30], [cx - 4, T + 36, cx + 2, T + 50], [cx - 10, T + 26, cx - 12, T + 36]] as const) {
          L.s.line(x0, y0, x1, y1, "#FF7A1A"); L.gf.line(x0, y0, x1, y1, "#FFB020", 0.4);
        }
      },
    });
    fg.rect(0, 131, W, 6, "#140E0C");
    for (let i = 0; i < 14; i++) { const x = (r() * W) | 0, y = 131 + ((r() * 5) | 0); fg.px(x, y, (i + f) % 3 ? "#FF3A1A" : "#FFB020"); }
  },

  "O Desbravador": L => {
    const { b, gb, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#1E0630", "#6A2A5A", 6);
    b.poly([[10, 110], [38, 40], [52, 40], [84, 110]], "#1a0a14");
    b.line(40, 44, 30, 100, "#FF6020", 1, 2); b.line(50, 44, 62, 104, "#FF6020", 1, 2);
    for (let k = 0; k < 10; k++) { const an = -Math.PI * (0.2 + k * 0.06), d = 6 + ((k * 5 + f * 4) % 18); gf.px(45 + Math.cos(an) * d, 40 + Math.sin(an) * d * 1.6, k % 2 ? "#FFD34E" : "#FF6020"); }
    gb.blob(45, 38, 14, 10, "#FF6020", 1, 0.4);
    b.grad(64, 100, 26, 20, "#1B4965", "#0B1A24", 2); b.blob(74, 98, 10, 5, "#FFFFFF", 1, 0.5);
    b.grad(0, 110, W, H - 110, "#1a0a10", "#0a0408", 3);
    human(L, { cx: 42, T: 44, B: 130, pose: "run", skin: "#A06A4A", robe: "#9E2A2B", trim: "#E07A5F", head: "flamehair", armL: "open", armR: "fwd" });
    rocks(fg, r, 134, 9, "#0A0508");
    for (let i = 0; i < 6; i++) { const x = (r() * W) | 0; fg.line(x, 136, x + 4, 133, "#FF6020"); }
  },

  "O Soberano da Chama": L => {
    const { b, gb, s, fg, f } = L;
    b.grad(0, 0, W, H, "#5A2A06", "#F7C060", 6);
    for (const x of [8, 24, 62, 78]) {
      const o = SW[f];
      b.rect(x + o, 0, 8, 44, "#9E2A2B"); b.rect(x + o, 44, 8, 2, "#F7D070"); b.poly([[x + o, 46], [x + 8 + o, 46], [x + 4 + o, 52]], "#9E2A2B");
    }
    b.grad(0, 112, W, H - 112, "#8a4a10", "#4a2206", 3);
    s.poly([[26, 120], [64, 120], [62, 70], [56, 50], [45, 36], [34, 50], [28, 70]], "#F7D070");
    s.poly([[30, 118], [60, 118], [58, 72], [45, 46], [32, 72]], "#FF9A2A");
    for (let k = 0; k < 5; k++) flame(s, 33 + k * 6, 50 - (k === 2 ? 12 : Math.abs(k - 2) * -4) + Math.abs(k - 2) * 6, 6 + ((k + f) % 2) * 2, f);
    gb.blob(45, 60, 30, 30, "#FFB020", 1, 0.35);
    human(L, { T: 58, B: 122, pose: "seat", skin: "#D08040", robe: "#F4A300", trim: "#9E2A2B", head: "crown", halo: "#FFE08a", armL: "fwd", armR: "fwd", l: "firelotus", r: "scepter" });
    for (let k = 0; k < 3; k++) fg.rect(10 + k * 6, 128 + k * 3, 70 - k * 12, 3, k % 2 ? "#3a1a04" : "#4a2406");
  },
};
