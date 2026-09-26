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
- **2 Cartas Especiais** — A Paixão e A Ambição, com dualidade **Luz/Sombra** em vez de posição invertida

Diferente do tarot tradicional: arcanos maiores e menores têm **um único significado** (sem invertida). Só as 2 cartas especiais manifestam Luz ou Sombra conforme o contexto — no app isso é sorteado a cada leitura.

## O que já tem

- Baralho completo de 52 cartas, com todos os textos originais
- 3 tiragens: Carta do Dia, Passado/Presente/Futuro, Situação/Ação (5 cartas)
- Dualidade Luz/Sombra nas 2 cartas especiais
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
