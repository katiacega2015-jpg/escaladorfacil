import { DECK } from "../domain/deck";
import { saveReading, type KeyValueStore } from "../domain/history";
import { meaningOf, polarityLabel, Reading } from "../domain/reading";
import { ROW_OPEN_ORDER, ROW_TITLE, ROW_VISUAL_ORDER, SPREADS } from "../domain/spreads";
import type { Drawn, RowName, Spread } from "../domain/types";
import { ACCENT } from "../engine/hud";
import { cardElement, type Animator, type CardEl } from "./animator";
import { byId, button, el } from "./dom";
import { fitScale, isDesktop } from "./layout";
import { attachTilt, burst, dealIn, flip, gather, nudge, play } from "./motion";
import type { ZoomTarget, ZoomView } from "./zoom";

interface Slot extends CardEl { drawn: Drawn; row: RowName; el: HTMLElement; name: HTMLElement }

const glow = (d: Drawn) => (d.polarity === "escuridao" ? "#B03CD2" : ACCENT[d.card.cat]);

/**
 * A mesa de leitura. O DOM das lâminas é persistente durante a leitura (só a classe e o nome mudam),
 * para que distribuição, virada e brilho rodem sem ser reiniciados por re-renderizações.
 */
export class TableView {
  private reading: Reading;
  private readonly slots = new Map<Drawn, Slot>();
  private readonly entries = new Map<Drawn, HTMLElement>();
  private busy = false;
  private readonly picker = byId("spreadPicker");
  private readonly desc = byId("spreadDesc");
  private readonly board = byId("board");
  private readonly deck = byId("deckPile");
  private readonly choice = byId("choicePanel");
  private readonly hint = byId("hint");
  private readonly info = byId("readingInfo");
  private readonly progress = byId("readingProgress");
  private readonly readBtn = byId<HTMLButtonElement>("readBtn");

  constructor(private readonly animator: Animator, private readonly zoom: ZoomView, private readonly store: KeyValueStore) {
    this.reading = new Reading(SPREADS[1]!, DECK);
    byId("newReadingBtn").onclick = () => void this.deal(this.reading.spread);
    this.readBtn.onclick = () => this.openReader(0);
    new ResizeObserver(() => this.fit()).observe(byId("stage"));
    addEventListener("resize", () => this.fit());
  }

  get spread(): Spread { return this.reading.spread; }

