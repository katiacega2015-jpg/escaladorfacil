import type { RowName, Spread } from "./types";

/** Tiragens só em números primos ≤ 7. Meio = Presente, Baixo = Passado, Cima = Futuro. */
export const SPREADS: readonly Spread[] = [
  {
    id: "g2", label: "2 · Causa ou Consequência", branch: true,
    desc: "Resposta binária para urgências. Depois de ver o Presente, o cartomante decide: investigar a Causa ou prever a Consequência.",
    meio: [{ label: "Situação Atual" }],
  },
  {
    id: "g3", label: "3 · Linha do Tempo", branch: false,
    desc: "Estrutura equilibrada e analítica: o agora, a raiz e a colheita.",
    meio: [{ label: "O status do agora" }], baixo: [{ label: "A raiz da questão" }], cima: [{ label: "A colheita que chega" }],
  },
  {
    id: "g5", label: "5 · Ponto de Pressão", branch: false,
    desc: "Cruz horizontal com foco analítico massivo no Presente.",
    meio: [{ label: "Situação aparente" }, { label: "Obstáculo oculto" }, { label: "Atitude mental" }],
    baixo: [{ label: "O gatilho original" }], cima: [{ label: "O veredito, se nada mudar" }],
  },
  {
    id: "g7", label: "7 · Teia do Destino", branch: false,
    desc: "A leitura máxima: um diamante 2-3-2 para cruzamento denso de dados.",
    meio: [{ label: "Corpo / Vida Material" }, { label: "Mente / Emoção" }, { label: "Alma / Essência" }],
    baixo: [{ label: "A Herança" }, { label: "O Fantasma" }], cima: [{ label: "A Luz" }, { label: "A Escuridão" }],
  },
];

export const ROW_TITLE: Record<RowName, string> = { meio: "Presente", baixo: "Passado", cima: "Futuro" };
/** Ordem visual na mesa (futuro em cima). A ordem de abertura é meio → baixo → cima. */
export const ROW_VISUAL_ORDER: readonly RowName[] = ["cima", "meio", "baixo"];
export const ROW_OPEN_ORDER: readonly RowName[] = ["meio", "baixo", "cima"];

export function cardCount(sp: Spread): number {
  return sp.branch ? 2 : sp.meio.length + sp.baixo.length + sp.cima.length;
}
