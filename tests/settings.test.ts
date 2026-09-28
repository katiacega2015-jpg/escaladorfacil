import { describe, expect, it } from "vitest";
import { DEFAULT_PREFS, loadPrefs, savePrefs, TEXT_SCALE } from "../src/ui/settings";

const mem = (init: Record<string, string> = {}) => {
  const m = new Map(Object.entries(init));
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};

describe("preferências de acessibilidade", () => {
  it("usa o padrão quando não há nada salvo", () => {
    expect(loadPrefs(mem())).toEqual(DEFAULT_PREFS);
  });

  it("salva e recarrega", () => {
    const s = mem();
    savePrefs(s, { text: "xl", contrast: "high", readFont: "sans", motion: "reduce" });
    expect(loadPrefs(s)).toEqual({ text: "xl", contrast: "high", readFont: "sans", motion: "reduce" });
  });

  it("ignora JSON inválido e valores desconhecidos campo a campo", () => {
    expect(loadPrefs(mem({ oraculo_prefs: "{quebrado" }))).toEqual(DEFAULT_PREFS);
    expect(loadPrefs(mem({ oraculo_prefs: "null" }))).toEqual(DEFAULT_PREFS);
    expect(loadPrefs(mem({ oraculo_prefs: JSON.stringify({ text: "gigante", contrast: "high" }) }))).toEqual({ ...DEFAULT_PREFS, contrast: "high" });
  });

  it("não quebra se o armazenamento recusar a escrita", () => {
    const s = { getItem: () => null, setItem: () => { throw new Error("cheio"); } };
    expect(() => savePrefs(s, DEFAULT_PREFS)).not.toThrow();
  });

  it("escalas de texto crescem em ordem", () => {
    expect(TEXT_SCALE.s).toBeLessThan(TEXT_SCALE.m);
    expect(TEXT_SCALE.m).toBeLessThan(TEXT_SCALE.l);
    expect(TEXT_SCALE.l).toBeLessThan(TEXT_SCALE.xl);
  });
});
