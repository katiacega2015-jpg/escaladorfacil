import { SW, mix, pulse, shade, type Color, type Pt } from "./buf";
import type { Side } from "./creatures";
import type { Layers } from "./layers";
import { crescent, flame } from "./primitives";

/* ------------------------------------------------------------------ */
/* Tipos                                                              */
/* ------------------------------------------------------------------ */

export type ArmPose = "down" | "open" | "up" | "chest" | "hold" | "fwd" | "high" | "side" | "low";
export type BodyPose = "stand" | "seat" | "step" | "run" | "dance";
export type HeadStyle =
  | "hair" | "bald" | "ibis" | "jackal" | "straw" | "hood" | "veil" | "triple" | "half"
  | "conical" | "hat_wide" | "helmet" | "crown" | "rays12" | "feather" | "wheat"
  | "horns" | "flamehair" | "spiky" | "twoface" | "templewings";

export type WingSpec =
  | { type: "fire" }
  | { type: "arm"; c: Color; c2: Color }
  | { type: "iris" }
  | { type?: "feather"; c?: Color; cl?: Color; cr?: Color; c2?: Color; glow?: Color };

/** Posição resolvida da figura, repassada a itens e ganchos. */
export interface FigureFrame { cx: number; T: number; B: number }
export type Hands = { L: Pt; R: Pt };
export type FigureHook = (L: Layers, fig: FigureFrame, hands: Hands) => void;

export interface HumanOpts {
  cx?: number;
  /** Topo da cabeça. */
  T?: number;
  /** Linha dos pés. */
  B?: number;
  pose?: BodyPose;
  tunic?: boolean;
  still?: boolean;
  skin?: Color;
  robe?: Color;
  trim?: Color;
  sleeve?: Color;
  legs?: Color;
  feet?: Color;
  noFeet?: boolean;
  cape?: Color;
  bare?: boolean;
  bareArms?: boolean;
  armor?: Color;
  collar?: Color;
  hair?: Color;
  hairLong?: boolean;
  hairLen?: number;
  beard?: Color;
  beardLong?: boolean;
  eye?: Color;
  eyeGlow?: Color;
  oneEye?: Color;
  smile?: boolean;
  head?: HeadStyle;
  hat?: readonly [Color, Color];
  hatCol?: Color;
  helm?: Color;
  crest?: Color;
  crownCol?: Color;
  gem?: Color;
  hornCol?: Color;
  veil?: Color;
  hoodCol?: Color;
  halo?: Color;
  wings?: WingSpec;
  multi?: boolean;
  arms?: ArmPose;
  armL?: ArmPose;
  armR?: ArmPose;
  l?: ItemKind;
  r?: ItemKind;
  /**
   * Acabamento refinado: silhueta com cintura, drapeado em 3 tons com dobras,
   * rosto com esclera/sobrancelhas/nariz/boca e brilho no cabelo.
   */
  detail?: boolean;
  /** Textura aplicada ao tecido no modo detalhado. */
  pattern?: "dots" | "stripes" | "stars" | "scales" | "diamonds";
  patternCol?: Color;
  necklace?: Color;
  bracelets?: Color;
  earrings?: Color;
  /** Faixa diagonal do ombro esquerdo ao quadril direito. */
  sash?: Color;
  lips?: Color;
  brow?: Color;
  /** Cabeça de perfil olhando para a direita (1) ou esquerda (-1). */
  profile?: 1 | -1;
  /** Desenhado antes do corpo (atrás da figura). */
  back?: FigureHook;
  /** Desenhado depois de tudo (na frente da figura). */
  front?: FigureHook;
}

/* ------------------------------------------------------------------ */
/* Itens segurados                                                    */
/* ------------------------------------------------------------------ */

interface ItemCtx { L: Layers; x: number; y: number; sg: Side; fig: FigureFrame }
type ItemFn = (c: ItemCtx) => void;

