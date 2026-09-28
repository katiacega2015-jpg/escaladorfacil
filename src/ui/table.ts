import { DECK } from "../domain/deck";
import { saveReading, type KeyValueStore } from "../domain/history";
import { meaningOf, polarityLabel, Reading } from "../domain/reading";
import { ROW_OPEN_ORDER, ROW_TITLE, ROW_VISUAL_ORDER, SPREADS } from "../domain/spreads";
import type { Drawn, RowName, Spread } from "../domain/types";
import { ACCENT } from "../engine/hud";
import { cardCanvas, type Animator } from "./animator";
import { byId, button, el } from "./dom";
import type { ZoomView } from "./zoom";

/** A mesa de leitura: seletor de tiragem, fileiras de lâminas, escolha do Grau 2 e interpretações. */
export class TableView {
  private reading: Reading;
  private readonly picker = byId("spreadPicker");
  private readonly desc = byId("spreadDesc");
  private readonly board = byId("board");
  private readonly choice = byId("choicePanel");
  private readonly hint = byId("hint");
  private readonly info = byId("readingInfo");

  constructor(private readonly animator: Animator, private readonly zoom: ZoomView, private readonly store: KeyValueStore) {
    this.reading = new Reading(SPREADS[1]!, DECK);
    byId("newReadingBtn").onclick = () => this.deal(this.reading.spread);
  }

  deal(spread: Spread): void {
    this.reading = new Reading(spread, DECK);
    this.render();
  }

  private reveal(d: Drawn): void {
    if (!this.reading.reveal(d, performance.now())) return;
    this.render();
    if (this.reading.complete) saveReading(this.store, this.reading);
  }

  render(): void {
    this.renderPicker();
    this.renderBoard();
    this.renderChoice();
    this.renderInfo();
  }

  private renderPicker(): void {
    const current = this.reading.spread;
    this.picker.replaceChildren(...SPREADS.map(sp => button(sp.label, () => this.deal(sp), `pbtn${sp.id === current.id ? " active" : ""}`)));
    this.desc.textContent = current.desc;
  }

  private renderBoard(): void {
    const blocks = ROW_VISUAL_ORDER.filter(r => this.reading.rows[r].length).map(r => {
      const cards = el("div", "row-cards");
      cards.append(...this.reading.rows[r].map(d => this.slot(d, r)));
      const block = el("div", "row-block");
      block.append(el("div", "row-header", ROW_TITLE[r]), cards);
      return block;
    });
    this.board.replaceChildren(...blocks);
  }

  private slot(d: Drawn, row: RowName): HTMLElement {
    const unlocked = this.reading.isUnlocked(row);
    const cv = cardCanvas(`cv${unlocked ? "" : " locked"}`);
    cv.setAttribute("aria-label", d.revealed ? d.card.name : `Lâmina oculta: ${d.pos.label}`);
    this.animator.mount(cv, d, true);
    cv.onclick = () => {
      if (!unlocked) return;
      if (d.revealed) this.zoom.open({ card: d.card, polarity: d.polarity, pos: d.pos });
      else this.reveal(d);
    };
    const slot = el("div", "slot");
    slot.append(el("div", "slot-label", d.pos.label), cv, el("div", "slot-name", d.revealed ? d.card.name : ""));
    return slot;
  }

  private renderChoice(): void {
    this.choice.replaceChildren();
    if (!this.reading.awaitingChoice) return;
    const row = el("div", "choice-row");
    row.append(
      button("Por quê · A Causa", () => { this.reading.choose("causa"); this.render(); }),
      button("Para onde · A Consequência", () => { this.reading.choose("consequencia"); this.render(); }),
    );
    const panel = el("div", "choice-panel");
    panel.append(el("p", undefined, "O cartomante decide: investigar o Passado (Causa) ou prever o Futuro (Consequência)?"), row);
    this.choice.append(panel);
  }

  private renderInfo(): void {
    const boxes = ROW_OPEN_ORDER.flatMap(r => this.reading.rows[r].filter(d => d.revealed).map(d => {
      const title = el("h3", undefined, d.card.name);
      if (d.polarity) title.append(el("span", `tagp${d.polarity === "escuridao" ? " esc" : ""}`, polarityLabel(d.polarity)));
      const meaning = el("p", "meaning");
      meaning.append(el("strong", undefined, `${ROW_TITLE[r]} — ${d.pos.label}: `), meaningOf(d));
      const box = el("div", "card-detail");
      box.style.setProperty("--acc", ACCENT[d.card.cat]);
      box.append(title, meaning);
      if (d.card.groupTheme) box.append(el("div", "suitline", `${d.card.group} — ${d.card.groupTheme}`));
      box.onclick = () => this.zoom.open({ card: d.card, polarity: d.polarity, pos: d.pos });
      return box;
    }));
    this.info.replaceChildren(...boxes);
    const msg = this.reading.hint();
    this.hint.hidden = !msg;
    this.hint.textContent = msg ?? "";
  }
}
