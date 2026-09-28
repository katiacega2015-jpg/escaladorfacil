import "./styles.css";
import { SPREADS } from "./domain/spreads";
import { Animator } from "./ui/animator";
import type { KeyValueStore } from "./domain/history";
import { byId, closeOverlay, topOverlay, trapFocus, wireOverlays } from "./ui/dom";
import { GalleryView } from "./ui/gallery";
import { openHistory } from "./ui/history-view";
import { TableView } from "./ui/table";
import { applyPrefs, loadPrefs } from "./ui/settings";
import { SettingsView } from "./ui/settings-view";
import { ZoomView } from "./ui/zoom";

/** localStorage pode não existir ou lançar erro (modo privado, WebView restrita): cai para memória. */
function safeStore(): KeyValueStore {
  try {
    const ls = window.localStorage, probe = "__oraculo__";
    ls.setItem(probe, "1"); ls.removeItem(probe);
    return ls;
  } catch {
    const mem = new Map<string, string>();
    return { getItem: k => mem.get(k) ?? null, setItem: (k, v) => void mem.set(k, v) };
  }
}

const store = safeStore();
const prefs = loadPrefs(store);
applyPrefs(document.documentElement, prefs);

const animator = new Animator();
const zoom = new ZoomView(animator);
const gallery = new GalleryView(animator, zoom);
const table = new TableView(animator, zoom, store);
// Mudar o tamanho do texto altera a altura dos rótulos: recalcula a escala das lâminas.
const settings = new SettingsView(prefs, store, () => dispatchEvent(new Event("resize")));

wireOverlays();
byId("galleryBtn").onclick = () => gallery.open();
byId("historyBtn").onclick = () => openHistory(store);
byId("settingsBtn").onclick = () => settings.open();

/** Atalhos de teclado (PC). Com um overlay aberto, só Esc e as setas do leitor. */
addEventListener("keydown", e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (trapFocus(e)) return;
  const open = topOverlay();
  if (open) {
    if (e.key === "Escape") closeOverlay(open.id);
    else if (open.id === "zoomOverlay" && zoom.key(e)) e.preventDefault();
    return;
  }
  if ((e.target as HTMLElement).closest("button")) return;
  const k = e.key.toLowerCase();
  const spread = SPREADS[Number(k) - 1];
  if (spread) void table.deal(spread);
  else if (k === " " || k === "enter") { e.preventDefault(); table.revealNext(); }
  else if (k === "n") void table.deal(table.spread);
  else if (k === "l") table.openReader(0);
  else if (k === "g") gallery.open();
  else if (k === "h") openHistory(store);
  else if (k === "a") settings.open();
});

animator.start();
void table.deal(SPREADS[1]!);
