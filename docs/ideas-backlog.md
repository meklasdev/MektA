# MektA — backlog pomysłów

Ten dokument jest miejscem na pomysły do późniejszego rozwijania produktu. Pomysły są pogrupowane według wartości, a nie według kolejności implementacji.

## Najwyższy priorytet

### Project Workspace

- tworzenie projektu z presetem React, Next.js, PHP albo FiveM NUI,
- wybór istniejącego folderu jako workspace,
- drzewo plików i szybkie otwieranie plików,
- status Git, branch i ostatnie zmiany,
- terminal projektu z bezpieczną listą komend,
- uruchamianie `dev`, `build`, `test` i `lint`,
- wykrywanie brakujących narzędzi: Node, PHP, Composer, Git, FXServer.

### UI Builder

- canvas z blokami przeciąganymi na ekran,
- panel właściwości komponentu,
- responsive preview desktop/tablet/mobile,
- design tokens: kolory, typografia, radius, spacing i shadows,
- eksport do czystych komponentów React albo HTML/CSS,
- sekcje zapisane jako wielokrotnego użytku komponenty.

### Agent Workflow

- prompt z kontekstem aktualnego projektu,
- plan przed zmianami,
- podgląd diffu przed zapisem,
- akceptacja pojedynczych plików lub całego planu,
- automatyczne uruchomienie testów po zmianie,
- rollback sesji,
- historia sesji i możliwość kontynuacji.

## React i web

- generator stron React/Next.js/Vite,
- generator routingu i layoutów,
- formularze z walidacją Zod,
- tabele z filtrowaniem i paginacją,
- auth screens i protected routes,
- integracje Supabase, PostgreSQL i REST API,
- generator komponentów z testami,
- podgląd SEO i OpenGraph,
- accessibility audit dla wygenerowanego UI,
- eksport gotowego repozytorium.

## PHP

- preset czystego PHP,
- preset Laravel,
- preset Symfony,
- komponenty Blade i Twig,
- formularze i walidacja po stronie serwera,
- generator CRUD z migracją SQL,
- konfiguracja `.env.example`,
- lokalny runner PHP i Composer,
- podgląd aplikacji przez lokalny serwer PHP.

## FiveM / NUI

- preset resource z `fxmanifest.lua`,
- generator HUD, inventory, tablet, phone, radial menu i pause menu,
- React NUI z gotowym bridge'em Lua ↔ browser,
- generator eventów `SendNUIMessage` i callbacków NUI,
- podgląd NUI bez uruchamiania całego serwera,
- panel eventów: nazwa, payload, kierunek i log,
- tryb testowania rozdzielczości 16:9, ultrawide i 4:3,
- gotowe systemy theme tokens pod ciemne HUD-y,
- eksport kompletnego resource do folderu `resources/`,
- integracje ESX, QBCore i standalone.

## Presety projektów

- SaaS dashboard,
- panel administracyjny,
- sklep internetowy,
- portfolio,
- system rezerwacji,
- CRM,
- panel serwera FiveM,
- inventory FiveM,
- tablet służb,
- telefon gracza,
- landing produktu,
- docs site,
- starter auth + database.

## Pluginy

Każdy plugin powinien mieć manifest, wersję, zakres uprawnień, konfigurację, health check i akcje.

Pomysły:

- GitHub/GitLab,
- Vercel/Cloudflare Pages,
- Supabase,
- Figma,
- Linear,
- OpenCode,
- MCP registry,
- Ollama i lokalne modele,
- Unsplash/Iconify,
- Playwright browser preview,
- Sentry/PostHog,
- MySQL/PostgreSQL/SQLite,
- FiveM FXServer connector.

## Developer experience

- command palette `Ctrl/Cmd + K`,
- skróty klawiaturowe,
- szybkie przełączanie projektów,
- split view: kod / preview / logi,
- embedded terminal,
- clean error explanations,
- kopiowanie komend naprawczych,
- automatyczne README projektu,
- generator changelogu i release notes,
- eksport ZIP i GitHub repository.

## Bezpieczeństwo

- tokeny w systemowym magazynie poświadczeń,
- brak sekretów w rendererze Electron,
- permission scopes dla pluginów,
- blokowanie destrukcyjnych komend,
- potwierdzenie przed zapisem i deploymentem,
- pełny audit log działań agenta,
- tryb offline bez wymaganego konta,
- jasne oznaczenie funkcji wymagających zewnętrznego API.

## Pomysły długoterminowe

- marketplace pluginów,
- marketplace presetów UI,
- współdzielone workspace'y zespołowe,
- synchronizacja ustawień,
- live collaboration,
- prywatny registry pluginów,
- system ocen i wersji presetów,
- automatyczne benchmarki wygenerowanego UI,
- AI review designu przed eksportem,
- generowanie dokumentacji komponentów,
- mobilny panel tylko do monitorowania agentów.

## Proponowana kolejność rozwoju

1. Project Workspace i wybór stacku.
2. Preview + file tree + bezpieczne komendy.
3. Presety React, PHP i FiveM NUI.
4. Blokowy UI Builder z eksportem kodu.
5. Agent workflow z planem, diffem i rollbackiem.
6. MCP Hub i system pluginów z uprawnieniami.
7. Integracje deploymentu i repozytoriów.
8. Marketplace oraz synchronizacja zespołowa.
