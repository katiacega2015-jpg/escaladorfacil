import { Buf, H, SW, W, bay, mix, pulse, shade, type Color, type Frame, type Pt, type Rng } from "./buf";

export function stars(b: Buf, r: Rng, n: number, y1: number, f: Frame, cols: readonly Color[] = ["#FFFFFF", "#BEE9E8"]): void {
  for (let i = 0; i < n; i++) {
    const x = (r() * W) | 0, y = (r() * y1) | 0, c = cols[i % cols.length]!, ph = (i + f) % 4;
    b.px(x, y, c, ph === 0 ? 0.35 : 1);
    if (i % 6 === 0 && ph === 2) { b.px(x - 1, y, c, 0.6); b.px(x + 1, y, c, 0.6); b.px(x, y - 1, c, 0.6); b.px(x, y + 1, c, 0.6); }
  }
}

export function mountains(b: Buf, r: Rng, base: number, hmin: number, hmax: number, c: Color, snow: Color | null, seg = 9): void {
  const p: Pt[] = [[0, H], [0, base - hmin]];
  const peaks: Pt[] = [];
  let x = 0;
  while (x < W + seg) {
    x += seg * 0.5 + r() * seg;
    const pt: Pt = [x, base - (hmin + r() * (hmax - hmin))];
    p.push(pt); peaks.push(pt);
  }
  p.push([W + 10, H]);
  b.poly(p, c);
  if (snow) for (const [px, py] of peaks) {
    if (py < base - hmin - 3) b.poly([[px - 3, py + 4], [px, py], [px + 3, py + 4], [px + 1, py + 3], [px - 1, py + 5]], snow);
  }
}

export function hills(b: Buf, base: number, amp: number, fr: number, ph: number, c: Color): void {
  for (let x = 0; x < W; x++) {
    const y = Math.round(base - amp * (Math.sin(x * fr + ph) * 0.5 + 0.5));
    b.rect(x, y, 1, H - y, c);
  }
}

export function waves(b: Buf, y0: number, y1: number, c1: Color, c2: Color, f: Frame, sp = 2): void {
  b.grad(0, y0, W, y1 - y0, c1, shade(c1, 0.55), 4);
  for (let y = y0 + 1; y < y1; y += 3) for (let x = 0; x < W; x++) if ((x + y * 3 + f * sp) % 11 < 2) b.px(x, y, c2, 0.8);
}

export function pillar(b: Buf, x: number, y0: number, y1: number, w: number, cM: Color, cL: Color, cD: Color): void {
  b.rect(x, y0, w, y1 - y0, cM); b.rect(x, y0, 1, y1 - y0, cL); b.rect(x + w - 1, y0, 1, y1 - y0, cD);
  b.rect(x - 1, y0 - 3, w + 2, 3, cL); b.rect(x - 1, y1, w + 2, 2, cD);
}

export function tree(b: Buf, x: number, y: number, h: number, cT: Color, cL: Color, rad: number): void {
  b.rect(x - 1, y - h, 3, h, cT);
  b.circ(x, y - h, rad, cL); b.circ(x - rad * 0.7, y - h + 3, rad * 0.7, cL); b.circ(x + rad * 0.7, y - h + 3, rad * 0.7, cL);
}

export function cloud(b: Buf, x: number, y: number, w: number, c1: Color, c2: Color): void {
  for (let i = 0; i <= w; i += 4) { const q = 3 + ((i * 7) % 4); b.circ(x + i, y - q / 2, q, c1); }
  b.rect(x - 2, y, w + 4, 2, c2);
}

export function bolt(b: Buf, r: Rng, x: number, y0: number, y1: number, c: Color, a = 1): void {
  let px = x, py = y0;
  while (py < y1) {
    const nx = px + Math.round((r() - 0.5) * 8), ny = py + 3 + ((r() * 4) | 0);
    b.line(px, py, nx, ny, c, a);
    if (r() < 0.25) b.line(nx, ny, nx + Math.round((r() - 0.5) * 10), ny + 6, c, a * 0.7);
    px = nx; py = ny;
  }
}

export function rays(b: Buf, cx: number, cy: number, n: number, len: number, c: Color, a: number, rot = 0): void {
  for (let k = 0; k < n; k++) {
    const an = rot + (k * Math.PI * 2) / n;
    for (let t = 5; t < len; t++) {
      if ((t + k) % 2) continue;
      b.px(cx + Math.cos(an) * t, cy + Math.sin(an) * t, c, a * (1 - t / len));
    }
  }
}

