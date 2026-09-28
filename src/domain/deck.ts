import type { Card, ElementKey, RegularCard, SpecialCard } from "./types";

export function toRoman(n: number): string {
  if (n === 0) return "0";
  const map: [number, string][] = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let out = "";
  for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
  return out;
}

type Entry = [name: string, desc: string, read: string];

const MAJOR: Entry[] = [
  ["O Errante", "O salto de fé rumo ao desconhecido, sem bagagens ou medos. A liberdade absoluta de quem confia na própria jornada.", "Indica um momento de arriscar, iniciar algo totalmente novo e abandonar a necessidade de controle. Pede espontaneidade e coragem para ser autêntico."],
  ["O Alquimista", "O poder da manifestação. Aquele que domina os elementos ao seu redor e transforma ideias intangíveis em realidade material.", "Mostra que você possui todos os recursos, contatos e habilidades necessárias para resolver o problema. Aja com foco e determinação."],
  ["O Oráculo", "A intuição pura e os mistérios ocultos. A voz silenciosa do subconsciente que guarda sabedorias ancestrais.", "O momento não exige ação física, mas escuta interior. Segredos podem ser revelados. Confie em seus pressentimentos e preste atenção aos sonhos."],
  ["A Matriz", "A fonte criadora, a fertilidade e a abundância. A energia acolhedora que nutre e dá vida a tudo que toca.", "Sinaliza crescimento, prosperidade, gravidez (física ou de projetos) e uma fase de grande força criativa. Conecte-se com a natureza e com o prazer de viver."],
  ["O Arquiteto", "A autoridade que traz ordem ao caos. A força estrutural que estabelece limites, regras e fundações duradouras.", "Pede organização, disciplina e liderança. É hora de agir com razão, assumir o controle da situação e não ceder a chantagens emocionais."],
  ["O Mentor", "A tradição, a ética e a ponte entre o humano e o divino. O conhecimento estruturado passado através de gerações.", "Busque aconselhamento com alguém mais experiente ou siga os métodos tradicionais. Indica também instituições, cursos acadêmicos e compromissos formais."],
  ["O Pacto", "O alinhamento profundo de valores. As encruzilhadas da vida que exigem escolhas morais e uniões verdadeiras.", "Um momento de decisão importante que deve ser feita com o coração, não apenas com a lógica. Pode indicar grandes parcerias, sociedades ou o encontro de um amor genuíno."],
  ["O Conquistador", "O domínio sobre os próprios instintos conflitantes para avançar com determinação em uma única direção.", "Movimento rápido, viagens ou a superação de obstáculos através da pura força de vontade e foco implacável. Você está no controle e a vitória é certa se não desviar a rota."],
  ["O Domínio", "A coragem compassiva. A capacidade de domar as \"feras\" interiores e exteriores não com brutalidade, mas com amor e firmeza.", "Pede paciência, resiliência e persuasão. Enfrente seus medos ou uma pessoa difícil usando a doçura e a diplomacia, controlando seus impulsos nervosos."],
  ["O Buscador", "A jornada solitária para dentro. O uso da própria luz como farol para encontrar respostas longe do barulho do mundo.", "Necessidade vital de isolamento, reflexão e autopreservação. Não tome decisões apressadas; afaste-se temporariamente para enxergar o quadro geral."],
  ["O Ciclo", "A roda inescapável do destino. A impermanência da vida, onde altos e baixos se alternam continuamente.", "Mudanças inesperadas (frequentemente positivas, de \"sorte\") estão a caminho. Aceite que algumas coisas estão fora do seu controle e adapte-se ao movimento do universo."],
  ["A Balança", "A verdade nua e crua que corta ilusões. A lei universal de causa e efeito, onde cada ação encontra sua justa reação.", "Assuntos legais, assinaturas de contratos e necessidade de imparcialidade. Você colherá exatamente o que plantou. Seja ético e exija justiça."],
  ["A Suspensão", "O sacrifício voluntário e a iluminação alcançada ao olhar o mundo por um ângulo invertido e desconfortável.", "Situações estagnadas. Pare de forçar as coisas a acontecerem. Aceite a pausa obrigatória, mude sua perspectiva e faça concessões para destravar a energia."],
  ["A Passagem", "A transformação profunda e a transição inescapável. A morte de velhas formas para adubar o terreno do novo.", "Finais definitivos e cortes radicais (um emprego, um relacionamento, um hábito). Aceite o luto e o desapego, pois esta limpeza é essencial para sua renovação."],
  ["A Síntese", "O equilíbrio alquímico. A mistura harmoniosa de opostos e a paciência para deixar o tempo agir como agente curador.", "Pede moderação, meio-termo e calma. Não vá a extremos. Bom presságio para a saúde, harmonização de conflitos e reconciliações."],
  ["As Correntes", "O reino das sombras, dos desejos densos, da sexualidade, dos vícios e das ilusões de aprisionamento.", "Alerta para relações tóxicas, obsessões, ambição desmedida ou dependências emocionais/financeiras. Lembre-se: as correntes estão soltas, você só está preso pelo próprio medo ou comodismo."],
  ["O Colapso", "O raio que destrói as fundações falsas. A crise inevitável que liberta a verdade aprisionada pelo orgulho.", "Ruptura repentina de estruturas que já não serviam (divórcios repentinos, demissões, quebra de paradigmas). O choque é doloroso, mas traz libertação total."],
  ["A Aurora", "A luz da esperança brilhando após a tempestade. A renovação da fé, a inspiração celestial e a pura cura espiritual.", "Um momento de grande proteção cósmica, alívio e otimismo. Deixe sua luz brilhar, invista em seus talentos e acredite no futuro. O pior já passou."],
  ["O Labirinto", "As águas profundas do inconsciente. O reino dos medos, das projeções, das paranoias e das emoções flutuantes.", "Cuidado com ilusões, fofocas, traições ou autoenganos. As coisas não são o que parecem. Enfrente suas inseguranças e não deixe a ansiedade guiar seus passos."],
  ["O Zênite", "O triunfo absoluto da luz. A clareza, a vitalidade inesgotável, a alegria de viver e o sucesso radiante.", "Excelente presságio. Confirmação de vitória, resolução de todos os problemas, saúde plena, energia infantil e sucesso público. Diga \"sim\" para a vida."],
  ["O Chamado", "O soar da trombeta para uma nova consciência. O momento de autoavaliação final, o despertar e a absolvição.", "Uma vocação se apresenta. Perdoe os erros do passado (seus e dos outros) e abrace uma nova chance. Retorno de pessoas ou situações para um encerramento definitivo."],
  ["O Cosmos", "A totalidade, a integração do microcosmo com o macrocosmo e a conclusão gloriosa da longa jornada da alma.", "O ápice da realização. Projetos concluídos com sucesso, viagens internacionais, expansão de limites e a sensação de estar exatamente onde deveria estar."],
];

