import { meaningOf, polarityLabel } from "../domain/reading";
import type { Card, Polarity, Position } from "../domain/types";
import type { Animator, AnimatorEntry, CardView } from "./animator";
import { byId, button, el, openOverlay } from "./dom";

export interface ZoomTarget {
  card: Card;
  polarity: Polarity | null;
  pos?: Position;
  /** Na galeria o usuário pode alternar Luz/Escuridão das cartas especiais. */
  allowPolarityToggle?: boolean;
}

export function metaLine(card: Card): string {
  if (card.special) return "Carta Especial · Dualidade Luz/Escuridão";
  if (card.cat === "major") return `Arcano Maior · ${card.numeral}`;
  return `${card.group} · Grau ${card.numeral} · ${card.groupTheme}`;
}

/** Folha de detalhe de uma lâmina (canvas 3× + textos). */
export class ZoomView {
  private entry: AnimatorEntry;

  constructor(private readonly animator: Animator) {
    this.entry = animator.mount(byId<HTMLCanvasElement>("zoomCv"), { card: placeholderCard(), polarity: null, revealed: true, revealStart: 0 }, true);
  }

  open(t: ZoomTarget): void {
    const view: CardView = { card: t.card, polarity: t.polarity, revealed: true, revealStart: 0 };
    this.animator.retarget(this.entry, view);

    const polRow = byId("polRow");
    polRow.replaceChildren();
    const info = byId("zoomInfo");

    const fill = () => {
      info.replaceChildren(el("h3", undefined, t.card.name), el("div", "meta", metaLine(t.card)));
      if (t.pos) {
        const p = el("p"); p.append(el("strong", undefined, `Posição: ${t.pos.label}`)); info.append(p);
      }
      info.append(el("p", undefined, t.card.desc));
      info.append(el("p", undefined, t.card.special ? `${polarityLabel(view.polarity ?? "luz")}: ${meaningOf(view)}` : `Como ler: ${meaningOf(view)}`));
    };

    if (t.card.special && t.allowPolarityToggle) {
      for (const pol of ["luz", "escuridao"] as const) {
        const b = button(polarityLabel(pol), () => {
          view.polarity = pol; this.animator.invalidate(this.entry);
          polRow.querySelectorAll(".pbtn").forEach(x => x.classList.toggle("active", x === b));
          fill();
        }, `pbtn${view.polarity === pol ? " active" : ""}`);
        polRow.append(b);
      }
    }
    fill();
    openOverlay("zoomOverlay");
  }
}

function placeholderCard(): Card {
  return { id: -1, name: "", group: "", cat: "major", desc: "", special: false, numeral: "0", read: "", groupTheme: null };
}