const ITEMS = {
  torch: ({ L, x, y }) => { L.s.rect(x, y - 12, 1, 15, "#5a3a1a"); L.s.rect(x - 1, y - 13, 3, 2, "#3a2a1a"); flame(L.s, x, y - 14, 7, L.f); L.gb.blob(x, y - 18, 11, 11, "#F4A300", 1, 0.35); },
  staff: ({ L, x, y }) => { L.s.line(x, y - 34, x, y + 30, "#6b4423", 1, 2); L.s.circ(x, y - 35, 2, "#8a6a3a"); },
  ogo: ({ L, x, y }) => { const s = L.s; s.line(x, y - 18, x, y + 8, "#3a2415", 1, 2); s.circ(x, y - 19, 3, "#3a2415"); for (let q = 0; q < 5; q++) s.px(x + (q % 2 ? 1 : -1), y - 16 + q * 3, "#FFFFFF"); s.px(x, y - 20, "#C8102E"); },
  sword: ({ L, x, y }) => { const s = L.s; s.rect(x, y - 24, 2, 22, "#DFE6EE"); s.rect(x, y - 24, 1, 22, "#FFFFFF"); s.rect(x - 3, y - 2, 8, 2, "#F7D070"); s.rect(x, y, 2, 4, "#5a3a1a"); },
  coppersword: ({ L, x, y }) => { const s = L.s; s.rect(x, y - 22, 2, 20, "#d8905a"); s.rect(x, y - 22, 1, 20, "#f0c090"); s.rect(x - 3, y - 2, 8, 2, "#b87333"); s.rect(x, y, 2, 4, "#3a2010"); L.gf.blob(x + 1, y - 12, 4, 12, "#FFB080", 1, 0.2 + pulse(L.f) * 0.05); },
  flamesword: ({ L, x, y }) => {
    const s = L.s; s.rect(x - 2, y - 3, 6, 2, "#F7D070"); s.rect(x, y - 1, 2, 4, "#5a3a1a");
    for (let j = 0; j < 26; j++) { s.rect(x, y - 4 - j, 2, 1, j < 9 ? "#FFFFFF" : j < 17 ? "#FFD34E" : "#FF7A1A"); if ((j + L.f) % 3 === 0) s.px(x + (j % 2 ? -1 : 2), y - 4 - j, "#FF7A1A"); }
    L.gf.blob(x + 1, y - 17, 7, 17, "#FFB020", 1.2, 0.3 + pulse(L.f) * 0.08);
  },
  spear: ({ L, x, y }) => { L.s.line(x, y - 42, x, y + 26, "#7a5a3a"); L.s.poly([[x - 2, y - 40], [x + 2, y - 40], [x, y - 48]], "#DFE6EE"); },
  spearD: ({ L, x, y }) => { L.s.line(x - 8, y + 16, x + 20, y - 40, "#7a5a3a"); L.s.poly([[x + 17, y - 36], [x + 22, y - 38], [x + 24, y - 46]], "#EEF2F6"); L.gf.line(x + 24, y - 46, x + 30, y - 58, "#FFFFFF", 0.6); },
  trumpet: ({ L, fig }) => {
    const mx = fig.cx + 5, my = fig.T + 9;
    L.s.line(mx, my, mx + 20, my - 12, "#F7D070", 1, 2); L.s.circ(mx + 21, my - 13, 3, "#FFE9A0"); L.s.circ(mx + 21, my - 13, 1, "#b8862b");
    for (let q = 0; q < 6; q++) { const d = 5 + q * 5 + L.f * 2; L.gf.px(mx + 22 + d * 0.8, my - 14 - d * 0.6 + (q % 2 ? 2 : -2), "#FFF3B0", 0.95); L.gf.px(mx + 23 + d * 0.8, my - 14 - d * 0.6, "#FFFFFF", 0.6); }
  },
  mirror: ({ L, x, y, sg }) => { L.s.rect(x, y - 1, 1, 4, "#b87333"); L.s.circ(x + sg * 2, y - 4, 3, "#d8a040"); L.s.circ(x + sg * 2, y - 4, 2, "#FFF3D0"); if (L.f === 1) L.gf.px(x + sg * 2 - 1, y - 5, "#FFFFFF"); },
  ankh: ({ L, x, y, sg }) => { L.s.ring(x + sg, y - 9, 2.2, "#E0E6EE", 1, 1); L.s.rect(x + sg, y - 7, 1, 10, "#E0E6EE"); L.s.rect(x + sg - 2, y - 6, 5, 1, "#E0E6EE"); L.gf.blob(x + sg, y - 5, 6, 9, "#BEE9E8", 1, 0.3 + pulse(L.f) * 0.08); },
  papyrus: ({ L, x, y, sg }) => { const s = L.s; s.rect(x - 3 + sg * 2, y - 5, 7, 6, "#F0E6C8"); s.rect(x - 3 + sg * 2, y - 5, 7, 1, "#C8B890"); for (let q = 0; q < 3; q++) s.rect(x - 2 + sg * 2, y - 3 + q, 5, 1, q === L.f % 3 ? "#62F0FF" : "#3a9aaa"); L.gf.blob(x + sg * 2, y - 2, 6, 5, "#62F0FF", 1, 0.3); },
  stylus: ({ L, x, y, sg }) => L.s.line(x, y + 1, x + sg * 2, y - 8, "#D8C8A0"),
  axe2: ({ L, x, y }) => { const s = L.s; s.line(x, y + 8, x, y - 20, "#5a3a1a", 1, 2); s.poly([[x, y - 20], [x - 8, y - 25], [x - 8, y - 14]], "#C8D0D8"); s.poly([[x + 1, y - 20], [x + 9, y - 25], [x + 9, y - 14]], "#C8D0D8"); s.px(x, y - 22, "#9E2A2B"); },
  hammer: ({ L, x, y }) => { L.s.line(x, y + 6, x, y - 14, "#5a3a1a", 1, 2); L.s.rect(x - 5, y - 19, 11, 5, "#6a7078"); L.s.rect(x - 5, y - 19, 11, 1, "#A8B0B8"); },
  trident: ({ L, x, y }) => { const s = L.s, c = "#C08070"; s.line(x, y + 24, x, y - 26, c); s.rect(x - 3, y - 27, 7, 1, c); s.line(x - 3, y - 27, x - 3, y - 32, c); s.line(x, y - 27, x, y - 34, c); s.line(x + 3, y - 27, x + 3, y - 32, c); },
  lotus: ({ L, x, y }) => { L.s.circ(x, y - 2, 2, "#F28AB2"); L.s.px(x - 2, y - 4, "#FFD1E3"); L.s.px(x + 2, y - 4, "#FFD1E3"); L.s.px(x, y - 5, "#FFD1E3"); },
  cornucopia: ({ L, x, y, sg }) => {
    const s = L.s;
    s.poly([[x - 1, y + 3], [x + sg * 5, y - 2], [x + sg * 12, y - 9], [x + sg * 14, y - 4], [x + sg * 7, y + 4]], "#D8A040"); s.line(x + sg * 5, y - 1, x + sg * 12, y - 7, "#A87020");
    ["#F7D070", "#62B6CB", "#E07A5F", "#8ECF6A", "#FFFFFF"].forEach((c, q) => s.px(x + sg * (11 + (q % 3)), y - 10 - (q >> 1), c));
    for (let q = 0; q < 3; q++) s.line(x + sg * 12, y - 10, x + sg * (10 + q * 3), y - 16 - q, "#DDA15E");
    L.gf.blob(x + sg * 12, y - 10, 5, 5, "#FFE08a", 1, 0.3);
  },
  sickle: ({ L, x, y, sg }) => { L.s.line(x, y + 4, x, y - 4, "#5a3a1a"); crescent(L.s, x + sg * 4, y - 8, 5, "#F7D070", sg * 3); },
  lantern: ({ L, x, y, fig }) => {
    L.s.line(x, y, x, y + 3, "#3a2a1a"); L.s.rect(x - 2, y + 3, 5, 6, "#b8862b"); L.s.rect(x - 1, y + 4, 3, 4, "#FFE066");
    L.gb.blob(x, y + 6, 8, 8, "#FFE066", 1.2, 0.5); L.gb.poly([[x - 1, y + 9], [x + 1, y + 9], [x + 14, fig.B + 3], [x - 18, fig.B + 3]], "#FFD34E", 0.22);
  },
  gourd: ({ L, x, y }) => { L.s.circ(x, y + 4, 3, "#8a5a2a"); L.s.rect(x - 1, y, 2, 2, "#6a4020"); },
  jar: ({ L, x, y }) => { L.s.poly([[x - 2, y], [x + 2, y], [x + 3, y + 5], [x, y + 7], [x - 3, y + 5]], "#C0A060"); L.s.rect(x - 2, y, 5, 1, "#8a7040"); },
  jewel: ({ L, x, y, sg }) => { L.s.circ(x + sg * 2, y - 3, 2, "#BEE9E8"); L.gf.blob(x + sg * 2, y - 3, 7, 7, "#62F0FF", 1, 0.3 + pulse(L.f) * 0.1); },
  comb: ({ L, x, y }) => { L.s.rect(x - 2, y - 5, 5, 2, "#F0E6D0"); for (let q = 0; q < 5; q++) L.s.px(x - 2 + q, y - 3, "#F0E6D0"); },
  damaru: ({ L, x, y }) => { L.s.poly([[x - 3, y - 7], [x + 3, y - 7], [x, y - 4]], "#8a5a2a"); L.s.poly([[x - 3, y - 1], [x + 3, y - 1], [x, y - 4]], "#8a5a2a"); },
  jadeblade: ({ L, x, y, sg }) => { for (let t = 0; t < 14; t++) L.s.rect(x + sg * Math.round(t * 0.5), y - 3 - t + Math.round(Math.sin(t / 4) * 2), 2, 1, "#5AC080"); L.s.rect(x - 1, y - 1, 3, 3, "#1a3a2a"); L.gf.blob(x + sg * 3, y - 10, 4, 8, "#5AC080", 1, 0.2); },
  poppy: ({ L, x, y, sg }) => { L.s.line(x, y, x + sg * 6, y - 10, "#4a7a3a"); L.s.circ(x + sg * 6, y - 11, 2, "#D02030"); L.s.px(x + sg * 7, y - 8 + L.f, "#BEE9E8"); },
  bread: ({ L, x, y, sg }) => { L.s.ell(x + sg * 2, y - 1, 3, 2, "#D8A060"); L.s.px(x + sg, y - 2, "#F0C080"); },
  scepter: ({ L, x, y }) => { L.s.line(x, y + 8, x, y - 16, "#F7D070"); L.s.circ(x, y - 17, 2, "#FF7A1A"); L.gf.blob(x, y - 17, 5, 5, "#FFB020", 1, 0.35); },
  firelotus: ({ L, x, y }) => { L.s.ell(x, y - 1, 3, 1.5, "#F28AB2"); flame(L.s, x, y - 2, 6, L.f); L.gf.blob(x, y - 5, 5, 5, "#FFB020", 1, 0.3); },
  scythe: ({ L, x, y, sg }) => { L.s.line(x, y + 22, x, y - 26, "#5a4a3a"); for (let t = 0; t < 13; t++) L.s.rect(x - sg * t, y - 26 + Math.round((t * t) / 14), 1, 2, "#9AA4AE"); },
  reins: ({ L, x, y, sg }) => L.s.line(x, y, x + sg * 14, y - 4, "#F7D070"),
  grain: ({ L, x, y, sg }) => { const s = L.s; s.ell(x + sg * 2, y - 12, 5, 3, "#DDA15E"); for (let q = 0; q < 4; q++) s.line(x + sg * (q - 1), y - 14, x + sg * (q - 2), y - 19, "#DDA15E"); s.rect(x + sg - 2, y - 9, 6, 2, "#FFD700"); },
  eruexim: ({ L, x, y, sg }) => { L.s.line(x, y, x, y - 6, "#8a6a3a"); for (let q = 0; q < 5; q++) L.s.line(x, y - 6, x + sg * (2 + q) + SW[L.f], y - 18 - q, "#E8ECF0"); },
} satisfies Record<string, ItemFn>;