  /** Recolhe a mesa atual, corta de novo e distribui com animação. */
  async deal(spread: Spread): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    const old = [...this.slots.values()].map(s => s.root);
    if (old.length) await gather(old, this.deck.getBoundingClientRect());
    this.reading = new Reading(spread, DECK);
    this.slots.clear();
    this.entries.clear();
    this.board.classList.remove("complete");
    this.renderPicker();
    this.buildBoard();
    this.renderChoice();
    this.renderInfo();
    await dealIn(this.inOpenOrder().map(s => s.root), this.deck.getBoundingClientRect());
    this.busy = false;
  }

  /** Revela a próxima lâmina liberada (atalho de teclado). */
  revealNext(): void {
    const next = this.inOpenOrder().find(s => !s.drawn.revealed && this.reading.isUnlocked(s.row));
    if (next) this.reveal(next);
  }

  /** Abre o leitor na i-ésima lâmina revelada, na ordem de abertura. */
  openReader(i: number, from?: Element | null): void {
    const list = this.revealedTargets();
    if (list.length) this.zoom.open(list, Math.min(i, list.length - 1), from ?? null);
  }

  private inOpenOrder(): Slot[] {
    return ROW_OPEN_ORDER.flatMap(r => this.reading.rows[r].map(d => this.slots.get(d)!).filter(Boolean));
  }

  private revealed(): Drawn[] {
    return ROW_OPEN_ORDER.flatMap(r => this.reading.rows[r].filter(d => d.revealed));
  }

  private revealedTargets(): ZoomTarget[] {
    return this.revealed().map(d => {
      const row = ROW_OPEN_ORDER.find(r => this.reading.rows[r].includes(d))!;
      return { card: d.card, polarity: d.polarity, pos: d.pos, row: ROW_TITLE[row] };
    });
  }

  private reveal(s: Slot): void {
    if (!this.reading.isUnlocked(s.row)) {
      void nudge(s.root);
      void play(this.hint, [{ color: "var(--gold)" }, { color: "var(--ink-dim)" }], { duration: 900 });
      return;
    }
    if (!this.reading.reveal(s.drawn, performance.now())) return;
    const ms = this.animator.flipMs;
    s.root.classList.add("flipping");
    void flip(s.root, ms);
    setTimeout(() => {
      s.root.classList.remove("flipping");
      burst(s.root, glow(s.drawn));
      this.refreshSlot(s);
      this.renderInfo();
    }, ms);
    this.slots.forEach(x => this.refreshSlot(x));
    this.renderChoice();
    this.renderHint();
    if (this.reading.complete) {
      saveReading(this.store, this.reading);
      setTimeout(() => this.board.classList.add("complete"), ms + 500);
    }
  }

  private renderPicker(): void {
    const current = this.reading.spread;
    this.picker.replaceChildren(...SPREADS.map((sp, i) => {
      const b = button(sp.label, () => void this.deal(sp), `pbtn${sp.id === current.id ? " active" : ""}`);
      b.title = `${sp.desc} (tecla ${i + 1})`;
      return b;
    }));
    this.desc.textContent = current.desc;
    byId("spreadDescSide").textContent = `${current.label} — ${current.desc}`;
  }

  /** Monta as fileiras. Lâminas que já existiam (Grau 2 após a escolha) são reaproveitadas. */
  private buildBoard(): Slot[] {
    const fresh: Slot[] = [];
    const blocks = ROW_VISUAL_ORDER.filter(r => this.reading.rows[r].length).map(r => {
      const cards = el("div", "row-cards");
      cards.append(...this.reading.rows[r].map(d => {
        let s = this.slots.get(d);
        if (!s) { s = this.slot(d, r); this.slots.set(d, s); fresh.push(s); }
        this.refreshSlot(s);
        return s.el;
      }));
      const block = el("div", `row-block row-${r}`);
      block.append(el("div", "row-header", ROW_TITLE[r]), cards);
      return block;
    });
    this.board.dataset.rows = String(blocks.length);
    this.board.replaceChildren(...blocks);
    this.fit();
    return fresh;
  }

  private slot(d: Drawn, row: RowName): Slot {
    const c = cardElement();
    this.animator.mount(c.cv, d, true);
    attachTilt(c.tilt);
    c.cv.tabIndex = 0;
    c.cv.setAttribute("role", "button");
    const s: Slot = { ...c, drawn: d, row, el: el("div", "slot"), name: el("div", "slot-name") };
    const act = () => {
      if (s.drawn.revealed) this.openReader(this.revealed().indexOf(d), c.cv);
      else this.reveal(s);
    };
    c.cv.onclick = act;
    c.cv.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); act(); } };
    s.el.onpointerenter = () => this.entries.get(d)?.classList.add("linked");
    s.el.onpointerleave = () => this.entries.get(d)?.classList.remove("linked");
    s.el.append(el("div", "slot-label", d.pos.label), c.root, s.name);
    return s;
  }

  private refreshSlot(s: Slot): void {
    const d = s.drawn, unlocked = this.reading.isUnlocked(s.row), shown = d.revealed && !s.root.classList.contains("flipping");
    s.el.classList.toggle("locked", !unlocked);
    s.el.classList.toggle("ready", unlocked && !d.revealed);
    s.el.classList.toggle("revealed", shown);
    // A cor da aura só vem da carta depois de revelada; antes seria spoiler do naipe.
    s.root.style.setProperty("--glow", shown ? glow(d) : "var(--gold)");
    s.cv.setAttribute("aria-label", shown ? `${d.card.name} — abrir leitura` : unlocked ? `Revelar: ${d.pos.label}` : `Trancada: ${d.pos.label}`);
    s.name.textContent = shown ? d.card.name + (d.polarity ? ` · ${polarityLabel(d.polarity)}` : "") : "";
  }

  private renderChoice(): void {
    this.choice.replaceChildren();
    if (!this.reading.awaitingChoice) return;
    const pick = (k: "causa" | "consequencia") => {
      this.reading.choose(k);
      this.choice.replaceChildren();
      const fresh = this.buildBoard();
      void dealIn(fresh.map(s => s.root), this.deck.getBoundingClientRect());
      this.renderHint();
    };
    const row = el("div", "choice-row");
    row.append(button("◂ Por quê · A Causa", () => pick("causa")), button("Para onde · A Consequência ▸", () => pick("consequencia")));
    const panel = el("div", "choice-panel");
    panel.append(el("p", undefined, "O cartomante decide: investigar o Passado (Causa) ou prever o Futuro (Consequência)?"), row);
    this.choice.append(panel);
    void play(panel, [{ opacity: 0, transform: "scale(.94)" }, { opacity: 1, transform: "none" }], { duration: 280, delay: this.animator.flipMs, easing: "ease-out", fill: "backwards" });
  }

  private renderHint(): void {
    const msg = this.reading.complete ? "Leitura completa · salva no histórico." : this.reading.hint();
    this.hint.hidden = !msg;
    this.hint.textContent = msg ?? "";
  }

  /** Painel de interpretações: só as entradas novas entram com animação. */
  private renderInfo(): void {
    const revealed = this.revealed().filter(d => !this.slots.get(d)?.root.classList.contains("flipping"));
    const boxes = revealed.map((d, i) => {
      let box = this.entries.get(d);
      if (!box) { box = this.entry(d, i); box.classList.add("enter"); this.entries.set(d, box); }
      else box.classList.remove("enter");
      return box;
    });
    this.info.replaceChildren(...boxes);
    byId("readingEmpty").hidden = boxes.length > 0;
    const total = this.inOpenOrder().length + (this.reading.spread.branch && !this.reading.choiceMade ? 1 : 0);
    this.progress.textContent = `${revealed.length} / ${total} lâminas abertas`;
    this.readBtn.disabled = !boxes.length;
    this.renderHint();
    const last = boxes[boxes.length - 1];
    if (last?.classList.contains("enter") && isDesktop()) last.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  private entry(d: Drawn, i: number): HTMLElement {
    const row = ROW_OPEN_ORDER.find(r => this.reading.rows[r].includes(d))!;
    const title = el("h3", undefined, d.card.name);
    if (d.polarity) title.append(el("span", `tagp${d.polarity === "escuridao" ? " esc" : ""}`, polarityLabel(d.polarity)));
    const box = el("article", "card-detail");
    box.style.setProperty("--acc", glow(d));
    box.append(el("div", "pos", `${ROW_TITLE[row]} · ${d.pos.label}`), title, el("p", "meaning", meaningOf(d)));
    if (d.card.groupTheme) box.append(el("div", "suitline", `${d.card.group} — ${d.card.groupTheme}`));
    box.onclick = () => this.openReader(this.revealed().indexOf(d), this.slots.get(d)?.cv);
    box.onpointerenter = () => this.slots.get(d)?.el.classList.add("linked");
    box.onpointerleave = () => this.slots.get(d)?.el.classList.remove("linked");
    box.style.setProperty("--i", String(i));
    return box;
  }

  /** Escala da lâmina: no PC cabe a tiragem inteira na tela; no mobile prioriza a largura e rola. */
  private fit(): void {
    const stage = byId("stage");
    const rows = this.reading.spread.branch ? 2 : ROW_OPEN_ORDER.filter(r => this.reading.rows[r].length).length;
    const cols = Math.max(1, ...ROW_OPEN_ORDER.map(r => this.reading.rows[r].length));
    const dpr = devicePixelRatio || 1;
    const desk = isDesktop();
    // Cromo real de uma fileira (títulos, rótulos, nome, vão) medido no DOM, independente da escala.
    const blk = this.board.querySelector<HTMLElement>(".row-block"), cv = blk?.querySelector("canvas");
    const side = desk ? 2 * (blk?.querySelector<HTMLElement>(".row-header")?.offsetWidth ?? 0) : 0;
    const chrome = blk && cv ? blk.offsetHeight - cv.offsetHeight + (parseFloat(getComputedStyle(this.board).rowGap) || 0) : 60;
    const s = fitScale({
      availW: this.board.clientWidth - side - 8,
      availH: desk ? stage.clientHeight - 8 : innerHeight * 0.8,
      cols, rows, rowChrome: chrome, gap: desk ? 22 : 12,
      min: 1, max: desk ? 3 : 2.5, dpr,
    });
    this.board.style.setProperty("--cs", String(s));
  }
}
