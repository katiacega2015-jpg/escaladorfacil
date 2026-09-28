import { reducedMotion } from "./layout";

/** Cria um elemento com classe e texto (texto sempre via textContent, nunca HTML). */
export function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}

export function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  const e = document.getElementById(id);
  if (!e) throw new Error(`Elemento #${id} não encontrado`);
  return e as T;
}

export function button(label: string, onClick: () => void, className = "pbtn"): HTMLButtonElement {
  const b = el("button", className, label);
  b.type = "button";
  b.onclick = onClick;
  return b;
}

const closers = new Map<string, () => void>();
/** Overlays abertos, do fundo para o topo. O último é o único interativo. */
const stack: string[] = [];
const timers = new Map<string, ReturnType<typeof setTimeout>>();
const returnFocus = new Map<string, HTMLElement | null>();
const FOCUSABLE = "button:not([disabled]):not([hidden]), [href], canvas[tabindex], [tabindex]:not([tabindex='-1'])";

/** Registra um callback chamado quando o overlay fecha (por botão, toque fora ou Esc). */
export const onOverlayClose = (id: string, fn: () => void) => closers.set(id, fn);

/** Empilha os overlays (z-index crescente) e deixa inerte tudo que está por baixo do topo. */
function restack(): void {
  stack.forEach((sid, k) => {
    const o = byId(sid);
    o.style.zIndex = String(20 + k);
    o.inert = k !== stack.length - 1;
  });
  byId("app").inert = stack.length > 0;
  document.body.classList.toggle("locked", stack.length > 0);
}

export function openOverlay(id: string): void {
  const o = byId(id);
  const pending = timers.get(id);
  if (pending) { clearTimeout(pending); timers.delete(id); }
  if (!o.classList.contains("open")) returnFocus.set(id, document.activeElement as HTMLElement | null);
  o.classList.remove("closing");
  o.classList.add("open");
  o.setAttribute("aria-hidden", "false");
  const i = stack.indexOf(id);
  if (i >= 0) stack.splice(i, 1);
  stack.push(id);
  restack();
  requestAnimationFrame(() => o.querySelector<HTMLElement>("[data-close]")?.focus({ preventScroll: true }));
}

/** Fecha com fade; o `display:none` só entra depois da animação. Reabrir durante o fade cancela o fechamento. */
export function closeOverlay(id: string): void {
  const o = byId(id);
  if (!o.classList.contains("open") || o.classList.contains("closing")) return;
  o.classList.add("closing");
  o.setAttribute("aria-hidden", "true");
  const i = stack.indexOf(id);
  if (i >= 0) stack.splice(i, 1);
  restack();
  o.inert = true;
  const done = () => {
    timers.delete(id);
    o.classList.remove("open", "closing");
    o.style.zIndex = "";
    closers.get(id)?.();
    const back = returnFocus.get(id);
    returnFocus.delete(id);
    if (back?.isConnected && !back.closest("[inert]")) back.focus({ preventScroll: true });
  };
  if (reducedMotion()) done();
  else timers.set(id, setTimeout(done, 170));
}

/** O overlay aberto mais recente (topo da pilha), se houver. */
export function topOverlay(): HTMLElement | null {
  const id = stack[stack.length - 1];
  return id ? byId(id) : null;
}

/** Mantém o Tab dentro do overlay do topo. Retorna se tratou a tecla. */
export function trapFocus(e: KeyboardEvent): boolean {
  const top = topOverlay();
  if (!top || e.key !== "Tab") return false;
  const items = [...top.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(el => el.offsetParent !== null);
  if (!items.length) return false;
  const first = items[0]!, last = items[items.length - 1]!, active = document.activeElement;
  if (e.shiftKey && (active === first || !top.contains(active))) { last.focus(); e.preventDefault(); return true; }
  if (!e.shiftKey && (active === last || !top.contains(active))) { first.focus(); e.preventDefault(); return true; }
  return false;
}

/** Fecha overlays pelo botão [data-close] ou tocando fora da folha. */
export function wireOverlays(): void {
  document.querySelectorAll<HTMLElement>("[data-close]").forEach(b => { b.onclick = () => closeOverlay(b.dataset.close!); });
  document.querySelectorAll<HTMLElement>(".overlay").forEach(o => {
    o.setAttribute("aria-hidden", "true");
    o.onclick = e => { if (e.target === o) closeOverlay(o.id); };
  });
}
