import { cardCount, ROW_OPEN_ORDER } from "./spreads";
import type { BranchChoice, Card, Drawn, Polarity, Position, RowName, Spread } from "./types";

export type Rng = () => number;

export function shuffle<T>(items: readonly T[], rand: Rng = Math.random): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function makeDrawn(card: Card, pos: Position, rand: Rng): Drawn {
  const polarity: Polarity | null = card.special ? (rand() < 0.5 ? "luz" : "escuridao") : null;
  return { pos, card, polarity, revealed: false, revealStart: 0 };
}

/**
 * Uma leitura: um único corte do baralho sela todas as cartas da sessão.
 * Regras: fileiras abrem na ordem meio → baixo → cima; no Grau 2 a segunda carta
 * só é posta na mesa depois que o cartomante escolhe Causa (baixo) ou Consequência (cima).
 */
export class Reading {
  readonly rows: Record<RowName, Drawn[]> = { meio: [], baixo: [], cima: [] };
  private pendingSecond: Card | null = null;
  private choice: BranchChoice | null = null;

  constructor(readonly spread: Spread, deck: readonly Card[], private readonly rand: Rng = Math.random) {
    const cards = shuffle(deck, rand).slice(0, cardCount(spread));
    let i = 0;
    const take = (): Card => cards[i++]!;
    spread.meio.forEach(p => this.rows.meio.push(makeDrawn(take(), p, rand)));
    if (spread.branch) {
      this.pendingSecond = take();
    } else {
      spread.baixo.forEach(p => this.rows.baixo.push(makeDrawn(take(), p, rand)));
      spread.cima.forEach(p => this.rows.cima.push(makeDrawn(take(), p, rand)));
    }
  }

  get choiceMade(): BranchChoice | null { return this.choice; }

  rowRevealed(row: RowName): boolean {
    const r = this.rows[row];
    return r.length > 0 && r.every(d => d.revealed);
  }

  isUnlocked(row: RowName): boolean {
    if (row === "meio") return true;
    if (this.spread.branch) return row === "baixo" ? this.choice === "causa" : this.choice === "consequencia";
    if (row === "baixo") return this.rowRevealed("meio");
    return this.rowRevealed("meio") && this.rowRevealed("baixo");
  }

  /** True quando o Grau 2 espera a decisão Causa/Consequência. */
  get awaitingChoice(): boolean {
    return this.spread.branch && this.pendingSecond !== null && this.rowRevealed("meio");
  }

  choose(kind: BranchChoice): void {
    if (!this.awaitingChoice || !this.pendingSecond) return;
    const row: RowName = kind === "causa" ? "baixo" : "cima";
    const label = kind === "causa" ? "A Causa" : "A Consequência";
    this.choice = kind;
    this.rows[row].push(makeDrawn(this.pendingSecond, { label }, this.rand));
    this.pendingSecond = null;
  }

  /** Revela uma carta se a fileira dela já estiver liberada. Retorna se algo mudou. */
  reveal(d: Drawn, now: number): boolean {
    const row = ROW_OPEN_ORDER.find(r => this.rows[r].includes(d));
    if (!row || d.revealed || !this.isUnlocked(row)) return false;
    d.revealed = true;
    d.revealStart = now;
    return true;
  }

  get complete(): boolean {
    return this.pendingSecond === null && ROW_OPEN_ORDER.every(r => this.rows[r].every(d => d.revealed));
  }

  get anyRevealed(): boolean {
    return ROW_OPEN_ORDER.some(r => this.rows[r].some(d => d.revealed));
  }

  /** Próxima instrução para o consulente, ou null quando não há o que orientar. */
  hint(): string | null {
    if (!this.rowRevealed("meio")) {
      return this.anyRevealed ? "Abra as demais cartas do Presente antes de seguir." : "Toque nas lâminas do Presente para revelá-las.";
    }
    if (this.awaitingChoice) return null;
    if (this.rows.baixo.length && !this.rowRevealed("baixo")) return "Agora abra a fileira do Passado.";
    if (this.rows.cima.length && !this.rowRevealed("cima")) return "Por fim, abra a fileira do Futuro.";
    return null;
  }
}

export function meaningOf(d: Pick<Drawn, "card" | "polarity">): string {
  const c = d.card;
  if (c.special) return d.polarity === "escuridao" ? c.dark : c.light;
  return c.read;
}

export const polarityLabel = (p: Polarity): string => (p === "escuridao" ? "Escuridão" : "Luz");
