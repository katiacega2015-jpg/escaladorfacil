import { Buf, H, SW, W, pulse, rng, shade } from "../engine/buf";
import { drawItem, human } from "../engine/figure";
import { withSprite, type ArtFn } from "../engine/layers";
import {
  bolt, crescent, eclipse, flame, grass, hills, mist, moon, mountains, particles, pillar, rays, rocks, splitSky, stars, sun,
} from "../engine/primitives";

export const MAJOR_ART: Record<string, ArtFn> = {
  /** Exu na encruzilhada cósmica: céu crepuscular, ilha de terra vermelha, capa ao vento. */
  "O Errante": L => {
    const { b, gb, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 62, "#0a0418", "#4a0f4e", 6);
    b.grad(0, 62, W, 58, "#4a0f4e", "#E0457A", 6);
    b.grad(0, 120, W, 40, "#E0457A", "#FF9A5A", 4);
    b.blob(20, 30, 30, 12, "#6a1a7a", 1.2, 0.8); b.blob(74, 54, 24, 10, "#8a2a6a", 1.1, 0.7);
    b.ring(70, 24, 9, "#F2B8D0", 0.35, 1); b.circ(70, 24, 6, "#C27AA8"); crescent(b, 70, 24, 6, "#F2B8D0", 3);
    stars(b, r, 34, 90, f, ["#FFFFFF", "#FFD1E3", "#BEE9E8"]);
    for (let k = 0; k < 6; k++) { const y = 40 + k * 12, x0 = ((k * 37 + f * 6) % 110) - 20; gb.line(x0, y, x0 + 16, y - 3, "#FFD8A0", 0.35); }

    b.poly([[4, 110], [86, 110], [78, 120], [66, 128], [56, 140], [46, 150], [36, 140], [24, 128], [12, 120]], "#2a0a0a");
    b.poly([[14, 112], [40, 112], [44, 146], [36, 138], [26, 128]], "#3e120e");
    for (const [x, len] of [[20, 8], [30, 14], [58, 12], [70, 7], [46, 18]] as const) b.line(x, 118, x + 1, 118 + len, "#1a0606");
    b.ell(45, 108, 40, 7, "#6a1a10"); b.ell(45, 107, 38, 5, "#A8402A"); b.ell(45, 106, 34, 3, "#C8573A");
    for (const [x0, y0, x1, y1] of [[10, 108, 80, 106], [20, 111, 70, 103]] as const) { b.line(x0, y0, x1, y1, "#FFB07A"); gb.line(x0, y0, x1, y1, "#FFD8A0", 0.4); }
    gb.blob(45, 107, 9, 3, "#FFE0A0", 1, 0.5 + p * 0.1);
    for (const [x, y, q] of [[8, 124, 3], [82, 116, 2], [76, 132, 2], [14, 140, 2]] as const) {
      const bob = SW[(x + f) % 4]!;
      b.circ(x, y + bob, q, "#3a0e0c"); b.px(x - 1, y - 1 + bob, "#8a3020");
    }
    particles(gf, r, 20, "#FFD8A0", f, -1, 10, 106, 3);

    human(L, {
      T: 28, B: 106, pose: "step", detail: true, skin: "#3b2418", legs: "#3b2418", robe: "#9E1B1B", trim: "#F7D070", sleeve: "#111111",
      sash: "#111111", pattern: "diamonds", patternCol: "#111111", necklace: "#C81E1E", bracelets: "#F7D070",
      head: "conical", hat: ["#C81E1E", "#111111"], hair: "#111111", armR: "fwd", armL: "down", r: "ogo",
      back: (L, { cx, T }) => {
        const w = SW[L.f] * 2;
        L.s.poly([[cx - 8, T + 15], [cx + 7, T + 15], [cx - 6, T + 46], [cx - 26 + w, T + 58], [cx - 22 + w, T + 36]], "#111111");
        L.s.poly([[cx - 8, T + 17], [cx - 20 + w, T + 36], [cx - 24 + w, T + 56], [cx - 18, T + 44]], "#6a0e0e");
      },
      front: (L, { cx, T }) => { for (let k = 0; k < 5; k++) L.s.px(cx - 4 + k * 2, T + 16 + (k === 2 ? 3 : Math.abs(k - 2)), "#111111"); },
    });
    for (const [x, y, q] of [[4, 150, 6], [86, 146, 5]] as const) fg.circ(x, y + SW[f], q, "#1a0406");
  },

  /** Thoth na câmara secreta: parede talhada, nicho de luz ciano, colunas de lótus e mesa de alquimia. */
  "O Alquimista": L => {
    const { b, gb, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 104, "#0a1a22", "#183440", 6);
    for (let y = 2; y < 104; y += 7) {
      const off = ((y / 7) | 0) % 2 ? 0 : 6;
      for (let x = -off; x < W; x += 12) { b.rect(x, y, 12, 1, "#07131a"); b.rect(x, y, 1, 7, "#07131a"); b.px(x + 1, y + 1, "#27505e"); }
    }
    b.poly([[0, 0], [12, 10], [12, 104], [0, 118]], "#0c2028"); b.poly([[90, 0], [78, 10], [78, 104], [90, 118]], "#0c2028");
    b.grad(0, 104, W, H - 104, "#1a3a44", "#08141a", 5);
    for (const x of [-30, -10, 10, 30]) b.line(45 + x * 0.35, 104, 45 + x * 1.6, H, "#0e2630");
    for (const y of [112, 124]) b.line(0, y, W, y, "#0e2630");

    b.rect(31, 30, 28, 74, "#04090c");
    for (let a = 0; a <= 16; a++) { const an = Math.PI * (1 + a / 16); b.rect(Math.round(45 + Math.cos(an) * 14 - 1), Math.round(30 + Math.sin(an) * 12), 3, 2, "#04090c"); }
    gb.blob(45, 62, 16, 36, "#62F0FF", 1, 0.25 + p * 0.05);
    for (let y = 30; y < 104; y += 2) b.px(31, y, "#2a7a8a"), b.px(58, y, "#2a7a8a");

    const glyphs = ["101", "111", "010", "110", "011", "100", "111", "001", "010"];
    for (const x of [14, 70]) {
      b.rect(x, 22, 7, 84, "#2a4a52"); b.rect(x, 22, 1, 84, "#4a7a82"); b.rect(x + 6, 22, 1, 84, "#12262c");
      b.poly([[x - 3, 22], [x + 10, 22], [x + 7, 14], [x + 3, 12], [x, 14]], "#3a8a6a"); b.line(x + 3, 13, x + 3, 22, "#6ACAA0");
      b.rect(x - 2, 104, 11, 3, "#12262c");
      b.rect(x + 1, 30, 5, 70, "#0c1a1e");
      for (let k = 0; k < 11; k++) {
        const g = (k * 3 + x) % 9, c = (k + f + x) % 5 === 0 ? "#BEFFFF" : "#3AD0E0";
        for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) if (glyphs[(g + j) % 9]![i] === "1") b.px(x + 2 + i, 32 + k * 6 + j, c);
      }
      gb.rect(x + 1, 30, 5, 70, "#62F0FF", 0.12);
    }

    human(L, {
      T: 38, B: 122, tunic: true, detail: true, skin: "#8a5a3a", legs: "#8a5a3a", robe: "#EDE8DA", trim: "#F7D070", pattern: "stripes", patternCol: "#D8D0C0",
      bareArms: true, bare: true, collar: "#F7D070", bracelets: "#F7D070", head: "ibis", armL: "hold", armR: "hold", l: "papyrus", r: "stylus",
      back: (L, { cx, T }) => {
        const hy = T + 7;
        L.s.poly([[cx - 8, hy - 2], [cx + 8, hy - 2], [cx + 9, hy + 14], [cx - 9, hy + 14]], "#14204a");
        for (let y = hy; y < hy + 14; y += 2) L.s.line(cx - 8, y, cx + 8, y, "#2a4aa0");
      },
      front: (L, { cx, T }) => {
        const s = L.s, hy = T + 7;
        s.px(cx + 2, hy - 1, "#1a1a1a"); s.px(cx + 1, hy - 1, "#F7D070");
        s.line(cx + 5, hy + 1, cx + 11, hy + 5, "#9A9A9A"); s.line(cx + 11, hy + 5, cx + 13, hy + 10, "#9A9A9A");
        for (let k = 0; k < 3; k++) s.line(cx - 7 + k, T + 17 + k, cx + 7 - k, T + 17 + k, k === 1 ? "#2a4aa0" : "#F7D070");
        s.circ(cx, hy - 16, 4, "#F7D070"); s.circ(cx - 1, hy - 17, 2, "#FFF3B0");
        for (let i = -6; i <= 6; i++) s.px(cx + i, hy - 11 + Math.round((i * i) / 12), "#E8E0C8");
        L.gf.blob(cx, hy - 16, 8, 8, "#FFE08a", 1, 0.3 + pulse(L.f) * 0.08);
      },
    });
    ["#FF5A3A", "#3A8AFF", "#6ADA5A", "#FFFFFF"].forEach((c, i) => {
      const an = (f * Math.PI) / 2 + (i * Math.PI) / 2, x = 45 + Math.cos(an) * 19, y = 70 + Math.sin(an) * 5;
      gf.circ(x, y, 2, c); gf.px(x - 1, y - 1, "#FFFFFF"); gf.blob(x, y, 6, 6, c, 1, 0.35);
      gf.line(x, y, 45 + Math.cos(an - 0.5) * 19, 70 + Math.sin(an - 0.5) * 5, c, 0.3);
    });

    fg.rect(2, 124, 86, 3, "#05080a"); fg.rect(2, 124, 86, 1, "#1a2a30"); fg.rect(6, 127, 3, 10, "#05080a"); fg.rect(81, 127, 3, 10, "#05080a");
    ([[12, "#6ADA5A", 4], [22, "#E04AE0", 3], [68, "#62F0FF", 3], [78, "#FFB020", 4]] as const).forEach(([x, c, q], i) => {
      fg.rect(x - 1, 115 - q, 2, 4 + q, "#05080a"); fg.circ(x, 121, q, "#05080a"); fg.circ(x, 122, q - 1, c); fg.px(x - 1, 120, "#FFFFFF", 0.6);
      for (let k = 0; k < 3; k++) gf.px(x + (k % 2), 116 - q - ((f + i + k * 2) % 5), c, 0.8);
      gf.blob(x, 121, 6, 5, c, 1, 0.3);
    });
    fg.poly([[36, 124], [42, 118], [48, 118], [54, 124]], "#05080a"); fg.rect(40, 116, 10, 2, "#1a2a30");
    void r;
  },

  /** Hécate diante do portal triplo: lua cheia enevoada, três rostos, tochas, chave de ferro e cães espectrais. */
  "O Oráculo": L => {
    const { b, gb, s, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 116, "#04050e", "#1c2440", 6); stars(b, r, 24, 70, f);
    b.blob(45, 26, 30, 24, "#3a4a70", 1.1, 0.6); b.blob(45, 26, 20, 16, "#8a9ac0", 1.1, 0.6);
    moon(b, 45, 26, 12, "#E6ECF4", "#B8C4D4"); b.circ(41, 21, 3, "#FFFFFF"); b.px(50, 31, "#9AA8BC");
    for (const [y, x0] of [[22, -10], [30, 40]] as const) { const x = ((x0 + f * 3) % 120) - 20; b.blob(x, y, 18, 2.5, "#2a3450", 1.4); b.blob(x + 4, y - 1, 12, 1.5, "#5a6a90", 1.2, 0.8); }

    const arch = (x: number, w: number, top: number, bottom: number) => {
      const mid = x + w / 2, rad = w / 2;
      b.rect(x + 3, top, w - 6, bottom - top, "#070812");
      gb.blob(mid, (top + bottom) / 2 + 6, rad, (bottom - top) / 2, "#8A6AD0", 1, 0.2 + p * 0.04);
      pillar(b, x, top, bottom, 4, "#3a3f4c", "#6a7082", "#1e222c"); pillar(b, x + w - 4, top, bottom, 4, "#3a3f4c", "#6a7082", "#1e222c");
      for (let a = 0; a <= 14; a++) {
        const an = Math.PI * (1 + a / 14), bx = Math.round(mid - 2 + Math.cos(an) * (rad - 2)), by = Math.round(top + Math.sin(an) * rad * 0.8);
        b.rect(bx, by, 4, 3, a % 2 ? "#3a3f4c" : "#4a5060"); b.px(bx, by, "#6a7082");
      }
      b.rect(Math.round(mid - 2), Math.round(top - rad * 0.8 - 2), 5, 4, "#5a6070"); b.px(Math.round(mid), Math.round(top - rad * 0.8 - 1), "#9A8AE0");
    };
    arch(2, 22, 74, 116); arch(66, 22, 74, 116); arch(27, 36, 62, 116);

    b.grad(0, 116, W, H - 116, "#1a1e30", "#0a0c16", 4);
    for (const x of [-20, 0, 20]) b.line(45, 118, 45 + x * 2.2, H, "#262a40");
    mist(b, 104, 3, "#8A9AB8", 0.25, f);

    const hound = (x: number, y: number, sg: 1 | -1) => {
      const c = "#A8C8FF";
      s.poly([[x - 6, y], [x + 5, y], [x + sg * 5, y - 12], [x - sg * 1, y - 16], [x - sg * 5, y - 6]], c, 0.5);
      s.poly([[x + sg * 1, y - 12], [x + sg * 6, y - 20], [x + sg * 8, y - 14], [x + sg * 5, y - 8]], c, 0.5);
      s.ell(x + sg * 7, y - 20, 3.5, 3, c, 0.5); s.poly([[x + sg * 9, y - 21], [x + sg * 14, y - 18], [x + sg * 13, y - 16], [x + sg * 9, y - 17]], c, 0.5);
      s.poly([[x + sg * 5, y - 22], [x + sg * 6, y - 27], [x + sg * 8, y - 22]], c, 0.55);
      s.line(x + sg * 3, y - 1, x + sg * 4, y - 10, "#E0F0FF", 0.35);
      s.line(x - sg * 6, y - 1, x - sg * 11, y - 5 - SW[f], c, 0.5);
      gf.px(x + sg * 9, y - 21, "#E0F0FF"); gb.blob(x + sg * 2, y - 11, 11, 13, "#7AA8FF", 1, 0.2);
    };
    hound(18, 132, 1); hound(72, 132, -1);

    human(L, {
      T: 42, B: 130, detail: true, skin: "#E8D4C0", robe: "#2d1b3d", trim: "#B8B0E0", pattern: "stars", patternCol: "#8A7AC0",
      hair: "#1a1020", hairLong: true, eye: "#B070FF", eyeGlow: "#B070FF", necklace: "#C8C8E0", armL: "fwd", armR: "fwd", l: "torch", r: "torch",
      back: (L, { cx, T }) => {
        const s = L.s, hy = T + 7;
        for (const sg of [-1, 1] as const) {
          const fx = cx + sg * 8;
          s.circ(fx, hy + 1, 4, "#1a1020"); s.ell(fx + sg * 1, hy + 2, 3, 4, "#D8C4B0");
          s.px(fx + sg * 4, hy + 2, "#D8C4B0"); s.px(fx + sg * 2, hy + 1, "#B070FF");
        }
      },
      front: (L, { cx, T }) => {
        const s = L.s, hy = T + 7;
        s.poly([[cx - 9, hy - 4], [cx - 5, hy - 8], [cx + 5, hy - 8], [cx + 9, hy - 4], [cx + 13, hy + 22 + SW[L.f]], [cx + 9, hy + 22], [cx + 6, hy], [cx - 6, hy], [cx - 9, hy + 22], [cx - 13, hy + 22 + SW[L.f]]], "#C8C8E8", 0.45);
        for (let i = -3; i <= 3; i++) s.px(cx + i, hy - 9 + Math.round((i * i) / 4), "#E6ECF4");
        s.px(cx, hy - 10, "#FFFFFF");
        s.ring(cx - 4, T + 36, 2, "#7a7a88", 1, 1); s.rect(cx - 4, T + 38, 1, 8, "#7a7a88"); s.rect(cx - 3, T + 44, 2, 1, "#7a7a88"); s.rect(cx - 3, T + 42, 1, 1, "#7a7a88");
        L.gf.blob(cx, hy, 6, 4, "#B070FF", 1, 0.15 + pulse(L.f) * 0.06);
      },
    });
    grass(fg, r, 134, 30, "#05060c");
  },

  /** Parvati no lótus de 16 pétalas diante da cascata dupla, na floresta que frutifica. */
  "A Matriz": L => {
    const { b, gb, s, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 118, "#0a2a1c", "#2e7a48", 6);
    for (let i = 0; i < 10; i++) b.circ(i * 10 + 4, 70 + (i % 3) * 4, 10, "#1e5a38");
    b.blob(45, 60, 40, 20, "#8AD0A8", 1, 0.35);
    b.poly([[28, 18], [62, 18], [64, 66], [26, 66]], "#1a4a3a");
    b.rect(36, 8, 18, 56, "#9AE0F0");
    for (let y = 8; y < 64; y++) for (let x = 36; x < 54; x++) if ((y * 2 + f * 4 + x * 7) % 9 < 2) b.px(x, y, "#FFFFFF");
    b.rect(28, 64, 34, 3, "#3a6a50");
    b.rect(32, 67, 26, 44, "#8AD8EA");
    for (let y = 67; y < 111; y++) for (let x = 32; x < 58; x++) if ((y * 2 + f * 4 + x * 5) % 8 < 2) b.px(x, y, "#FFFFFF");
    b.blob(45, 66, 20, 5, "#FFFFFF", 1.2, 0.8); b.blob(45, 110, 26, 6, "#FFFFFF", 1.2, 0.8);
    b.grad(0, 110, W, H - 110, "#2a8a8a", "#0e3a3a", 4);
    for (let y = 114; y < H; y += 4) for (let x = 0; x < W; x++) if ((x + y * 2 + f * 2) % 13 < 2) b.px(x, y, "#BEF0F0", 0.6);
    for (let i = 0; i < 14; i++) { const x = r() * W, y = r() * 26 - 6, q = 6 + r() * 8; b.circ(x, y, q, i % 2 ? "#0e3020" : "#154a2c"); }
    for (let i = 0; i < 6; i++) {
      const x = 4 + i * 16 + ((r() * 4) | 0), ln = Math.round(30 + r() * 50), sw = SW[(i + f) % 4]!;
      b.line(x, 0, x + sw, ln, "#1f5a30");
      for (let y = 10; y < ln; y += 9) b.px(x + 1, y, "#2f8a40");
      b.circ(x + sw, ln, 2, "#F28AB2"); b.px(x + sw, ln, "#FFE0F0");
      b.circ(x + 3, ln - 10, 1.5, "#FFB020"); gf.blob(x + 3, ln - 10, 3, 3, "#FFD08a", 1, 0.4 + p * 0.1);
    }
    s.ell(45, 126, 24, 2.5, "#2a8a5a");
    for (let k = 0; k < 16; k++) { const an = (Math.PI * 2 * k) / 16; s.ell(45 + Math.cos(an) * 18, 122 + Math.sin(an) * 5, 5, 2, k % 2 ? "#F28AB2" : "#FFD1E3"); }
    for (let k = 0; k < 8; k++) { const an = (Math.PI * 2 * k) / 8 + 0.2; s.ell(45 + Math.cos(an) * 11, 119 + Math.sin(an) * 3, 4, 2, "#FFE8F2"); }
    gb.blob(45, 120, 26, 8, "#FFD1E3", 1, 0.25);
    human(L, {
      T: 68, B: 120, pose: "seat", detail: true, skin: "#C98A5A", robe: "#C8102E", trim: "#F7D070", hairLong: true, hairLen: 36, hair: "#1a0e08",
      head: "crown", gem: "#2AA060", halo: "#FFE08a", necklace: "#F7D070", bracelets: "#F7D070", earrings: "#F7D070", sash: "#F7D070", armL: "side", armR: "fwd",
      front: (L, { cx, T }, h) => {
        const s = L.s;
        s.px(cx, T + 4, "#C8102E");
        s.rect(h.R[0] - 1, h.R[1] - 3, 3, 3, "#C98A5A"); s.px(h.R[0], h.R[1] - 4, "#C98A5A"); s.px(h.R[0], h.R[1] - 2, "#E07A7A");
        s.rect(h.L[0] - 1, h.L[1], 3, 2, "#C98A5A");
        L.gf.blob(h.R[0], h.R[1] - 2, 5, 5, "#FFE08a", 1, 0.3 + pulse(L.f) * 0.08);
      },
    });
    for (const [x0, dir] of [[0, 1], [90, -1]] as const) for (let k = 0; k < 4; k++) {
      const y = 128 - k * 8;
      fg.poly([[x0, y + 12], [x0 + dir * (18 - k * 2), y - 4 + SW[(k + f) % 4]!], [x0 + dir * 4, y + 2]], k % 2 ? "#06140a" : "#0a1e10");
    }
  },

  /** Metatron no Sétimo Céu: colunas de safira e fogo, piso espelhado e o Cubo de Metatron girando. */
  "O Arquiteto": L => {
    const { b, gb, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 112, "#050520", "#1e3080", 6);
    for (let k = 0; k < 7; k++) gb.line(45 + (k - 3) * 6, 0, 45 + (k - 3) * 16, 112, "#FFE8A0", 0.08);
    b.blob(45, 10, 40, 14, "#F7D070", 1, 0.35); b.blob(45, 6, 26, 8, "#FFF3B0", 1.2, 0.5);
    const column = (x: number, w: number, top: number, far: boolean) => {
      const base = far ? "#1e3a8a" : "#2a4fb0", lt = far ? "#4a6fd0" : "#7a9ff0", dk = far ? "#0e1e50" : "#101e50";
      b.rect(x, top, w, 112 - top, base);
      for (let i = 0; i < w; i++) b.rect(x + i, top, 1, 112 - top, i < w / 3 ? lt : i > (w * 2) / 3 ? dk : base);
      for (let y = top + 6; y < 112; y += 9) b.line(x, y, x + w - 1, y + 2, dk);
      b.rect(x - 2, top - 3, w + 4, 3, "#F7D070"); b.rect(x - 2, 110, w + 4, 3, "#B8862B");
      flame(b, x + w / 2, top - 4, far ? 6 : 9, f, ["#FFF3B0", "#FFB020", "#E0521B"], far ? 1 : 1.4);
      gb.blob(x + w / 2, top - 8, w, 8, "#FFB020", 1, 0.3);
    };
    column(17, 5, 38, true); column(68, 5, 38, true); column(2, 9, 18, false); column(79, 9, 18, false);
    b.grad(0, 112, W, H - 112, "#1a2a80", "#060a24", 4);
    for (let y = 113; y < 137; y++) {
      const src = 111 - (y - 112) * 2;
      if (src < 0) break;
      for (let x = 0; x < W; x++) { const i = (src * W + x) * 4, d = b.d; b.px(x, y, [d[i]!, d[i + 1]!, d[i + 2]!], 0.35); }
    }
    for (let x = 0; x < W; x += 2) b.px(x, 114 + ((x + f) % 4), "#8AAFFF", 0.35);
    const hebrew = [["111", "001", "111"], ["101", "101", "111"], ["110", "010", "011"], ["111", "100", "100"], ["011", "010", "110"]];
    for (let i = 0; i < 12; i++) {
      const x = (r() * 80 + 4) | 0, y0 = r() * 100 + 10, y = Math.round((((y0 - f * 2) % 110) + 110) % 110 + 4), g = hebrew[i % 5]!;
      for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) if (g[j]![k] === "1") gf.px(x + k, y + j, "#F7D070", 0.85);
    }
    for (const [x, y] of [[14, 96], [74, 90]] as const) {
      const yy = y + SW[f];
      gf.rect(x - 3, yy, 7, 4, "#F0E6C8"); gf.rect(x - 4, yy - 1, 1, 6, "#C8B890"); gf.rect(x + 4, yy - 1, 1, 6, "#C8B890");
      gf.line(x - 2, yy + 1, x + 2, yy + 1, "#B8862B"); gf.line(x - 2, yy + 2, x + 1, yy + 2, "#B8862B");
    }
    human(L, {
      T: 46, B: 132, detail: true, skin: "#F3E6D0", robe: "#8A9AD8", trim: "#F7D070", pattern: "stars", patternCol: "#F7D070",
      hair: "#E8D8A0", eye: "#FFE08a", eyeGlow: "#FFE08a", halo: "#FFF3B0", necklace: "#F7D070", sash: "#F7D070",
      wings: { type: "fire" }, armL: "chest", armR: "chest",
      back: (L, { cx, T }) => L.gb.blob(cx, T + 40, 24, 46, "#FFF3B0", 1, 0.12 + pulse(L.f) * 0.04),
    });
    const cx = 45, cy = 72, R = 6, rot = (f * Math.PI) / 12;
    const nodes: [number, number][] = [[cx, cy]];
    for (const d of [R, R * 2]) for (let k = 0; k < 6; k++) { const an = rot + (k * Math.PI) / 3; nodes.push([cx + Math.cos(an) * d, cy + Math.sin(an) * d]); }
    gf.circ(cx, cy, 14, "#0a1450", 0.55);
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) gf.line(nodes[i]![0], nodes[i]![1], nodes[j]![0], nodes[j]![1], "#F7D070", i === 0 || j - i === 1 ? 0.8 : 0.4);
    for (const [x, y] of nodes) gf.ring(x, y, 2.2, "#FFF3B0", 1, 1);
    gf.circ(cx, cy, 1, "#FFFFFF"); gf.blob(cx, cy, 16, 16, "#FFE08a", 1, 0.12 + p * 0.06);
    fg.rect(0, 134, W, 4, "#050818");
  },

  /** Odin sob as raízes de Yggdrasil: poço de Mímir, runas geladas, névoa sobre o musgo e os corvos Hugin e Munin. */
  "O Mentor": L => {
    const { b, gb, s, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, H, "#040c0a", "#20362f", 6);
    b.blob(45, 70, 30, 40, "#2a4a44", 1, 0.5);
    const root = (pts: [number, number][], t: number) => {
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i]!, [x1, y1] = pts[i + 1]!;
        b.line(x0, y0, x1, y1, "#1e140c", 1, t + 2); b.line(x0, y0, x1, y1, "#3a2818", 1, t);
        b.line(x0 - t / 3, y0, x1 - t / 3, y1, "#5a4028"); b.line(x0 + t / 4, y0 + 1, x1 + t / 4, y1 + 1, "#2a1c10");
      }
    };
    root([[20, -4], [40, 12], [68, 4], [94, 18]], 6);
    root([[-6, 8], [8, 30], [14, 60], [10, 90], [18, 120]], 9); root([[96, 4], [82, 32], [76, 62], [82, 96], [72, 120]], 9);
    root([[-2, 58], [18, 70], [28, 92], [24, 120]], 4); root([[92, 68], [70, 80], [64, 102], [68, 120]], 4);
    for (let i = 0; i < 14; i++) { const x = (r() * W) | 0, y = (r() * 110) | 0; b.px(x, y, "#5ADA9A", (i + f) % 3 ? 0.4 : 0.9); }
    b.grad(0, 116, W, H - 116, "#1a3a28", "#0a1a12", 4);
    b.ell(16, 124, 12, 3, "#0a2a3a"); b.ell(16, 123, 10, 2, "#3A9AC8"); gb.blob(16, 122, 14, 8, "#7FD4FF", 1, 0.3 + p * 0.06);
    for (let x = 0; x < W; x += 3) b.px(x, 117 + (x % 2), "#3a7a4a");

    const runes = [["010", "010", "111"], ["101", "110", "101"], ["100", "110", "101"], ["111", "010", "010"], ["110", "101", "110"], ["101", "010", "101"]];
    for (let i = 0; i < 10; i++) {
      const x = (r() * 78 + 6) | 0, y = (r() * 80 + 14) | 0, g = runes[i % 6]!, c = (i + f) % 4 === 0 ? "#E0F6FF" : "#7FD4FF";
      for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) if (g[j]![k] === "1") gf.px(x + k, y + j - SW[f], c);
      gf.line(x + 1, y + 4 - SW[f], x + 1 + SW[(i + f) % 4]!, y + 9, "#BEE9E8", 0.3);
      gf.blob(x + 1, y + 1, 4, 4, "#7FD4FF", 1, 0.2);
    }

    human(L, {
      T: 42, B: 130, detail: true, skin: "#D8B89A", robe: "#5a6064", trim: "#8A9098", pattern: "diamonds", patternCol: "#464c52",
      hair: "#D8D8D8", beard: "#E8E8E8", beardLong: true, head: "hat_wide", hatCol: "#3e4348", oneEye: "#7FD4FF", armR: "hold", r: "spear", armL: "down",
      back: (L, { cx, T, B }) => {
        const w = SW[L.f];
        L.s.poly([[cx - 10, T + 15], [cx + 10, T + 15], [cx + 19 + w, B], [cx - 19 + w, B]], "#2a3038");
        L.s.line(cx - 18 + w, B - 1, cx - 10, T + 18, "#3e4650");
      },
      front: (L, { cx, T }, h) => {
        const s = L.s, hy = T + 7;
        for (let k = 0; k < 6; k++) s.line(cx - 4 + k * 2, hy + 4, cx - 3 + k * 1.2, hy + 14, "#C8C8C8");
        for (let i = -10; i <= 10; i++) s.px(cx + i, T + 15 + Math.round(Math.abs(i) / 4), i % 2 ? "#8a7a60" : "#a89878");
        s.ell(cx, T + 16, 10, 2, "#7a6a50", 0.8);
        s.rect(cx - 12, hy - 5, 25, 1, "#5a6068");
        s.poly([[h.R[0] - 2, h.R[1] - 40], [h.R[0] + 2, h.R[1] - 40], [h.R[0], h.R[1] - 49]], "#F7D070");
        for (let k = 0; k < 3; k++) L.gf.px(h.R[0], h.R[1] - 36 + k * 4, "#7FD4FF");
      },
    });
    const bigRaven = (x: number, y: number, sg: 1 | -1) => {
      gb.blob(x, y - 2, 9, 7, "#7FD4FF", 1, 0.3);
      s.ell(x, y, 4, 2.5, "#07070e"); s.circ(x + sg * 3, y - 3, 2.5, "#07070e");
      s.poly([[x + sg * 5, y - 4], [x + sg * 8, y - 2], [x + sg * 5, y - 2]], "#5a5a62");
      s.px(x + sg * 3, y - 4, "#9AD8FF"); s.line(x - sg * 1, y - 1, x + sg * 2, y - 1, "#2a3050");
      s.poly([[x - sg * 3, y], [x - sg * 8, y + 3], [x - sg * 6, y + 1]], "#07070e");
      if (f % 2) s.poly([[x, y - 2], [x - sg * 5, y - 8], [x - sg * 2, y - 2]], "#12121e");
    };
    bigRaven(31, 57, -1); bigRaven(59, 57, 1);
    mist(fg, 124, 3, "#9AB0A8", 0.35, f); grass(fg, r, 134, 20, "#06100a");
  },

  /** Radha e Krishna no bosque sob eclipse total; a luz divide a lâmina em azul e ouro. */
  "O Pacto": L => {
    const { b, gb, s, gf, fg, r, f } = L, p = pulse(f);
    splitSky(b, (x, y) => x - 45 + (y - 80) * 0.6, ["#0a1a48", "#2a5ab0"], ["#3a2208", "#D8A030"]);
    rays(gb, 45, 22, 16, 30, "#FFF3B0", 0.45, f * 0.05);
    eclipse(b, 45, 22, 9, "#FFE8A0", f);
    const grove = (x: number, h: number, trunk: string, leaf: string, hi: string) => {
      b.line(x, 118, x + 1, 118 - h, trunk, 1, 3);
      for (let k = 0; k < 6; k++) { const lx = x + ((k * 7) % 11) - 5, ly = 118 - h - 4 + ((k * 5) % 12); b.circ(lx, ly, 5 + (k % 3), leaf); b.px(lx - 2, ly - 2, hi); b.px(lx - 1, ly - 3, hi); }
    };
    grove(8, 40, "#08101e", "#10245a", "#6A9AFF"); grove(22, 28, "#08101e", "#16306a", "#6A9AFF");
    grove(82, 40, "#2a1a06", "#6a4210", "#F7D070"); grove(68, 30, "#2a1a06", "#7a5014", "#F7D070");
    b.grad(0, 118, W, H - 118, "#1a2a1a", "#0a140a", 4);
    particles(gf, r, 8, "#8AB0FF", f, 1, 30, 120, 3); particles(gf, r, 8, "#FFD34E", f, 1, 30, 120, 3);

    human(L, {
      cx: 29, T: 46, B: 130, detail: true, skin: "#3B7BD4", robe: "#F7D070", trim: "#C8102E", pattern: "dots", patternCol: "#C8102E",
      hair: "#0a0a1a", head: "crown", gem: "#2AA060", necklace: "#FFFFFF", bracelets: "#F7D070", earrings: "#F7D070", armL: "chest", armR: "fwd",
      front: (L, { cx, T }) => {
        const s = L.s, hy = T + 7;
        s.line(cx + 1, hy + 4, cx + 20, hy + 6, "#8a5a2a"); s.px(cx + 20, hy + 6, "#F7D070"); for (let k = 0; k < 3; k++) s.px(cx + 8 + k * 3, hy + 5, "#3a2010");
        s.line(cx + 1, hy - 8, cx + 4, hy - 20, "#2AA060");
        s.ell(cx + 4, hy - 21, 2.5, 3, "#2AA060"); s.circ(cx + 4, hy - 21, 1.5, "#F7D070"); s.px(cx + 4, hy - 21, "#1A3AB0");
        for (let k = 0; k < 5; k++) L.gf.px(cx + 22 + k * 3, hy + 3 - ((k + L.f) % 3) * 2, "#FFF3B0", 0.8);
      },
    });
    human(L, {
      cx: 61, T: 48, B: 130, detail: true, skin: "#E0A878", robe: "#F4A300", trim: "#C8102E", pattern: "diamonds", patternCol: "#C8102E",
      hairLong: true, hair: "#140a06", necklace: "#F7D070", bracelets: "#F7D070", earrings: "#F7D070", sash: "#C8102E", armL: "fwd", armR: "chest",
      front: (L, { cx, T }) => {
        const s = L.s, hy = T + 7;
        s.poly([[cx - 8, hy - 3], [cx - 3, hy - 8], [cx + 3, hy - 8], [cx + 8, hy - 3], [cx + 11, hy + 20], [cx + 7, hy + 20], [cx + 5, hy - 2], [cx - 5, hy - 2], [cx - 7, hy + 20], [cx - 11, hy + 20]], "#FF8A2A", 0.45);
        s.px(cx, hy - 3, "#C8102E");
      },
    });
    for (let t = 0; t <= 24; t++) {
      const x = 36 + t * 0.75, y = 64 + Math.sin((Math.PI * t) / 24) * 12;
      s.circ(x, y, 1, t % 3 === 0 ? "#FFFFFF" : t % 3 === 1 ? "#FF9A1A" : "#FFD34E");
      if (t % 6 === 3) { s.line(x, y + 1, x, y + 4, "#FF9A1A"); s.px(x, y + 5, "#C8102E"); }
    }
    gf.blob(45, 70, 10, 8, "#FFE8A0", 1, 0.15 + p * 0.06);
    grass(fg, r, 134, 30, "#0a120a");
    for (const [x, y, c] of [[8, 132, "#8AB0FF"], [20, 134, "#FFFFFF"], [66, 133, "#FF9A1A"], [80, 131, "#FFD34E"]] as const) { fg.px(x, y, c); fg.px(x + 1, y - 1, c); fg.px(x - 1, y - 1, c); }
  },

  /** São Miguel no limiar entre a tempestade e a abóbada dourada, pisando o dragão das trevas. */
  "O Conquistador": L => {
    const { b, gb, s, gf, fg, f } = L, p = pulse(f);
    b.grad(0, 0, W, 64, "#FFF3C0", "#C8942B", 6); b.grad(0, 64, W, H - 64, "#2a2440", "#08080f", 6);
    rays(gb, 45, 14, 20, 60, "#FFFFFF", 0.35, f * 0.04);
    for (let i = 0; i < 10; i++) b.blob(i * 10, 66 + ((i * 7) % 6), 11, 7, i % 2 ? "#3a3456" : "#2a2644", 1.2);
    for (let i = 0; i < 8; i++) b.blob(i * 12 + 4, 61, 9, 4, "#E8C070", 1, 0.85);
    for (let i = 0; i < 6; i++) b.blob(i * 16 + 8, 88 + (i % 2) * 6, 10, 5, "#1a1830", 1.2);
    if (f === 1 || f === 3) { bolt(b, rng(99 + f), 10 + ((f * 23) % 60), 70, 118, "#FFFFFF"); gb.blob(20, 90, 20, 20, "#C8D0FF", 1, 0.2); }

    const dragon: [number, number][] = [[4, 126], [14, 121], [26, 127], [40, 122], [54, 128], [68, 122], [80, 127], [88, 124]];
    for (let i = 0; i < dragon.length - 1; i++) { const [x0, y0] = dragon[i]!, [x1, y1] = dragon[i + 1]!; s.line(x0, y0, x1, y1, "#140a1a", 1, 6); s.line(x0, y0 - 2, x1, y1 - 2, "#3a1a4a"); }
    for (let x = 8; x < 86; x += 5) s.px(x, 121 + ((x * 3) % 5), "#5a2a6a");
    s.poly([[4, 112], [16, 110], [22, 118], [16, 124], [6, 122]], "#140a1a");
    s.poly([[6, 122], [18, 124], [10, 131], [2, 128]], "#140a1a");
    s.poly([[8, 112], [4, 104], [12, 110]], "#2a1a3a"); s.poly([[14, 111], [14, 103], [18, 112]], "#2a1a3a");
    s.line(6, 123, 16, 124, "#FF4A2A"); for (const x of [8, 11, 14]) s.px(x, 122, "#E0E0E0");
    s.px(10, 115, "#FF2020"); s.px(14, 114, "#FF2020");
    gf.blob(12, 115, 6, 4, "#FF2020", 1, 0.35 + p * 0.1);
    s.poly([[86, 122], [90, 116], [90, 128]], "#140a1a");

    human(L, {
      T: 40, B: 122, tunic: true, detail: true, skin: "#F0D0B0", robe: "#B8C2CC", trim: "#F7D070", pattern: "stripes", patternCol: "#8A949E",
      legs: "#C8D0D8", feet: "#8A949E", sleeve: "#C8D0D8", armor: "#E8EEF4", hair: "#E8C070", halo: "#F7D070", eye: "#2A5AA0",
      wings: { cl: "#B01030", cr: "#F4F4F4", c2: "#F7D070", glow: "#FFF3B0" }, armR: "high", r: "flamesword", armL: "down",
      back: (L, { cx, T }) => {
        const w = SW[L.f];
        L.s.poly([[cx - 9, T + 15], [cx + 9, T + 15], [cx + 17 + w, T + 76], [cx - 17 + w, T + 76]], "#8A0A20");
        L.s.line(cx - 16 + w, T + 75, cx - 9, T + 16, "#C81E3A");
      },
      front: (L, { cx, T }, h) => {
        const s = L.s;
        s.line(cx - 4, T + 20, cx + 4, T + 20, "#F7D070"); s.line(cx, T + 17, cx, T + 28, "#F7D070");
        s.circ(cx, T + 20, 1, "#FFF3B0");
        for (const sg of [-1, 1] as const) { s.ell(cx + sg * 10, T + 16, 4, 3, "#C8D0D8"); s.line(cx + sg * 7, T + 18, cx + sg * 13, T + 18, "#F7D070"); }
        for (const x of [cx - 5, cx + 5]) { s.rect(x - 2, T + 62, 4, 2, "#E8EEF4"); s.px(x, T + 62, "#F7D070"); }
        s.rect(h.L[0] - 1, h.L[1] - 1, 3, 3, "#C8D0D8");
      },
    });
    for (let i = 0; i < 10; i++) { const an = i * 0.7 + f * 0.4; gf.px(45 + Math.cos(an) * 16, 121 + Math.sin(an) * 3, i % 2 ? "#FFF3B0" : "#FFFFFF", 0.9); }
    fg.rect(0, 134, W, 4, "#05050a");
  },

  /** Durga no cume nevado ao pôr do sol: braços em leque com as armas em repouso e a mão na juba do tigre-real. */
  "O Domínio": L => {
    const { b, gb, s, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 60, "#1e0e38", "#6a2a6a", 6); b.grad(0, 60, W, 50, "#6a2a6a", "#F09A50", 6);
    sun(b, 64, 80, 11, "#FFF0C0", "#FFD08a", "#FFB070");
    rays(gb, 64, 80, 14, 60, "#FFD08a", 0.3, f * 0.04);
    mountains(b, r, 108, 18, 44, "#5a4a7a", "#F0E4FF", 11); mountains(b, r, 118, 6, 18, "#8a7aa0", "#FFFFFF", 8);
    b.poly([[0, 118], [30, 108], [60, 112], [90, 116], [90, H], [0, H]], "#E8EEF8");
    b.poly([[40, 111], [60, 112], [90, 116], [90, 124], [50, 120]], "#FFE0C0");
    b.grad(0, 124, W, H - 124, "#C8D0E8", "#8A94B8", 3);

    const tiger = (x: number, y: number) => {
      const o = "#E8801E", w = "#F8EEDC", k = "#140a04";
      s.ell(x + 10, y - 8, 17, 7, o); s.ell(x + 10, y - 4, 14, 3, w);
      for (let i = 0; i < 8; i++) s.line(x + i * 4, y - 15, x + i * 4 - 1, y - 8, k);
      s.line(x + 26, y - 8, x + 32, y - 12 - SW[f], o, 1, 3); s.line(x + 32, y - 12 - SW[f], x + 34, y - 16, k, 1, 2);
      s.rect(x - 2, y - 4, 10, 4, o); s.rect(x - 4, y - 1, 6, 2, w);
      for (const dx of [-4, -1, 2]) s.px(x + dx, y, k);
      s.circ(x - 2, y - 16, 7, o); s.circ(x - 2, y - 14, 6, "#F0A040");
      for (let i = -6; i <= 6; i += 2) s.px(x - 2 + i, y - 22 + Math.abs(i) / 2, "#F8EEDC");
      s.ell(x - 5, y - 12, 4, 3, w); s.px(x - 7, y - 13, k); s.px(x - 8, y - 12, "#3a1a10");
      s.px(x - 5, y - 17, "#FFD020"); s.px(x - 1, y - 17, "#FFD020"); s.px(x - 5, y - 16, k); s.px(x - 1, y - 16, k);
      for (const [dx, dy] of [[-7, -20], [3, -20], [-4, -22], [0, -22]] as const) s.line(x - 2 + dx * 0.5, y + dy + 4, x - 2 + dx * 0.6, y + dy + 7, k);
      s.poly([[x - 8, y - 21], [x - 7, y - 25], [x - 5, y - 21]], o); s.poly([[x + 1, y - 21], [x + 3, y - 25], [x + 4, y - 21]], o);
      gb.blob(x + 6, y - 10, 22, 12, "#FFD08a", 1, 0.2);
    };

    human(L, {
      cx: 34, T: 42, B: 124, detail: true, skin: "#D8A070", robe: "#B0202A", trim: "#F7D070", pattern: "diamonds", patternCol: "#F7D070",
      armor: "#F7D070", head: "crown", gem: "#C8102E", hairLong: true, hairLen: 38, hair: "#140a06", necklace: "#F7D070", bracelets: "#F7D070", earrings: "#F7D070",
      armL: "down", armR: "low",
      back: (L, { cx, T }) => {
        const s = L.s, sk = "#D8A070";
        const fan: [number, number, string][] = [[205, 24, "trident"], [235, 25, "conch"], [262, 24, "bow"], [298, 24, "sword"], [325, 25, "chakra"], [340, 22, "lotus"]];
        for (const [deg, len, wp] of fan) {
          const an = (deg * Math.PI) / 180, sx = cx + (deg > 270 ? 7 : -7), sy = T + 19;
          const hx = Math.round(cx + Math.cos(an) * len), hy = Math.round(T + 20 + Math.sin(an) * len * 0.9);
          s.line(sx, sy, hx, hy, sk, 1, 3); s.line(sx + (hx - sx) * 0.6, sy + (hy - sy) * 0.6, sx + (hx - sx) * 0.66, sy + (hy - sy) * 0.66, "#F7D070", 1, 3);
          s.rect(hx - 1, hy - 1, 3, 3, sk);
          if (wp === "trident") { s.line(hx, hy - 12, hx, hy + 8, "#C8D0D8"); s.line(hx - 2, hy - 10, hx + 2, hy - 10, "#C8D0D8"); s.px(hx - 2, hy - 12, "#C8D0D8"); s.px(hx + 2, hy - 12, "#C8D0D8"); }
          else if (wp === "conch") { s.ell(hx - 2, hy - 3, 3, 2, "#F4F0E8"); s.px(hx - 3, hy - 3, "#C8B8A8"); }
          else if (wp === "bow") { for (let t = -6; t <= 6; t++) s.px(hx - 2 - Math.round(Math.cos((t / 6) * 1.2) * 3), hy + t, "#8a5a2a"); s.line(hx, hy - 6, hx, hy + 6, "#E0E0E0"); }
          else if (wp === "sword") { s.line(hx, hy, hx + 2, hy - 11, "#E8EEF4"); s.line(hx - 2, hy, hx + 2, hy, "#F7D070"); }
          else if (wp === "chakra") { s.ring(hx + 2, hy - 3, 3, "#F7D070", 1, 1); s.px(hx + 2, hy - 3, "#FFF3B0"); L.gf.blob(hx + 2, hy - 3, 5, 5, "#FFD08a", 1, 0.2 + pulse(L.f) * 0.08); }
          else { s.circ(hx + 1, hy - 3, 2, "#F28AB2"); s.px(hx + 1, hy - 4, "#FFE0F0"); }
        }
      },
      front: (L, { cx, T }) => { L.s.px(cx, T + 4, "#C8102E"); L.s.line(cx - 6, T + 32, cx + 6, T + 32, "#C8102E"); },
    });
    tiger(58, 118);
    gf.blob(52, 94, 6, 5, "#FFE08a", 1, 0.25 + p * 0.06);
    fg.poly([[70, 137], [72, 126], [76, 137]], "#4a4460"); fg.line(73, 124, 73, 137, "#C8D0D8");
    fg.ell(12, 134, 7, 3, "#6a6a8a"); fg.ring(12, 133, 4, "#F7D070", 1, 1);
    fg.rect(0, 135, W, 2, "#E8EEF8");
  },

  /** Omolu coberto de palha da costa no deserto sem estrelas; a lamparina é a única luz quente. */
  "O Buscador": L => {
    const { b, gb, s, gf, fg, f } = L, p = pulse(f);
    b.grad(0, 0, W, 104, "#010a10", "#0a2a36", 6);
    b.blob(45, 104, 60, 10, "#1a4a58", 1, 0.5);
    hills(b, 104, 10, 0.06, 1, "#0e2c36"); hills(b, 114, 12, 0.09, 3, "#0a2430"); hills(b, 124, 8, 0.12, 5, "#07202a");
    for (let y = 108; y < H; y += 3) for (let x = 0; x < W; x++) if ((x + y * 3) % 17 < 2) b.px(x, y + Math.round(Math.sin(x * 0.3) * 1), "#123a46");
    for (let k = 0; k < 7; k++) { const x = 74 - k * 4 + (k % 2) * 2, y = 112 + k * 3; b.rect(x, y, 2, 1, "#051820"); }

    const cx = 38, T = 36, B = 130, sw = SW[f];
    const lx = cx + 14, ly = T + 44;
    gb.poly([[lx - 1, ly + 9], [lx + 1, ly + 9], [lx + 22, B + 5], [lx - 18, B + 5]], "#FFD34E", 0.22);
    gb.blob(lx + 2, B + 2, 22, 5, "#FFD34E", 1.2, 0.5);
    for (let x = lx - 14; x < lx + 20; x += 3) b.px(x, B + 2 + ((x * 7) % 3), "#6a5a2a");

    const tier = (y0: number, y1: number, w0: number, w1: number, base: string, lite: string, dark: string, off: number) => {
      s.poly([[cx - w0, y0], [cx + w0, y0], [cx + w1 + off, y1], [cx - w1 + off, y1]], base);
      for (let k = -w1; k <= w1; k += 2) {
        const t = (k + w1) / (2 * w1), x0 = cx - w0 + t * 2 * w0;
        s.line(x0, y0 + 1, cx + k + off, y1, k % 4 ? dark : lite);
      }
      for (let x = -w1; x <= w1; x += 2) s.line(cx + x + off, y1, cx + x + off + SW[(x + f + 8) % 4]!, y1 + 2, x % 4 ? dark : lite);
    };
    s.poly([[cx, T - 8], [cx + 6, T + 4], [cx - 6, T + 4]], "#C8A048");
    tier(T + 2, T + 30, 6, 13, "#B8903C", "#E0C878", "#7A5A22", sw);
    tier(T + 24, T + 62, 11, 16, "#A8802E", "#D8B868", "#6A4A18", sw);
    tier(T + 56, B, 14, 18, "#9A7426", "#C8A858", "#5A3E12", sw);
    for (let k = -5; k <= 5; k++) s.px(cx + k * 2 + sw, T + 26 + (k % 2), "#F4F0E8");
    s.line(cx - 4, T - 2, cx + 4, T - 2, "#5A3E12");

    for (const [hx, hy] of [[lx, ly], [cx - 15, T + 46]] as const) {
      s.rect(hx - 1, hy - 1, 3, 3, "#8A8A90"); s.px(hx - 1, hy + 2, "#8A8A90"); s.px(hx + 1, hy + 2, "#8A8A90"); s.px(hx, hy - 1, "#B8B8C0");
    }
    const fig = { cx, T, B };
    drawItem(L, "lantern", lx, ly, 1, fig);
    drawItem(L, "gourd", cx - 15, T + 46, -1, fig);
    gf.blob(lx, ly + 6, 5, 5, "#FFF3B0", 1, 0.35 + p * 0.08);
    fg.rect(0, 134, W, 4, "#03141a"); for (let x = 0; x < W; x += 3) fg.px(x, 133 - (((x / 9) | 0) % 2), "#03141a");
  },

  /** Ananta-Shesha: o ouroboros de sete cabeças sobre o oceano de leite, com o cosmos girando no centro. */
  "O Ciclo": L => {
    const { b, gb, s, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 114, "#05021a", "#2a1650", 6); stars(b, r, 34, 110, f);
    b.blob(45, 76, 30, 30, "#3a1a6a", 1.1, 0.7);
    for (let i = 0; i < 60; i++) {
      const arm = i % 2, t = (i >> 1) / 30, an = t * 5 + arm * Math.PI + f * 0.25, rad = 2 + t * 22;
      gf.px(45 + Math.cos(an) * rad, 76 + Math.sin(an) * rad * 0.8, t < 0.3 ? "#FFF3D0" : i % 3 ? "#C8B8FF" : "#FFFFFF", 0.9 - t * 0.5);
    }
    gf.blob(45, 76, 6, 5, "#FFF3D0", 1.2, 0.6);
    gf.circ(33, 66, 2.5, "#62B6CB"); gf.ring(33, 66, 4.5, "#BEE9E8", 0.5, 1); gf.blob(33, 66, 6, 6, "#62F0FF", 1, 0.2 + p * 0.06);
    gf.circ(57, 86, 2, "#A83A2A"); gf.px(56, 85, "#FF8A4A"); gf.px(58, 87, "#3a0a0a"); for (let k = 0; k < 3; k++) gf.px(60 + k, 88 + (k + f) % 2, "#FF6A3A", 0.6);

    b.grad(0, 114, W, H - 114, "#F8F2E0", "#C8BEA0", 4);
    for (let y = 116; y < H; y += 3) for (let x = 0; x < W; x++) if ((x + y * 2 + f * 2) % 13 < 3) b.px(x, y, "#FFFFFF");
    for (let x = 0; x < W; x += 5) b.px(x + (f % 2), 115, "#FFFFFF");
    s.ell(72, 124, 6, 1.5, "#2a8a5a"); s.circ(72, 122, 2, "#F28AB2"); s.px(72, 121, "#FFE0F0");

    const cx = 45, cy = 78, R = 29;
    for (let a = 0; a < 360; a += 4) {
      const an = (a * Math.PI) / 180, x = cx + Math.cos(an) * R, y = cy + Math.sin(an) * R;
      const shimmer = (((a / 4) | 0) + f * 3) % 12 === 0;
      s.circ(x, y, 4, ((a / 8) | 0) % 2 ? "#2A5AA0" : "#B87A3A");
      s.circ(cx + Math.cos(an) * (R + 2), cy + Math.sin(an) * (R + 2), 1.5, shimmer ? "#BEF4FF" : ((a / 8) | 0) % 2 ? "#4A8AD8" : "#E0A868");
      s.circ(cx + Math.cos(an) * (R - 3), cy + Math.sin(an) * (R - 3), 1.2, "#E8D4A0");
    }
    for (let a = 0; a < 360; a += 12) { const an = (a * Math.PI) / 180; s.px(cx + Math.cos(an) * (R - 3), cy + Math.sin(an) * (R - 3), "#A8905A"); }
    s.poly([[cx + 3, cy - R - 2], [cx + 10, cy - R + 1], [cx + 6, cy - R + 4]], "#B87A3A");
    for (const k of [-3, 3, -2, 2, -1, 1, 0]) {
      const lean = k * 0.18, hx = cx + k * 8, hy = cy - R - 9 - (3 - Math.abs(k)) * 3;
      const pt = (dx: number, dy: number): [number, number] => [hx + dx + dy * lean, hy + dy];
      s.line(...pt(0, 10), ...pt(0, 16), "#2A5AA0", 1, 3);
      s.poly([pt(-2, 10), pt(-6, 4), pt(-6, -1), pt(-3, -5), pt(3, -5), pt(6, -1), pt(6, 4), pt(2, 10)], "#2A5AA0");
      s.poly([pt(-1, 9), pt(-3, 4), pt(-3, 1), pt(3, 1), pt(3, 4), pt(1, 9)], "#E8D4A0");
      for (let y = 3; y < 9; y += 2) s.line(...pt(-2, y), ...pt(2, y), "#B8A070");
      for (const d of [-1, 1]) { s.px(...pt(d * 5, 0), "#4A8AD8"); s.px(...pt(d * 5, 3), "#4A8AD8"); }
      s.ell(...pt(0, -7), 3, 2.5, "#4A8AD8"); s.ell(...pt(0, -6), 2, 1.5, "#6AA8E8");
      s.px(...pt(-2, -8), "#FFD34E"); s.px(...pt(2, -8), "#FFD34E"); s.px(...pt(0, -5), "#1E3A6A");
      if ((k + f) % 3 === 0) { s.line(...pt(0, -4), ...pt(0, -1), "#FF2A4A"); }
      gf.px(...pt(-2, -8), "#FFE08a", 0.6); gf.px(...pt(2, -8), "#FFE08a", 0.6);
    }
    gb.ring(cx, cy, R + 6, "#8AB0FF", 0.18, 3);
    fg.rect(0, 135, W, 2, "#E0D6BE");
  },

  /** Ma'at no Salão do Julgamento: colunas de basalto, disco solar alado e a balança do coração contra a pena. */
  "A Balança": L => {
    const { b, gb, gf, fg, f } = L, p = pulse(f);
    b.grad(0, 0, W, 112, "#0e0a07", "#3a2a1a", 6);
    b.rect(10, 8, 70, 10, "#2a1e14"); b.line(10, 8, 80, 8, "#5a4028"); b.line(10, 17, 80, 17, "#1a120a");
    b.circ(45, 13, 4, "#E8A030"); b.circ(45, 13, 3, "#FFD050"); gb.blob(45, 13, 8, 6, "#FFD050", 1, 0.3);
    for (const sg of [-1, 1]) for (let k = 0; k < 4; k++) b.line(45 + sg * 5, 12 + k, 45 + sg * (22 - k * 3), 11 + k * 2, k % 2 ? "#40C0C0" : "#2A7A9A");
    for (let x = 12; x < 78; x += 5) if (Math.abs(x - 45) > 26) for (let y = 22; y < 60; y += 5) b.rect(x, y, 2, 3, "#4a3a28");
    const col = (x: number, w: number, top: number) => {
      pillar(b, x, top, 112, w, "#2a2a30", "#5a5a66", "#101014");
      b.poly([[x - 3, top], [x + w + 3, top], [x + w + 1, top - 6], [x + w / 2, top - 8], [x - 1, top - 6]], "#2A6A5A");
      b.line(x + w / 2, top - 7, x + w / 2, top, "#4AAA8A");
      for (let y = top + 8; y < 108; y += 10) b.line(x + 1, y, x + w - 2, y, "#1a1a20");
    };
    col(2, 7, 24); col(81, 7, 24); col(18, 5, 34); col(67, 5, 34);
    b.grad(0, 112, W, H - 112, "#3a2a1a", "#1a120a", 3);
    for (let y = 113; y < H; y += 4) { const sh = (y - 112) * 0.4; for (let x = -10; x < W + 10; x += 8) b.rect(Math.round(45 + (x - 45) * (1 + sh * 0.05)), y, 4, 2, ((x / 8 + y / 4) | 0) % 2 ? "#4a3620" : "#2a1e12"); }

    const scale = (x: number) => {
      const by = 96;
      b.rect(x, by, 2, 114 - by, "#B87333"); b.rect(x - 1, 110, 4, 3, "#8a5a2a"); b.circ(x + 1, by - 1, 2, "#F7D070");
      b.rect(x - 9, by + 1, 20, 2, "#D89050"); b.rect(x - 9, by + 1, 20, 1, "#F0B070");
      for (const dx of [-8, 10]) { b.line(x + dx, by + 3, x + dx - 3, by + 11, "#8a5a2a"); b.line(x + dx, by + 3, x + dx + 3, by + 11, "#8a5a2a"); b.ell(x + dx, by + 12, 5, 1.5, "#B87333"); }
      b.circ(x - 8, by + 9, 2, "#B01A2A"); b.px(x - 9, by + 8, "#FF5A6A");
      b.line(x + 9, by + 10, x + 12, by + 3, "#FFFFFF"); b.px(x + 11, by + 5, "#E0E0E0"); b.px(x + 10, by + 7, "#E0E0E0");
    };
    scale(12); scale(76);

    human(L, {
      T: 46, B: 132, detail: true, skin: "#B07A4A", robe: "#F0EDE4", trim: "#40C0C0", pattern: "stripes", patternCol: "#E0DCD0",
      collar: "#40C0C0", hair: "#0a0a0a", head: "feather", bareArms: true, bracelets: "#F7D070", earrings: "#F7D070", brow: "#0a0a0a",
      armL: "open", armR: "open",
      back: (L, { cx, T }) => {
        const s = L.s, w = SW[L.f];
        for (const sg of [-1, 1] as const) {
          const rows: [string, number, number][] = [["#40C0C0", 10, 34], ["#2A7A9A", 18, 42], ["#1A5A7A", 26, 48]];
          rows.forEach(([c, dy, len], ri) => {
            for (let k = 0; k < 9; k++) {
              const x0 = cx + sg * (9 + k * 4), y0 = T + 18 + k * 0.4 - ri, tip = T + dy + (len - dy) * (1 - Math.abs(k - 4) / 6) - ri * 2;
              s.line(x0, y0, x0 + sg, tip + w, c, 1, 3);
              if (ri === 2) s.px(x0 + sg, tip + w + 1, "#F7D070");
            }
          });
          s.line(cx + sg * 8, T + 17, cx + sg * 42, T + 18, "#8AE0E0", 1, 2);
        }
      },
      front: (L, { cx, T }) => { const s = L.s, hy = T + 7; s.px(cx - 5, hy, "#0a0a0a"); s.px(cx + 5, hy, "#0a0a0a"); for (let k = 0; k < 3; k++) s.line(cx - 7 + k, T + 17 + k, cx + 7 - k, T + 17 + k, k === 1 ? "#F7D070" : "#40C0C0"); },
    });
    gf.blob(45, 40, 8, 10, "#FFFFFF", 1, 0.15 + p * 0.05);
    fg.rect(0, 134, W, 4, "#0e0a07");
  },

  /** Inanna suspensa pelo tornozelo entre as raízes da terra e os cristais do submundo, com a auréola solar serena. */
  "A Suspensão": L => {
    const { b, gb, s, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, H, "#2a1a14", "#07040e", 7);
    b.grad(0, 0, W, 20, "#3a2618", "#2a1a14", 3);
    for (let i = 0; i < 12; i++) {
      const x = (r() * W) | 0, ln = 10 + r() * 26, sw = ((r() * 6) | 0) - 3;
      b.line(x, 0, x + sw, ln, "#1a0e08", 1, 3); b.line(x, 0, x + sw, ln, "#4a3020"); b.line(x + sw, ln, x + sw + 2, ln + 5, "#3a2418");
    }
    b.blob(45, 110, 50, 30, "#2a1450", 1, 0.6);
    for (let i = 0; i < 11; i++) {
      const x = (r() * W) | 0, h = 10 + r() * 22, w = 3 + ((r() * 3) | 0), c = i % 3 === 0 ? "#3AC0D0" : i % 2 ? "#6A3AA0" : "#9A6AE0";
      b.poly([[x - w, 137], [x, 137 - 16 - h], [x + w, 137]], c); b.line(x, 137 - 16 - h, x, 132, "#E0D0FF"); b.line(x + 1, 137 - 14 - h, x + w - 1, 134, shade(c, 0.6));
      gb.blob(x, 137 - 10 - h / 2, 6, 10, c, 1, 0.25);
    }
    particles(gf, r, 18, "#9AE0FF", f, -1, 24, 130, 5);

    const sheet = new Buf();
    human(withSprite(L, sheet), {
      T: 42, B: 126, pose: "dance", detail: true, still: true, skin: "#C89070", legs: "#C89070", robe: "#1E3A6E", trim: "#F7D070",
      pattern: "stars", patternCol: "#8AA8FF", hair: "#1a0e08", necklace: "#3A6AE0", bracelets: "#F7D070", armL: "up", armR: "up",
      front: (L, { cx, T }) => {
        const s = L.s;
        for (let k = 0; k < 8; k++) { const an = (k * Math.PI) / 4; s.px(cx + Math.round(Math.cos(an) * 2), T + 26 + Math.round(Math.sin(an) * 2), "#F7D070"); }
        s.px(cx, T + 26, "#FFF3B0");
      },
    });
    s.over(sheet.flipV());
    const hx = 45, hy = H - 1 - (42 + 7);
    gb.blob(hx, hy + 1, 18, 18, "#FFE08a", 1, 0.3 + p * 0.06); gf.ring(hx, hy + 1, 13, "#F7D070", 0.7, 2); rays(gb, hx, hy + 1, 12, 22, "#FFE08a", 0.35, f * 0.05);
    for (let k = -5; k <= 5; k += 2) s.line(hx + k, hy + 5, hx + k + SW[(k + 5 + f) % 4]!, hy + 18 + Math.abs(k) % 3, "#1a0e08", 1, 2);
    const fx = 45 - 6, fy = H - 1 - 126;
    s.line(fx, 0, fx + 1, fy - 2, "#6ADA7A", 1, 2); for (let y = 4; y < fy; y += 6) s.px(fx + 2 - (y % 12 ? 0 : 3), y, "#AFFFC0");
    s.line(fx - 2, fy - 2, fx + 3, fy + 1, "#6ADA7A", 1, 2);
    gf.line(fx, 0, fx + 1, fy, "#AFFFC0", 0.35);
    fg.rect(0, 136, W, 2, "#07040e");
  },

  /** Anúbis às margens do Nilo espiritual: barca solar em águas negras, névoa baixa e juncos secos. */
  "A Passagem": L => {
    const { b, gb, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 88, "#030306", "#1a1834", 6); stars(b, r, 22, 76, f);
    b.blob(70, 20, 10, 10, "#8A8AC0", 1, 0.4); b.circ(70, 20, 3, "#E6ECF4");
    b.poly([[4, 88], [18, 70], [32, 88]], "#0e0c1a"); b.poly([[26, 88], [36, 76], [46, 88]], "#12101e"); b.line(18, 70, 32, 88, "#2a2840");
    for (const x of [58, 66, 80]) { b.line(x, 88, x + 1, 74, "#0a0a14", 1, 2); for (let k = 0; k < 5; k++) b.line(x + 1, 74, x + 1 + (k - 2) * 3, 75 + Math.abs(k - 2), "#0a0a14"); }
    b.rect(0, 86, W, 4, "#0e0e1c");
    b.grad(0, 90, W, 30, "#06080f", "#010206", 3);
    for (let i = 0; i < 14; i++) { const x = ((r() * W + f * 3) | 0) % W, y = 92 + ((r() * 26) | 0); b.rect(x, y, 3 + (i % 3), 1, "#C8D0E0", 0.55); }
    b.poly([[4, 96], [30, 96], [34, 90], [32, 94], [26, 99], [8, 99], [2, 94], [0, 90]], "#B8862B");
    b.line(4, 95, 30, 95, "#F7D070"); b.rect(14, 88, 8, 6, "#6a4a1a");
    b.circ(18, 83, 4, "#FFD34E"); b.circ(17, 82, 2, "#FFF3B0"); gb.blob(18, 83, 10, 8, "#FFD34E", 1, 0.35 + p * 0.06);
    for (let y = 100; y < 112; y += 2) b.px(18 + SW[(y + f) % 4]!, y, "#FFD34E", 0.6);
    mist(b, 84, 3, "#8A8AA0", 0.25, f);
    b.grad(0, 120, W, H - 120, "#1a1a14", "#0a0a08", 3);

    human(L, {
      T: 40, B: 128, tunic: true, detail: true, skin: "#3a2a1f", legs: "#3a2a1f", robe: "#F0EDE4", trim: "#F7D070", pattern: "stripes", patternCol: "#D8D4C8",
      collar: "#F7D070", bare: true, bareArms: true, bracelets: "#F7D070", head: "jackal", armL: "fwd", l: "ankh", armR: "hold", r: "jar",
      front: (L, { cx, T }) => {
        const s = L.s, hy = T + 7;
        s.poly([[cx - 3, T + 34], [cx + 3, T + 34], [cx + 5, T + 52], [cx - 5, T + 52]], "#F7D070"); for (let y = T + 37; y < T + 52; y += 3) s.line(cx - 3, y, cx + 3, y, "#2a4aa0");
        for (let k = 0; k < 3; k++) s.line(cx - 7 + k, T + 17 + k, cx + 7 - k, T + 17 + k, k === 1 ? "#2a4aa0" : "#F7D070");
        for (const sg of [-1, 1]) s.rect(45 + sg * 12 - 1, T + 22, 3, 1, "#F7D070");
        s.poly([[cx + 5, hy - 2], [cx + 14, hy + 2], [cx + 13, hy + 5], [cx + 5, hy + 4]], "#141414"); s.px(cx + 14, hy + 3, "#3a3a3a");
        s.line(cx + 5, hy - 2, cx + 13, hy + 1, "#3a3a3a");
        L.gf.blob(cx - 17, T + 17, 7, 9, "#E0F0FF", 1, 0.25 + pulse(L.f) * 0.08);
      },
    });
    for (let i = 0; i < 16; i++) {
      const x = (r() * W) | 0, h = 10 + ((r() * 16) | 0), sw = SW[(i + f) % 4]!;
      fg.line(x, 137, x + sw, 137 - h, "#0a0806");
      if (i % 3 === 0) { for (let k = -2; k <= 2; k++) fg.px(x + sw + k, 136 - h - (2 - Math.abs(k)), "#6a5a30"); } else fg.px(x + sw, 137 - h, "#8a7a50");
    }
  },

  /** Íris entre a cachoeira dupla e o arco-íris, vertendo o líquido entre dois jarros sem derramar. */
  "A Síntese": L => {
    const { b, gb, s, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 118, "#3a6ab0", "#E0F2FA", 7);
    b.blob(45, 118, 30, 30, "#F4FAFF", 1, 0.3);
    for (const [x0, dir] of [[0, 1], [90, -1]] as const) {
      b.poly([[x0, 0], [x0 + dir * 22, 0], [x0 + dir * 20, 30], [x0 + dir * 24, 60], [x0 + dir * 18, 118], [x0, 118]], "#4a5a6a");
      b.line(x0 + dir * 22, 0, x0 + dir * 20, 30, "#7a8a9a"); b.line(x0 + dir * 20, 30, x0 + dir * 24, 60, "#7a8a9a");
      const wx = dir > 0 ? 10 : 70;
      b.rect(wx, 6, 10, 112, "#9AD8F0");
      for (let y = 6; y < 118; y++) for (let i = 0; i < 10; i++) if ((y + f * 3 + i * 5) % 6 < 2) b.px(wx + i, y, "#FFFFFF");
      b.blob(wx + 5, 114, 14, 6, "#FFFFFF", 1.3, 0.85);
    }
    ["#FF4A4A", "#FF9A2A", "#FFE04A", "#5ADA5A", "#4A9AFF", "#6A4AE0", "#B07AFF"].forEach((c, k) => b.ring(45, 130, 100 - k * 2, c, 0.8, 2));
    b.grad(0, 118, W, H - 118, "#62B6CB", "#1B4965", 4);
    for (let y = 121; y < H; y += 3) for (let x = 0; x < W; x++) if ((x + y * 2 + f * 2) % 12 < 2) b.px(x, y, "#BEF4FF", 0.6);
    for (let i = 0; i < 18; i++) gf.px((r() * W) | 0, 60 + ((r() * 70) | 0), "#FFFFFF", (i + f) % 3 ? 0.3 : 0.95);
    s.ell(36, 127, 12, 3, "#5a6a7a"); s.ell(36, 126, 10, 2, "#7a8a9a");
    gb.ring(54, 128, 3 + (f % 2), "#FFFFFF", 0.6, 1);

    human(L, {
      T: 46, B: 126, detail: true, skin: "#F0D8C0", robe: "#F4F0FF", trim: "#C0A0FF", pattern: "dots", patternCol: "#D8C8FF",
      hairLong: true, hairLen: 40, hair: "#E8C070", necklace: "#C0A0FF", bracelets: "#F7D070", eye: "#6A4AE0", wings: { type: "iris" }, armL: "fwd", armR: "hold",
      back: (L, { cx, T }) => {
        const C = ["#FF6A6A", "#FFB04A", "#FFF06A", "#6AE06A", "#6AB0FF", "#B07AFF"];
        for (const sg of [-1, 1]) C.forEach((c, q) => L.s.line(cx + sg * 6, T + 18, cx + sg * (8 + 30 * (1 - q * 0.12)), T + 4 + q * 5 + SW[L.f], c, 0.6));
      },
      front: (L, _fig, h) => {
        const s = L.s;
        const jar = (x: number, y: number, c: string, lt: string) => { s.poly([[x - 2, y - 1], [x + 2, y - 1], [x + 3, y + 3], [x + 2, y + 6], [x - 2, y + 6], [x - 3, y + 3]], c); s.rect(x - 1, y - 3, 3, 2, c); s.px(x - 2, y + 2, lt); };
        jar(h.L[0], h.L[1] - 1, "#D8A040", "#FFE08a"); jar(h.R[0], h.R[1] - 1, "#B8C0CC", "#F0F4F8");
        const RB = ["#FF6A6A", "#FFB04A", "#FFF06A", "#6AE06A", "#6AB0FF", "#B07AFF"];
        for (let t = 0; t <= 16; t++) {
          const x = h.L[0] + ((h.R[0] - h.L[0]) * t) / 16, y = h.L[1] - 3 + ((h.R[1] - h.L[1]) * t) / 16 - Math.sin((Math.PI * t) / 16) * 9;
          L.gf.rect(Math.round(x), Math.round(y), 2, 2, RB[(t + L.f) % 6]!); L.gf.px(x, y + 2, "#FFFFFF", 0.5);
        }
        L.gf.blob((h.L[0] + h.R[0]) / 2, h.L[1] - 10, 10, 6, "#FFFFFF", 1, 0.2 + pulse(L.f) * 0.06);
      },
    });
    void p;
    rocks(fg, r, 135, 6, "#0B1A24");
  },

  /** Mara no trono de obsidiana: olhos em brasa, joias, e fios dourados que prendem duas almas sorridentes. */
  "As Correntes": L => {
    const { b, gb, s, gf, fg, f } = L, p = pulse(f);
    b.grad(0, 0, W, H, "#020402", "#0e1a10", 6);
    const facet = (pts: [number, number][], c: string, edge: string) => { b.poly(pts, c); b.line(pts[0]![0], pts[0]![1], pts[1]![0], pts[1]![1], edge); };
    facet([[0, 0], [20, 0], [12, 40], [0, 50]], "#060808", "#2a4a3a"); facet([[12, 40], [22, 90], [8, 132], [0, 132], [0, 50]], "#0a0c0c", "#1a3a2a");
    facet([[90, 0], [70, 0], [78, 50], [90, 60]], "#060808", "#2a4a3a"); facet([[78, 50], [68, 100], [82, 132], [90, 132], [90, 60]], "#0a0c0c", "#1a3a2a");
    for (let i = 0; i < 9; i++) { const x = 18 + i * 7, len = 6 + ((i * 7) % 11); b.poly([[x - 2, 0], [x + 2, 0], [x, len]], "#0a0e0c"); }
    for (const [x, y] of [[14, 60], [76, 60]] as const) {
      b.rect(x - 1, y, 3, 2, "#3a2a1a"); b.rect(x, y + 2, 1, 8, "#3a2a1a");
      flame(b, x, y, 8, f, ["#E0FFE0", "#6AFF8A", "#1A8A3A"]); gb.blob(x, y - 4, 16, 16, "#6AFF8A", 1, 0.3 + p * 0.05);
    }
    b.grad(0, 118, W, H - 118, "#0a120a", "#040604", 3);

    s.poly([[26, 124], [64, 124], [62, 60], [58, 40], [45, 30], [32, 40], [28, 60]], "#0a0a10");
    s.line(32, 40, 45, 30, "#3a5a4a"); s.line(45, 30, 58, 40, "#2a3a34"); s.line(28, 60, 32, 40, "#3a5a4a");
    s.circ(45, 38, 2, "#2AE06A"); gf.blob(45, 38, 5, 5, "#6AFF8A", 1, 0.4 + p * 0.1);
    for (const x of [24, 66]) { s.rect(x - 2, 96, 6, 4, "#0a0a10"); s.circ(x + 1, 95, 2, "#1a1a24"); }

    const hands = human(L, {
      T: 60, B: 120, pose: "seat", detail: true, skin: "#7A7A82", robe: "#1a0f24", trim: "#F7D070", sleeve: "#1a0f24",
      head: "crown", crownCol: "#F7D070", gem: "#6AFF8A", hair: "#2a2a30", eye: "#FF3020", eyeGlow: "#FF3020",
      necklace: "#F7D070", bracelets: "#F7D070", earrings: "#6AFF8A", sash: "#F7D070", armL: "open", armR: "open",
      front: (L, { cx, T }, h) => {
        const s = L.s;
        for (const [dx, dy] of [[-4, 20], [3, 22], [0, 26], [-2, 29], [4, 28]] as const) s.px(cx + dx, T + dy, "#F7D070");
        for (const sg of [-1, 1] as const) { const [hx, hy] = sg < 0 ? h.L : h.R; for (let k = 0; k < 3; k++) s.line(hx + sg, hy, hx + sg * 3, hy + 3 + k, "#8A8A92"); }
        for (const sg of [-1, 1]) s.poly([[cx + sg * 3, T - 1], [cx + sg * 6, T - 8], [cx + sg * 5, T - 1]], "#F7D070");
      },
    });
    ([[14, 122], [76, 122]] as const).forEach(([x, y], i) => {
      const h = i ? hands.R : hands.L, sg = i ? 1 : -1;
      for (let k = 0; k < 3; k++) gf.line(h[0] + sg * (1 + k), h[1] + 3 + k, x + (k - 1) * 2, y - 8 + SW[(f + k) % 4]!, "#F7D070", 0.75);
      fg.circ(x, y - 4, 4, "#4a7a4a"); fg.poly([[x - 5, y - 1], [x + 5, y - 1], [x + 7, y + 11], [x - 7, y + 11]], "#4a7a4a");
      fg.circ(x + 1, y - 3, 3, "#1a261a"); fg.poly([[x - 3, y], [x + 5, y], [x + 6, y + 11], [x - 5, y + 11]], "#1a261a");
      fg.px(x - 1, y - 4, "#C8D0B0"); fg.px(x + 2, y - 4, "#C8D0B0"); fg.px(x - 1, y - 2, "#A8B090"); fg.px(x, y - 1, "#A8B090"); fg.px(x + 1, y - 1, "#A8B090"); fg.px(x + 2, y - 2, "#A8B090");
      fg.line(x - 4, y + 4, x + sg * 12, 137, "#5A5A5A"); for (let k = 0; k < 4; k++) fg.px(x - 4 + ((sg * 12 + 4) * k) / 4, y + 4 + ((133 - y) * k) / 4, "#8A8A8A");
      fg.ring(x + sg * 12, 136, 2, "#5A5A5A", 1, 1);
    });
  },

  /** Shiva Nataraja dança no anel de fogo enquanto a torre se parte sob o meteoro e as cinzas chovem. */
  "O Colapso": L => {
    const { b, gb, s, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, H, "#1a0303", "#A02A10", 7);
    for (let i = 0; i < 7; i++) b.blob((r() * W) | 0, (r() * 70) | 0, 18, 6, i % 2 ? "#5a1008" : "#7a1a0a", 1.2);
    b.poly([[34, 110], [36, 20], [44, 16], [44, 110]], "#2a1a1a"); b.poly([[46, 110], [46, 18], [54, 14], [57, 110]], "#241616");
    for (let y = 24; y < 110; y += 7) { b.line(35, y, 43, y - 1, "#1a1010"); b.line(47, y - 1, 56, y - 2, "#1a1010"); }
    b.poly([[43, 16], [47, 16], [45, 60], [47, 90], [44, 110], [43, 70]], "#FF7A1A"); b.line(45, 20, 45, 104, "#FFE070");
    for (let k = 0; k < 6; k++) b.rect(40 + ((k * 7) % 14), 10 - k * 2 + f, 2, 2, "#3a2020");
    b.line(88, 0, 58, 16, "#FF9A2A", 1, 4); b.line(88, 2, 60, 17, "#FFE070", 1, 2); b.circ(57, 17, 4, "#FFF3B0"); gb.blob(57, 17, 14, 12, "#FFB020", 1, 0.45);
    b.grad(0, 118, W, H - 118, "#2a0a06", "#120402", 3);

    const cx = 45, cy = 78, R = 36;
    gb.ring(cx, cy, R, "#FF9A2A", 0.9, 2); gb.ring(cx, cy, R - 3, "#FFD34E", 0.5, 1);
    for (let k = 0; k < 28; k++) {
      const an = (k * Math.PI * 2) / 28, x = cx + Math.cos(an) * (R + 2), y = cy + Math.sin(an) * (R + 2);
      const h = 4 + ((k + f) % 3), tx = x + Math.cos(an) * h, ty = y + Math.sin(an) * h;
      gb.line(x, y, tx, ty, "#FF7A1A"); gb.px(tx, ty, "#FFE070");
    }
    gb.blob(cx, cy, R, R, "#FF6A1A", 1, 0.12);

    s.ell(38, 128, 7, 3, "#1a2a3a"); s.circ(32, 126, 2.5, "#1a2a3a"); s.px(31, 125, "#8a8a8a");
    human(L, {
      T: 44, B: 126, pose: "dance", detail: true, skin: "#5B7FA8", legs: "#5B7FA8", robe: "#D89040", trim: "#3a2a10",
      pattern: "stripes", patternCol: "#3a2a10", bare: true, bareArms: true, hair: "#2a1a10", necklace: "#F7D070", bracelets: "#F7D070",
      eye: "#1a1a2a", armL: "open", armR: "up", r: "damaru",
      back: (L, { cx, T }) => {
        const s = L.s;
        for (let k = 0; k < 5; k++) for (const sg of [-1, 1]) {
          const y0 = T + 3 + k * 2, wave = SW[(L.f + k) % 4]! * sg;
          s.line(cx + sg * 5, y0, cx + sg * (14 + k * 3), y0 - 2 + wave, "#2a1a10", 1, 2);
          s.line(cx + sg * (14 + k * 3), y0 - 2 + wave, cx + sg * (22 + k * 2), y0 + 1 - wave, "#2a1a10");
          if (k % 2) s.px(cx + sg * (18 + k * 2), y0 - 1 + wave, "#F28AB2");
        }
      },
      front: (L, { cx, T }, h) => {
        const s = L.s;
        s.line(cx - 9, T + 18, cx - 2, T + 30, "#5B7FA8", 1, 3); s.line(cx - 2, T + 30, cx + 10, T + 44, "#5B7FA8", 1, 3); s.rect(cx + 9, T + 43, 3, 3, "#5B7FA8");
        s.line(cx + 9, T + 18, cx + 13, T + 26, "#5B7FA8", 1, 3); s.rect(cx + 12, T + 22, 3, 4, "#5B7FA8"); s.px(cx + 13, T + 21, "#5B7FA8");
        flame(s, h.L[0], h.L[1] - 1, 6, L.f, ["#FFF3B0", "#FF9A2A", "#E0321B"]);
        s.px(cx, T + 3, "#F4F0E8"); s.line(cx - 1, T + 2, cx + 1, T + 2, "#F4F0E8");
        crescent(s, cx + 5, T - 1, 2, "#F4F0E8", 1);
      },
    });
    particles(gf, r, 26, "#8A8A8A", f, 1, 0, 132, 4); particles(gf, r, 10, "#FF9A2A", f, -1, 60, 130, 5);
    gf.blob(45, 80, 10, 10, "#FFE070", 1, 0.08 + p * 0.04);
    rocks(fg, r, 134, 8, "#0a0202");
  },

  /** Amaterasu abre a cortina de trevas na gruta de Ama-no-Iwato; o sol estoura e banha o orvalho. */
  "A Aurora": L => {
    const { b, gb, s, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 118, "#3a1a5a", "#FFB26A", 7);
    b.blob(45, 104, 40, 24, "#FFD8A0", 1.2, 0.7);
    sun(b, 45, 108, 22, "#FFFBE8", "#FFE8A0", "#FFD08a");
    rays(gb, 45, 108, 22, 110, "#FFF3C0", 0.8, f * 0.05);
    const rock = (pts: [number, number][]) => { b.poly(pts, "#1a1020"); for (let i = 0; i < pts.length - 1; i++) b.line(pts[i]![0], pts[i]![1], pts[i + 1]![0], pts[i + 1]![1], "#3a2a40"); };
    rock([[0, 0], [28, 0], [16, 30], [22, 70], [12, 118], [0, 118]]); rock([[90, 0], [62, 0], [74, 30], [68, 70], [78, 118], [90, 118]]);
    b.poly([[0, 0], [90, 0], [72, 12], [45, 8], [18, 12]], "#1a1020");
    for (let i = 0; i < 12; i++) { const x = (r() * 20) | 0, y = (r() * 110) | 0; b.px(x, y, "#4a3a50"); b.px(W - 1 - x, y, "#4a3a50"); }
    b.circ(84, 104, 12, "#2a1e30"); b.circ(82, 100, 9, "#3a2a40"); b.line(76, 94, 82, 92, "#5a4a60");
    for (let x = 16; x <= 74; x++) { const y = Math.round(12 + Math.sin(((x - 16) / 58) * Math.PI) * 4); b.rect(x, y, 1, 2, "#C8A870"); if (x % 3 === 0) b.px(x, y + 2, "#8a6a40"); }
    for (const x of [26, 38, 52, 64]) { const y = Math.round(12 + Math.sin(((x - 16) / 58) * Math.PI) * 4) + 2; b.rect(x, y, 2, 2, "#FFFFFF"); b.rect(x + 1, y + 2, 2, 2, "#FFFFFF"); b.rect(x, y + 4, 2, 2, "#FFFFFF"); }
    b.grad(0, 118, W, H - 118, "#4a2a3a", "#1a0e18", 3);

    s.poly([[14, 16], [22, 16], [18 - SW[f], 122], [8, 122]], "#1a1030"); s.line(22, 16, 18 - SW[f], 122, "#3a2a5a");
    s.poly([[68, 16], [76, 16], [82, 122], [72 + SW[f], 122]], "#1a1030"); s.line(68, 16, 72 + SW[f], 122, "#3a2a5a");
    human(L, {
      T: 44, B: 128, detail: true, skin: "#F5DCC0", robe: "#FAFAF5", trim: "#F7D070", pattern: "diamonds", patternCol: "#F7D070",
      hairLong: true, hairLen: 42, hair: "#0a0a0a", earrings: "#F7D070", sash: "#C8102E", lips: "#C8303A", armL: "open", armR: "open",
      back: (L, { cx, T }) => {
        for (const sg of [-1, 1]) { L.s.rect(sg < 0 ? cx - 25 : cx + 16, T + 26, 10, 14, "#F0F0E8"); L.s.line(sg < 0 ? cx - 25 : cx + 16, T + 39, sg < 0 ? cx - 16 : cx + 25, T + 39, "#F7D070"); }
      },
      front: (L, { cx, T }) => {
        const s = L.s;
        s.rect(cx - 8, T + 30, 17, 5, "#C8102E"); s.line(cx - 8, T + 32, cx + 8, T + 32, "#F7D070");
        s.circ(cx, T + 23, 3, "#F7D070"); s.circ(cx, T + 23, 2, "#FFFFFF"); s.px(cx - 1, T + 22, "#FFF3B0");
        L.gf.blob(cx, T + 23, 8, 8, "#FFF3B0", 1, 0.35 + pulse(L.f) * 0.1);
        s.line(cx + 4, T + 1, cx + 8, T - 1, "#F7D070"); s.px(cx + 8, T - 2, "#C8102E"); s.px(cx + 9, T - 1, "#FFB7D0");
      },
    });
    const rooster = (x: number, y: number) => {
      s.ell(x, y, 3, 2.5, "#E8E0D0"); s.circ(x + 3, y - 3, 1.5, "#E8E0D0"); s.px(x + 3, y - 5, "#C8102E"); s.px(x + 4, y - 2, "#C8102E"); s.px(x + 5, y - 3, "#F7D070");
      s.poly([[x - 2, y - 1], [x - 6, y - 5 - (f % 2)], [x - 4, y + 1]], "#3a2a2a"); s.line(x, y + 2, x, y + 4, "#F7D070");
    };
    rooster(78, 90);
    rocks(fg, r, 134, 8, "#1a0e18");
    for (let i = 0; i < 10; i++) gf.px((r() * W) | 0, 128 + ((r() * 8) | 0), i % 2 ? "#FFB7D0" : "#FFE08a", (i + f) % 3 ? 0.35 : 1);
    void p;
  },

  /** Tsukuyomi no bambuzal sob a lua crescente; a água parada devolve um reflexo distorcido. */
  "O Labirinto": L => {
    const { b, gb, s, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 118, "#02050c", "#1a2a3a", 6); stars(b, r, 12, 50, f);
    b.blob(66, 22, 18, 18, "#6A7AA0", 1, 0.4); crescent(b, 66, 22, 9, "#E6ECF4", 4); b.px(62, 18, "#FFFFFF");
    const bamboo = (x: number, c: string, node: string, leaf: string, top: number) => {
      b.rect(x, top, 3, 118 - top, c); b.rect(x, top, 1, 118 - top, node);
      for (let y = top + 6; y < 118; y += 12) { b.rect(x - 1, y, 5, 1, node); b.line(x + 3, y, x + 8, y - 3, leaf); b.line(x + 8, y - 3, x + 11, y - 2, leaf); }
    };
    for (const x of [5, 16, 26, 36, 46, 82]) bamboo(x, "#1e3a3a", "#2e5a50", "#2a5a4a", 0);
    mist(b, 60, 3, "#8A9AB0", 0.2, f);
    for (const x of [2, 11, 21, 31, 86]) bamboo(x, "#12281c", "#2a4a30", "#1e4a2a", 0);
    mist(b, 88, 3, "#A8B8D0", 0.22, f);
    for (const x of [10, 78]) { b.rect(x - 3, 104, 7, 2, "#5a5a60"); b.rect(x - 2, 98, 5, 6, "#4a4a50"); b.rect(x - 1, 100, 3, 2, "#FFE8A0"); b.rect(x - 1, 106, 3, 10, "#4a4a50"); b.poly([[x - 4, 98], [x + 4, 98], [x, 94]], "#5a5a60"); gb.blob(x, 101, 7, 6, "#FFE8A0", 1, 0.35 + p * 0.06); }
    b.grad(0, 116, W, H - 116, "#0a1620", "#040a10", 3);

    human(L, {
      T: 40, B: 116, detail: true, skin: "#E8E0F0", robe: "#0E1630", trim: "#8A9AC0", pattern: "dots", patternCol: "#6A7AB0",
      hairLong: true, hairLen: 40, hair: "#C8D0E0", eye: "#8AB0FF", necklace: "#C8D0E0", armR: "fwd", r: "jadeblade", armL: "down",
      front: (L, { cx, T }) => { crescent(L.s, cx - 5, T + 1, 2.5, "#F4F8FF", 1.5); L.gf.px(cx - 5, T, "#FFFFFF"); },
    });
    const sd = s.d;
    for (let y = 117; y < 137; y++) {
      const src = 115 - (y - 117) * 1.2, off = Math.round(Math.sin((y + f * 2) * 0.7) * 2);
      if (src < 0) break;
      for (let x = 0; x < W; x++) {
        const sx = Math.min(W - 1, Math.max(0, x + off)), i = (Math.round(src) * W + sx) * 4, bi = (Math.round(src) * W + sx) * 4;
        if (sd[i + 3]) gf.px(x, y, [sd[i]! * 0.55, sd[i + 1]! * 0.6, sd[i + 2]! * 0.8], 0.55);
        else { const d = b.d; b.px(x, y, [d[bi]! * 0.55, d[bi + 1]! * 0.6, d[bi + 2]! * 0.75], 0.6); }
      }
    }
    for (let x = 0; x < W; x += 4) gf.px(x + (f % 2), 117, "#C8D8FF", 0.6);
    fg.rect(1, 0, 3, 137, "#020806"); fg.rect(86, 0, 3, 137, "#020806");
    for (const x of [1, 86]) for (let y = 10; y < 137; y += 14) fg.line(x + 1, y, x + (x < 45 ? 8 : -6), y - 3, "#020806");
  },

  /** Hélio no zênite: carruagem de ouro, cavalos solares empinados e girassóis gigantes sob o cobalto puro. */
  "O Zênite": L => {
    const { b, gb, s, fg, f } = L, p = pulse(f);
    b.grad(0, 0, W, 118, "#0a2a9a", "#4a8aea", 7);
    rays(gb, 45, 36, 24, 70, "#FFF3B0", 0.55, f * 0.06);
    sun(b, 45, 36, 16, "#FFFFFF", "#FFE066", "#FFD34E"); gb.blob(45, 36, 30, 30, "#FFF3B0", 1, 0.3 + p * 0.06);
    b.grad(0, 112, W, H - 112, "#3a8a3a", "#123a1e", 3);

    const steed = (x: number, y: number, sg: 1 | -1) => {
      const c = "#FFE08a", d = "#E0A020", hoof = "#8a4a00", up = f % 2;
      s.line(x, y - 12, x - 2 * sg, y, d, 1, 2); s.line(x + 3 * sg, y - 12, x + 4 * sg, y, d, 1, 2); s.rect(x - 2 * sg - 1, y, 3, 1, hoof); s.rect(x + 4 * sg - 1, y, 3, 1, hoof);
      s.poly([[x - 3 * sg, y - 9], [x - 5 * sg, y - 18], [x + 6 * sg, y - 26], [x + 15 * sg, y - 31], [x + 17 * sg, y - 23], [x + 6 * sg, y - 12]], c);
      s.line(x - 4 * sg, y - 17, x + 14 * sg, y - 30, "#FFF8D8");
      s.poly([[x + 11 * sg, y - 28], [x + 13 * sg, y - 37], [x + 19 * sg, y - 39], [x + 19 * sg, y - 25]], c);
      s.poly([[x + 13 * sg, y - 39], [x + 18 * sg, y - 42], [x + 26 * sg, y - 34], [x + 25 * sg, y - 30], [x + 19 * sg, y - 33]], c);
      s.poly([[x + 14 * sg, y - 41], [x + 14 * sg, y - 46], [x + 17 * sg, y - 42]], c);
      s.px(x + 18 * sg, y - 39, "#3a1a00"); s.px(x + 25 * sg, y - 32, "#8a4a00"); s.line(x + 20 * sg, y - 33, x + 25 * sg, y - 30, d);
      s.line(x + 14 * sg, y - 25, x + 20 * sg, y - 22 - up, d, 1, 2); s.line(x + 20 * sg, y - 22 - up, x + 21 * sg, y - 28 - up, d, 1, 2);
      s.line(x + 11 * sg, y - 23, x + 16 * sg, y - 17 + up, d, 1, 2); s.line(x + 16 * sg, y - 17 + up, x + 19 * sg, y - 21 + up, d, 1, 2);
      for (let k = 0; k < 5; k++) flame(s, x + (13 - k) * sg, y - 42 + k * 3, 4 + ((k + f) % 2) * 2, f, ["#FFFFFF", "#FFF3B0", "#FF9A2A"]);
      flame(s, x - 6 * sg, y - 16, 7, f, ["#FFF3B0", "#FF9A2A", "#E0321B"]);
      gb.blob(x + 8 * sg, y - 24, 16, 16, "#FFB020", 1, 0.3);
    };
    steed(10, 118, 1); steed(80, 118, -1);

    human(L, {
      T: 44, B: 120, detail: true, skin: "#D8A070", robe: "#FFFFFF", trim: "#F7D070", pattern: "stars", patternCol: "#F7D070",
      hair: "#FFD34E", head: "rays12", eye: "#3A6AE0", necklace: "#F7D070", bracelets: "#F7D070", armL: "fwd", armR: "fwd", l: "reins", r: "reins",
    });
    s.poly([[26, 98], [64, 98], [60, 118], [30, 118]], "#F7D070"); s.poly([[28, 100], [62, 100], [59, 116], [31, 116]], "#D8A020");
    for (let x = 32; x < 60; x += 4) s.px(x, 108, "#FFF3B0");
    s.line(26, 98, 64, 98, "#FFF3B0");
    for (const wx of [30, 60]) { s.ring(wx, 120, 7, "#B8862B", 1, 2); s.circ(wx, 120, 2, "#F7D070"); for (let k = 0; k < 8; k++) { const an = (k * Math.PI) / 4 + f * 0.4; s.line(wx, 120, wx + Math.cos(an) * 5, 120 + Math.sin(an) * 5, "#B8862B"); } }

    for (const [x, y, rad] of [[6, 122, 7], [84, 124, 7], [22, 132, 5], [70, 132, 5]] as const) {
      fg.line(x, 137, x, y, "#1a4a1a", 1, 2); fg.ell(x + (x < 45 ? 4 : -4), y + 8, 4, 2, "#2a6a2a");
      for (let k = 0; k < 12; k++) { const an = (k * Math.PI) / 6; fg.line(x, y, x + Math.cos(an) * rad, y + Math.sin(an) * rad, "#FFD34E"); }
      fg.circ(x, y, rad * 0.45, "#5a3a10"); fg.px(x - 1, y - 1, "#8a5a20");
    }
  },

  /** Gabriel sopra a trombeta na aurora cósmica; nuvens de ouro giram e as almas se erguem das tumbas. */
  "O Chamado": L => {
    const { b, gb, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, 116, "#05050f", "#E8B04A", 7);
    for (let i = 0; i < 90; i++) {
      const t = i / 90, an = t * 9 + f * 0.15, rad = 4 + t * 50;
      b.blob(45 + Math.cos(an) * rad, 22 + Math.sin(an) * rad * 0.55, 5 + t * 4, 3 + t * 2, t < 0.5 ? "#FFE8A0" : "#B8862B", 1.2, 0.35);
    }
    b.blob(45, 22, 16, 12, "#FFF8E0", 1.3, 0.9);
    rays(gb, 45, 22, 16, 60, "#FFF3C0", 0.4, f * 0.05);
    stars(b, r, 12, 30, f);
    b.poly([[0, 116], [14, 104], [28, 110], [40, 102], [54, 108], [70, 100], [90, 110], [90, 137], [0, 137]], "#2a2030");
    b.poly([[0, 120], [20, 112], [40, 118], [60, 112], [90, 118], [90, 137], [0, 137]], "#1a1420");
    for (let x = 4; x < W; x += 9) b.px(x, 104 + ((x * 3) % 8), "#5a4a50");

    human(L, {
      T: 30, B: 106, detail: true, noFeet: true, skin: "#F0D8C0", robe: "#FAFAFF", trim: "#F7D070", pattern: "stars", patternCol: "#E8D8A0",
      hair: "#E8C070", halo: "#FFF3B0", eye: "#3A6AB0", necklace: "#F7D070",
      wings: { c: "#FFFFFF", c2: "#F7D070", glow: "#FFF3B0" }, armR: "fwd", r: "trumpet", armL: "down",
      back: (L, { cx, T }) => {
        const s = L.s, w = SW[L.f];
        for (const sg of [-1, 1]) for (let k = 0; k < 6; k++) {
          const x0 = cx + sg * (8 + k * 5), y0 = T + 14 + k * 2, len = 36 - k * 2;
          s.line(x0, y0, x0 + sg * 4, y0 + len + w, k % 2 ? "#F0F0F8" : "#E0E0EC", 1, 3);
          s.px(x0 + sg * 4, y0 + len + w + 1, "#F7D070");
        }
      },
      front: (L, { cx, B }) => L.gf.blob(cx, B + 2, 14, 4, "#FFFFFF", 1, 0.35),
    });
    const note = (x: number, y: number, c: string) => { gf.line(x + 2, y - 5, x + 2, y, c); gf.rect(x, y, 3, 2, c); gf.px(x + 3, y - 5, c); gf.px(x + 4, y - 4, c); };
    for (let q = 0; q < 5; q++) { const d = 8 + q * 7 + f * 2; note(58 + d * 0.7, 26 - d * 0.5 + (q % 2 ? 3 : -2), q % 2 ? "#FFF3B0" : "#FFFFFF"); }
    gf.blob(45, 60, 20, 30, "#FFF3B0", 1, 0.08 + p * 0.04);

    for (const [x, y] of [[12, 126], [34, 130], [60, 128], [80, 124]] as const) {
      fg.rect(x - 5, y, 10, 6, "#6a6a78"); fg.rect(x - 5, y, 10, 1, "#8a8a98");
      fg.poly([[x - 6, y - 1], [x + 4, y - 5], [x + 6, y - 3], [x - 4, y + 1]], "#8a8a98");
      const sy = y - 10 - (f % 2);
      fg.circ(x, sy, 1.5, "#FFFFFF", 0.85); fg.rect(x - 1, sy + 2, 3, 6, "#FFFFFF", 0.8);
      fg.line(x - 1, sy + 2, x - 3, sy - 2, "#FFFFFF", 0.85); fg.line(x + 1, sy + 2, x + 3, sy - 2, "#FFFFFF", 0.85);
      gb.blob(x, sy + 3, 6, 8, "#FFFFFF", 1, 0.25);
    }
    rocks(fg, r, 136, 6, "#0a0810");
  },

  /** Brahma/Olorum em lótus universal, manto de céu estrelado e uma galáxia no peito, emoldurado pelos quatro arcos cardeais. */
  "O Cosmos": L => {
    const { b, gb, s, gf, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, H, "#03030c", "#1a0a3a", 6);
    b.blob(18, 30, 26, 16, "#5a1a7a", 1.2, 0.8); b.blob(72, 112, 28, 16, "#1a4a8a", 1.2, 0.8);
    b.blob(66, 36, 18, 12, "#8a1a5a", 1.1, 0.7); b.blob(22, 110, 18, 10, "#1a6a6a", 1.1, 0.6);
    stars(b, r, 50, 150, f, ["#FFFFFF", "#BEE9E8", "#FFD1E3", "#FFF3B0"]);
    for (const [x, y, d] of [[12, 18, -1], [74, 134, 1], [80, 60, 1]] as const) {
      for (let k = 0; k < 10; k++) b.px(x + d * k * 1.2, y + k * 0.6, "#BEE9E8", 0.7 - k * 0.06);
      b.circ(x, y, 1, "#FFFFFF"); gb.blob(x, y, 3, 3, "#BEE9E8", 1, 0.5);
    }
    const an = f * (Math.PI / 2);
    for (const k of [0, 1]) { const x = 78 + Math.cos(an + k * Math.PI) * 3, y = 20 + Math.sin(an + k * Math.PI) * 1.5; b.circ(x, y, 1, k ? "#FFB070" : "#8AC8FF"); gb.blob(x, y, 4, 4, k ? "#FFB070" : "#8AC8FF", 1, 0.45); }

    const ELEM: [number, number, string][] = [[45, 22, "#E07A5F"], [45, 138, "#62B6CB"], [7, 80, "#DDA15E"], [83, 80, "#D9DCD6"]];
    for (const [cx, cy, rad] of [[45, 44, 26], [45, 116, 26], [22, 80, 26], [68, 80, 26]] as const) b.ring(cx, cy, rad, "#B8862B", 0.9, 2);
    b.circ(45, 80, 30, "#0a0620", 0.6);
    for (const [x, y, c] of ELEM) { b.poly([[x - 3, y], [x, y - 4], [x + 3, y], [x, y + 4]], "#F7D070"); b.px(x, y, c); gb.blob(x, y, 5, 5, c, 1, 0.4 + p * 0.08); }

    const sheet = new Buf();
    for (let k = 0; k < 16; k++) { const a = (Math.PI * 2 * k) / 16; sheet.ell(45 + Math.cos(a) * 20, 124 + Math.sin(a) * 4, 5, 2, k % 2 ? "#8A7AFF" : "#E0D8FF"); }
    for (let k = 0; k < 8; k++) { const a = (Math.PI * 2 * k) / 8 + 0.2; sheet.ell(45 + Math.cos(a) * 12, 121 + Math.sin(a) * 3, 4, 2, "#F4F0FF"); }
    human(withSprite(L, sheet), {
      T: 68, B: 122, pose: "seat", detail: true, still: true, skin: "#C8B8FF", robe: "#140e40", trim: "#B8A8FF", hair: "#2a1a6a",
      head: "crown", crownCol: "#F7D070", gem: "#62F0FF", eye: "#FFF3B0", eyeGlow: "#FFF3B0", necklace: "#F7D070", armL: "chest", armR: "chest",
      back: (L, { cx, T }) => { for (const sg of [-1, 1]) { L.s.circ(cx + sg * 8, T + 8, 4, "#B0A0F0"); L.s.px(cx + sg * 10, T + 7, "#FFF3B0"); } },
    });
    const rr = rng(3);
    for (let i = 0; i < 26; i++) sheet.px(32 + ((rr() * 26) | 0), 86 + ((rr() * 34) | 0), i % 4 ? "#FFFFFF" : "#FFD1E3");
    s.over(sheet, 0.72);
    gb.blob(45, 100, 30, 34, "#C8B8FF", 1, 0.18 + p * 0.05);
    for (let i = 0; i < 60; i++) {
      const arm = i % 2, t = (i >> 1) / 30, a = t * 5 + arm * Math.PI + f * 0.4, rad = 1 + t * 8;
      gf.px(45 + Math.cos(a) * rad, 92 + Math.sin(a) * rad * 0.75, t < 0.3 ? "#FFFFFF" : i % 3 ? "#FFD1E3" : "#C8B8FF", 1 - t * 0.5);
    }
    gf.blob(45, 92, 8, 6, "#FFF3D0", 1.2, 0.45);
  },
};