export type ItemKind = keyof typeof ITEMS;

export function drawItem(L: Layers, kind: ItemKind, x: number, y: number, sg: Side, fig: FigureFrame): void {
  ITEMS[kind]({ L, x, y, sg, fig });
}

/* ------------------------------------------------------------------ */
/* Asas                                                               */
/* ------------------------------------------------------------------ */

function wings(L: Layers, cx: number, T: number, w: WingSpec): void {
  const { s, gf, f } = L, fl = [0, -1, -2, -1][f]!, p = pulse(f);
  switch (w.type) {
    case "fire": {
      const shapes: Pt[][] = [
        [[0, 0], [8, -16], [20, -30], [18, -14], [26, -10], [12, 6]],
        [[0, 4], [16, -2], [34, 0], [26, 8], [34, 18], [12, 14]],
        [[0, 10], [10, 22], [22, 38], [14, 34], [8, 44], [2, 22]],
      ];
      for (const sg of [-1, 1] as const) shapes.forEach((pts, k) => {
        const pp: Pt[] = pts.map(([x, y]) => [cx + sg * (6 + x), T + 18 + y + (k === 0 ? fl : 0)]);
        s.poly(pp, k === 1 ? "#FF9A2A" : "#FF7A1A");
        s.poly(pp.map(([x, y]): Pt => [cx + sg * 6 + (x - cx - sg * 6) * 0.6, T + 18 + (y - T - 18) * 0.6]), "#FFD34E");
        const m = pp[2]!, ex = Math.round((m[0] + cx + sg * 6) / 2), ey = Math.round((m[1] + T + 18) / 2);
        s.rect(ex - 1, ey, 3, 2, "#FFFFFF"); s.px(ex, ey, "#1a1a40");
        gf.poly(pp, "#FFB020", 0.1 + p * 0.07);
      });
      return;
    }
    case "arm":
      for (const sg of [-1, 1]) {
        s.poly([[cx + sg * 8, T + 16], [cx + sg * 24, T + 22], [cx + sg * 41, T + 16], [cx + sg * 43, T + 26], [cx + sg * 36, T + 42], [cx + sg * 22, T + 50], [cx + sg * 9, T + 36]], w.c);
        for (let q = 0; q < 4; q++) s.line(cx + sg * (14 + q * 7), T + 22 + q, cx + sg * (12 + q * 6), T + 44 + q, w.c2);
        s.line(cx + sg * 12, T + 20, cx + sg * 40, T + 18, mix(w.c, "#FFFFFF", 0.5));
      }
      return;
    case "iris": {
      const C = ["#FF6A6A", "#FFB04A", "#FFF06A", "#6AE06A", "#6AB0FF", "#B07AFF"];
      for (const sg of [-1, 1]) C.forEach((c, q) => {
        const k = 1 - q * 0.12;
        s.poly([[cx + sg * 6, T + 18], [cx + sg * (6 + 24 * k), T + 2 + fl], [cx + sg * (6 + 34 * k), T + 10 + fl], [cx + sg * (6 + 28 * k), T + 34], [cx + sg * (6 + 14 * k), T + 50]], c, 0.3);
      });
      return;
    }
    default:
      for (const sg of [-1, 1]) {
        const c = (sg < 0 ? w.cl : w.cr) ?? w.c ?? "#FFFFFF";
        const pts: Pt[] = [[cx + sg * 6, T + 18], [cx + sg * 16, T + 4 + fl], [cx + sg * 30, T - 6 + fl * 2], [cx + sg * 38, T + 4 + fl * 2], [cx + sg * 34, T + 22 + fl], [cx + sg * 26, T + 44], [cx + sg * 16, T + 60], [cx + sg * 8, T + 38]];
        s.poly(pts, c);
        for (let q = 0; q < 5; q++) s.line(cx + sg * (12 + q * 5), T + 8 + q * 2 + fl, cx + sg * (10 + q * 4), T + 34 + q * 5, shade(c, 0.78));
        s.line(cx + sg * 16, T + 4 + fl, cx + sg * 30, T - 6 + fl * 2, w.c2 ?? mix(c, "#FFFFFF", 0.5));
        if (w.glow) gf.poly(pts, w.glow, 0.08 + p * 0.07);
      }
  }
}