interface ElementDef { key: ElementKey; name: string; theme: string; graus: Entry[] }

const ELEMENTS: ElementDef[] = [
  { key: "agua", name: "Água", theme: "Emoção, Relacionamentos, Intuição", graus: [
    ["O Vínculo", "O nascimento do afeto e da atração.", "Indica o início de um romance, uma nova amizade ou uma reconciliação promissora. Abra-se para a troca emocional."],
    ["O Oásis", "O equilíbrio entre a festa e o retiro.", "Comemore as pequenas vitórias com quem você ama, mas saiba quando se afastar para recarregar as energias emocionais."],
    ["A Saudade", "O bálsamo das memórias curando a dor da perda.", "Resgate a pureza do passado para curar tristezas presentes. O retorno de alguém antigo, ou a necessidade de perdoar uma decepção emocional."],
    ["A Miragem", "A intuição rompendo as ilusões reconfortantes.", "Abandone um sonho que não tem base na realidade. Hora de deixar para trás uma relação ou ambiente que não preenche mais a sua alma."],
    ["A Plenitude", "O ápice da harmonia familiar e emocional.", "Alegria duradoura, paz no lar e desejos profundos do coração sendo atendidos. Você chegou a um estado de contentamento absoluto."],
    ["O Sonhador", "O impulso romântico, sensível e idealista.", "Uma pessoa amorosa e poética (ou essa energia em você). Siga a sua intuição, faça uma declaração, ou dedique-se a uma expressão artística."],
    ["O Guardião das Marés", "A maestria emocional, o conselheiro profundo.", "Exerça a empatia e o acolhimento sem se perder nas emoções dos outros. Indica maturidade nos relacionamentos e capacidade de curar as próprias feridas."],
  ] },
  { key: "fogo", name: "Fogo", theme: "Ação, Criatividade, Vontade", graus: [
    ["A Centelha", "A ideia inicial, o planejamento e o ímpeto de mudar.", "É o momento de dar o primeiro passo e sair da zona de conforto. Você tem o plano; agora precisa ter a ousadia de executá-lo."],
    ["A Fogueira", "A primeira expansão, o calor do apoio mútuo.", "Indica boas parcerias, consolidação de um projeto e a chegada de bons resultados. Você está em um ambiente que incentiva e celebra o seu crescimento."],
    ["A Forja", "O atrito das competições lapidando o metal da vontade.", "Haverá conflitos, oposição ou disputas de ego. Mantenha-se confiante; os desafios trarão reconhecimento público e vitória se você não recuar."],
    ["O Ímpeto", "A energia acelerada e a defesa inabalável do próprio espaço.", "As coisas acontecerão muito rápido. Comunique-se com clareza, defenda suas posições e aproveite o momento para resolver pendências com velocidade."],
    ["A Brasa", "A resistência sob pressão extrema, carregando fardos.", "Você está sobrecarregado, mas muito perto da linha de chegada. Aguente firme, mas delegue responsabilidades assim que o ciclo terminar."],
    ["O Desbravador", "O pioneiro enérgico, impaciente e passional.", "Aja com coragem, entusiasmo e espírito de aventura. Uma viagem inesperada, uma mudança de rota ou uma atitude ousada trará excelentes resultados."],
    ["O Soberano da Chama", "A liderança magnética, o poder de inspiração.", "Assuma o comando. Use o seu carisma e a sua autoconfiança para mobilizar pessoas. Seja a figura de autoridade visionária e generosa da situação."],
  ] },
  { key: "terra", name: "Terra", theme: "Matéria, Segurança, Concretização", graus: [
    ["A Semente", "O surgimento do recurso material aliado ao malabarismo diário.", "Uma nova oportunidade de ganhos está disponível, mas exigirá adaptação, jogo de cintura e flexibilidade na gestão do tempo ou dinheiro."],
    ["O Alicerce", "A edificação cautelosa e a união de competências técnicas.", "Trabalhe em equipe para construir algo sólido. Cuidado com a avareza; proteja seus bens, mas não paralise o fluxo financeiro pelo medo de perder."],
    ["A Providência", "O balanço da balança material: escassez e ajuda.", "Se estiver em dificuldade, engula o orgulho e peça socorro (um empréstimo, um favor). Se estiver próspero, seja generoso e retribua as bênçãos ao mundo."],
    ["O Ofício", "A repetição metódica, o foco nos detalhes e na produção.", "Concentre-se no trabalho e nos estudos práticos. Aprimore suas habilidades. O sucesso chegará não por sorte, mas pelo esforço diário contínuo e bem feito."],
    ["O Legado", "O conforto definitivo, a herança e o patrimônio acumulado.", "Desfrute do conforto material, da aposentadoria ou dos lucros de um longo esforço. Indica segurança estrutural, enriquecimento e fortes bases familiares."],
    ["O Construtor", "O avanço pragmático, teimoso e eficiente.", "Não procure atalhos. Faça o que precisa ser feito com método, lealdade e perseverança. Cada passo pragmático pavimentará um caminho duradouro."],
    ["O Soberano da Terra", "A abundância instintiva, o provedor rico e próspero.", "Aja com visão administrativa e pragmatismo, garantindo o conforto, a saúde física e o sucesso financeiro. Administre seus recursos visando luxo e qualidade."],
  ] },
  { key: "ar", name: "Ar", theme: "Mente, Verdade, Conflito", graus: [
    ["A Lucidez", "O \"insight\" cortante que resolve impasses.", "Tire as vendas. Use o intelecto frio para tomar a decisão que está sendo evitada. Uma conversa franca, lógica e direta resolverá a questão pendente."],
    ["A Trégua", "O descanso estratégico da mente, a pausa obrigatória para cura.", "Pare de pensar excessivamente no problema. Você precisa descansar, meditar ou dormir para cicatrizar uma dor antes de voltar para a vida agitada."],
    ["A Travessia", "O abandono de vitórias inúteis em busca de paz.", "Afaste-se da confusão. Aceite a perda, perdoe o agravante e mude fisicamente ou mentalmente de cenário. A paz é mais importante que estar certo."],
    ["A Armadilha", "As prisões criadas pelas crenças limitantes e pela ansiedade.", "Você está refém dos seus próprios pensamentos. Pare de criar obstáculos imaginários. A saída é simples: encare o problema de frente e liberte-se."],
    ["O Abismo", "O fim inescapável da negação, o colapso dos esquemas mentais.", "Aceite o pior cenário, chore, desabafe. A resistência só prolonga a dor mental. Quando você aceita o fundo do poço, a mente desocupa espaço e o renascimento começa."],
    ["O Desafiante", "A mente inquiridora, o discurso cortante, a pressa em debater.", "Exija fatos e verdades. Esteja pronto para argumentar e cortar a manipulação alheia pela raiz. Cuidado apenas para não se tornar excessivamente agressivo ou frio."],
    ["O Soberano do Ar", "A imparcialidade suprema do intelecto refinado, o estratega.", "Adote uma postura distanciada e analítica. Julgue a situação de forma ética, clara e sem sentimentalismos. Suas palavras têm o poder de sentenciar o futuro."],
  ] },
];

