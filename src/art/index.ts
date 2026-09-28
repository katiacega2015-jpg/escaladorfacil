import type { ArtFn } from "../engine/layers";
import { AGUA_ART } from "./agua";
import { AR_ART } from "./ar";
import { ESPECIAIS_ART } from "./especiais";
import { FOGO_ART } from "./fogo";
import { MAJOR_ART } from "./majors";
import { TERRA_ART } from "./terra";

/** Registro de arte por nome de lâmina. Para uma carta nova: adicione-a no deck e aqui. */
export const ART: Readonly<Record<string, ArtFn>> = {
  ...MAJOR_ART,
  ...AGUA_ART,
  ...FOGO_ART,
  ...TERRA_ART,
  ...AR_ART,
  ...ESPECIAIS_ART,
};