export function sun(b: Buf, cx: number, cy: number, rad: number, c1: Color, c2: Color, halo?: Color): void {
  if (halo) b.blob(cx, cy, rad * 2.2, rad * 2.2, halo, 1.2, 0.8);
  b.circ(cx, cy, rad, c2); b.circ(cx, cy, rad - 2, c1);
}

export function moon(b: Buf, cx: number, cy: number, rad: number, c: Color, cd: Color): void {
  b.circ(cx, cy, rad, c);
  b.circ(cx - rad * 0.3, cy - rad * 0.2, rad * 0.25, cd);
  b.circ(cx + rad * 0.35, cy + rad * 0.3, rad * 0.18, cd);
}

export function crescent(b: Buf, cx: number, cy: number, rad: number, c: Color, dx: number): void {
  const R = Math.ceil(rad), rr = rad * rad + rad * 0.8;
  for (let j = -R; j <= R; j++) for (let i = -R; i <= R; i++)
    if (i * i + j * j <= rr && (i - dx) * (i - dx) + j * j > rr * 0.85) b.px(cx + i, cy + j, c);
}

export function eclipse(b: Buf, cx: number, cy: number, rad: number, corona: Color, f: Frame): void {
  b.blob(cx, cy, rad * 2.1, rad * 2.1, corona, 1 + pulse(f) * 0.12, 0.85);
  b.ring(cx, cy, rad + 1, "#FFFFFF", 1, 1);
  b.circ(cx, cy, rad, "#050505");
}

export type FlamePalette = readonly [core: Color, mid: Color, edge: Color];
export const FIRE: FlamePalette = ["#FFF3B0", "#F4A300", "#E0521B"];

/** Chama com base em (x,y) crescendo para cima; oscila com o quadro. */
export function flame(b: Buf, x: number, y: number, h: number, f: Frame, cols: FlamePalette = FIRE, wm = 1): void {
  const fl = SW[f];
  for (let k = 0; k < h; k++) {
    const t = k / h, hw = Math.round((1 - t) * h * 0.32 * wm), ox = Math.round(fl * t * t * 2);
    for (let i = -hw; i <= hw; i++) {
      const e = hw ? Math.abs(i) / hw : 0;
      const c = e < 0.4 && t < 0.55 ? cols[0] : e < 0.75 && t < 0.8 ? cols[1] : cols[2];
      b.px(x + i + ox, y - k, c);
    }
  }
}

/** Partículas em loop vertical (dir 1 cai, -1 sobe). */
export function particles(b: Buf, r: Rng, n: number, c: Color, f: Frame, dir: 1 | -1, y0: number, y1: number, spd: number, a?: number): void {
  const R = y1 - y0;
  for (let i = 0; i < n; i++) {
    const x = (r() * W) | 0, base = r() * R;
    const y = y0 + ((((base + dir * f * spd) % R) + R) % R);
    b.px(x, y, c, a);
  }
}

export function grass(b: Buf, r: Rng, y: number, n: number, c: Color): void {
  b.rect(0, y, W, H - y, c);
  for (let i = 0; i < n; i++) { const x = (r() * W) | 0, h = 2 + ((r() * 7) | 0); b.line(x, y, x + (i % 2 ? -1 : 1), y - h, c); }
}

export function rocks(b: Buf, r: Rng, y: number, n: number, c: Color): void {
  b.rect(0, y, W, H - y, c);
  for (let i = 0; i < n; i++) {
    const x = r() * W, w = 3 + r() * 8, h = 2 + r() * 6;
    b.poly([[x - w, y + 1], [x - w * 0.5, y - h * 0.7], [x, y - h], [x + w * 0.6, y - h * 0.6], [x + w, y + 1]], c);
  }
}

export function mist(b: Buf, y0: number, n: number, c: Color, a: number, f: Frame): void {
  for (let k = 0; k < n; k++) {
    const y = y0 + k * 6;
    for (let x = 0; x < W; x++) if ((x + f * 2 + k * 5) % 9 < 5) b.px(x, y + ((x + k) % 3 === 0 ? 1 : 0), c, a);
  }
}

/** Céu dividido: `edge` é a distância assinada até a fronteira (negativo = lado A). */
export function splitSky(b: Buf, edge: (x: number, y: number) => number, a: [Color, Color], c: [Color, Color], jitter = 6): void {
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const t = y / H;
    const left = edge(x, y) < (bay(x, y) - 0.5) * jitter;
    b.px(x, y, left ? mix(a[0], a[1], t) : mix(c[0], c[1], t));
  }
}
