import type { Polarity } from "../domain/types";
import { Buf, type Frame, type Rng } from "./buf";

/**
 * Camadas de composição de uma lâmina (de trás para frente):
 * b = fundo · gb = brilho de fundo · s = sprite (ganha contorno + rim light) ·
 * gf = brilho frontal · fg = primeiro plano.
 */
export interface Layers {
  b: Buf;
  gb: Buf;
  s: Buf;
  gf: Buf;
  fg: Buf;
  f: Frame;
  pol: Polarity | null;
  r: Rng;
}

/** Uma função de arte desenha a lâmina inteira nas camadas. Precisa ser determinística para o mesmo `f`. */
export type ArtFn = (L: Layers) => void;

export function makeLayers(f: Frame, pol: Polarity | null, r: Rng): Layers {
  return { b: new Buf(), gb: new Buf(), s: new Buf(), gf: new Buf(), fg: new Buf(), f, pol, r };
}

/** Clona as camadas trocando o sprite (para desenhar numa folha separada e compor depois). */
export const withSprite = (L: Layers, s: Buf): Layers => ({ ...L, s });
