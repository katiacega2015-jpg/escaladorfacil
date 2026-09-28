# Oráculo das 52 Lâminas

App mobile de leitura de tarot com um baralho **autoral de 52 cartas** e arte pixel 16-bit desenhada por código. Feito em **TypeScript + Vite**; o build gera um único `dist/index.html` autocontido (funciona offline, sem assets externos), pronto para abrir no celular ou empacotar como APK.

## Comandos

```bash
npm install
npm run dev        # servidor de desenvolvimento com hot reload
npm test           # testes (Vitest)
npm run typecheck  # checagem de tipos (strict)
npm run build      # gera dist/index.html autocontido
npm run sheets     # folhas de contato PNG de todas as cartas em tools/out/
```

## Arquitetura

```
src/
  domain/        regras do oráculo, sem DOM (testáveis em Node)
    types.ts       Card, Spread, Drawn, Polarity…
    deck.ts        as 52 lâminas e seus textos
    spreads.ts     tiragens 2/3/5/7 e a Lei das Fileiras
    reading.ts     Reading: corte, ordem de abertura, escolha Causa/Consequência
    history.ts     histórico (localStorage injetável)
  engine/        motor de pixel art (grade 90×160, 9:16), sem DOM
    buf.ts         buffer RGBA, cores, dithering Bayer, RNG determinístico
    primitives.ts  céu, estrelas, montanhas, chamas, partículas…
    creatures.ts   cão, tigre, corvo, cavalo…
    figure.ts      divindade humanoide parametrizada + itens + asas
    hud.ts         moldura chanfrada, glifos, numeral, fonte pixel
    render.ts      composição das camadas → frente e verso
  art/           bíblia visual: uma função por lâmina, por grupo
    majors.ts · agua.ts · fogo.ts · terra.ts · ar.ts · especiais.ts
  ui/            DOM: mesa, zoom, galeria, histórico, animador de canvas
  main.ts        monta tudo
tests/           Vitest: baralho, regras de leitura, histórico, render
tools/           scripts de desenvolvimento (folhas de contato)
```

`domain/` e `engine/` não dependem de navegador, então rodam em testes e scripts Node. A UI só lê o estado de `Reading` e pinta.

### Como adicionar ou mudar uma carta

1. Texto: edite `src/domain/deck.ts`.
2. Arte: edite a função da carta em `src/art/<grupo>.ts`. Ela desenha nas camadas `b` (fundo), `gb` (brilho de fundo), `s` (sprite, ganha contorno e rim light automáticos), `gf` (brilho frontal) e `fg` (primeiro plano). Use `human()` para divindades (com `detail: true` para silhueta com cintura, drapeado, rosto completo, joias e padrões no tecido) e `L.f` (0–3) para animar.
3. Rode `npm run sheets` e confira os PNGs em `tools/out/`.
4. `npm test` garante que toda carta tem arte, renderiza opaca e é determinística.

## O baralho

- **22 Arcanos Maiores**, **28 Arcanos Menores** (Água, Fogo, Terra, Ar × 7 graus) e **2 Cartas Especiais** (A Paixão e A Ambição).
- Maiores e menores têm um único significado (sem invertida). As especiais manifestam **Luz ou Escuridão**, sorteado a cada leitura.

## A mecânica de leitura

Tiragens só em primos ≤ 7 (2, 3, 5, 7), em até 3 fileiras abertas nesta ordem: **Meio = Presente**, depois **Baixo = Passado**, por fim **Cima = Futuro**. No Grau 2 o cartomante escolhe, após o Presente, investigar a Causa (Passado) ou prever a Consequência (Futuro).

## Arte 16-bit

Cada lâmina tem cenário, divindade e primeiro plano em silhueta, moldura dourada (maiores) ou prata (menores), glifo do elemento, numeral romano e rodapé em fonte pixel. Animação idle em 4 quadros de 500 ms, brilho pulsante e revelação em dissolve xadrez 4×4. O botão ▦ abre a galeria.

## Roadmap para APK (Capacitor)

1. `npm install @capacitor/core @capacitor/cli @capacitor/android`
2. `npx cap init "Oráculo das 52 Lâminas" "com.seudominio.oraculo" --web-dir dist`
3. `npm run build && npx cap add android && npx cap sync android`
4. Abra `android/` no Android Studio e gere o APK/AAB (ou `./gradlew assembleDebug`).
