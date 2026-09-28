import { H, SW, W, pulse } from "../engine/buf";
import { human } from "../engine/figure";
import type { ArtFn } from "../engine/layers";
import { eclipse, flame, particles, pillar } from "../engine/primitives";

export const ESPECIAIS_ART: Record<string, ArtFn> = {
  /** Toda em tons de cinza; o coração neon (#FF0055) é o único ponto de cor. */
  "A Paixão": L => {
    const { b, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, H, "#0A0A0A", "#5E5E5E", 6);
    eclipse(b, 45, 22, 8, L.pol === "escuridao" ? "#FF2050" : "#D8D8D8", f);
    for (const [x, top, w] of [[4, 40, 8], [16, 62, 6], [70, 48, 7], [82, 70, 5]] as const) {
      pillar(b, x, top, 114, w, "#C8C8C8", "#F0F0F0", "#7A7A7A");
      b.poly([[x - 1, top - 3], [x + w + 1, top - 3], [x + w - 1, top - 7], [x + 2, top - 5]], "#C8C8C8");
    }
    b.rect(0, 114, W, H - 114, "#8A8A8A");
    for (let i = 0; i < 8; i++) b.rect((r() * W) | 0, 116 + ((r() * 16) | 0), 3 + ((r() * 5) | 0), 2, "#B8B8B8");
    human(L, {
      T: 42, B: 130, skin: "#B8B8B8", robe: "#E8E8E8", trim: "#9A9A9A", hairLong: true, hair: "#2A2A2A", armL: "chest", armR: "chest",
      front: (L, { cx, T, B }) => {
        const s = L.s;
        // Metade direita: armadura de espinhos. Metade esquerda: véu nupcial.
        s.poly([[cx, T + 15], [cx + 9, T + 15], [cx + 13, B], [cx, B]], "#3A3A3E");
        for (let y = T + 18; y < B; y += 5) s.poly([[cx + 10, y], [cx + 15, y - 2], [cx + 11, y + 2]], "#1E1E22");
        s.rect(cx + 6, T + 14, 6, 3, "#2A2A2E"); s.px(cx + 12, T + 13, "#1E1E22");
        s.poly([[cx - 9, T + 15], [cx - 18 + SW[L.f], B], [cx - 10, B]], "#FFFFFF", 0.35);
        const hx = cx, hy = T + 25;
        s.circ(hx - 2, hy - 1, 2, "#FF0055"); s.circ(hx + 2, hy - 1, 2, "#FF0055"); s.poly([[hx - 4, hy], [hx + 4, hy], [hx, hy + 5]], "#FF0055");
        s.px(hx - 2, hy - 2, "#FF8AB0"); s.line(hx, hy - 4, hx + 1, hy - 6, "#C0003A");
        L.gf.blob(hx, hy, 9 + p * 2, 9 + p * 2, "#FF0055", 1.1, 0.3 + p * 0.12);
      },
    });
    particles(gf, r, 10, "#C8103A", f, 1, 30, 134, 3);
    fg.rect(0, 132, W, 6, "#0E0E0E");
    for (let i = 0; i < 10; i++) { const x = (r() * W) | 0; fg.line(x, 137, x + ((r() * 8) | 0) - 4, 122 + ((r() * 8) | 0), "#0E0E0E"); }
    for (const [x, y] of [[8, 126], [20, 130], [70, 128], [84, 124]] as const) { fg.circ(x, y, 2, "#C8103A"); fg.px(x, y, "#FF4A6A"); }
  },

  /** Titã de costas subindo a escadaria, coroa de chamas douradas com espinhos de ferro. */
  "A Ambição": L => {
    const { b, s, gf, fg, r, f } = L, p = pulse(f);
    b.grad(0, 0, W, H, "#101010", "#4A4A4E", 6);
    b.poly([[45, 18], [80, 98], [10, 98]], "#050506"); b.line(45, 18, 80, 98, "#3A3A4A"); b.line(45, 18, 45, 98, "#15151A");
    for (let i = 0; i < 12; i++) b.blob(4 + i * 8, 98 + (i % 3) * 3, 9, 5, "#6A6A70", 1.1);
    b.rect(0, 102, W, H - 102, "#5A5A60");
    for (let k = 0; k < 9; k++) {
      const y = 134 - k * 5, x0 = 6 + k * 3, x1 = 84 - k * 3;
      b.rect(x0, y, x1 - x0, 5, k % 2 ? "#5A5A5E" : "#626268"); b.rect(x0, y, x1 - x0, 1, "#8A8A92");
    }
    const cx = 46, T = 54;
    s.poly([[cx - 5, T + 34], [cx - 1, T + 34], [cx - 3, T + 50], [cx - 7, T + 50]], "#3A3A3E");
    s.poly([[cx + 1, T + 34], [cx + 6, T + 34], [cx + 10, T + 43], [cx + 6, T + 46]], "#3A3A3E");
    s.poly([[cx - 13, T + 13], [cx + 13, T + 13], [cx + 9, T + 36], [cx - 9, T + 36]], "#3E3E44");
    s.line(cx - 13, T + 14, cx - 17, T + 36, "#3A3A3E", 1, 4); s.line(cx + 13, T + 14, cx + 17, T + 36, "#3A3A3E", 1, 4);
    s.circ(cx, T + 6, 6, "#38383C"); s.px(cx + 6, T + 6, "#58585E"); s.rect(cx - 2, T + 11, 5, 3, "#38383C");
    for (const [x0, y0, x1, y1] of [[cx - 6, T + 16, cx - 2, T + 30], [cx + 4, T + 18, cx + 8, T + 32], [cx - 2, T + 30, cx + 3, T + 35], [cx - 15, T + 20, cx - 16, T + 30], [cx + 15, T + 22, cx + 16, T + 30]] as const) {
      s.line(x0, y0, x1, y1, "#FFE070"); gf.line(x0, y0, x1, y1, "#FFD700", 0.4 + p * 0.1);
    }
    for (let k = 0; k < 5; k++) flame(s, cx - 6 + k * 3, T, 6 + ((k + f) % 2) * 2, f, ["#FFFFFF", "#FFD700", "#E09A00"]);
    for (let k = 0; k < 4; k++) s.line(cx - 5 + k * 3.5, T + 1, cx - 6 + k * 3.5, T - 4, "#2A2A2E");
    gf.blob(cx, T - 3, 15, 11, "#FFD700", 1, 0.35 + p * 0.12);
    particles(gf, r, 14, "#FFE070", f, -1, 4, T, 3);
    for (const [x, y] of [[12, 128], [70, 123]] as const) { fg.rect(x, y - 10, 8, 10, "#2A2A2A"); fg.rect(x - 1, y - 14, 10, 4, "#2A2A2A"); fg.rect(x, y - 3, 8, 2, "#1A1A1A"); }
    fg.line(24, 133, 34, 130, "#5A6A3A"); fg.circ(34, 130, 1, "#6A7A4A"); fg.line(56, 131, 64, 134, "#5A6A3A");
  },
};
