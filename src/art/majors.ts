import { Buf, H, SW, W, pulse, rng } from "../engine/buf";
import { dog, horse, raven, tiger } from "../engine/creatures";
import { drawItem, human } from "../engine/figure";
import { withSprite, type ArtFn } from "../engine/layers";
import {
  bolt, crescent, eclipse, flame, grass, hills, mist, moon, mountains, particles, pillar, rays, rocks, splitSky, stars, sun, tree,
} from "../engine/primitives";

export const MAJOR_ART: Record<string, ArtFn> = {
  "O Errante": L => {
    const { b, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#12031f", "#D23A78", 7);
    b.blob(22, 36, 28, 14, "#3a0a50", 1.1); b.blob(72, 64, 24, 12, "#5a1060", 1);
    stars(b, r, 26, 84, f);
    b.poly([[8, 112], [82, 112], [70, 124], [58, 136], [46, 144], [34, 136], [20, 124]], "#2a0808");
    b.poly([[22, 116], [40, 116], [44, 138], [32, 130]], "#3e100c");
    b.ell(45, 111, 38, 6, "#8a2818"); b.ell(45, 110, 36, 4, "#B8452A");
    b.line(12, 110, 78, 112, "#E0805A"); b.line(18, 113, 72, 107, "#E0805A");
    particles(gf, r, 16, "#FFD8A0", f, -1, 10, 110, 3);
    human(L, { T: 30, B: 110, pose: "step", skin: "#3b2418", robe: "#9E1B1B", trim: "#111111", sleeve: "#111111", head: "conical", hat: ["#9E1B1B", "#111111"], hair: "#111111", armR: "fwd", r: "ogo" });
    for (const [x, y, q] of [[10, 126, 3], [80, 118, 2], [72, 132, 2]] as const) fg.circ(x, y + SW[f], q, "#1a0406");
  },

  "O Alquimista": L => {
    const { b, gb, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#0a1a22", "#1f3a46", 6);
    for (let y = 4; y < 118; y += 7) {
      const off = ((y / 7) | 0) % 2 ? 0 : 6;
      for (let x = -off; x < W; x += 12) { b.rect(x, y, 12, 1, "#081218"); b.rect(x, y, 1, 7, "#081218"); }
    }
    b.rect(0, 118, W, H - 118, "#10222a"); b.line(0, 118, W, 118, "#2a4a56");
    const glyphs = ["101", "111", "010", "110", "011", "100", "111", "001"];
    for (let i = 0; i < 14; i++) {
      const x = 4 + (i % 2) * 74 + ((r() * 6) | 0), y = 10 + ((i / 2) | 0) * 14 + ((r() * 4) | 0), g = (r() * 6) | 0;
      const c = (i + f) % 4 === 0 ? "#BEFFFF" : "#3AD0E0";
      for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) if (glyphs[(g + j) % 8]![k] === "1") b.px(x + k, y + j, c);
      gb.blob(x + 1, y + 1, 4, 4, "#62F0FF", 1, 0.25);
    }
    human(L, { T: 40, B: 128, skin: "#8a5a3a", robe: "#EDE8DA", trim: "#F7D070", bareArms: true, bare: true, collar: "#F7D070", head: "ibis", armL: "hold", armR: "hold", l: "papyrus", r: "stylus" });
    ["#FF5A3A", "#3A8AFF", "#6ADA5A", "#FFFFFF"].forEach((c, i) => {
      const an = (f * Math.PI) / 2 + (i * Math.PI) / 2, x = 45 + Math.cos(an) * 19, y = 72 + Math.sin(an) * 5;
      gf.circ(x, y, 2, c); gf.blob(x, y, 5, 5, c, 1, 0.35);
    });
    fg.rect(4, 126, 82, 3, "#05080a"); fg.rect(8, 129, 3, 8, "#05080a"); fg.rect(79, 129, 3, 8, "#05080a");
    ([[14, "#6ADA5A"], [22, "#E04AE0"], [68, "#62F0FF"], [76, "#FFB020"]] as const).forEach(([x, c], i) => {
      fg.rect(x - 1, 117, 2, 4, "#05080a"); fg.circ(x, 123, 3, "#05080a"); fg.circ(x, 124, 2, c);
      gf.px(x, 120 - ((f + i) % 3), c); gf.blob(x, 123, 5, 4, c, 1, 0.3);
    });
  },

  "O Oráculo": L => {
    const { b, s, fg, r, f } = L;
    b.grad(0, 0, W, H, "#04050e", "#1c2440", 6); stars(b, r, 20, 70, f);
    b.blob(45, 26, 22, 18, "#6a7aa0", 1, 0.6); moon(b, 45, 26, 11, "#E6ECF4", "#B8C4D4");
    ([[6, 24], [33, 24], [60, 24]] as const).forEach(([x, w], i) => {
      const top = i === 1 ? 60 : 70;
      pillar(b, x, top, 116, 4, "#3a3f4c", "#5a6070", "#1e222c"); pillar(b, x + w - 4, top, 116, 4, "#3a3f4c", "#5a6070", "#1e222c");
      for (let a = 0; a <= 20; a++) {
        const an = Math.PI * (1 + a / 20);
        b.rect(Math.round(x + w / 2 - 2 + Math.cos(an) * (w / 2 - 2)), Math.round(top + Math.sin(an) * 10), 4, 2, a % 5 ? "#3a3f4c" : "#5a6070");
      }
    });
    b.grad(0, 116, W, H - 116, "#141828", "#0a0c16", 4);
    mist(b, 100, 3, "#8A9AB8", 0.25, f);
    human(L, {
      T: 42, B: 130, skin: "#E8D4C0", robe: "#2d1b3d", trim: "#9AA0B8", head: "triple", veil: "#C8C8E8", armL: "fwd", armR: "fwd", l: "torch", r: "torch",
      front: (L, { cx, T }) => { L.s.ring(cx - 4, T + 36, 1.5, "#6a6a78", 1, 1); L.s.rect(cx - 4, T + 37, 1, 5, "#6a6a78"); L.s.px(cx - 3, T + 41, "#6a6a78"); },
    });
    dog(s, 20, 132, "#A8C8FF", 0.5, 1); dog(s, 70, 132, "#A8C8FF", 0.5, -1);
    grass(fg, r, 134, 30, "#05060c");
  },

  "A Matriz": L => {
    const { b, s, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#0a2a1c", "#3a8a50", 6);
    b.rect(62, 8, 10, 104, "#9AE0F0");
    for (let y = 8; y < 112; y++) for (let x = 62; x < 72; x++) if ((y + f * 3 + x * 5) % 7 < 2) b.px(x, y, "#FFFFFF");
    b.blob(67, 112, 12, 5, "#FFFFFF", 1, 0.8);
    for (let i = 0; i < 16; i++) { const x = r() * W, y = r() * 30 - 4, q = 6 + r() * 8; b.circ(x, y, q, i % 2 ? "#123a22" : "#1a5030"); }
    for (let i = 0; i < 5; i++) {
      const x = 6 + i * 19, ln = 40 + r() * 30;
      b.line(x, 0, x + 2, ln, "#1f5a30"); b.px(x + 1, 30 + i * 5, "#F28AB2"); b.circ(x + 2, 44 + i * 3, 1.5, "#FF7A3A"); gf.px(x + 2, 44 + i * 3, "#FFD08a", 0.6);
    }
    b.grad(0, 112, W, H - 112, "#1e5a30", "#0e3a1e", 4);
    for (let k = 0; k < 16; k++) { const an = (Math.PI * 2 * k) / 16; s.ell(45 + Math.cos(an) * 16, 124 + Math.sin(an) * 4, 4, 2, k % 2 ? "#F28AB2" : "#FFD1E3"); }
    human(L, { T: 62, B: 124, pose: "seat", skin: "#C98A5A", robe: "#C8102E", trim: "#F7D070", hairLong: true, hair: "#1a0e08", head: "crown", halo: "#FFE08a", armL: "chest", armR: "chest", l: "lotus" });
    for (let i = 0; i < 8; i++) { const x = (r() * W) | 0, t = 124 + ((r() * 6) | 0); fg.poly([[x - 6, 137], [x, t], [x + 6, 137]], "#06140a"); }
  },

  "O Arquiteto": L => {
    const { b, gb, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, H, "#050520", "#1e3080", 6);
    ([[4, 6, 20], [80, 6, 20], [18, 4, 40], [68, 4, 40]] as const).forEach(([x, w, top], i) => {
      pillar(b, x, top, 114, w, i < 2 ? "#2a4fb0" : "#1e3a8a", "#7a9ff0", "#101e50");
      flame(b, x + w / 2, top - 4, 6, f, ["#FFF3B0", "#FFB020", "#E0521B"]); gb.blob(x + w / 2, top - 7, 6, 6, "#FFB020", 1, 0.3);
    });
    b.grad(0, 114, W, H - 114, "#2a3a90", "#0a0f30", 4);
    for (let x = 0; x < W; x += 2) b.px(x, 116 + ((x + f) % 4), "#6a8ff0", 0.35);
    const hebrew = [["111", "001", "111"], ["101", "101", "111"], ["110", "010", "011"], ["111", "100", "100"]];
    for (let i = 0; i < 10; i++) {
      const x = (r() * 80 + 4) | 0, y0 = r() * 100 + 10, y = Math.round((((y0 - f * 2) % 110) + 110) % 110 + 4), g = hebrew[i % 4]!;
      for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) if (g[j]![k] === "1") gf.px(x + k, y + j, "#F7D070", 0.85);
    }
    human(L, { T: 44, B: 132, skin: "#F3E6D0", robe: "#F8F4E3", trim: "#F7D070", hair: "#E8D8A0", halo: "#FFF3B0", wings: { type: "fire" }, armL: "chest", armR: "chest" });
    const cx = 45, cy = 71, R = 8, hx: [number, number][] = [];
    for (let k = 0; k < 6; k++) { const an = Math.PI / 6 + (k * Math.PI) / 3 + (f * Math.PI) / 24; hx.push([cx + Math.cos(an) * R, cy + Math.sin(an) * R]); }
    for (let k = 0; k < 6; k++) {
      const a = hx[k]!, c = hx[(k + 1) % 6]!, d = hx[(k + 2) % 6]!;
      gf.line(a[0], a[1], c[0], c[1], "#FFE08a"); gf.line(a[0], a[1], cx, cy, "#F7D070", 0.8); gf.line(a[0], a[1], d[0], d[1], "#F7D070", 0.45);
    }
    gf.circ(cx, cy, 1, "#FFFFFF"); gf.blob(cx, cy, 12, 12, "#FFE08a", 1, 0.25 + p * 0.08);
    fg.rect(0, 133, W, 5, "#050818");
  },

  "O Mentor": L => {
    const { b, s, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#06120e", "#2a3e38", 6);
    const curve = (pts: [number, number][], t: number, c: string) => { for (let i = 0; i < pts.length - 1; i++) b.line(pts[i]![0], pts[i]![1], pts[i + 1]![0], pts[i + 1]![1], c, 1, t); };
    curve([[20, 0], [40, 14], [70, 6], [92, 20]], 6, "#2a1c12");
    curve([[-4, 10], [10, 30], [16, 60], [12, 90], [20, 118]], 8, "#2a1c12"); curve([[94, 6], [80, 34], [74, 64], [80, 96], [70, 118]], 8, "#2a1c12");
    curve([[0, 60], [20, 70], [30, 90], [26, 118]], 4, "#4a3422"); curve([[90, 70], [68, 80], [62, 100], [66, 118]], 4, "#4a3422");
    b.grad(0, 116, W, H - 116, "#1a3a28", "#0a1a12", 4);
    const runes = [["010", "010", "111"], ["101", "110", "101"], ["100", "110", "101"], ["111", "010", "010"], ["110", "101", "110"]];
    for (let i = 0; i < 9; i++) {
      const x = (r() * 78 + 6) | 0, y = (r() * 80 + 14) | 0, g = runes[i % 5]!, c = (i + f) % 4 === 0 ? "#E0F6FF" : "#7FD4FF";
      for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) if (g[j]![k] === "1") gf.px(x + k, y + j - SW[f], c);
      gf.blob(x + 1, y + 1, 4, 4, "#7FD4FF", 1, 0.2);
    }
    human(L, { T: 42, B: 130, skin: "#D8B89A", robe: "#5a6064", cape: "#3a3f44", hair: "#D8D8D8", beard: "#E8E8E8", beardLong: true, head: "hat_wide", hatCol: "#454a50", oneEye: "#7FD4FF", armR: "hold", r: "spear" });
    raven(s, 32, 56, -1, f); raven(s, 58, 56, 1, f);
    mist(fg, 126, 2, "#9AB0A8", 0.35, f); grass(fg, r, 134, 20, "#06100a");
  },

  "O Pacto": L => {
    const { b, s, fg, r, f } = L;
    splitSky(b, (x, y) => x - 45 + (y - 80) * 0.6, ["#0a1a48", "#2a5ab0"], ["#3a2208", "#D8A030"]);
    eclipse(b, 45, 22, 8, "#FFE8A0", f);
    tree(b, 8, 118, 34, "#08101e", "#0a1830", 10); tree(b, 82, 118, 34, "#2a1a06", "#3a2408", 10);
    b.grad(0, 118, W, H - 118, "#1a2a1a", "#0a140a", 4);
    human(L, {
      cx: 29, T: 44, B: 130, skin: "#3B7BD4", robe: "#F7D070", trim: "#C8102E", hair: "#0a0a1a", head: "crown", gem: "#2AA060", armL: "down", armR: "fwd",
      front: (L, { cx, T }) => { L.s.line(cx + 3, T + 10, cx + 16, T + 12, "#8a5a2a"); L.s.line(cx, T - 4, cx + 3, T - 9, "#2AA060"); L.s.px(cx + 3, T - 10, "#3A8AFF"); },
    });
    human(L, { cx: 61, T: 46, B: 130, skin: "#E0A878", robe: "#F4A300", trim: "#C8102E", hairLong: true, hair: "#140a06", armL: "fwd", armR: "chest" });
    for (let t = 0; t <= 20; t++) {
      const x = 37 + t * 0.8, y = 62 + t * 0.1 + Math.sin((Math.PI * t) / 20) * 12;
      s.px(x, y, t % 2 ? "#F28AB2" : "#FFFFFF"); if (t % 5 === 0) s.circ(x, y, 1, "#FFD1E3");
    }
    grass(fg, r, 134, 30, "#0a120a");
    for (const [x, y] of [[12, 132], [30, 134], [62, 133], [80, 131]] as const) { fg.px(x, y, "#F28AB2"); fg.px(x + 1, y - 1, "#FFD1E3"); }
  },

  "O Conquistador": L => {
    const { b, gf, fg, f } = L;
    b.grad(0, 0, W, 62, "#FFE9A0", "#B8862B", 5); b.grad(0, 62, W, H - 62, "#2a2440", "#0a0a18", 6);
    for (let i = 0; i < 9; i++) b.blob(i * 11, 64 + ((i * 7) % 5), 10, 6, "#3a3456", 1.2);
    for (let i = 0; i < 7; i++) b.blob(i * 14 + 4, 60, 8, 4, "#D8B060", 1, 0.8);
    if (f === 1 || f === 3) bolt(b, rng(99 + f), 12 + ((f * 23) % 60), 66, 118, "#FFFFFF");
    human(L, {
      T: 44, B: 130, skin: "#F0D0B0", robe: "#9AA4AE", trim: "#F7D070", armor: "#DFE6EE", hair: "#E8C070", halo: "#F7D070",
      wings: { cl: "#B01030", cr: "#F4F4F4", c2: "#F7D070" }, armR: "high", r: "flamesword", armL: "down",
      front: (L, { cx, T, B }) => { for (let y = T + 38; y < B; y += 6) L.s.line(cx - 12, y, cx + 12, y, "#6a747e"); },
    });
    for (let i = 0; i < 5; i++) fg.blob(12 + i * 16, 138, 12, 6, "#05050a", 1.3);
    for (let i = 0; i < 8; i++) { const an = i * 0.8 + f * 0.4; gf.px(45 + Math.cos(an) * 14, 131 + Math.sin(an) * 3, "#FFF3B0", 0.9); }
  },

  "O Domínio": L => {
    const { b, s, fg, r, f } = L;
    b.grad(0, 0, W, H, "#2a1440", "#F09A50", 7);
    sun(b, 45, 88, 9, "#FFE8B0", "#FFD08a", "#FFB070");
    mountains(b, r, 112, 20, 42, "#6a5a8a", "#F0F4FF", 10); mountains(b, r, 120, 6, 16, "#A8B0D0", "#FFFFFF", 8);
    b.grad(0, 120, W, H - 120, "#E8EEF8", "#B8C4D8", 4);
    human(L, { cx: 38, T: 44, B: 130, skin: "#D8A070", robe: "#B0202A", trim: "#F7D070", armor: "#F7D070", head: "crown", hairLong: true, hair: "#140a06", multi: true, armL: "down", armR: "fwd" });
    tiger(s, 66, 130, f);
    fg.rect(0, 134, W, 4, "#C8D0E0");
    fg.line(6, 133, 20, 129, "#4a4460"); fg.line(18, 128, 20, 131, "#4a4460"); fg.line(74, 134, 86, 128, "#4a4460"); fg.line(84, 127, 88, 129, "#4a4460");
  },

  "O Buscador": L => {
    const { b, s, fg, f } = L;
    b.grad(0, 0, W, H, "#021016", "#0c2c3a", 6);
    hills(b, 110, 12, 0.08, 1, "#12303a"); hills(b, 122, 10, 0.11, 3, "#0a2430");
    const cx = 40, T = 40, B = 132, sw = SW[f];
    s.poly([[cx, T - 6], [cx + 7, T + 6], [cx + 16 + sw, B], [cx - 16 + sw, B], [cx - 7, T + 6]], "#B8903C");
    for (let k = -14; k <= 14; k += 2) s.line(cx + k * 0.3, T + 2 + Math.abs(k) * 0.4, cx + k + sw, B, k % 4 ? "#8A6A2A" : "#DCC070");
    for (const y of [T + 30, T + 60]) for (let x = cx - 14; x <= cx + 14; x += 2) s.px(x + sw, y + (x % 4 ? 1 : 0), "#6a4a1a");
    s.rect(cx + 11, T + 44, 3, 3, "#8A8A8A"); s.rect(cx - 14, T + 46, 3, 3, "#8A8A8A");
    const fig = { cx, T, B };
    drawItem(L, "lantern", cx + 13, T + 45, 1, fig);
    drawItem(L, "gourd", cx - 13, T + 46, -1, fig);
    fg.rect(0, 134, W, 4, "#03141a"); for (let x = 0; x < W; x += 3) fg.px(x, 133 - (((x / 9) | 0) % 2), "#03141a");
  },

  "O Ciclo": L => {
    const { b, s, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#07031a", "#2a1650", 6); stars(b, r, 30, 110, f);
    for (let i = 0; i < 40; i++) { const an = i * 0.5 + f * 0.3, rad = i * 0.55; gf.px(45 + Math.cos(an) * rad, 76 + Math.sin(an) * rad, i % 3 ? "#FFFFFF" : "#BEE9E8", 0.8); }
    for (const [x, y, q, c] of [[38, 70, 2, "#E07A5F"], [54, 82, 1.5, "#62B6CB"], [48, 64, 1, "#F7D070"]] as const) { gf.circ(x, y, q, c); gf.ring(x, y, q + 2, c, 0.4, 1); }
    b.grad(0, 114, W, H - 114, "#F4EEDC", "#C8BEA0", 4);
    for (let y = 116; y < H; y += 4) for (let x = 0; x < W; x++) if ((x + y + f * 2) % 13 < 3) b.px(x, y, "#FFFFFF");
    const cx = 45, cy = 78, R = 30;
    for (let a = 0; a < 360; a += 5) {
      const an = (a * Math.PI) / 180;
      s.circ(cx + Math.cos(an) * R, cy + Math.sin(an) * R, 4, ((a / 5) | 0) % 2 ? "#2A5AA0" : "#B87A3A");
      s.circ(cx + Math.cos(an) * (R - 3), cy + Math.sin(an) * (R - 3), 1.5, "#E0C080");
    }
    for (let k = -2; k <= 2; k++) {
      const x = cx + k * 8, y = cy - R - 6 - (2 - Math.abs(k)) * 3;
      s.ell(x, y, 4, 6, "#2A5AA0"); s.ell(x, y + 1, 2, 3, "#B87A3A"); s.px(x - 1, y - 2, "#F7D070"); s.px(x + 1, y - 2, "#F7D070");
    }
    fg.rect(0, 134, W, 4, "#E0D6BE");
  },

  "A Balança": L => {
    const { b, fg } = L;
    b.grad(0, 0, W, H, "#0e0a07", "#3a2a1a", 6);
    for (const x of [2, 14, 70, 82]) pillar(b, x, 16, 112, 6, "#2a2a30", "#5a5a66", "#101014");
    for (let y = 114; y < H; y += 3) for (let x = 0; x < W; x += 6) b.rect(x, y, 6, 3, ((x / 6 + (y - 114) / 3) | 0) % 2 ? "#3a2a1a" : "#2a1e12");
    for (const x of [16, 74]) {
      b.rect(x, 58, 2, 56, "#B87333"); b.rect(x - 8, 58, 18, 2, "#D89050");
      b.line(x - 7, 60, x - 7, 72, "#8a5a2a"); b.line(x + 9, 60, x + 9, 72, "#8a5a2a");
      b.ell(x - 7, 73, 4, 1.5, "#B87333"); b.ell(x + 9, 73, 4, 1.5, "#B87333");
    }
    human(L, { T: 46, B: 132, skin: "#B07A4A", robe: "#F0EDE4", trim: "#40C0C0", collar: "#40C0C0", hair: "#0a0a0a", head: "feather", bareArms: true, wings: { type: "arm", c: "#40C0C0", c2: "#1A6A8A" }, armL: "open", armR: "open" });
    fg.rect(0, 134, W, 4, "#0e0a07");
  },

  "A Suspensão": L => {
    const { b, gb, s, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#1d1030", "#0a0612", 6);
    for (let i = 0; i < 9; i++) { const x = (r() * W) | 0, ln = 8 + r() * 20; b.line(x, 0, x + ((r() * 6) | 0) - 3, ln, "#3a2418", 1, 2); }
    for (let i = 0; i < 9; i++) {
      const x = (r() * W) | 0, h = 10 + r() * 18;
      b.poly([[x - 4, H], [x, H - 26 - h], [x + 4, H]], i % 2 ? "#6A3AA0" : "#9A6AE0"); b.line(x, H - 26 - h, x, H - 20, "#D8B8FF");
    }
    particles(gf, r, 14, "#9AE0FF", f, -1, 20, 130, 5);
    const sheet = new Buf();
    human(withSprite(L, sheet), { T: 34, B: 122, tunic: true, skin: "#C89070", robe: "#1E3A6E", trim: "#F7D070", hair: "#1a0e08", legs: "#C89070", armL: "up", armR: "up", still: true });
    s.over(sheet.flipV());
    s.poly([[39, 120], [51, 120], [50 + SW[f], 134], [40 + SW[f], 134]], "#1a0e08");
    gb.ring(45, 119, 11, "#F7D070", 0.9, 2); gb.blob(45, 119, 16, 16, "#FFE08a", 1, 0.3);
    s.line(45, 4, 45, 36, "#6ADA7A", 1, 2); gf.line(45, 4, 45, 36, "#AFFFC0", 0.35);
    fg.rect(0, 136, W, 2, "#0a0612");
  },

  "A Passagem": L => {
    const { b, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#030306", "#14142a", 6); stars(b, r, 12, 70, f);
    b.rect(0, 90, W, 6, "#0e0e1c");
    b.grad(0, 96, W, 22, "#070a14", "#02040a", 3);
    for (let i = 0; i < 10; i++) { const x = ((r() * W + f * 3) | 0) % W, y = 98 + ((r() * 18) | 0); b.rect(x, y, 4, 1, "#C8D0E0", 0.6); }
    b.poly([[8, 98], [28, 98], [25, 102], [11, 102]], "#B8862B"); b.circ(18, 94, 3, "#FFD34E"); gf.blob(18, 94, 6, 6, "#FFD34E", 1, 0.3);
    mist(b, 86, 2, "#8A8AA0", 0.25, f);
    b.grad(0, 118, W, H - 118, "#1a1a14", "#0a0a08", 3);
    human(L, { T: 42, B: 130, skin: "#3a2a1f", robe: "#F0EDE4", trim: "#F7D070", collar: "#F7D070", bare: true, bareArms: true, head: "jackal", armL: "fwd", l: "ankh", armR: "hold", r: "jar" });
    for (let i = 0; i < 14; i++) {
      const x = (r() * W) | 0, h = 10 + ((r() * 14) | 0), sway = SW[(i + f) % 4]!;
      fg.line(x, 137, x + sway, 137 - h, "#0a0806"); fg.px(x + sway, 137 - h, "#8a7a50");
    }
  },

  "A Síntese": L => {
    const { b, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#2a5a95", "#CFEAF8", 6);
    ["#FF4A4A", "#FF9A2A", "#FFE04A", "#5ADA5A", "#4A9AFF", "#9A5AFF"].forEach((c, k) => b.ring(45, 112, 46 - k * 2, c, 0.7, 2));
    for (const [x, w] of [[4, 10], [76, 10]] as const) {
      b.rect(x, 0, w, 118, "#9AD8F0");
      for (let y = 0; y < 118; y++) for (let i = 0; i < w; i++) if ((y + f * 3 + i * 5) % 6 < 2) b.px(x + i, y, "#FFFFFF");
    }
    b.grad(0, 118, W, H - 118, "#62B6CB", "#1B4965", 4);
    for (let i = 0; i < 14; i++) gf.px((r() * W) | 0, (r() * 120) | 0, "#FFFFFF", (i + f) % 3 ? 0.3 : 0.9);
    human(L, {
      T: 44, B: 130, skin: "#F0D8C0", robe: "#F4F0FF", trim: "#C0A0FF", hairLong: true, hair: "#E8C070", wings: { type: "iris" }, armL: "fwd", armR: "hold",
      front: (L, fig, h) => {
        drawItem(L, "jar", h.L[0], h.L[1], -1, fig); drawItem(L, "jar", h.R[0], h.R[1], 1, fig);
        for (let t = 0; t <= 12; t++) {
          const x = h.L[0] + ((h.R[0] - h.L[0]) * t) / 12, y = h.L[1] + ((h.R[1] - h.L[1]) * t) / 12 - Math.sin((Math.PI * t) / 12) * 8;
          L.gf.px(x, y, (t + L.f) % 3 ? "#BEF4FF" : "#FFFFFF");
        }
      },
    });
    rocks(fg, r, 135, 6, "#0B1A24");
  },

  "As Correntes": L => {
    const { b, gb, gf, fg, f } = L;
    b.grad(0, 0, W, H, "#020402", "#0e1a10", 6);
    b.poly([[0, 0], [18, 0], [12, 40], [20, 90], [10, 130], [0, 130]], "#070808"); b.poly([[90, 0], [72, 0], [78, 50], [70, 100], [80, 130], [90, 130]], "#070808");
    b.line(12, 40, 20, 90, "#2a3a4a"); b.line(78, 50, 70, 100, "#2a3a4a");
    for (const [x, y] of [[14, 62], [76, 62]] as const) { b.rect(x, y, 1, 8, "#3a2a1a"); flame(b, x, y, 7, f, ["#E0FFE0", "#6AFF8A", "#1A8A3A"]); gb.blob(x, y - 4, 12, 12, "#6AFF8A", 1, 0.3); }
    b.grad(0, 118, W, H - 118, "#0a120a", "#040604", 3);
    const hands = human(L, {
      T: 40, B: 130, skin: "#7A7A82", robe: "#1a0f24", trim: "#F7D070", head: "crown", gem: "#6AFF8A", eye: "#FF3020", eyeGlow: "#FF3020", armL: "down", armR: "down",
      front: (L, { cx, T }) => { for (const [dx, dy] of [[-4, 20], [3, 22], [0, 26], [-2, 29], [4, 28]] as const) L.s.px(cx + dx, T + dy, "#F7D070"); },
    });
    ([[16, 118], [74, 118]] as const).forEach(([x, y], i) => {
      const h = i ? hands.R : hands.L;
      gf.line(h[0], h[1] + 1, x, y - 4, "#F7D070", 0.8);
      fg.circ(x, y, 3, "#0c120c"); fg.poly([[x - 5, y + 3], [x + 5, y + 3], [x + 6, y + 16], [x - 6, y + 16]], "#0c120c");
      fg.px(x - 1, y + 1, "#8a8a70"); fg.px(x + 1, y + 1, "#8a8a70");
      fg.line(x, y + 8, x + (i ? 8 : -8), 137, "#5A5A5A");
    });
  },

  "O Colapso": L => {
    const { b, gb, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#1a0303", "#A02A10", 6);
    for (let i = 0; i < 6; i++) b.blob((r() * W) | 0, (r() * 60) | 0, 16, 6, "#5a1008", 1.2);
    b.rect(36, 24, 8, 90, "#2a1a1a"); b.rect(46, 22, 8, 92, "#2a1a1a");
    b.poly([[43, 22], [47, 22], [45, 60], [47, 90], [44, 114], [43, 70]], "#FF7A1A"); b.line(45, 26, 45, 100, "#FFE070");
    b.line(88, 2, 58, 20, "#FF9A2A", 1, 3); b.circ(57, 21, 3, "#FFF3B0"); gb.blob(57, 21, 10, 10, "#FFB020", 1, 0.4);
    b.grad(0, 114, W, H - 114, "#2a0a06", "#120402", 3);
    for (let k = 0; k < 24; k++) { const an = (k * Math.PI * 2) / 24; flame(gb, 45 + Math.cos(an) * 34, 80 + Math.sin(an) * 34, 5 + ((k + f) % 3), f, ["#FFF3B0", "#FF9A2A", "#E0321B"]); }
    human(L, {
      T: 44, B: 130, pose: "dance", skin: "#5B7FA8", robe: "#D89040", trim: "#3a2a10", bare: true, bareArms: true, hair: "#2a1a10", armL: "open", armR: "up", r: "damaru",
      front: (L, { cx, T }) => {
        const s = L.s;
        s.line(cx - 9, T + 18, cx - 19, T + 8, "#5B7FA8", 1, 3); s.line(cx + 9, T + 18, cx + 19, T + 38, "#5B7FA8", 1, 3);
        for (let k = 0; k < 4; k++) { s.line(cx - 5, T + 4 + k * 2, cx - 14 - k * 2, T + k * 3 - SW[L.f], "#2a1a10"); s.line(cx + 5, T + 4 + k * 2, cx + 14 + k * 2, T + k * 3 + SW[L.f], "#2a1a10"); }
      },
    });
    particles(gf, r, 20, "#8A8A8A", f, 1, 0, 130, 4);
    rocks(fg, r, 134, 8, "#0a0202");
  },

  "A Aurora": L => {
    const { b, gb, s, gf, fg, r, f } = L;
    b.grad(0, 0, W, H, "#2a1a4a", "#FFB26A", 7);
    sun(b, 45, 112, 20, "#FFF8E0", "#FFE8A0", "#FFD08a");
    rays(gb, 45, 112, 18, 100, "#FFE8A0", 0.55, f * 0.05);
    b.poly([[0, 0], [26, 0], [14, 30], [20, 70], [10, 118], [0, 118]], "#1a1020"); b.poly([[90, 0], [64, 0], [76, 30], [70, 70], [80, 118], [90, 118]], "#1a1020");
    b.poly([[0, 0], [90, 0], [70, 10], [45, 6], [20, 10]], "#1a1020");
    b.grad(0, 118, W, H - 118, "#3a2030", "#1a0e18", 3);
    s.poly([[14, 6], [28, 6], [26, 120], [8, 120]], "#1a1030"); s.poly([[62, 6], [76, 6], [82, 120], [64, 120]], "#1a1030");
    human(L, {
      T: 44, B: 130, skin: "#F5DCC0", robe: "#FAFAF5", trim: "#F7D070", hairLong: true, hair: "#0a0a0a", armL: "open", armR: "open",
      front: (L, { cx, T, B }) => {
        const s = L.s;
        for (let y = T + 36; y < B; y += 6) for (let x = cx - 10; x <= cx + 10; x += 5) s.px(x + ((y / 6) % 2) * 2, y, "#F7D070");
        s.circ(cx, T + 24, 3, "#F7D070"); s.circ(cx, T + 24, 2, "#FFFFFF"); L.gf.blob(cx, T + 24, 7, 7, "#FFF3B0", 1, 0.35 + pulse(L.f) * 0.08);
      },
    });
    rocks(fg, r, 134, 8, "#1a0e18");
    for (let i = 0; i < 6; i++) gf.px((r() * W) | 0, 130 + ((r() * 6) | 0), "#FFFFFF", (i + f) % 3 ? 0.3 : 1);
  },

  "O Labirinto": L => {
    const { b, fg, r, f } = L;
    b.grad(0, 0, W, H, "#02050c", "#142030", 6); stars(b, r, 10, 60, f);
    crescent(b, 64, 22, 8, "#E6ECF4", 4); b.blob(64, 22, 16, 16, "#6A7AA0", 1, 0.35);
    for (let i = 0; i < 12; i++) {
      const x = (r() * W) | 0;
      b.rect(x, 0, 3, 120, i % 2 ? "#0E2A1A" : "#15321f");
      for (let y = 6 + ((r() * 10) | 0); y < 120; y += 12) b.rect(x, y, 3, 1, "#2a4a30");
    }
    mist(b, 70, 4, "#8A9AB0", 0.22, f);
    b.grad(0, 118, W, H - 118, "#0a1620", "#040a10", 3);
    for (let y = 118; y < 137; y++) {
      const src = 117 - (y - 118), off = Math.round(Math.sin((y + f * 2) * 0.8) * 1.5);
      for (let x = 0; x < W; x++) {
        const i = (src * W + Math.min(W - 1, Math.max(0, x + off))) * 4, d = b.d;
        b.px(x, y, [d[i]! * 0.6, d[i + 1]! * 0.6, d[i + 2]! * 0.75], 0.7);
      }
    }
    human(L, {
      T: 42, B: 118, skin: "#E8E0F0", robe: "#0E1630", trim: "#8A9AC0", hairLong: true, hair: "#C8D0E0", armR: "fwd", r: "jadeblade",
      front: (L, { cx, T, B }) => { const rr = rng(7); for (let i = 0; i < 12; i++) L.s.px(cx - 9 + ((rr() * 19) | 0), T + 20 + ((rr() * (B - T - 24)) | 0), "#FFFFFF"); },
    });
    fg.rect(3, 0, 3, 137, "#020806"); fg.rect(86, 0, 3, 137, "#020806");
  },

  "O Zênite": L => {
    const { b, gb, s, fg, f } = L;
    b.grad(0, 0, W, H, "#0a2a8a", "#3a7ae0", 6);
    sun(b, 45, 28, 13, "#FFFFFF", "#FFE066", "#FFD34E"); rays(gb, 45, 28, 16, 54, "#FFF3B0", 0.5, f * 0.1);
    b.grad(0, 112, W, H - 112, "#2a6a3a", "#123a1e", 3);
    horse(s, 16, 118, 1, f); horse(s, 74, 118, -1, f);
    human(L, { T: 46, B: 130, skin: "#D8A070", robe: "#FFFFFF", trim: "#F7D070", hair: "#FFD34E", head: "rays12", armL: "fwd", armR: "fwd", l: "reins", r: "reins" });
    for (let i = 0; i < 5; i++) {
      const x = 8 + i * 18, y = 126 + (i % 2) * 5;
      fg.line(x, 137, x, y, "#1a4a1a", 1, 2);
      for (let k = 0; k < 8; k++) { const an = (k * Math.PI) / 4; fg.px(x + Math.cos(an) * 3, y + Math.sin(an) * 3, "#FFD34E"); }
      fg.circ(x, y, 1.5, "#5a3a10");
    }
  },

  "O Chamado": L => {
    const { b, fg, r, f } = L;
    b.grad(0, 0, W, H, "#05050f", "#E8B04A", 7);
    for (let k = 0; k < 5; k++) b.ring(45, 16, 8 + k * 7, k % 2 ? "#F7D070" : "#B8862B", 0.35, 2);
    b.blob(45, 16, 14, 12, "#FFF3B0", 1.2, 0.8);
    hills(b, 116, 14, 0.1, 2, "#2a2030"); b.grad(0, 122, W, H - 122, "#1a1420", "#0a0810", 3);
    human(L, { T: 36, B: 126, skin: "#F0D8C0", robe: "#FAFAFF", trim: "#F7D070", hair: "#E8C070", halo: "#FFF3B0", wings: { c: "#FFFFFF", c2: "#F7D070", glow: "#FFF3B0" }, armR: "fwd", r: "trumpet", armL: "down" });
    for (const [x, y] of [[12, 128], [76, 127]] as const) {
      fg.rect(x - 5, y, 10, 8, "#6a6a78"); fg.poly([[x - 6, y - 1], [x + 4, y - 5], [x + 6, y - 3], [x - 4, y + 1]], "#8a8a98");
      const sy = y - 10 - (f % 2);
      fg.circ(x, sy, 1.5, "#FFFFFF", 0.85); fg.rect(x - 1, sy + 2, 3, 5, "#FFFFFF", 0.85);
      fg.line(x - 1, sy + 2, x - 3, sy - 2, "#FFFFFF", 0.85); fg.line(x + 1, sy + 2, x + 3, sy - 2, "#FFFFFF", 0.85);
    }
    rocks(fg, r, 136, 6, "#0a0810");
  },

  "O Cosmos": L => {
    const { b, s, gf, r, f } = L;
    b.grad(0, 0, W, H, "#03030c", "#2a1050", 6);
    b.blob(20, 30, 24, 14, "#4a1a6a", 1.1); b.blob(70, 110, 26, 14, "#1a3a6a", 1.1); b.blob(64, 40, 16, 10, "#6a1a4a", 1);
    stars(b, r, 44, 150, f, ["#FFFFFF", "#BEE9E8", "#FFD1E3"]);
    for (const [x, y, d] of [[10, 20, -1], [70, 130, 1]] as const) { b.line(x, y, x + d * 12, y + 6, "#BEE9E8", 0.6); b.circ(x, y, 1, "#FFFFFF"); }
    b.ring(45, 80, 44, "#F7D070", 0.8, 2);
    for (const [x, y] of [[45, 36], [45, 124], [1, 80], [89, 80]] as const) b.poly([[x - 3, y], [x, y - 3], [x + 3, y], [x, y + 3]], "#F7D070");
    const sheet = new Buf();
    for (let k = 0; k < 12; k++) { const an = (Math.PI * 2 * k) / 12; sheet.ell(45 + Math.cos(an) * 18, 126 + Math.sin(an) * 4, 4, 2, k % 2 ? "#8A7AFF" : "#C8B8FF"); }
    human(withSprite(L, sheet), { T: 62, B: 126, pose: "seat", skin: "#C8B8FF", robe: "#1a1450", trim: "#8A7AFF", hair: "#2a1a6a", armL: "chest", armR: "chest", still: true });
    const rr = rng(3);
    for (let i = 0; i < 20; i++) sheet.px(34 + ((rr() * 22) | 0), 80 + ((rr() * 40) | 0), "#FFFFFF");
    s.over(sheet, 0.65);
    for (let i = 0; i < 30; i++) { const an = i * 0.55 + f * 0.4, rad = i * 0.22; gf.px(45 + Math.cos(an) * rad, 88 + Math.sin(an) * rad * 0.7, i % 3 ? "#FFD1E3" : "#FFFFFF"); }
    gf.blob(45, 88, 7, 5, "#C8B8FF", 1, 0.35);
  },
};

