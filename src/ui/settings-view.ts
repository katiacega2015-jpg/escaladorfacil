import type { KeyValueStore } from "../domain/history";
import { byId, button, el, openOverlay } from "./dom";
import { applyPrefs, savePrefs, type Prefs } from "./settings";

type Option<K extends keyof Prefs> = [value: Prefs[K], label: string];

const GROUPS: { [K in keyof Prefs]: { title: string; hint: string; options: Option<K>[] } } = {
  text: { title: "Tamanho do texto", hint: "Aumenta títulos, rótulos e interpretações. A arte das lâminas não muda.", options: [["s", "Pequeno"], ["m", "Médio"], ["l", "Grande"], ["xl", "Extra grande"]] },
  contrast: { title: "Contraste", hint: "Textos secundários e bordas mais claros.", options: [["normal", "Normal"], ["high", "Alto"]] },
  readFont: { title: "Fonte das interpretações", hint: "Serifada lembra livro; simples é mais limpa para leitura rápida.", options: [["serif", "Serifada"], ["sans", "Simples"]] },
  motion: { title: "Movimento", hint: "Reduzido desliga viradas 3D, voos, brilhos pulsantes e inclinação.", options: [["auto", "Do sistema"], ["reduce", "Reduzido"]] },
};

/** Painel de acessibilidade: cada escolha vale na hora e fica salva no aparelho. */
export class SettingsView {
  constructor(private prefs: Prefs, private readonly store: KeyValueStore, private readonly onChange: () => void) {}

  open(): void {
    this.render();
    openOverlay("settingsOverlay");
  }

  private set<K extends keyof Prefs>(key: K, value: Prefs[K]): void {
    this.prefs = { ...this.prefs, [key]: value };
    applyPrefs(document.documentElement, this.prefs);
    savePrefs(this.store, this.prefs);
    this.render();
    this.onChange();
  }

  private render(): void {
    const body = byId("settingsBody");
    const sections = (Object.keys(GROUPS) as (keyof Prefs)[]).map(key => {
      const g = GROUPS[key];
      const row = el("div", "seg");
      row.setAttribute("role", "radiogroup");
      row.setAttribute("aria-label", g.title);
      for (const [value, label] of g.options as Option<typeof key>[]) {
        const on = this.prefs[key] === value;
        const b = button(label, () => this.set(key, value), `pbtn${on ? " active" : ""}`);
        b.setAttribute("role", "radio");
        b.setAttribute("aria-checked", String(on));
        row.append(b);
      }
      const sec = el("section", "setting");
      sec.append(el("h3", undefined, g.title), row, el("p", "setting-hint", g.hint));
      return sec;
    });
    const sample = el("p", "setting-sample", "Prévia: “Trabalhe em equipe para construir algo sólido. Cuidado com a avareza.”");
    body.replaceChildren(...sections, sample);
  }
}
