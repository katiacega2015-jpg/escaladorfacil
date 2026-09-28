import { loadHistory, type KeyValueStore } from "../domain/history";
import { byId, el, openOverlay } from "./dom";

export function openHistory(store: KeyValueStore): void {
  const list = loadHistory(store);
  const root = byId("historyList");
  root.replaceChildren();
  if (!list.length) root.append(el("div", "empty-history", "Nenhuma leitura salva ainda."));
  for (const item of list) {
    const d = new Date(item.date);
    const when = `${d.toLocaleDateString("pt-BR")} ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
    const row = el("div", "history-item");
    row.append(el("div", "h-date", `${when} · ${item.spread}`), el("div", "h-cards", item.cards.join(" · ")));
    root.append(row);
  }
  openOverlay("historyOverlay");
}
