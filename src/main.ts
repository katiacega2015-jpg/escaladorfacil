import "./styles.css";
import { SPREADS } from "./domain/spreads";
import { Animator } from "./ui/animator";
import { byId, closeOverlay, topOverlay, wireOverlays } from "./ui/dom";
import { GalleryView } from "./ui/gallery";
import { openHistory } from "./ui/history-view";
import { TableView } from "./ui/table";
import { ZoomView } from "./ui/zoom";

const animator = new Animator();
const zoom = new ZoomView(animator);
const gallery = new GalleryView(animator, zoom);
const table = new TableView(animator, zoom, localStorage);

wireOverlays();
byId("galleryBtn").onclick = () => gallery.open();
byId("historyBtn").onclick = () => openHistory(localStorage);

/** Atalhos de teclado (PC). Com um overlay aberto, só Esc e as setas do leitor. */
addEventListener("keydown", e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
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
  else if (k === "h") openHistory(localStorage);
});

animator.start();
void table.deal(SPREADS[1]!);
