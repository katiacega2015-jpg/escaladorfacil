import { DECK } from "../domain/deck";
import type { Card } from "../domain/types";
import { cardCanvas, type Animator } from "./animator";
import { byId, el, openOverlay } from "./dom";
import type { ZoomView } from "./zoom";

const GROUPS: [title: string, match: (c: Card) => boolean][] = [
  ["Arcanos Maiores", c => c.cat === "major"],
  ["Elemento Água", c => c.cat === "agua"],
  ["Elemento Fogo", c => c.cat === "fogo"],
  ["Elemento Terra", c => c.cat === "terra"],
  ["Elemento Ar", c => c.cat === "ar"],
  ["Cartas Especiais", c => c.special],
];

/** Galeria com as 52 lâminas; construída só na primeira abertura. */
export class GalleryView {
  private built = false;

  constructor(private readonly animator: Animator, private readonly zoom: ZoomView) {}

  open(): void {
    if (!this.built) this.build();
    openOverlay("galleryOverlay");
  }

  private build(): void {
    this.built = true;
    const body = byId("galleryBody");
    for (const [title, match] of GROUPS) {
      const grid = el("div", "gallery-grid");
      for (const card of DECK.filter(match)) {
        const cv = cardCanvas();
        const polarity = card.special ? "luz" : null;
        this.animator.mount(cv, { card, polarity, revealed: true, revealStart: 0 });
        cv.onclick = () => this.zoom.open({ card, polarity, allowPolarityToggle: true });
        const item = el("div", "g-item");
        item.append(cv, el("span", undefined, card.name));
        grid.append(item);
      }
      const group = el("div", "gallery-group");
      group.append(el("h4", undefined, title), grid);
      body.append(group);
    }
  }
}
