export type Category = "major" | "agua" | "fogo" | "terra" | "ar" | "special";
export type ElementKey = Exclude<Category, "major" | "special">;
export type Polarity = "luz" | "escuridao";
export type RowName = "meio" | "baixo" | "cima";
export type BranchChoice = "causa" | "consequencia";

interface CardBase {
  id: number;
  name: string;
  group: string;
  cat: Category;
  desc: string;
}

export interface RegularCard extends CardBase {
  special: false;
  numeral: string;
  read: string;
  groupTheme: string | null;
}

export interface SpecialCard extends CardBase {
  special: true;
  numeral: null;
  groupTheme: null;
  light: string;
  dark: string;
}

export type Card = RegularCard | SpecialCard;

export interface Position {
  label: string;
}

export interface FixedSpread {
  id: string;
  label: string;
  desc: string;
  branch: false;
  meio: Position[];
  baixo: Position[];
  cima: Position[];
}

export interface BranchSpread {
  id: string;
  label: string;
  desc: string;
  branch: true;
  meio: Position[];
}

export type Spread = FixedSpread | BranchSpread;

export interface Drawn {
  pos: Position;
  card: Card;
  polarity: Polarity | null;
  revealed: boolean;
  revealStart: number;
}
