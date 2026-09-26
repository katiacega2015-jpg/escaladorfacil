# Tarot Místico

App de leitura de tarot para mobile. Fase atual: **HTML autocontido** (`index.html`) — um único arquivo, sem dependências externas, sem build, funciona 100% offline.

## Rodar agora

Abra `index.html` direto no navegador (desktop ou celular) ou sirva localmente:

```bash
npx serve .
```

## O que já tem

- Baralho completo (78 cartas: 22 arcanos maiores + 56 menores)
- 3 tiragens: Carta do Dia, Passado/Presente/Futuro, Situação/Ação (5 cartas)
- Cartas invertidas (30% de chance), com significado próprio
- Animação de flip em CSS puro
- Histórico de leituras salvo em `localStorage`
- Layout mobile-first, respeita safe-area (notch), sem zoom acidental, sem overscroll

## Roadmap para virar APK

Quando o HTML estiver validado, empacotar com **Capacitor** (mais simples e mantido que Cordova):

1. `npm init -y && npm install @capacitor/core @capacitor/cli @capacitor/android`
2. `npx cap init "Tarot Místico" "com.seudominio.tarot"`
3. Mover `index.html` (e assets futuros) para `www/`
4. `npx cap add android`
5. `npx cap sync android`
6. Abrir `android/` no Android Studio e gerar o APK/AAB (ou `./gradlew assembleDebug`)

Nenhuma mudança estrutural grande é necessária no HTML para isso — por isso o app já foi feito sem CDNs externos, sem fontes remotas e com meta tags de viewport/PWA prontas.

## Próximos passos sugeridos

- Ícone do app e splash screen (para o Capacitor)
- Tela de "significado da carta" mais detalhada (arcano, elemento, astrologia)
- Compartilhar leitura (imagem ou texto)
