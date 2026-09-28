import type { KeyValueStore } from "../domain/history";

/** Preferências de acessibilidade, salvas no aparelho. */
export interface Prefs {
  /** Escala do texto da interface (não afeta a arte em pixel). */
  text: TextSize;
  contrast: "normal" | "high";
  /** Fonte dos textos longos de leitura. */
  readFont: "serif" | "sans";
  /** "auto" segue o sistema; "reduce" desliga viradas, voos e brilhos animados. */
  motion: "auto" | "reduce";
}

export type TextSize = "s" | "m" | "l" | "xl";
export const TEXT_SCALE: Record<TextSize, number> = { s: 0.9, m: 1, l: 1.2, xl: 1.4 };
export const DEFAULT_PREFS: Prefs = { text: "m", contrast: "normal", readFont: "serif", motion: "auto" };
const KEY = "oraculo_prefs";

const pick = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T =>
  allowed.includes(v as T) ? (v as T) : fallback;

/** Lê as preferências, ignorando valores corrompidos ou de versões antigas. */
export function loadPrefs(store: KeyValueStore): Prefs {
  let raw: Record<string, unknown> = {};
  try { raw = JSON.parse(store.getItem(KEY) ?? "{}") as Record<string, unknown>; } catch { /* mantém o padrão */ }
  if (typeof raw !== "object" || raw === null) raw = {};
  return {
    text: pick(raw.text, ["s", "m", "l", "xl"] as const, DEFAULT_PREFS.text),
    contrast: pick(raw.contrast, ["normal", "high"] as const, DEFAULT_PREFS.contrast),
    readFont: pick(raw.readFont, ["serif", "sans"] as const, DEFAULT_PREFS.readFont),
    motion: pick(raw.motion, ["auto", "reduce"] as const, DEFAULT_PREFS.motion),
  };
}

export function savePrefs(store: KeyValueStore, p: Prefs): void {
  try { store.setItem(KEY, JSON.stringify(p)); } catch { /* armazenamento cheio ou bloqueado: segue sem salvar */ }
}

/** Aplica as preferências no <html> (variáveis e atributos lidos pelo CSS). */
export function applyPrefs(root: HTMLElement, p: Prefs): void {
  root.style.setProperty("--fs", String(TEXT_SCALE[p.text]));
  root.dataset.contrast = p.contrast;
  root.dataset.readfont = p.readFont;
  root.dataset.motion = p.motion;
}
