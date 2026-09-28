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

export const openOverlay = (id: string) => byId(id).classList.add("open");
export const closeOverlay = (id: string) => byId(id).classList.remove("open");

/** Fecha overlays pelo botão [data-close] ou tocando fora da folha. */
export function wireOverlays(): void {
  document.querySelectorAll<HTMLElement>("[data-close]").forEach(b => { b.onclick = () => closeOverlay(b.dataset.close!); });
  document.querySelectorAll<HTMLElement>(".overlay").forEach(o => { o.onclick = e => { if (e.target === o) o.classList.remove("open"); }; });
}
