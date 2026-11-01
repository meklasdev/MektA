# MektA — wizja produktu

## Czym ma być MektA

MektA ma być lokalnym, desktopowym frameworkiem i workspace'em do tworzenia prawdziwych interfejsów oraz aplikacji. Nie jest wyłącznie landing page builderem ani launcherem do CLI.

Główna obietnica produktu:

> Od pomysłu do działającego UI, kodu i uruchomionego projektu w jednym środowisku.

MektA ma obsługiwać między innymi:

- aplikacje React, Next.js i Vite,
- strony i panele PHP,
- komponenty HTML/CSS/JavaScript,
- dashboardy i narzędzia wewnętrzne,
- UI do FiveM/NUI w HTML, React i Lua,
- projekty z backendem, bazą danych i API,
- pracę agenta OpenCode oraz serwerów MCP.

## Główne filary

### 1. Workspace projektu

Użytkownik wybiera projekt, stack i środowisko, a MektA pokazuje strukturę plików, status Git, komendy, preview, logi i uruchomione procesy.

### 2. Framework bloków i presetów

Zamiast generować monolityczne pliki, MektA składa aplikacje z wersjonowanych bloków:

- layouty,
- nawigacje,
- formularze,
- tabele,
- modale,
- karty,
- ekrany auth,
- dashboardy,
- HUD-y i menu FiveM.

Każdy blok ma warianty, tokeny designu, accessibility rules i generator kodu dla wybranego stacku.

### 3. Agent jako współtwórca

Agent nie powinien działać jak czarna skrzynka. MektA pokazuje plan, zmieniane pliki, diff, komendy, testy i prośby o akceptację.

### 4. Preview i runtime

Każdy projekt powinien mieć szybki preview webowy, tryb responsive oraz — dla FiveM — podgląd NUI z kontrolą eventów i mockowanym środowiskiem developerskim.

### 5. Pluginy i integracje

Pluginy rozszerzają narzędzia, a nie tylko wygląd aplikacji. Mogą dodawać generator, provider danych, deployment, integrację z API albo nowy typ preview.

## Docelowe typy projektów

| Typ | Technologie | Wynik |
| --- | --- | --- |
| React App | React, Vite, Next.js, Tailwind | aplikacja webowa |
| PHP Site | PHP, Twig/Blade, HTML, CSS | strona lub panel |
| Full-stack | React/Next + PHP/Node + SQL | aplikacja z API |
| FiveM NUI | React/HTML/CSS + Lua | HUD, menu, tablet, inventory |
| UI Kit | React, CSS, tokens | biblioteka komponentów |
| Internal Tool | React, forms, tables, auth | dashboard operacyjny |

## Zasada produktu

MektA ma prowadzić użytkownika za rękę, ale nie ukrywać kodu. Każdy wygenerowany element powinien być możliwy do obejrzenia, edycji, uruchomienia, przetestowania i wyeksportowania.