function multiArms(L: Layers, cx: number, T: number, skin: Color): void {
  const s = L.s;
  for (const [dx, dy, wp] of [[24, 6, "sword"], [27, 18, "disc"], [23, 40, "bow"]] as const) for (const sg of [-1, 1]) {
    const hx = cx + sg * dx, hy = T + dy;
    s.line(cx + sg * 8, T + 19, hx, hy, skin, 1, 2); s.rect(hx - 1, hy - 1, 3, 3, skin);
    if (wp === "sword") s.line(hx, hy, hx + sg * 2, hy - 8, "#DFE6EE");
    else if (wp === "disc") s.ring(hx, hy - 3, 2.2, "#F7D070", 1, 1);
    else s.line(hx, hy - 6, hx, hy + 6, "#8a5a2a");
  }
}

/* ------------------------------------------------------------------ */
/* Cabeça                                                             */
/* ------------------------------------------------------------------ */

function head(L: Layers, cx: number, T: number, o: HumanOpts): void {
  const { s, gf, f } = L, hy = T + 7;
  const sk = o.skin ?? "#c68a5a", hr = o.hair ?? "#1a1210", ey = o.eye ?? "#140c08", style = o.head ?? "hair";
  const hairBase = () => {
    s.circ(cx, hy - 1, 7, hr);
    if (o.detail) for (const [dx, dy] of [[-5, -4], [-4, -5], [-3, -6], [-1, -7], [0, -7]] as const) s.px(cx + dx, hy + dy, mix(hr, "#FFFFFF", 0.3));
    s.ell(cx, hy + 1, 5, 5, sk);
    if (o.detail) faceShade();
  };
  /** Sombra do lado direito do rosto e do queixo (luz vem da esquerda). */
  const faceShade = () => {
    const dk = shade(sk, 0.8);
    for (let j = -3; j <= 5; j++) for (let i = 3; i <= 5; i++) if ((i * i) / 25 + ((j - 1) * (j - 1)) / 25 <= 1.05) s.px(cx + i, hy + j, dk);
    s.px(cx - 1, hy + 6, dk); s.px(cx, hy + 6, dk); s.px(cx + 1, hy + 6, dk);
  };
  const eyes = () => {
    if (o.oneEye) { s.px(cx - 2, hy, o.oneEye); s.rect(cx + 1, hy - 1, 3, 2, "#111111"); gf.circ(cx - 2, hy, 2, o.oneEye, 0.35); }
    else if (o.detail) {
      const white = "#F4F0EA", brow = o.brow ?? shade(hr, 0.8);
      s.px(cx - 3, hy, white); s.px(cx - 2, hy, ey); s.px(cx + 2, hy, ey); s.px(cx + 3, hy, shade(white, 0.85));
      s.px(cx - 3, hy - 1, shade(sk, 0.62)); s.px(cx - 2, hy - 1, shade(sk, 0.62)); s.px(cx + 2, hy - 1, shade(sk, 0.62)); s.px(cx + 3, hy - 1, shade(sk, 0.62));
      s.px(cx - 4, hy - 2, brow); s.px(cx - 3, hy - 2, brow); s.px(cx + 3, hy - 2, brow); s.px(cx + 4, hy - 2, brow);
      if (o.eyeGlow) { gf.circ(cx - 2, hy, 1.5, o.eyeGlow, 0.5); gf.circ(cx + 2, hy, 1.5, o.eyeGlow, 0.5); }
    } else {
      s.px(cx - 2, hy, ey); s.px(cx + 2, hy, ey);
      if (o.eyeGlow) { gf.circ(cx - 2, hy, 1.5, o.eyeGlow, 0.5); gf.circ(cx + 2, hy, 1.5, o.eyeGlow, 0.5); }
    }
    if (o.detail) {
      s.px(cx, hy + 2, shade(sk, 0.72));
      const lips = o.lips ?? shade(mix(sk, "#B03040", 0.35), 0.8);
      if (!o.beard) { s.px(cx - 1, hy + 4, lips); s.px(cx, hy + 4, lips); s.px(cx + 1, hy + 4, shade(lips, 0.85)); }
      s.px(cx - 3, hy + 3, mix(sk, "#FF7A7A", 0.25));
      if (o.earrings) { s.px(cx - 6, hy + 3, o.earrings); s.px(cx + 6, hy + 3, o.earrings); }
    }
    if (o.smile) { const m = shade(sk, 0.55); s.px(cx - 1, hy + 3, m); s.px(cx, hy + 4, m); s.px(cx + 1, hy + 3, m); }
  };
  const beard = () => {
    if (!o.beard) return;
    const lg = o.beardLong ? 13 : 8;
    s.poly([[cx - 5, hy + 2], [cx + 5, hy + 2], [cx + 3, hy + lg], [cx, hy + lg + 2], [cx - 3, hy + lg]], o.beard);
    s.px(cx, hy + 3, shade(sk, 0.6));
  };
  const veil = o.veil ?? "#E0E0F0";
  /** Rosto de perfil: nariz, lábios e queixo projetados para `d`, cabelo cobrindo a nuca, um olho. */
  const profileFace = (d: 1 | -1) => {
    const lips = o.lips ?? shade(mix(sk, "#B03040", 0.35), 0.8), dk = shade(sk, 0.8);
    s.circ(cx - d, hy - 1, 7, hr);
    s.ell(cx + d, hy + 1, 4, 5, sk);
    for (const [dx, dy] of [[5, 0], [5, 1], [6, 2], [5, 3], [4, 4], [4, 5], [3, 6], [2, 6]] as const) s.px(cx + d * dx, hy + dy, sk);
    s.px(cx + d * 4, hy + 4, lips); s.px(cx + d * 5, hy + 2, dk);
    s.poly([[cx - d * 7, hy - 3], [cx - d * 2, hy - 8], [cx + d * 4, hy - 6], [cx + d * 5, hy - 3], [cx + d, hy - 3], [cx - d * 2, hy + 7], [cx - d * 7, hy + 5]], hr);
    if (o.detail) for (const [dx, dy] of [[-4, -5], [-2, -6], [0, -7], [2, -6]] as const) s.px(cx + d * dx, hy + dy, mix(hr, "#FFFFFF", 0.3));
    s.px(cx - d, hy + 1, dk); s.px(cx - d, hy + 2, dk);
    s.px(cx + d * 3, hy, ey); s.px(cx + d * 2, hy, "#F4F0EA"); s.px(cx + d * 3, hy - 2, o.brow ?? shade(hr, 0.8)); s.px(cx + d * 4, hy - 2, o.brow ?? shade(hr, 0.8));
    s.px(cx + d * 2, hy + 3, mix(sk, "#FF7A7A", 0.25)); s.px(cx, hy + 6, dk);
    if (o.earrings) s.px(cx - d, hy + 4, o.earrings);
    if (o.eyeGlow) gf.circ(cx + d * 3, hy, 1.5, o.eyeGlow, 0.5);
  };

  switch (style) {
    case "ibis":
      s.circ(cx, hy, 6, "#F4F4F0"); s.circ(cx, hy + 2, 4, "#E4E4DC"); s.px(cx + 2, hy - 1, "#111111");
      s.line(cx + 4, hy + 1, cx + 13, hy + 8, "#1a1a1a", 1, 2); s.line(cx + 13, hy + 8, cx + 14, hy + 12, "#1a1a1a");
      s.rect(cx - 4, hy + 5, 9, 2, "#F7D070");
      return;
    case "jackal":
      s.poly([[cx - 8, hy - 3], [cx + 8, hy - 3], [cx + 10, hy + 14], [cx - 10, hy + 14]], "#1a3a8a");
      for (let y = hy - 2; y < hy + 14; y += 2) s.line(cx - 9, y, cx + 9, y, "#F7D070");
      s.circ(cx, hy, 6, "#111111");
      s.poly([[cx - 5, hy - 3], [cx - 3, hy - 15], [cx - 1, hy - 4]], "#111111"); s.poly([[cx + 1, hy - 4], [cx + 3, hy - 15], [cx + 5, hy - 3]], "#111111");
      s.px(cx - 3, hy - 10, "#3a2a2a"); s.px(cx + 3, hy - 10, "#3a2a2a");
      s.poly([[cx + 3, hy - 1], [cx + 13, hy + 3], [cx + 12, hy + 6], [cx + 3, hy + 5]], "#111111");
      s.px(cx + 2, hy - 1, "#F7D070"); gf.px(cx + 2, hy - 1, "#FFE08a", 0.7);
      return;
    case "straw":
      return;
    case "hood":
      s.circ(cx, hy, 8, o.hoodCol ?? o.robe ?? "#555555"); s.ell(cx, hy + 2, 4, 5, sk); eyes(); beard();
      return;
    case "veil":
      s.ell(cx, hy + 1, 5, 6, sk); eyes();
      s.circ(cx, hy - 1, 8, veil, 0.75); s.poly([[cx - 8, hy], [cx + 8, hy], [cx + 11, hy + 18], [cx - 11, hy + 18]], veil, 0.5);
      return;
    case "triple":
      for (const dx of [-9, 9]) { s.circ(cx + dx, hy + 2, 4, sk); s.px(cx + dx + (dx < 0 ? -1 : 1), hy + 1, ey); s.circ(cx + dx, hy, 5, veil, 0.55); }
      s.ell(cx, hy + 1, 5, 6, sk); eyes(); s.circ(cx, hy - 1, 8, veil, 0.65);
      s.poly([[cx - 8, hy], [cx + 8, hy], [cx + 12, hy + 20], [cx - 12, hy + 20]], veil, 0.45);
      return;
    case "half":
      hairBase(); eyes();
      for (let j = -4; j <= 6; j++) for (let i = 1; i <= 5; i++) if (i * i + (j - 1) * (j - 1) <= 28) s.px(cx + i, hy + j, "#E4DED2");
      s.rect(cx + 1, hy - 1, 3, 2, "#1a1a22"); s.px(cx + 2, hy + 3, "#1a1a22");
      for (let i = 1; i < 5; i++) s.px(cx + i, hy + 5, i % 2 ? "#1a1a22" : "#E4DED2");
      return;
    default:
      break;
  }

  if (o.profile) profileFace(o.profile);
  else { hairBase(); eyes(); beard(); }
  switch (style) {
    case "bald": s.circ(cx, hy - 3, 4, sk); s.ell(cx, hy + 1, 5, 5, sk); eyes(); break;
    case "conical": {
      const [c1, c2] = o.hat ?? ["#9E1B1B", "#111111"];
      s.poly([[cx - 8, hy - 3], [cx + 8, hy - 3], [cx + 2, hy - 21]], c1); s.poly([[cx - 8, hy - 3], [cx, hy - 3], [cx + 2, hy - 21]], c2);
      s.rect(cx - 8, hy - 4, 17, 2, "#F7D070");
      break;
    }
    case "hat_wide": {
      const hc = o.hatCol ?? "#454a50";
      s.poly([[cx - 6, hy - 5], [cx + 6, hy - 5], [cx + 4, hy - 12], [cx - 4, hy - 12]], hc);
      s.rect(cx - 12, hy - 5, 25, 2, hc); s.rect(cx - 12, hy - 4, 25, 1, shade(hc, 0.7));
      break;
    }
    case "helmet": {
      const hc = o.helm ?? "#C8D0D8";
      s.poly([[cx - 7, hy + 1], [cx - 7, hy - 4], [cx - 4, hy - 8], [cx + 4, hy - 8], [cx + 7, hy - 4], [cx + 7, hy + 1], [cx + 4, hy + 1], [cx + 4, hy - 2], [cx - 4, hy - 2], [cx - 4, hy + 1]], hc);
      s.rect(cx, hy - 2, 1, 5, hc); s.rect(cx - 6, hy - 7, 13, 1, mix(hc, "#FFFFFF", 0.4));
      if (o.crest) s.poly([[cx - 2, hy - 8], [cx + 2, hy - 8], [cx + 4, hy - 16], [cx - 8, hy - 15], [cx - 9, hy - 11]], o.crest);
      break;
    }
    case "crown": {
      const c = o.crownCol ?? "#F7D070";
      s.rect(cx - 6, hy - 8, 13, 3, c);
      for (const dx of [-5, 0, 5]) s.line(cx + dx, hy - 8, cx + dx, hy - 11, c);
      s.px(cx, hy - 7, o.gem ?? "#C8102E");
      break;
    }
    case "rays12":
      for (let k = 0; k < 12; k++) {
        const an = Math.PI * (1 + k / 11);
        s.line(cx + Math.cos(an) * 8, hy - 1 + Math.sin(an) * 8, cx + Math.cos(an) * 13, hy - 1 + Math.sin(an) * 13, "#FFD34E");
      }
      gf.blob(cx, hy - 4, 14, 12, "#FFE08a", 1, 0.35 + 0.1 * pulse(f));
      break;
    case "feather":
      s.rect(cx - 6, hy - 5, 13, 2, "#40C0C0");
      s.poly([[cx, hy - 6], [cx + 2, hy - 6], [cx + 5, hy - 22], [cx + 2, hy - 24], [cx - 1, hy - 16]], "#FFFFFF");
      s.line(cx + 1, hy - 6, cx + 3, hy - 22, "#C8C8D0");
      break;
    case "wheat":
      for (let k = 0; k < 7; k++) {
        const an = Math.PI * (1.1 + (k * 0.8) / 6);
        const x2 = cx + Math.cos(an) * 12, y2 = hy - 2 + Math.sin(an) * 12;
        s.line(cx + Math.cos(an) * 6, hy - 2 + Math.sin(an) * 6, x2, y2, "#DDA15E"); s.px(x2, y2, "#FFD34E");
      }
      break;
    case "horns": {
      const hc = o.hornCol ?? "#FF8060";
      for (const sg of [-1, 1]) {
        s.line(cx + sg * 4, hy - 5, cx + sg * 8, hy - 15, hc, 1, 2);
        s.line(cx + sg * 7, hy - 11, cx + sg * 11, hy - 13, hc); s.line(cx + sg * 6, hy - 8, cx + sg * 9, hy - 7, hc);
      }
      break;
    }
    case "flamehair":
      for (let k = 0; k < 5; k++) flame(s, cx - 6 + k * 3, hy - 3, 8 + ((k + f) % 3) * 2, f, ["#FFF3B0", "#FF9A2A", "#E0321B"]);
      break;
    case "spiky":
      for (let k = 0; k < 7; k++) {
        const an = Math.PI * (1.05 + (k * 0.9) / 6);
        s.poly([[cx + Math.cos(an) * 5 - 2, hy - 1 + Math.sin(an) * 5], [cx + Math.cos(an) * 14, hy - 1 + Math.sin(an) * 14], [cx + Math.cos(an) * 5 + 2, hy - 1 + Math.sin(an) * 5]], hr);
      }
      break;
    case "twoface":
      s.circ(cx - 8, hy + 1, 4, sk); s.px(cx - 10, hy, ey); s.px(cx - 11, hy + 2, shade(sk, 0.6));
      break;
    case "templewings":
      for (const sg of [-1, 1]) s.poly([[cx + sg * 6, hy - 2], [cx + sg * 13, hy - 7 + SW[f]], [cx + sg * 12, hy - 3], [cx + sg * 14, hy - 1], [cx + sg * 7, hy + 1]], "#F4F4F0");
      break;
    default:
      break;
  }
  if (o.halo) { L.gb.ring(cx, hy - 1, 11, o.halo, 0.85, 2); L.gb.blob(cx, hy - 1, 15, 15, o.halo, 1, 0.25); }
}