const SPECIAL: Omit<SpecialCard, "id">[] = [
  {
    name: "A Paixão", group: "Carta Especial", groupTheme: null, cat: "special", numeral: null, special: true,
    desc: "O magnetismo, o desejo absoluto e a necessidade de fusão.",
    light: "O amor que devota, fortalece e gera milagres. A conexão íntima curadora, o carisma magnético. A força de dar a própria vida por algo sagrado.",
    dark: "O ciúme possessivo, o apego tóxico e o vazio existencial. A obsessão, a chantagem emocional e a atração perigosa por algo que consumirá sua energia.",
  },
  {
    name: "A Ambição", group: "Carta Especial", groupTheme: null, cat: "special", numeral: null, special: true,
    desc: "O instinto de ascensão, o orgulho e a fome de poder.",
    light: "A superação admirável de limites, o ímpeto de vencer a miséria ou o ostracismo. A liderança que inspira e ergue os oprimidos, construindo um grande legado.",
    dark: "A ganância insaciável, a tirania, e a política do \"os fins justificam os meios\". O ego que pisa nos outros e acaba governando, solitário, um império de cinzas.",
  },
];

function buildDeck(): Card[] {
  const majors: Omit<RegularCard, "id">[] = MAJOR.map(([name, desc, read], i) => ({
    name, desc, read, group: "Arcano Maior", groupTheme: null, cat: "major", numeral: toRoman(i), special: false,
  }));
  const minors: Omit<RegularCard, "id">[] = ELEMENTS.flatMap(el => el.graus.map(([name, desc, read], i) => ({
    name, desc, read, group: `Elemento ${el.name}`, groupTheme: el.theme, cat: el.key, numeral: toRoman(i + 1), special: false as const,
  })));
  return [...majors, ...minors, ...SPECIAL].map((c, id) => ({ ...c, id }) as Card);
}

/** 22 Arcanos Maiores + 28 Menores (4 elementos × 7 graus) + 2 Especiais = 52. */
export const DECK: readonly Card[] = buildDeck();
