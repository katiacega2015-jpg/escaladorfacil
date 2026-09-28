/** Grade nativa da carta: 90×160 (9:16), sempre escalada em múltiplos inteiros. */
export const W = 90;
export const H = 160;

export type RGB = readonly [number, number, number];
export type Color = string | RGB;
export type Frame = 0 | 1 | 2 | 3;
export type Rng = () => number;

export const BAYER: readonly number[] = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
export const bay = (x: number, y: number): number => (BAYER[((y & 3) << 2) | (x & 3)]! + 0.5) / 16;

/** Oscilação de 4 quadros usada pelas animações idle (500 ms cada). */
export const SW: readonly [number, number, number, number] = [0, 1, 0, -1];
export const pulse = (f: Frame): number => [0, 1, 2, 1][f]!;

const cache = new Map<string, RGB>();
export function rgb(c: Color): RGB {
  if (typeof c !== "string") return c;
  let v = cache.get(c);
  if (v) return v;
  let s = c.slice(1);
  if (s.length === 3) s = s[0]! + s[0] + s[1] + s[1] + s[2] + s[2];
  v = [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
  cache.set(c, v);
  return v;
}
export const hex = (c: RGB): string =>
  "#" + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
export const mix = (a: Color, b: Color, t: number): string => {
  const A = rgb(a), B = rgb(b);
  return hex([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]);
};
export const shade = (a: Color, k: number): string => {
  const A = rgb(a);
  return hex([A[0] * k, A[1] * k, A[2] * k]);
};

export function rng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export type Pt = readonly [number, number];

/** Buffer RGBA 90×160 com primitivas de pixel art (sem antialiasing). */
export class Buf {
  readonly d = new Uint8ClampedArray(W * H * 4);

  px(x: number, y: number, col: Color, a = 1): void {
    x = Math.round(x); y = Math.round(y);
    if (x < 0 || y < 0 || x >= W || y >= H || a <= 0) return;
    const c = rgb(col), d = this.d, i = (y * W + x) * 4;
    if (a >= 1) { d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255; return; }
    const da = d[i + 3]! / 255, oa = a + da * (1 - a);
    d[i] = (c[0] * a + d[i]! * da * (1 - a)) / oa;
    d[i + 1] = (c[1] * a + d[i + 1]! * da * (1 - a)) / oa;
    d[i + 2] = (c[2] * a + d[i + 2]! * da * (1 - a)) / oa;
    d[i + 3] = oa * 255;
  }
  al(x: number, y: number): number {
    return x < 0 || y < 0 || x >= W || y >= H ? 0 : this.d[(y * W + x) * 4 + 3]!;
  }
  rect(x: number, y: number, w: number, h: number, c: Color, a?: number): void {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.px(x + i, y + j, c, a);
  }
  circ(cx: number, cy: number, r: number, c: Color, a?: number): void {
    const R = Math.ceil(r), rr = r * r + r * 0.8;
    for (let j = -R; j <= R; j++) for (let i = -R; i <= R; i++) if (i * i + j * j <= rr) this.px(cx + i, cy + j, c, a);
  }
  ring(cx: number, cy: number, r: number, c: Color, a = 1, t = 1): void {
    const R = Math.ceil(r), o = r * r + r * 0.8, n = (r - t) * (r - t) + (r - t) * 0.8;
    for (let j = -R; j <= R; j++) for (let i = -R; i <= R; i++) {
      const q = i * i + j * j;
      if (q <= o && q > n) this.px(cx + i, cy + j, c, a);
    }
  }
  ell(cx: number, cy: number, rx: number, ry: number, c: Color, a?: number): void {
    for (let j = -Math.ceil(ry); j <= ry; j++) for (let i = -Math.ceil(rx); i <= rx; i++)
      if ((i * i) / (rx * rx) + (j * j) / (ry * ry) <= 1.05) this.px(cx + i, cy + j, c, a);
  }
  poly(p: readonly Pt[], c: Color, a?: number): void {
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const [x, y] of p) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    for (let y = Math.max(0, Math.floor(y0)); y <= Math.min(H - 1, Math.ceil(y1)); y++) {
      for (let x = Math.max(0, Math.floor(x0)); x <= Math.min(W - 1, Math.ceil(x1)); x++) {
        const px = x + 0.5, py = y + 0.5;
        let ins = false;
        for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
          const [xi, yi] = p[i]!, [xj, yj] = p[j]!;
          if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) ins = !ins;
        }
        if (ins) this.px(x, y, c, a);
      }
    }
  }
  line(x0: number, y0: number, x1: number, y1: number, c: Color, a?: number, t = 1): void {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let k = 0; k <= n; k++) {
      const x = x0 + ((x1 - x0) * k) / n, y = y0 + ((y1 - y0) * k) / n;
      if (t <= 1) this.px(x, y, c, a);
      else this.rect(Math.round(x - (t - 1) / 2), Math.round(y - (t - 1) / 2), t, t, c, a);
    }
  }
  /** Degradê vertical quantizado em `n` tons com dithering Bayer 4×4. */
  grad(x: number, y: number, w: number, h: number, c1: Color, c2: Color, n = 6): void {
    const lv: RGB[] = [];
    for (let k = 0; k < n; k++) lv.push(rgb(mix(c1, c2, k / (n - 1))));
    for (let j = 0; j < h; j++) {
      const t = (h < 2 ? 0 : j / (h - 1)) * (n - 1), lo = Math.floor(t), fr = t - lo;
      for (let i = 0; i < w; i++) {
        const l = fr > bay(x + i, y + j) ? Math.min(lo + 1, n - 1) : lo;
        this.px(x + i, y + j, lv[l]!);
      }
    }
  }
  /** Elipse com borda desfeita em dithering (nebulosas, halos, brilhos). */
  blob(cx: number, cy: number, rx: number, ry: number, c: Color, dens = 1, a?: number): void {
    for (let j = -Math.ceil(ry); j <= ry; j++) for (let i = -Math.ceil(rx); i <= rx; i++) {
      const q = Math.sqrt((i * i) / (rx * rx) + (j * j) / (ry * ry));
      if (q <= 1 && (1 - q) * dens > bay(Math.round(cx + i), Math.round(cy + j))) this.px(cx + i, cy + j, c, a);
    }
  }
  over(o: Buf, a = 1): void {
    const e = o.d;
    for (let i = 0; i < W * H; i++) {
      const k = i * 4, oa = (e[k + 3]! / 255) * a;
      if (oa > 0) this.px(i % W, (i / W) | 0, [e[k]!, e[k + 1]!, e[k + 2]!], oa);
    }
  }
  /** Contorno de 1px ao redor de tudo que for opaco (sprites). */
  outline(c: Color): void {
    const m: number[] = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (this.al(x, y) > 60) continue;
      if (this.al(x - 1, y) > 127 || this.al(x + 1, y) > 127 || this.al(x, y - 1) > 127 || this.al(x, y + 1) > 127) m.push(x, y);
    }
    for (let i = 0; i < m.length; i += 2) this.px(m[i]!, m[i + 1]!, c);
  }
  /** Luz de recorte: clareia bordas de cima/esquerda e escurece baixo/direita. */
  rim(c: Color, amt: number, dk: number): void {
    const A = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) A[i] = this.d[i * 4 + 3]!;
    const al = (x: number, y: number) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : A[y * W + x]!);
    const C = rgb(c), d = this.d;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (al(x, y) < 128) continue;
      const i = (y * W + x) * 4;
      if (al(x - 1, y) < 128 || al(x, y - 1) < 128) for (let k = 0; k < 3; k++) d[i + k] = d[i + k]! + (C[k]! - d[i + k]!) * amt;
      else if (al(x + 1, y) < 128 || al(x, y + 1) < 128) for (let k = 0; k < 3; k++) d[i + k] = d[i + k]! * dk;
    }
  }
  flipV(): Buf {
    const o = new Buf();
    for (let y = 0; y < H; y++) o.d.set(this.d.subarray(y * W * 4, (y + 1) * W * 4), (H - 1 - y) * W * 4);
    return o;
  }
  map(fn: (r: number, g: number, b: number, x: number, y: number) => RGB): void {
    const d = this.d;
    for (let i = 0; i < W * H; i++) {
      const k = i * 4;
      if (!d[k + 3]) continue;
      const v = fn(d[k]!, d[k + 1]!, d[k + 2]!, i % W, (i / W) | 0);
      d[k] = v[0]; d[k + 1] = v[1]; d[k + 2] = v[2];
    }
  }
}