/* ------------------------------------------------------------------ */
/* Corpo                                                              */
/* ------------------------------------------------------------------ */

const HAND_POS: Record<ArmPose, Pt> = {
  down: [13, 42], open: [21, 26], up: [14, 2], chest: [4, 27], hold: [12, 32], fwd: [16, 24], high: [12, -6], side: [18, 38], low: [18, 50],
};

/** Túnica refinada: ombro → cintura → barra, luz à esquerda, sombra à direita, dobras e textura. */
function drapedRobe(L: Layers, o: HumanOpts, { cx, T }: FigureFrame, hemY: number, hw: number, sw: number, robe: Color, trim: Color): void {
  const s = L.s, dk = shade(robe, 0.68), lt = mix(robe, "#FFFFFF", 0.22), fold = shade(robe, 0.78), sheen = mix(robe, "#FFFFFF", 0.14);
  const waist = T + 33;
  s.poly([[cx - 9, T + 15], [cx + 9, T + 15], [cx + 8, T + 25], [cx + 7, waist], [cx + hw + sw, hemY], [cx - hw + sw, hemY], [cx - 7, waist], [cx - 8, T + 25]], robe);
  s.poly([[cx + 3, T + 15], [cx + 9, T + 15], [cx + 8, T + 25], [cx + 7, waist], [cx + hw + sw, hemY], [cx + 4 + sw, hemY], [cx + 2, waist]], dk, 0.6);
  s.poly([[cx - 8, T + 16], [cx - 6, T + 16], [cx - 5, waist], [cx - hw + 3 + sw, hemY], [cx - hw + 1 + sw, hemY], [cx - 7, waist]], lt, 0.8);
  for (const [x0, x1] of [[-4, -7], [0, -1], [4, 6]] as const) {
    s.line(cx + x0, waist + 3, cx + x1 + sw, hemY - 2, fold);
    s.line(cx + x0 - 1, waist + 4, cx + x1 - 1 + sw, hemY - 2, sheen);
  }
  if (o.pattern) {
    const pc = o.patternCol ?? mix(trim, robe, 0.3);
    for (let y = waist + 5, row = 0; y < hemY - 3; y += 5, row++) {
      const t = (y - waist) / (hemY - waist), half = 7 + (hw - 7) * t - 2;
      for (let x = -half + (row % 2) * 2; x <= half; x += 4) {
        const px = Math.round(cx + x + sw * t), py = y;
        switch (o.pattern) {
          case "dots": s.px(px, py, pc); break;
          case "stripes": s.px(px, py, pc); s.px(px + 1, py, pc); s.px(px + 2, py, pc); break;
          case "stars": s.px(px, py, pc); s.px(px - 1, py, pc, 0.5); s.px(px + 1, py, pc, 0.5); s.px(px, py - 1, pc, 0.5); s.px(px, py + 1, pc, 0.5); break;
          case "scales": s.px(px - 1, py, pc); s.px(px, py + 1, pc); s.px(px + 1, py, pc); break;
          case "diamonds": s.px(px, py - 1, pc); s.px(px - 1, py, pc); s.px(px + 1, py, pc); s.px(px, py + 1, pc); break;
        }
      }
    }
  }
  s.line(cx - hw + sw, hemY - 1, cx + hw + sw, hemY - 1, trim, 1, 2);
  s.line(cx - hw + 1 + sw, hemY - 3, cx + hw - 1 + sw, hemY - 3, shade(trim, 0.75));
  s.line(cx - 3, T + 16, cx - 2, T + 24, sheen);
}

