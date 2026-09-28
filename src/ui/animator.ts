import type { Card, Polarity } from "../domain/types";
import { BAYER, H, W, type Buf, type Frame } from "../engine/buf";
import { renderBack, renderFront } from "../engine/render";

/** O que um canvas está mostrando. Mutável: a UI troca `card`/`polarity`/`revealed` e o animador repinta. */
export interface CardView {
  card: Card;
  polarity: Polarity | null;
  revealed: boolean;
  /** `performance.now()` do momento da revelação; 0 = já revelada sem transição. */
  revealStart: number;
}

const FRAME_MS = 500;
const DISSOLVE_STEP_MS = 40;
const DISSOLVE_STEPS = 17;
/** Máximo de lâminas novas renderizadas por quadro de animação (evita travar a galeria). */
const RENDERS_PER_TICK = 2;

interface Entry { ctx: CanvasRenderingContext2D; canvas: HTMLCanvasElement; view: CardView; key: string; priority: boolean }

const toImage = (b: Buf) => new ImageData(new Uint8ClampedArray(b.d), W, H);

/** Transição de revelação: blocos 4×4 trocam do verso para a frente na ordem de Bayer. */
function dissolve(back: ImageData, front: ImageData, step: number): ImageData {
  const out = new ImageData(W, H), o = out.data, a = back.data, c = front.data;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const src = BAYER[(((y >> 2) & 3) << 2) | ((x >> 2) & 3)]! < step ? c : a, i = (y * W + x) * 4;
    o[i] = src[i]!; o[i + 1] = src[i + 1]!; o[i + 2] = src[i + 2]!; o[i + 3] = src[i + 3]!;
  }
  return out;
}

/** Pinta e anima todos os canvas de lâminas visíveis num único loop, com cache de quadros. */
export class Animator {
  private entries: Entry[] = [];
  private fronts = new Map<string, ImageData>();
  private backs: ImageData[] = [];
  private budget = 0;

  start(): void {
    const tick = (now: number) => { this.tick(now); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }

  /** Registra um canvas. `priority` = sempre renderiza na hora (mesa, zoom); senão respeita o orçamento (galeria). */
  mount(canvas: HTMLCanvasElement, view: CardView, priority = false): Entry {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D indisponível");
    const e: Entry = { ctx, canvas, view, key: "", priority };
    this.entries.push(e);
    this.entries.sort((a, b) => Number(b.priority) - Number(a.priority));
    return e;
  }

  /** Troca o que um canvas já registrado mostra (ex.: o zoom reaproveita o mesmo canvas). */
  retarget(e: Entry, view: CardView): void {
    e.view = view; e.key = "";
    if (!this.entries.includes(e)) this.mount(e.canvas, view, e.priority);
  }

  invalidate(e: Entry): void { e.key = ""; }

  private back(f: Frame): ImageData {
    return (this.backs[f] ??= toImage(renderBack(f)));
  }

  private front(card: Card, pol: Polarity | null, f: Frame, force: boolean): ImageData | null {
    const k = `${card.id}|${pol ?? ""}|${f}`;
    let img = this.fronts.get(k);
    if (!img) {
      if (!force && this.budget <= 0) return null;
      this.budget--;
      img = toImage(renderFront(card, pol, f));
      this.fronts.set(k, img);
    }
    return img;
  }

  private tick(now: number): void {
    this.budget = RENDERS_PER_TICK;
    this.entries = this.entries.filter(e => e.canvas.isConnected);
    for (const e of this.entries) this.paint(e, now);
  }

  private paint(e: Entry, now: number): void {
    if (!e.canvas.offsetParent) return;
    const v = e.view, f = (Math.floor(now / FRAME_MS) % 4) as Frame;
    let key: string, img: ImageData | null = null;
    if (!v.revealed) {
      key = `b${f}`;
      if (key !== e.key) img = this.back(f);
    } else {
      const t = v.revealStart ? now - v.revealStart : Infinity;
      if (t < DISSOLVE_STEPS * DISSOLVE_STEP_MS) {
        const step = Math.floor(t / DISSOLVE_STEP_MS);
        key = `d${step}|${f}|${v.polarity}`;
        if (key !== e.key) img = dissolve(this.back(f), this.front(v.card, v.polarity, f, true)!, step);
      } else {
        key = `f${f}|${v.polarity}|${v.card.id}`;
        if (key !== e.key) img = this.front(v.card, v.polarity, f, e.priority);
      }
    }
    if (img) { e.ctx.putImageData(img, 0, 0); e.key = key; }
  }
}

export type AnimatorEntry = ReturnType<Animator["mount"]>;

export function cardCanvas(className = "cv"): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = W; c.height = H; c.className = className;
  return c;
}
