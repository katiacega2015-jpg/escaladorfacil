# Oráculo das 52 Lâminas

App de leitura de tarot para mobile, com baralho **autoral de 52 cartas** (não é o tarot tradicional de 78). Fase atual: **HTML autocontido** (`index.html`) — um único arquivo, sem dependências externas, sem build, funciona 100% offline.

## Rodar agora

Abra `index.html` direto no navegador (desktop ou celular) ou sirva localmente:

```bash
npx serve .
```

## O baralho

- **22 Arcanos Maiores** — jornada do espírito (O Errante, O Alquimista, O Oráculo... até O Cosmos)
- **28 Arcanos Menores** — jornada dos elementos, 4 naipes × 7 graus (Água, Fogo, Terra, Ar)
- **2 Cartas Especiais** — A Paixão e A Ambição, com dualidade **Luz/Escuridão** em vez de posição invertida

Diferente do tarot tradicional: arcanos maiores e menores têm **um único significado** (sem invertida). Só as 2 cartas especiais manifestam Luz ou Escuridão conforme o contexto — no app isso é sorteado a cada leitura.

## A mecânica de leitura

Tiragens só em números primos ≤ 7 (2, 3, 5, 7), organizadas em até 3 fileiras:

- **Fileira do Meio = Presente** — aberta primeiro
- **Fileira de Baixo = Passado** — aberta em segundo
- **Fileira de Cima = Futuro** — aberta por último

A ordem de abertura é travada (não dá pra abrir o Futuro antes do Presente). A tiragem de Grau 2 é ramificada: depois de ver o Presente, você escolhe investigar a Causa (desce pro Passado) ou prever a Consequência (sobe pro Futuro).

- **Grau 2** — Causa ou Consequência
- **Grau 3** — Linha do Tempo Direta (Presente/Passado/Futuro)
- **Grau 5** — Ponto de Pressão (cruz horizontal: 3 no Presente + 1 Passado + 1 Futuro)
- **Grau 7** — A Teia do Destino (diamante 3-2-2: Presente/Passado/Futuro)

## Arte 16-bit

Todas as 52 lâminas e o verso são pixel art desenhada por código em `<canvas>` (grade nativa 90×160, 9:16, escala inteira sem interpolação) — nenhuma imagem externa. Cada carta tem cenário, divindade (sprite com contorno e rim light) e primeiro plano em silhueta, moldura chanfrada dourada (maiores) ou prata (menores), glifo de canto por elemento, numeral romano e rodapé em fonte pixel. Animação idle em 4 quadros de 500 ms, brilho pulsante e revelação em dissolve xadrez 4×4. O botão ▦ abre a galeria completa.

## O que já tem

- Baralho completo de 52 cartas, com todos os textos originais
- As 4 tiragens numerológicas (2, 3, 5, 7) com fileiras travadas por ordem
- Tiragem de Grau 2 ramificada (Causa ou Consequência)
- Dualidade Luz/Escuridão nas 2 cartas especiais
- Animação de flip em CSS puro
- Histórico de leituras salvo em `localStorage`
- Layout mobile-first, respeita safe-area (notch), sem zoom acidental, sem overscroll

## Roadmap para virar APK

Quando o HTML estiver validado, empacotar com **Capacitor** (mais simples e mantido que Cordova):

1. `npm init -y && npm install @capacitor/core @capacitor/cli @capacitor/android`
2. `npx cap init "Oráculo das 52 Lâminas" "com.seudominio.oraculo"`
3. Mover `index.html` (e assets futuros) para `www/`
4. `npx cap add android`
5. `npx cap sync android`
6. Abrir `android/` no Android Studio e gerar o APK/AAB (ou `./gradlew assembleDebug`)

Nenhuma mudança estrutural grande é necessária no HTML para isso — por isso o app já foi feito sem CDNs externos, sem fontes remotas e com meta tags de viewport/PWA prontas.

## Próximos passos sugeridos

- Ícone do app e splash screen (para o Capacitor)
- Arte/ilustração própria para as 52 cartas
- Compartilhar leitura (imagem ou texto)
