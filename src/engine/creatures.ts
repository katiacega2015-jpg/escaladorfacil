import { Buf, SW, mix, type Color, type Frame } from "./buf";
import { flame } from "./primitives";

export type Side = 1 | -1;

export function dog(b: Buf, x: number, y: number, c: Color, a: number, sg: Side): void {
  b.rect(x - 3, y - 8, 6, 8, c, a); b.circ(x + sg * 2, y - 11, 3, c, a);
  b.poly([[x + sg, y - 13], [x + sg * 2, y - 18], [x + sg * 3, y - 13]], c, a);
  b.rect(sg > 0 ? x + 4 : x - 6, y - 11, 3, 2, c, a); b.rect(sg > 0 ? x - 6 : x + 3, y - 3, 3, 2, c, a);
  b.px(x + sg * 3, y - 12, "#FFFFFF", Math.min(1, a + 0.3));
}

export function tiger(b: Buf, x: number, y: number, f: Frame): void {
  const o = "#E07A20", w = "#F4E8D0";
  b.ell(x + 4, y - 9, 12, 6, o); b.ell(x + 4, y - 6, 10, 3, w);
  for (let k = 0; k < 6; k++) b.line(x - 4 + k * 3, y - 15, x - 5 + k * 3, y - 9, "#1a1008");
  b.circ(x - 9, y - 14, 5, o); b.rect(x - 13, y - 13, 4, 3, w);
  b.px(x - 11, y - 15, "#1a1008"); b.px(x - 7, y - 15, "#1a1008");
  b.poly([[x - 12, y - 18], [x - 11, y - 21], [x - 9, y - 18]], o); b.poly([[x - 7, y - 18], [x - 6, y - 21], [x - 4, y - 18]], o);
  for (const dx of [-4, 0, 8, 12]) b.rect(x + dx, y - 4, 3, 5, o);
  b.line(x + 16, y - 11, x + 20, y - 16 - SW[f], o, 1, 2);
}

export function raven(b: Buf, x: number, y: number, sg: Side, f: Frame): void {
  b.ell(x, y, 3, 2, "#0a0a12"); b.circ(x + sg * 2, y - 2, 2, "#0a0a12");
  b.px(x + sg * 4, y - 2, "#4a4a4a"); b.px(x + sg * 2, y - 3, "#9ad8ff");
  b.line(x - sg * 3, y, x - sg * 5, y + 2, "#0a0a12");
  if (f % 2) b.line(x, y - 1, x - sg * 3, y - 5, "#1a1a28");
}

export function bird(b: Buf, x: number, y: number, c: Color, f: Frame): void {
  b.rect(x - 1, y, 3, 2, c); b.px(x + 2, y - 1, c);
  if (f % 2) { b.px(x - 1, y - 1, c); b.px(x - 2, y - 2, c); } else b.px(x - 2, y + 1, c);
}

export function owl(b: Buf, x: number, y: number, f: Frame): void {
  const c = "#8a8a90";
  b.ell(x, y, 3, 4, c); b.circ(x, y - 4, 3, c);
  b.px(x - 1, y - 4, "#FFD34E"); b.px(x + 1, y - 4, "#FFD34E");
  const up = f % 2 ? -4 : 2;
  b.poly([[x - 2, y - 1], [x - 12, y + up], [x - 9, y + 3]], c); b.poly([[x + 2, y - 1], [x + 12, y + up], [x + 9, y + 3]], c);
}

/** Cavalo solar de perfil; `sg` é o lado para onde a cabeça aponta. */
export function horse(b: Buf, x: number, y: number, sg: Side, f: Frame): void {
  const c = "#FFB020", d = "#E0621B";
  b.ell(x, y - 15, 11, 6, c); b.ell(x, y - 13, 9, 3, d, 0.5);
  b.poly([[x + sg * 6, y - 19], [x + sg * 8, y - 32], [x + sg * 12, y - 33], [x + sg * 12, y - 22], [x + sg * 9, y - 14]], c);
  b.poly([[x + sg * 10, y - 34], [x + sg * 18, y - 29], [x + sg * 17, y - 26], [x + sg * 10, y - 27]], c);
  b.px(x + sg * 13, y - 31, "#3a1a00"); b.px(x + sg * 17, y - 28, "#3a1a00");
  for (const dx of [-8, -5, 5, 8]) { b.line(x + dx, y - 11, x + dx, y - 2, d, 1, 2); b.rect(x + dx - 1, y - 1, 3, 2, "#5a2a00"); }
  for (let k = 0; k < 4; k++) flame(b, x + sg * (7 + k), y - 24 + k * 3, 4 + ((k + f) % 2) * 2, f, ["#FFFFFF", "#FFF3B0", "#FF9A2A"]);
  flame(b, x - sg * 10, y - 14, 6, f, ["#FFF3B0", "#FF9A2A", "#E0321B"]);
}

export function ram(b: Buf, x: number, y: number, c: Color): void {
  b.ell(x, y - 9, 10, 6, c);
  for (let k = 0; k < 8; k++) b.px(x - 8 + k * 2, y - 12 + (k % 2), mix(c, "#FFFFFF", 0.3));
  b.circ(x - 10, y - 13, 4, c); b.ring(x - 9, y - 15, 3, "#F7D070", 1, 1); b.px(x - 12, y - 13, "#1a0a00");
  for (const dx of [-6, -2, 4, 8]) b.rect(x + dx, y - 4, 2, 4, "#5a3010");
}

export function wolf(b: Buf, x: number, y: number): void {
  const c = "#7a7a82";
  b.ell(x, y - 4, 10, 4, c); b.ell(x, y - 3, 8, 2, "#9a9aa2"); b.circ(x - 9, y - 6, 3, c);
  b.poly([[x - 11, y - 8], [x - 10, y - 12], [x - 8, y - 8]], c); b.rect(x - 14, y - 6, 3, 2, c);
  b.px(x - 10, y - 7, "#1a1a1a"); b.line(x + 10, y - 4, x + 15, y - 2, c, 1, 2);
}

export function fish(b: Buf, x: number, y: number, sg: Side, c: Color): void {
  b.ell(x, y, 3, 1.5, c); b.poly([[x - sg * 3, y], [x - sg * 6, y - 2], [x - sg * 6, y + 2]], c); b.px(x + sg * 2, y, "#1a1a1a");
}
