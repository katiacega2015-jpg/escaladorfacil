import { hasFinePointer, reducedMotion } from "./layout";

const EASE_OUT = "cubic-bezier(.2,.8,.2,1)";
const EASE_BACK = "cubic-bezier(.2,.9,.3,1.25)";

/** WAAPI com fallback: sem suporte ou com "reduzir movimento" termina na hora. */
export function play(el: Element, frames: Keyframe[], opts: KeyframeAnimationOptions): Promise<void> {
  if (reducedMotion() || typeof el.animate !== "function") return Promise.resolve();
  const a = el.animate(frames, opts);
  return a.finished.then(() => undefined, () => undefined);
}

const center = (r: DOMRect) => [r.left + r.width / 2, r.top + r.height / 2] as const;

/** Distribui as lâminas saindo do monte (`from`), uma a uma, com leve giro. */
export function dealIn(els: readonly HTMLElement[], from: DOMRect, stagger = 110): Promise<void> {
  const [fx, fy] = center(from);
  return Promise.all(els.map((el, i) => {
    const [x, y] = center(el.getBoundingClientRect());
    const rot = (i % 2 ? 1 : -1) * (6 + (i * 7) % 9);
    return play(el, [
      { transform: `translate(${fx - x}px, ${fy - y}px) rotate(${rot}deg) scale(.55)`, opacity: 0, offset: 0 },
      { opacity: 1, offset: 0.2 },
      { transform: "translate(0,0) rotate(0) scale(1)", opacity: 1 },
    ], { duration: 560, delay: i * stagger, easing: EASE_BACK, fill: "backwards" });
  })).then(() => undefined);
}

/** Recolhe as lâminas de volta ao monte antes de um novo corte. */
export function gather(els: readonly HTMLElement[], to: DOMRect): Promise<void> {
  const [tx, ty] = center(to);
  return Promise.all(els.map((el, i) => {
    const [x, y] = center(el.getBoundingClientRect());
    return play(el, [
      { transform: "none", opacity: 1 },
      { transform: `translate(${tx - x}px, ${ty - y}px) rotate(${i % 2 ? 8 : -8}deg) scale(.5)`, opacity: 0 },
    ], { duration: 300, delay: i * 30, easing: "cubic-bezier(.5,0,.8,.4)", fill: "forwards" });
  })).then(() => undefined);
}

/** Virada 3D: sobe, gira até ficar de perfil (o canvas troca de face aqui) e pousa do outro lado. */
export function flip(el: HTMLElement, ms: number): Promise<void> {
  return play(el, [
    { transform: "perspective(900px) translateY(0) rotateY(0) scale(1)", filter: "drop-shadow(3px 3px 0 #000)" },
    { transform: "perspective(900px) translateY(-14px) rotateY(90deg) scale(1.14)", filter: "drop-shadow(10px 16px 6px rgba(0,0,0,.55))", offset: 0.5 },
    { transform: "perspective(900px) translateY(-14px) rotateY(-90deg) scale(1.14)", filter: "drop-shadow(10px 16px 6px rgba(0,0,0,.55))", offset: 0.5001 },
    { transform: "perspective(900px) translateY(-4px) rotateY(8deg) scale(1.04)", filter: "drop-shadow(5px 8px 3px rgba(0,0,0,.5))", offset: 0.82 },
    { transform: "perspective(900px) translateY(0) rotateY(0) scale(1)", filter: "drop-shadow(3px 3px 0 #000)" },
  ], { duration: ms, easing: "ease-in-out" });
}

/** Anel de luz que se expande quando a lâmina pousa. */
export function burst(host: HTMLElement, color: string): void {
  if (reducedMotion()) return;
  const b = document.createElement("div");
  b.className = "burst";
  b.style.setProperty("--burst", color);
  host.append(b);
  b.addEventListener("animationend", () => b.remove(), { once: true });
}

/** Recusa: a lâmina trancada treme. */
export const nudge = (el: HTMLElement) => play(el, [
  { transform: "translateX(0)" }, { transform: "translateX(-5px) rotate(-2deg)" }, { transform: "translateX(4px) rotate(1.5deg)" },
  { transform: "translateX(-2px)" }, { transform: "translateX(0)" },
], { duration: 320, easing: "ease-out" });

/** Técnica FLIP: o elemento nasce no retângulo de origem e voa até sua posição atual. */
export function growFrom(el: HTMLElement, from: DOMRect): Promise<void> {
  const to = el.getBoundingClientRect();
  if (!to.width) return Promise.resolve();
  const [fx, fy] = center(from), [tx, ty] = center(to);
  return play(el, [
    { transform: `translate(${fx - tx}px, ${fy - ty}px) scale(${from.width / to.width})` },
    { transform: "none" },
  ], { duration: 380, easing: EASE_OUT });
}

/** Troca de página no leitor: sai por um lado, entra pelo outro. */
export async function slide(el: HTMLElement, dir: 1 | -1, swap: () => void): Promise<void> {
  await play(el, [{ transform: "none", opacity: 1 }, { transform: `translateX(${-dir * 40}px) rotateY(${dir * 25}deg)`, opacity: 0 }], { duration: 140, easing: "ease-in" });
  swap();
  await play(el, [{ transform: `translateX(${dir * 40}px) rotateY(${-dir * 25}deg)`, opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 220, easing: EASE_OUT });
}

/** Inclinação 3D + reflexo que segue o mouse (só em ponteiro fino). */
export function attachTilt(el: HTMLElement): void {
  if (!hasFinePointer() || reducedMotion()) return;
  el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - py) * 16}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * 18}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.classList.add("hover");
  });
  el.addEventListener("pointerleave", () => {
    el.classList.remove("hover");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  });
}

/** Gesto de arrastar: esquerda/direita e para baixo (mobile). */
export function onSwipe(el: HTMLElement, h: { left?: () => void; right?: () => void; down?: () => void }): void {
  let sx = 0, sy = 0, active = false;
  el.addEventListener("pointerdown", e => { if (e.pointerType === "mouse") return; sx = e.clientX; sy = e.clientY; active = true; });
  el.addEventListener("pointercancel", () => { active = false; });
  el.addEventListener("pointerup", e => {
    if (!active) return;
    active = false;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) (dx < 0 ? h.left : h.right)?.();
    else if (dy > 90 && dy > Math.abs(dx) * 1.3) h.down?.();
  });
}