/** Desenha uma divindade humanoide no sprite e devolve a posição das mãos. */
export function human(L: Layers, o: HumanOpts): Hands {
  const { s, f } = L, sw = o.still ? 0 : SW[f];
  const fig: FigureFrame = { cx: o.cx ?? 45, T: o.T ?? 44, B: o.B ?? 134 };
  const { cx, T, B } = fig;
  const skin = o.skin ?? "#c68a5a", robe = o.robe ?? "#6a5a8a", trim = o.trim ?? mix(robe, "#FFFFFF", 0.35), dk = shade(robe, 0.7);
  const seat = o.pose === "seat";
  const tunic = !!o.tunic || o.pose === "step" || o.pose === "run" || o.pose === "dance";
  const hemY = seat ? B : tunic ? T + 54 : B;
  const hands: Hands = { L: [cx - 13, T + 42], R: [cx + 13, T + 42] };

  if (o.hairLong) { const hl = o.hairLen ?? 32; s.poly([[cx - 7, T + 3], [cx + 7, T + 3], [cx + 9 + sw, T + hl], [cx - 9 + sw, T + hl]], o.hair ?? "#1a1210"); }
  if (o.wings) wings(L, cx, T, o.wings);
  if (o.cape) s.poly([[cx - 9, T + 15], [cx + 9, T + 15], [cx + 18 + sw * 2, B], [cx - 18 + sw * 2, B]], o.cape);
  o.back?.(L, fig, hands);

  if (tunic && !seat) {
    const lc = o.legs ?? skin, foot = o.feet ?? shade(lc, 0.6);
    const [fx1, fx2] = o.pose === "step" ? [cx - 11, cx + 9] : o.pose === "run" ? [cx - 14, cx + 12] : [cx - 6, cx + 6];
    s.line(cx - 5, hemY - 2, fx1, B, lc, 1, 3);
    if (o.pose === "dance") { s.line(cx + 5, hemY - 2, cx + 13, hemY + 10, lc, 1, 3); s.line(cx + 13, hemY + 10, cx - 1, hemY + 15, lc, 1, 3); }
    else { s.line(cx + 5, hemY - 2, fx2, B, lc, 1, 3); s.rect(fx2 - 2, B, 4, 2, foot); }
    s.rect(fx1 - 2, B, 4, 2, foot);
  }

  if (seat) {
    s.ell(cx, B - 5, 17, 6, robe); s.rect(cx - 16, B - 5, 33, 1, trim);
    s.poly([[cx - 9, T + 15], [cx + 9, T + 15], [cx + 11, B - 6], [cx - 11, B - 6]], robe);
    s.poly([[cx + 3, T + 15], [cx + 9, T + 15], [cx + 11, B - 6], [cx + 4, B - 6]], dk, 0.5);
    if (o.detail) {
      const lt = mix(robe, "#FFFFFF", 0.22);
      s.line(cx - 8, T + 16, cx - 10, B - 7, lt);
      for (const dx of [-12, -5, 3, 10]) s.line(cx + dx, B - 9, cx + dx + (dx < 0 ? -3 : 3), B - 2, shade(robe, 0.75));
      s.ell(cx, B - 1, 16, 1.5, trim);
      s.line(cx - 15, B - 6, cx + 15, B - 6, shade(robe, 0.8));
    }
  } else if (o.detail) {
    drapedRobe(L, o, fig, hemY, tunic ? 11 : 13, sw, robe, trim);
    if (!tunic && !o.noFeet) { const ft = o.feet ?? shade(skin, 0.7); s.rect(cx - 6 + sw, B, 4, 2, ft); s.rect(cx + 3 + sw, B, 4, 2, ft); }
  } else {
    const hw = tunic ? 11 : 13;
    s.poly([[cx - 9, T + 15], [cx + 9, T + 15], [cx + hw + sw, hemY], [cx - hw + sw, hemY]], robe);
    s.poly([[cx + 3, T + 15], [cx + 9, T + 15], [cx + hw + sw, hemY], [cx + 4 + sw, hemY]], dk, 0.55);
    s.line(cx - hw + sw, hemY - 1, cx + hw + sw, hemY - 1, trim, 1, 2);
    if (!tunic && !o.noFeet) { const ft = o.feet ?? shade(skin, 0.7); s.rect(cx - 6 + sw, B, 4, 2, ft); s.rect(cx + 3 + sw, B, 4, 2, ft); }
  }
  if (o.bare) { s.poly([[cx - 8, T + 15], [cx + 8, T + 15], [cx + 7, T + 32], [cx - 7, T + 32]], skin); s.line(cx, T + 21, cx, T + 30, shade(skin, 0.8)); }
  if (o.armor) {
    s.rect(cx - 8, T + 16, 17, 15, o.armor); s.rect(cx - 8, T + 16, 17, 1, mix(o.armor, "#FFFFFF", 0.5)); s.line(cx, T + 17, cx, T + 30, shade(o.armor, 0.75));
    s.rect(cx - 11, T + 14, 5, 4, shade(o.armor, 0.9)); s.rect(cx + 7, T + 14, 5, 4, shade(o.armor, 0.9));
  }
  if (o.collar) { s.ell(cx, T + 17, 8, 3, o.collar); s.line(cx - 7, T + 18, cx + 7, T + 18, shade(o.collar, 0.7)); }
  s.rect(seat ? cx - 9 : cx - 8, T + 32, seat ? 19 : 17, 2, trim);
  s.rect(cx - 2, T + 11, 5, 5, skin);

  for (const side of ["L", "R"] as const) {
    const sg = side === "L" ? -1 : 1;
    const hp = HAND_POS[(side === "L" ? o.armL : o.armR) ?? o.arms ?? "down"];
    const sx = cx + sg * 9, sy = T + 17, hx = cx + sg * hp[0], hy = T + hp[1];
    const ac = o.bareArms ? skin : (o.sleeve ?? robe);
    const ex = (sx + hx) / 2 + sg * 2, ey = (sy + hy) / 2 + 2;
    s.line(sx, sy, ex, ey, ac, 1, 3); s.line(ex, ey, hx, hy, ac, 1, 3);
    if (o.detail && !o.bareArms) s.line(ex + (hx - ex) * 0.8, ey + (hy - ey) * 0.8, hx - (hx - ex) * 0.08, hy - (hy - ey) * 0.08, trim, 1, 2);
    s.rect(hx - 1, hy - 1, 3, 3, skin);
    if (o.bracelets) s.rect(hx - 1, hy - 2, 3, 1, o.bracelets);
    hands[side] = [hx, hy];
  }
  if (o.necklace) {
    s.line(cx - 5, T + 15, cx, T + 19, o.necklace); s.line(cx, T + 19, cx + 5, T + 15, o.necklace);
    s.px(cx, T + 20, mix(o.necklace, "#FFFFFF", 0.4));
  }
  if (o.sash) s.line(cx - 8, T + 16, cx + 7, T + 33, o.sash, 1, 2);
  if (o.multi) multiArms(L, cx, T, skin);
  head(L, cx, T, o);
  if (o.l) drawItem(L, o.l, hands.L[0], hands.L[1], -1, fig);
  if (o.r) drawItem(L, o.r, hands.R[0], hands.R[1], 1, fig);
  o.front?.(L, fig, hands);
  return hands;
}
