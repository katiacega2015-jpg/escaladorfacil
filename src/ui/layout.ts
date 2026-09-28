import { H, W } from "../engine/buf";

/** Arredonda a escala para que cada pixel da arte caia em pixels físicos inteiros (passos de ¼ em telas 1×). */
export function snapScale(s: number, dpr: number): number {
  const step = dpr >= 2 ? 1 / Math.round(dpr) : 0.25;
  return Math.max(step, Math.floor(s / step + 1e-6) * step);
}

export interface FitInput {
  availW: number;
  availH: number;
  /** Maior número de lâminas numa fileira. */
  cols: number;
  rows: number;
  /** Espaço vertical fixo por fileira (títulos, rótulos, nome). */
  rowChrome: number;
  gap: number;
  min: number;
  max: number;
  dpr: number;
}

/** Maior escala da lâmina (90×160) que cabe na área, entre `min` e `max`, alinhada à grade de pixels. */
export function fitScale(i: FitInput): number {
  const byW = (i.availW - (i.cols - 1) * i.gap) / (i.cols * W);
  const byH = (i.availH - i.rows * i.rowChrome) / (i.rows * H);
  const s = Math.min(i.max, Math.max(i.min, Math.min(byW, byH)));
  return snapScale(s, i.dpr);
}

export const desktopQuery = "(min-width: 960px) and (min-height: 560px)";
export const finePointerQuery = "(hover: hover) and (pointer: fine)";
export const isDesktop = () => matchMedia(desktopQuery).matches;
export const hasFinePointer = () => matchMedia(finePointerQuery).matches;
export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
