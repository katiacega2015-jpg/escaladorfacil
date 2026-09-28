import { DECK } from "../domain/deck";
import type { Card } from "../domain/types";
import { cardElement, type Animator } from "./animator";
import { byId, el, openOverlay } from "./dom";
import { attachTilt } from "./motion";
import type { ZoomTarget, ZoomView } from "./zoom";

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
    const list: ZoomTarget[] = [];
    for (const [title, match] of GROUPS) {
      const grid = el("div", "gallery-grid");
      for (const card of DECK.filter(match)) {
        const { root, tilt, cv } = cardElement();
        const target: ZoomTarget = { card, polarity: card.special ? "luz" : null, allowPolarityToggle: true };
        const index = list.push(target) - 1;
        const view = { card, polarity: target.polarity, revealed: true, revealStart: 0 };
        this.animator.mount(cv, view);
        attachTilt(tilt);
        cv.setAttribute("aria-label", card.name);
        cv.onclick = () => this.zoom.open(list, index, cv);
        const item = el("div", "g-item");
        item.append(root, el("span", undefined, card.name));
        grid.append(item);
      }
      const group = el("div", "gallery-group");
      group.append(el("h4", undefined, title), grid);
      body.append(group);
    }
  }
}
