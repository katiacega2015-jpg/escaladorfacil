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

/** Registra um callback chamado quando o overlay fecha (por botão, toque fora ou Esc). */
export const onOverlayClose = (id: string, fn: () => void) => closers.set(id, fn);

export function openOverlay(id: string): void {
  const o = byId(id);
  o.classList.remove("closing");
  o.classList.add("open");
  document.body.classList.add("locked");
}

/** Fecha com fade; o `display:none` só entra depois da animação. */
export function closeOverlay(id: string): void {
  const o = byId(id);
  if (!o.classList.contains("open") || o.classList.contains("closing")) return;
  o.classList.add("closing");
  const done = () => {
    o.classList.remove("open", "closing");
    if (!document.querySelector(".overlay.open")) document.body.classList.remove("locked");
    closers.get(id)?.();
  };
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) done();
  else setTimeout(done, 170);
}

/** O overlay aberto mais recente, se houver. */
export function topOverlay(): HTMLElement | null {
  const open = document.querySelectorAll<HTMLElement>(".overlay.open:not(.closing)");
  return open[open.length - 1] ?? null;
}

/** Fecha overlays pelo botão [data-close] ou tocando fora da folha. */
export function wireOverlays(): void {
  document.querySelectorAll<HTMLElement>("[data-close]").forEach(b => { b.onclick = () => closeOverlay(b.dataset.close!); });
  document.querySelectorAll<HTMLElement>(".overlay").forEach(o => { o.onclick = e => { if (e.target === o) closeOverlay(o.id); }; });
}
