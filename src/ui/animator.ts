import type { Card, Polarity } from "../domain/types";
import { BAYER, H, W, type Buf, type Frame } from "../engine/buf";
import { reducedMotion } from "./layout";
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
/** Duração da virada 3D (CSS/WAAPI). O canvas troca verso → frente na metade, quando a lâmina está de perfil. */
export const FLIP_MS = 620;
/** Depois de pousar: clarão pontilhado + faixa de brilho diagonal. */
const SHINE_MS = 560;
const SHINE_STEP_MS = 40;
/** Máximo de lâminas novas renderizadas por quadro de animação (evita travar a galeria). */
const RENDERS_PER_TICK = 2;

interface Entry { ctx: CanvasRenderingContext2D; canvas: HTMLCanvasElement; view: CardView; key: string; priority: boolean }

const toImage = (b: Buf) => new ImageData(new Uint8ClampedArray(b.d), W, H);

/**
 * Pouso da revelação: a frente nasce de um clarão que se desfaz em pontilhado Bayer (blocos 2×2)
 * e uma faixa de luz atravessa a lâmina na diagonal. `k` vai de 0 a 1.
 */
function shine(front: ImageData, k: number, flash: readonly [number, number, number]): ImageData {
  const out = new ImageData(new Uint8ClampedArray(front.data), W, H), o = out.data;
  const fl = Math.max(0, 1 - k * 2.4) * 16;
  const c = -12 + k * (W + H * 0.55 + 24);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    if (BAYER[(((y >> 1) & 3) << 2) | ((x >> 1) & 3)]! < fl) { o[i] = flash[0]; o[i + 1] = flash[1]; o[i + 2] = flash[2]; continue; }
    const d = Math.abs(x + (H - y) * 0.55 - c);
    const a = d < 1.5 ? 0.75 : d < 4 ? 0.4 : d < 6 && ((x + y) & 1) ? 0.2 : 0;
    if (a) { o[i] = o[i]! + (255 - o[i]!) * a; o[i + 1] = o[i + 1]! + (255 - o[i + 1]!) * a; o[i + 2] = o[i + 2]! + (240 - o[i + 2]!) * a; }
  }
  return out;
}

const FLASH_LIGHT = [255, 246, 214] as const;
const FLASH_DARK = [176, 60, 210] as const;

/** Pinta e anima todos os canvas de lâminas visíveis num único loop, com cache de quadros. */
export class Animator {
  private entries: Entry[] = [];
  private fronts = new Map<string, ImageData>();
  private backs: ImageData[] = [];
  private budget = 0;
  /** Com "reduzir movimento" a lâmina não gira: só o clarão. */
  readonly flipMs = reducedMotion() ? 0 : FLIP_MS;

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
      const t = v.revealStart ? now - v.revealStart : Infinity, half = this.flipMs / 2;
      if (t < half) {
        key = `b${f}`;
        if (key !== e.key) img = this.back(f);
      } else if (t < half + SHINE_MS) {
        const step = Math.floor((t - half) / SHINE_STEP_MS);
        key = `s${step}|${f}|${v.polarity}|${v.card.id}`;
        if (key !== e.key) img = shine(this.front(v.card, v.polarity, f, true)!, step * SHINE_STEP_MS / SHINE_MS, v.polarity === "escuridao" ? FLASH_DARK : FLASH_LIGHT);
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

/** Lâmina com camadas para animação: `root` recebe distribuição/virada, `tilt` a inclinação do mouse. */
export interface CardEl { root: HTMLDivElement; tilt: HTMLDivElement; cv: HTMLCanvasElement }

export function cardElement(extra = ""): CardEl {
  const root = document.createElement("div");
  root.className = `card3d${extra ? ` ${extra}` : ""}`;
  const tilt = document.createElement("div");
  tilt.className = "tilt";
  const cv = cardCanvas();
  const glare = document.createElement("div");
  glare.className = "glare";
  tilt.append(cv, glare);
  root.append(tilt);
  return { root, tilt, cv };
}
