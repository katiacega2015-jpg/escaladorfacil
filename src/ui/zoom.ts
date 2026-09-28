import { meaningOf, polarityLabel } from "../domain/reading";
import type { Card, Polarity, Position } from "../domain/types";
import { ACCENT } from "../engine/hud";
import type { Animator, AnimatorEntry, CardView } from "./animator";
import { byId, button, closeOverlay, el, openOverlay } from "./dom";
import { fitScale, isDesktop } from "./layout";
import { growFrom, onSwipe, play, slide } from "./motion";

export interface ZoomTarget {
  card: Card;
  polarity: Polarity | null;
  pos?: Position;
  /** Título da fileira na leitura (Presente, Passado, Futuro). */
  row?: string;
  /** Na galeria o usuário pode alternar Luz/Escuridão das cartas especiais. */
  allowPolarityToggle?: boolean;
}

export function metaLine(card: Card): string {
  if (card.special) return "Carta Especial · Dualidade Luz/Escuridão";
  if (card.cat === "major") return `Arcano Maior · ${card.numeral}`;
  return `${card.group} · Grau ${card.numeral} · ${card.groupTheme}`;
}

/**
 * Leitor de lâminas: carta grande + textos. Navega por uma lista (a leitura ou o baralho)
 * com setas, teclado (←/→) ou arrastando; no mobile, arrastar para baixo fecha.
 */
export class ZoomView {
  private readonly entry: AnimatorEntry;
  private readonly overlay = byId("zoomOverlay");
  private readonly box = byId("zoomCard");
  private readonly side = byId("zoomSide");
  private readonly prev = byId<HTMLButtonElement>("zoomPrev");
  private readonly next = byId<HTMLButtonElement>("zoomNext");
  private list: ZoomTarget[] = [];
  private i = 0;
  private moving = false;

  constructor(private readonly animator: Animator) {
    this.entry = animator.mount(byId<HTMLCanvasElement>("zoomCv"), { card: placeholderCard(), polarity: null, revealed: true, revealStart: 0 }, true);
    this.prev.onclick = () => void this.step(-1);
    this.next.onclick = () => void this.step(1);
    onSwipe(byId("zoomStage"), { left: () => void this.step(1), right: () => void this.step(-1), down: () => closeOverlay("zoomOverlay") });
    addEventListener("resize", () => { if (this.isOpen) this.fit(); });
  }

  get isOpen(): boolean { return this.overlay.classList.contains("open"); }

  open(list: ZoomTarget[], index: number, from?: Element | null): void {
    this.list = list;
    this.i = index;
    this.show();
    openOverlay("zoomOverlay");
    this.overlay.scrollTop = 0;
    this.fit();
    if (from) void growFrom(this.box, from.getBoundingClientRect());
    void play(this.side, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 320, delay: 120, easing: "ease-out", fill: "backwards" });
  }

  /** Teclado do leitor. Retorna se tratou a tecla. */
  key(e: KeyboardEvent): boolean {
    if (e.key === "ArrowLeft") { void this.step(-1); return true; }
    if (e.key === "ArrowRight") { void this.step(1); return true; }
    return false;
  }

  private async step(d: 1 | -1): Promise<void> {
    if (this.list.length < 2 || this.moving) return;
    this.moving = true;
    const n = (this.i + d + this.list.length) % this.list.length;
    void play(this.side, [{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], { duration: 360, easing: "ease-in-out" });
    await slide(this.box, d, () => { this.i = n; this.show(); });
    this.moving = false;
  }

  private fit(): void {
    const dpr = devicePixelRatio || 1;
    const s = isDesktop()
      ? fitScale({ availW: innerWidth * 0.4, availH: innerHeight - 120, cols: 1, rows: 1, rowChrome: 0, gap: 0, min: 2, max: 4, dpr })
      : fitScale({ availW: innerWidth - 110, availH: innerHeight * 0.58, cols: 1, rows: 1, rowChrome: 0, gap: 0, min: 1.5, max: 3, dpr });
    this.box.style.setProperty("--zs", String(s));
  }

  private show(): void {
    const t = this.list[this.i]!;
    const view: CardView = { card: t.card, polarity: t.polarity, revealed: true, revealStart: 0 };
    this.animator.retarget(this.entry, view);
    this.box.style.setProperty("--acc", t.polarity === "escuridao" ? "#B03CD2" : ACCENT[t.card.cat]);

    const many = this.list.length > 1;
    this.prev.hidden = this.next.hidden = !many;
    byId("zoomCount").textContent = many ? `${this.i + 1} / ${this.list.length}` : "";

    const polRow = byId("polRow");
    polRow.replaceChildren();
    const info = byId("zoomInfo");
    const fill = () => {
      const title = el("h3", undefined, t.card.name);
      if (view.polarity && !t.allowPolarityToggle) title.append(el("span", `tagp${view.polarity === "escuridao" ? " esc" : ""}`, polarityLabel(view.polarity)));
      info.replaceChildren(title, el("div", "meta", metaLine(t.card)));
      if (t.pos) info.append(el("div", "zoom-pos", t.row ? `${t.row} · ${t.pos.label}` : t.pos.label));
      info.append(el("h4", undefined, "A lâmina"), el("p", undefined, t.card.desc));
      info.append(el("h4", undefined, t.card.special ? polarityLabel(view.polarity ?? "luz") : "Como ler"), el("p", "read", meaningOf(view)));
    };

    if (t.card.special && t.allowPolarityToggle) {
      for (const pol of ["luz", "escuridao"] as const) {
        const b = button(polarityLabel(pol), () => {
          view.polarity = t.polarity = pol;
          this.animator.invalidate(this.entry);
          this.box.style.setProperty("--acc", pol === "escuridao" ? "#B03CD2" : ACCENT[t.card.cat]);
          polRow.querySelectorAll(".pbtn").forEach(x => x.classList.toggle("active", x === b));
          fill();
        }, `pbtn${view.polarity === pol ? " active" : ""}`);
        polRow.append(b);
      }
    }
    fill();
  }
}

function placeholderCard(): Card {
  return { id: -1, name: "", group: "", cat: "major", desc: "", special: false, numeral: "0", read: "", groupTheme: null };
}
