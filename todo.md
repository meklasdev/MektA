
## A: Rebuild UI / Codex-Style Aesthetic (Zadania 1–150)

### A1. Shell, Frameless Window & Layout Architecture (1–25)
1. Zastąpienie natywnego paska tytułu Windows bezramkowym window chrome z własnymi przyciskami (Minimize, Maximize, Close).
2. Dodanie obszaru przeciągania okna (`-webkit-app-region: drag`) zintegrowanego z górnym paskiem nawigacji.
3. Implementacja efektu Windows Mica / Acrylic (lub CSS Backdrop Blur) w tle okna.
4. Zbudowanie elastycznego systemu podziału ekranu (Resizable Split Panes) opartego na `react-resizable-panels`.
5. Przygotowanie głównej siatki: Pasek boczny, Sidebar, Główny canvas, Panel dolny i Pasek stanu.
6. Dodanie pływających okienek modalnych z tłem `backdrop-filter: blur(16px)`.
7. Opracowanie systemu motywów z wykorzystaniem zmiennych CSS (Design Tokens).
8. Wdrożenie domyślnego motywu **Codex Dark**: głęboki grafit/czerń (`#09090b`), subiektywne obramowania (`#27272a`) oraz akcent niebiesko-fioletowy (`#6366f1`).
9. Stworzenie motywu **Codex Midnight**: smolista czerń (`#000000`) z neonowymi akcentami cyan (`#06b6d4`).
10. Stworzenie motywu **Codex Light**: czysty, papierowy wygląd z subtelnymi cieniami (`#f8fafc`).
11. Zaokrąglenie rogów interfejsu (`rounded-xl` dla kart, `rounded-lg` dla przycisków).
12. Dodanie subtelnych linii podziału 1px o niskim kontraście (`border: 1px solid rgba(255, 255, 255, 0.08)`).
13. Zbudowanie komponentu Paska Stanu z wskaźnikami statusu Git, OpenCode, Node.js i Supabase.
14. Dodanie możliwości ukrywania paska stanu jednym skrótem klawiszowym (`Ctrl+Shift+S`).
15. Implementacja płynnych przejść tonalnych i animacji `framer-motion` przy zmianie zakładek.
16. Stworzenie ujednoliconej typografii opartej na nowoczesnych krojach pisma (*Inter*, *Geist Sans*, *JetBrains Mono*).
17. Dodanie dynamicznego wskaźnika ładowania (Neonowy progress bar) pod titlebarem.
18. Zbudowanie chowanego Activity Bara z ikonami po lewej stronie.
19. Integracja zestawu ikonek **Lucide Icons** dla całego interfejsu.
20. Zapewnienie pełnej responsywności UI przy skalowaniu okna.
21. Ustawienie niestandardowych pasków przewijania (Custom Scrollbars): wąskie, półprzezroczyste.
22. Dodanie podglądu miniatury okna w pasku zadań Windows z szybkim menu akcji (JumpList).
23. Stworzenie efektu „Glow” wokół aktywnych pól edycyjnych i przycisków akcji.
24. Zbudowanie uniwersalnego komponentu Tooltip z opóźnieniem i animacją pojawiania się.
25. Zapamiętywanie dokładnych wymiarów i położenia rozdzielonych paneli w `localStorage`.

### A2. Command Palette & Quick Navigation (26–50)
26. Zbudowanie centralnej Palety Komend (`Ctrl + K` / `Cmd + K`) wzorowanej na Linear / Codex.
27. Wdrożenie szybkiej wyszukiwarki plików i projektów (`Ctrl + P`).
28. Wdrożenie wyszukiwania typu Fuzzy Search (`fuse.js` / `match-sorter`).
29. Grupowanie wyników w palecie komend (*Recent Projects*, *Actions*, *OpenCode Commands*, *Settings*).
30. Dodanie podświetlania dopasowanych liter w wynikach wyszukiwania.
31. Obsługa pełnego sterowania z klawiatury (Strzałki, Enter, Esc, Tab).
32. Dodanie skrótów klawiszowych po prawej stronie każdego wyniku w palecie.
33. Zbudowanie trybu „Szybki podgląd” w palecie komend po najechaniu na wynik.
34. Wdrożenie mikro-historii wykonywanych komend z opcją powtórzenia.
35. Stworzenie kontekstowych komend zmieniających się zależnie od widoku.
36. Dodanie komendy `> Change Theme` z podglądem motywu w czasie rzeczywistym.
37. Dodanie komendy `> OpenCode: Execute Prompt...`.
38. Dodanie komendy `> Git: Checkout Branch`.
39. Dodanie komendy `> Project: Clear Cache / node_modules`.
40. Zbudowanie wskaźnika aktywnych filtrów w palecie komend (`:file`, `:project`, `:action`).
41. Dodanie kalkulatora deweloperskiego w palecie komend.
42. Dodanie skrótu `Ctrl + Shift + P` dla komend technicznych/systemowych.
43. Dodanie animacji otwierania palety komend (Scale-up fade).
44. Pamiętanie 5 najczęściej wybieranych komend na górze listy.
45. Integracja palety komend z systemem wtyczek.
46. Stworzenie podglądu skrótów klawiszowych przy każdej ikonie.
47. Zbudowanie edytora mapowania skrótów klawiszowych (Keyboard Shortcuts Editor).
48. Dodanie możliwości konfiguracji każdego skrótu w UI.
49. Zbudowanie detektora konfliktów skrótów klawiszowych.
50. Wywoływanie palety komend przyciskiem w nagłówku z ikoną `⌘K`.

### A3. Codex Chat & Prompt Interface (51–90)
51. Zbudowanie panelu czatu OpenCode inspirowanego konsolą Codex / Cursor.
52. Auto-rozszerzalny edytor promptów z obsługą Markdown i podświetlaniem kodu.
53. Załączanie plików i kontekstu po wpisaniu `@` (`@file`, `@docs`, `@git`).
54. Auto-complete menu z listą plików i symboli po wpisaniu `@`.
55. Podgląd dołączonych plików w postaci małych kapsułek (Pills) nad polem edycji.
56. Renderowanie odpowiedzi z React-Markdown i podświetlaniem `PrismJS`/`Shiki`.
57. Dodanie przycisków „Copy Code” i „Apply to File” przy blokach kodu.
58. Przycisk „Apply to File” otwierający podgląd różnic (Diff View).
59. Wizualizacja toku myślenia AI (Thinking / Reasoning accordion).
60. Przycisk zatrzymania generowania (`Stop Generation`).
61. Wskaźnik prędkości generowania odpowiedzi (Tokeny/sekundę).
62. Zbudowanie zakładek z wieloma równoległymi sesjami czatu OpenCode.
63. Automatyczne generowanie tytułu sesji na podstawie zapytania.
64. Edycja i usuwanie wpisów z historii czatu.
65. Przełącznik trybu „Agentic Mode” vs „Ask Mode”.
66. Wizualizacja wywołań narzędzi MCP w czacie (status, argumenty, wynik).
67. Rozwijane sekcje dla wyników wywołań narzędzi MCP.
68. Podświetlanie błędów narzędzi MCP w kolorze czerwonym z przyciskiem „Retry”.
69. Rozwijana lista wyboru modeli (Anthropic, OpenAI, Ollama, Groq).
70. Wskaźnik okna kontekstu (Context Window Progress Bar).
71. Przycisk „Compact Conversation” automatycznie streszczający historię.
72. Generowanie sugerowanych pytań kontynuacyjnych po odpowiedzi AI.
73. Ocena odpowiedzi (Kciuk w górę / w dół).
74. Edycja poprzednich zapytań i ponowne generowanie gałęzi rozmowy.
75. Nawigacja między gałęziami rozmowy (`< 2/3 >`).
76. Dedykowany edytor system promptów per projekt.
77. Przełącznik auto-zatwierdzania komend MCP.
78. Podgląd zmian w plikach w czasie rzeczywistym w drzewie plików.
79. Przycisk eksportu czatu do Markdown / JSON.
80. Obsługa wklejania obrazów ze schowka do zapytań OpenCode.
81. Miniatury obrazków w polu tekstowym z opcją powiększenia.
82. Powiadomienia dźwiękowe po zakończeniu generowania odpowiedzi.
83. Animowany wskaźnik pisania (Glowing Typing Dots).
84. Przycisk „Pin Message” do przypinania wiadomości.
85. Wyszukiwarka w historii rozmów czatu.
86. Obsługa składni matematycznej LaTeX w odpowiedziach czatu.
87. Wbudowany podgląd wyrenderowanego kodu HTML/SVG bezpośrednio w karcie czatu.
88. Pływające menu akcji po zaznaczeniu tekstu w czacie.
89. Pokazywanie zużycia RAM/CPU przez lokalne modele podczas generowania.
90. Przycisk zresetowania kontekstu sesji bez usuwania historii.

### A4. Workspace & File Explorer UX (91–120)
91. Drzewo plików projektu z ikonami typów plików (Material / VSCode Icons).
92. Płynne rozwijanie folderów z animacją.
93. Szybkie filtrowanie plików w drzewie na podstawie wpisanego tekstu.
94. Oznaczenia kolorystyczne statusu Git w drzewie plików.
95. Wskaźnik liczby zmienionych plików w folderach.
96. Obsługa Drag & Drop dla plików i katalogów.
97. Menu kontekstowe pod prawym przyciskiem myszy dla plików.
98. Przycisk „Collapse All Folders” na górze paska.
99. Przycisk „Locate Active File” ustawiający ostrość w drzewie plików.
100. Podgląd zawartości pliku po najechaniu myszą (File Hover Preview).
101. Przyciemnianie i ukrywanie plików ignorowanych z `.gitignore`.
102. Wbudowana wyszukiwarka fraz w całym projekcie (Global Search & Replace).
103. Obsługa wyrażeń regularnych (RegEx) w wyszukiwarce.
104. Filtry wykluczające w wyszukiwarce (`!node_modules/**`).
105. Sekcja „Open Editors” na samej górze explorera.
106. Sekcja „Project Outline” ze strukturą klas i funkcji.
107. Sekcja „Timeline” pokazująca historię zmian wybranego pliku.
108. Pasek zakładek edytorów z obsługą przeciągania.
109. Wskaźnik niezapisanych plików w zakładkach (kropka).
110. Przycisk zamykania z opcjami „Close Others” i „Close Right”.
111. Dzielenie edytora w pionie i poziomie (Split Editor Grid).
112. Dedykowany podgląd obrazów (PNG, JPG, SVG, WebP) z zoomem.
113. Wbudowany podgląd plików Markdown z synchronizacją scrolla.
114. Wbudowana przeglądarka plików PDF.
115. Podgląd plików JSON/YAML w postaci interaktywnego drzewa obiektów.
116. Ekran startowy (Dashboard), gdy żaden plik nie jest otwarty.
117. Ekran startowy z szybkim uruchamianiem i ostatnimi projektami.
118. Statystyki projektu na ekranie startowym (pliki, linie kodu, rozmiar).
119. Obsługa otwierania wielu projektów na raz w osobnych kartach.
120. Paseknawigacji okruszkowej (Breadcrumbs) na górze edytora.

### A5. Terminal & Output Panels UI (121–150)
121. Integracja terminala na bazie **xterm.js** w dolnym panelu.
122. Obsługa wielu kart terminala z nazwami i kolorowymi ikonami.
123. Wybór powłoki (PowerShell, Cmd, Git Bash, WSL Bash).
124. Płynne rozciąganie dolnego panelu terminala.
125. Przycisk maksymalizacji i natychmiastowego ukrywania (`Ctrl + ~`).
126. Obsługa skrótów kopiowania i wklejania (`Ctrl+Shift+C` / `Ctrl+Shift+V`).
127. Dedykowana zakładka „OpenCode Logs” z logami w formie czytelnych kart.
128. Filtrowanie logów według ważności (`INFO`, `WARN`, `ERROR`, `DEBUG`).
129. Przycisk czyszczenia konsoli i logów.
130. Przycisk eksportu logów do pliku tekstowego `.log`.
131. Podświetlanie linków i ścieżek do plików z obsługą klikania.
132. Dedykowany panel „Problems” zbierający błędy TypeScript/Lintera.
133. Kliknięcie w błąd przenoszące bezpośrednio do linii i kolumny kodu.
134. Przycisk „Fix with OpenCode” obok każdego błędu w panelu.
135. Zakładka „Package Scripts” wyświetlająca skrypty z `package.json`.
136. Wskaźnik stanu uruchomionych skryptów (Zielona kropka = Działa).
137. Przycisk restartu zawieszonego procesu.
138. Pokazywanie czasu trwania i zużycia pamięci przy kartach terminala.
139. Automatyczne wykrywanie `localhost:PORT` z przyciskiem otwarcia.
140. Wbudowany podgląd przeglądarki (Embedded Web Preview) obok kodu.
141. Hot Reload dla wbudowanej przeglądarki podglądu.
142. Przycisk czyszczenia cache przeglądarki podglądu.
143. Dedykowany panel „Git Output” z wynikami komend Git.
144. Pasek szybkiego wprowadzania poleceń z poziomu Palety Komend.
145. Wygląd terminala dopasowany do motywu MektA Studio.
146. Konfiguracja fontu i rozmiaru tekstu w terminalu.
147. Efekt przeźroczystości terminala i mrugający kursor.
148. Podświetlanie wywołań OpenCode wywoływanych z terminala.
149. Auto-wykrywanie menedżerów pakietów (`npm`, `pnpm`, `yarn`, `bun`).
150. Przycisk podsumowania błędów wykonania przez AI (`Explain Failure`).

---

## 🛠️ SEKCJA B: OpenCode, Agent AI, MCP & RAG Engine (Zadania 151–300)

### B1. OpenCode Core & Model Context Protocol (151–190)
151. Wdrożenie obsługi specyfikacji **Model Context Protocol (MCP)**.
152. Podłączenie lokalnego menedżera serwerów MCP (`stdio` oraz `SSE`).
153. Tworzenie i edycja pliku `.mcp.json` przez edytor wizualny.
154. Auto-odpytywanie serwerów MCP o narzędzia, zasoby i prompty.
155. Generowanie dynamicznych schematów JSON Schema dla argumentów narzędzi.
156. Bezpieczny mechanizm zatwierdzania wywołań narzędzi MCP.
157. Konfiguracja poziomów zaufania serwerów MCP (Always Allow / Ask / Deny).
158. Wbudowany serwer MCP `mekta-filesystem` do odczytu i zapisu plików.
159. Wbudowany serwer MCP `mekta-git` dla operacji na repozytorium.
160. Wbudowany serwer MCP `mekta-terminal` dla komend konsoli.
161. Obsługa zdalnych serwerów MCP po HTTP/HTTPS z tokenem Bearer.
162. Auto-reconnect przy zerwaniu połączenia z serwerem MCP.
163. Inspektor ruchu MCP (MCP Traffic Monitor) z podglądem JSON-RPC.
164. Obsługa przesyłania plików binarnych i obrazów jako zasobów MCP.
165. Obsługa szablonowania promptów MCP w UI.
166. Integracja z lokalnym silnikiem **Ollama API** (`localhost:11434`).
167. Wykrywanie zainstalowanych modeli Ollama i wprowadzanie ich do UI.
168. Integracja z **LM Studio API** (`localhost:1234`).
169. Integracja z API Anthropic (Claude 3.5 Sonnet, Claude 3 Opus).
170. Integracja z API OpenAI (GPT-4o, GPT-4o-mini, o1-preview).
171. Integracja z Groq API do szybkiego generowania kodu.
172. Integracja z OpenRouter API dla modeli Open Source.
173. Przechowywanie kluczy API w systemowym pęku kluczy (Keychain).
174. Obsługa własnych punktów końcowych (Custom OpenAI Compatible Endpoints).
175. Limitowanie częstotliwości zapytań (Rate Limiter) i auto-retry.
176. Strumieniowanie odpowiedzi (SSE Streaming) w czasie rzeczywistym.
177. Zliczanie tokenów przed wysłaniem zapytania (`tiktoken`).
178. Automatyczne przycinanie najstarszych wiadomości przy przepełnieniu kontekstu.
179. Obsługa trybu offline (automatyczne przełączanie na Ollama).
180. Zapis surowych logów zapytań AI do `.mekta/agent_debug.json`.
181. Mechanizm Fallback Model przy awarii głównego dostawcy API.
182. Automatyczne generowanie `.gitignore` i `.env.example` przez agenta.
183. Wykrywanie nieskończonych pętli wykonania agenta (Agent Loop Protection).
184. Wbudowane narzędzie przeszukiwania sieci (Web Search MCP tool).
185. Pobieranie zewnętrznych dokumentacji bibliotek w locie.
186. Obsługa skryptów Python jako serwerów MCP.
187. Obsługa serwerów MCP w Node.js / TypeScript.
188. Konfiguracja niestandardowych reguł agenta w `.mekta/rules.md`.
189. Kontrola parametru Temperature (0.0 dla kodu, 0.7 dla kreatywności).
190. Inteligentne sugerowanie najlepszego modelu dla wybranego zadania.

### B2. Local RAG & Code Context Indexing (191–230)
191. Indeksowanie struktur projektu przy pierwszym otwarciu.
192. Bezchmurne embeddingi kodu z użyciem modelu ONNX (`all-MiniLM-L6-v2`).
193. Lokalna baza wektorowa w SQLite / DuckDB (`%APPDATA%/mekta/vector_db/`).
194. Dzielenie kodu na fragmenty z uwzględnieniem granic funkcji i klas.
195. Wykluczanie katalogów ignorowanych (`node_modules`, `dist`, `.git`).
196. Przyrostowe aktualizowanie bazy wektorowej po zapisaniu pliku.
197. Hybrydowe wyszukiwanie kontekstu (BM25 + Similarity Search).
198. Automatyczne dołączanie najważniejszych fragmentów kodu do promptu.
199. Podgląd dołączonych fragmentów kodu RAG w czacie z opcją usunięcia.
200. Przycisk „Rebuild Workspace Index” wymuszający reskan.
201. Wskaźnik postępu indeksowania na pasku stanu.
202. Limitowanie maksymalnego rozmiaru indeksowanych plików.
203. Wykluczanie z indeksu plików binarnych i skompilowanych.
204. Podgląd wygenerowanych map powiązań między kodem.
205. Graficzna wizualizacja powiązań i zależności (Dependency Graph).
206. Integracja parsera **Tree-Sitter** do analizy struktur AST.
207. Wyszukiwanie definicji symboli i klas w całym repozytorium.
208. Wyszukiwanie wszystkich odwołań do wybranego elementu.
209. Generowanie i buforowanie zwięzłych podsumowań funkcji.
210. Inteligentny dobór kontekstu na podstawie kursorów i otwartych kart.
211. Automatyczne dołączanie fragmentu zaznaczonego tekstu do promptu.
212. Filtrowanie sekretów i haseł przed przesłaniem kontekstu do API.
213. Wykrywanie zahardkodowanych haseł i kluczy API w kodzie.
214. Generowanie mapy schematu bazy danych Supabase dla AI.
215. Tworzenie opisu architektury projektu w locie na bazie `package.json`.
216. Analiza rozmiarów pakietów i wdrożonych importów.
217. Automatyczna detekcja używanego frameworka (React, Next, Vue, Nest).
218. Dynamiczne dopasowanie promptów systemowych pod dany framework.
219. Obsługa projektów wielojęzycznych (Monorepo Python + TypeScript).
220. Zapisywanie logów dokładności trafień RAG w celach optymalizacji.
221. Wyłącznik automatycznego RAG z opcją ręcznego wskazywania plików.
222. Eksport zindeksowanego kontekstu do pliku `.mekta-context`.
223. Importowanie paczek kontekstowych popularnych bibliotek.
224. Estymacja czasu trwania pierwszego indeksowania projektu.
225. Wstrzymywanie indeksowania przy niskim stanie baterii laptopa.
226. Pamięć ulubionych rozwiązań i powtarzalnych wzorców użytkownika.
227. Tworzenie słownika pojęć domenowych z komentarzy w kodzie.
228. Wskaźnik procentowy trafności dopasowania fragmentów RAG w UI.
229. Możliwość dodawania z zewnętrznych linków URL do bazy wiedzy.
230. Wbudowany moduł pobierania i czytania stron z dokumentacją API.

### B3. Intelligent Editing & Autonomous Actions (231–270)
231. Podgląd edycji w trybie strumieniowym (Live Stream Diffing).
232. Automatyczne formatowanie zmodyfikowanego kodu za pomocą Prettiera.
233. Usuwanie nieużywanych importów po wygenerowaniu odpowiedzi przez AI.
234. Generator testów jednostkowych (Jest, Vitest, PyTest) dla wybranego pliku.
235. Tworzenie i automatyczne wykonywanie testów po zmianie kodu.
236. Autonomiczny tryb usuwania błędów kompilacji (Iterative Bug Fixing).
237. Generowanie czytelnych wiadomości komitów Git na bazie zmian w kodzie.
238. Tworzenie szablonów PR (Pull Request) z podsumowaniem zmian.
239. Generowanie dokumentacji JSDoc / TypeDoc dla funkcji i interfejsów.
240. Wykrywanie długu technologicznego i sugerowanie refaktoryzacji.
241. Przekształcanie kodu JavaScript do TypeScript.
242. Optymalizacja złożoności obliczeniowej algorytmów przez AI.
243. Automatyczne generowanie typów i interfejsów TypeScript z payloadu JSON.
244. Podpowiadanie poprawek dostępności (Accessibility / a11y) w komponentach JSX.
245. Generowanie makiet stron w Tailwind CSS na bazie opisów tekstowych.
246. Generowanie skryptów SQL dla Supabase / Postgres.
247. Generowanie reguł bezpieczeństwa Supabase RLS (Row Level Security).
248. Skanowanie kodu pod kątem podatności OWASP Top 10.
249. Automatyczne aktualizowanie zależności w `package.json` przez agenta.
250. Tworzenie konfiguracji Dockerfile oraz docker-compose na podstawie projektu.
251. Generowanie konfiguracji CI/CD (GitHub Actions workflow).
252. Generowanie testów E2E z użyciem Playwright lub Cypress.
253. Tłumaczenie opisów i komentarzy w kodzie na inne języki.
254. Generowanie makiet danych testowych (Mock Data Generator).
255. Autonomiczna naprawa uszkodzonych plików JSON / YAML.
256. Dodawanie wskaźników logowania (`console.log` / `logger.info`) w zadanym śledzonym procesie.
257. Tworzenie komponentów React z gotowymi podglądami w Storybooku.
258. Zamiana starych komponentów klasowych React na funkcjonalne z Hookami.
259. Wykrywanie nieużywanych zmiennych i funkcji w całym projekcie.
260. Automatyczny podział dużego pliku na mniejsze moduły.
261. Generowanie plików `.env.example` ze zmiennych używanych w projekcie.
262. Tworzenie skryptów migracji danych dla bazy danych.
263. Analiza wydajności zapytań SQL i tworzenie propozycji indeksów.
264. Generowanie interfejsu klienta API na podstawie specyfikacji OpenAPI / Swagger.
265. Generowanie szablonów wiadomości e-mail w HTML z podglądem.
266. Podpowiedzi optymalizacji stylów CSS i usuwanie nieużywanych klas Tailwind.
267. Szybkie generowanie czytelnych wykresów w Mermaid.js z opisu.
268. Generowanie dokumentu architektury systemu w formacie Markdown.
269. Przeprowadzanie symulacji przeglądu kodu (Code Review Simulation) przed komitem.
270. Automatyczne tworzenie przypomnień TODO w kodzie i rejestracja ich na liście zadań.

### B4. Project Analytics & Insights Engine (271–300)
271. Panel analityki projektu (Project Health Dashboard).
272. Licznik zmodyfikowanych linii kodu (Lines Added/Deleted) w obecnej sesji.
273. Wizualny rozkład języków programowania w projekcie (procentowy udział).
274. Skaner rozmiarów folderu `node_modules` i głębokości drzewa zależności.
275. Licznik czasu spędzonego nad projektem (Pomodoro / Session Time Tracker).
276. Wykres aktywności komitów (Git Commit Heatmap).
277. Analiza pokrycia kodu testami jednostkowymi.
278. Estymacja koszona zużycia zewnętrznych API AI per projekt.
279. Wykrywanie zduplikowanych fragmentów kodu w repozytorium.
280. Analiza złożoności cyklomatycznej kodu (Cyclomatic Complexity Meter).
281. Raport stanu bezpieczeństwa używanych bibliotek (`npm audit` visualizer).
282. Monitor rozmiaru wynikowych paczek budowlanych (Bundle Size Analyzer).
283. Śledzenie nieobsłużonych wyjątków w czasie wykonywania aplikacji.
284. Wykres czasu reakcji zapytań do Supabase / API.
285. Licznik wywołań komend OpenCode oraz skuteczności promptów.
286. Raport o braku dokumentacji dla eksportowanych funkcji i typów.
287. Wykrywanie wolnych zapytań sieciowych w podglądzie aplikacji.
288. Raport zgodności kodu ze standardami zespołu (Linter Rule Coverage).
289. Porównywanie zużycia pamięci podręcznej przed i po refaktoryzacji.
290. Monitorowanie zużycia zasobów dyskowych przez pliki tymczasowe.
291. Podsumowanie nieukończonych zadań `// TODO:` i `// FIX:` w kodzie.
292. Historia instalacji pakietów i zmian w pliku lockfile.
293. Wykres wzrostu objętości kodu w czasie.
294. Statystyka najczęściej modyfikowanych plików w repozytorium.
295. Identyfikator „właściciela kodu” (Git Blame Insights) dla sekcji plików.
296. Wykrywanie martwego kodu i nieużywanych zasobów (np. nieużywane obrazki).
297. Raport wydajności ładowania strony (Core Web Vitals Checker).
298. Przewidywanie potencjalnych regresji przy wprowadzeniu zmian.
299. Eksport zbiorczego raportu kondycji projektu do pliku PDF/HTML.
300. Dedykowana zakładka rekomendacji usprawnień projektu podsumowywana co tydzień przez AI.

---

## 🔌 SEKCJA C: System Wtyczek (Plugin Architecture) (Zadania 301–420)

### C1. Core Plugin SDK & Extension Engine (301–340)
301. Architektura wtyczek w oparciu o odizolowane procesy Node.js worker threads / Web Workers.
302. Oficjalne zapakowane API dla wtyczek (`@mekta/plugin-sdk`).
303. System Rejestracji Hooków (UI Hooks, Command Hooks, File System Hooks).
304. Pozwolenia dla wtyczek (Permissions System: File System, Network, Terminal, OpenCode).
305. Zarządzanie cyklem życia wtyczek (Install, Enable, Disable, Uninstall, Update).
306. System wykrywania nieobsłużonych awarii wtyczek i ich izolacji.
307. Sandboxing środowiska wtyczki zapobiegający blokowaniu głównego wątku UI.
308. Ustawianie i zapamiętywanie konfiguracji dla każdej zainstalowanej wtyczki.
309. Udostępnienie wtyczkom dostępu do systemowego pęku kluczy (Keychain API).
310. Umożliwienie wtyczkom tworzenia własnych paneli w interfejsie.
311. Umożliwienie wtyczkom dodawania elementów do paska stanu (Status Bar).
312. Umożliwienie wtyczkom dodawania własnych komend do Palety Komend.
313. Umożliwienie wtyczkom rejestracji własnych serwerów MCP.
314. System przesyłania wiadomości (IPC Event Bus) między wtyczkami a rdzeniem.
315. Hot-reloading podczas prac programistycznych nad nową wtyczką.
316. Wyświetlanie barier bezpieczeństwa przy instalacji niezweryfikowanych wtyczek.
317. Sprawdzanie i walidacja podpisu cyfrowego wtyczek.
318. Dedykowana podstrona w ustawieniach z listą zainstalowanych wtyczek i ich uprawnieniami.
319. Wsparcie dla wtyczek pisanych w JavaScript, TypeScript, a także WASM.
320. Rejestrowanie skrótów klawiszowych przez zewnętrzne wtyczki.
321. System udostępniania zasobów wizualnych (ikon, motywów) przez wtyczki.
322. Udostępnienie wtyczkom dostępu do systemu podpowiedzi i powiadomień.
323. Wbudowane API do obsługi operacji na plikach (Scoped Storage API).
324. Umożliwienie wtyczkom dodawania opcji do menu kontekstowego explorera.
325. Przechowywanie metadanych wtyczek w pliku manifestu `plugin.json`.
326. Automatyczna walidacja manifestu wtyczki przy próbie instalacji.
327. System zarządzania wersjami i zależnościami między wtyczkami (SemVer).
328. Umożliwienie wtyczkom manipulowania elementami czatu OpenCode.
329. Dedykowana konsola debugowania dla twórców wtyczek (Plugin DevTools).
330. Szablony starterów dla nowych wtyczek (`npm create @mekta/plugin`).
331. Automatyczne generowanie dokumentacji SDK dla deweloperów.
332. System powiadomień o aktualizacjach zainstalowanych wtyczek.
333. Przywracanie domyślnego stanu po awarii uszkodzonej wtyczki.
334. Ustawienie maksymalnego zużycia pamięci i czasu wykonania dla wtyczek.
335. Narzędzie testowania wtyczek w odizolowanym środowisku (Plugin Tester Harness).
336. Wsparcie dla motywów interfejsu dystrybuowanych jako wtyczki.
337. API do wprowadzania niestandardowych reguł podświetlania składni przez wtyczki.
338. Podgląd dziennika działań wtyczki (Plugin Audit Log).
339. Obsługa lokalizacji i wielojęzyczności we wtyczkach.
340. System oceniania i opinii dla wtyczek przechowywany lokalnie / w Supabase.

### C2. In-App Marketplace & Distribution (341–370)
341. Zbudowanie wbudowanego Marketplace z wtyczkami zintegrowanego z UI.
342. Kategoryzacja wtyczek (*AI & LLM*, *DevTools*, *Themes*, *Database*, *Integrations*).
343. Wyszukiwarka wtyczek z filtrowaniem po nazwie, autorze i popularności.
344. Strona szczegółów wtyczki z opisem w Markdown, zrzutami ekranu i changelogiem.
345. Instalowanie wtyczek jednym kliknięciem („One-Click Install”).
346. Instalowanie wtyczek z plików `.zip` lub `.tar.gz` z dysku lokalnego.
347. Instalowanie wtyczek bezpośrednio z linków do repozytorium GitHub.
348. Wskaźnik liczby pobrań i gwiazdek dla każdej wtyczki w Sklepie.
349. Sekcja „Featured Plugins” polecająca najlepsze rozszerzenia na ekranie głównym.
350. Sekcja „Trending Plugins” z najszybciej zyskującymi na popularności rozszerzeniami.
351. Automatyczne aktualizowanie wtyczek w tle z opcją wyłączenia w ustawieniach.
352. Wirtualny rejestr wtyczek (Plugin Registry API) zaimplementowany na Supabase.
353. Możliwość podłączenia własnego prywatnego rejestru wtyczek (Enterprise Registry).
354. Przycisk zgłaszania niebezpiecznej wtyczki (Report Abuse).
355. Eksport i import listy zainstalowanych wtyczek (`plugins.lock.json`).
356. Zakładka „My Published Plugins” ułatwiająca twórcom publikację aktualizacji.
357. Narzędzie do automatycznego pakowania wtyczki przed wysłaniem (`mekta-plugin pack`).
358. Sprawdzanie kompatybilności wtyczki z obecną wersją MektA Studio.
359. Bezpieczny mechanizm opłat/donacji dla twórców wtyczek (np. GitHub Sponsors link).
360. System tagów ułatwiających wyszukiwanie powiązanych wtyczek.
361. Podgląd wymaganych uprawnień przed potwierdzeniem instalacji wtyczki.
362. Historia wersji wtyczki z możliwością przywrócenia starszego wydania.
363. Dedykowany cache dla pobranych instalatorów wtyczek.
364. Powiadomienia o nowych wtyczkach dopasowanych do używanego stosu technologicznego.
365. Tworzenie kolekcji wtyczek (np. „Frontend Developer Starter Pack”).
366. Podostępnianie linków do wtyczek (Deep Linking `mekta://plugins/id`).
367. Automatyczne wyłączanie niekompatybilnych wtyczek po aktualizacji MektA Studio.
368. Możliwość ukrycia sekcji Marketplace w środowiskach firmowych.
369. Oznaczanie certyfikowanych wtyczek zweryfikowanych przez twórców MektA.
370. Dziennik zmian w Marketplace pokazujący nowo dodane rozszerzenia.

### C3. Built-in Core Plugins (371–420)
371. **Wtyczka REST API Client**: Testowanie endpointów HTTP (odpowiednik Postmana/Bruno).
372. **Wtyczka Database Inspector**: Podgląd baz SQLite, PostgreSQL oraz MySQL z edycją rekordów.
373. **Wtyczka Docker Manager**: Podgląd kontenerów, obrazów i wolumenów Docker z logami.
374. **Wtyczka Snippet Manager**: Wbudowana biblioteka wielorazowych fragmentów kodu.
375. **Wtyczka Git Visualizer**: Drzewo komitów, wykres gałęzi i narzędzie do rozwiązywania konfliktów scalania.
376. **Wtyczka Tailwind CSS Helper**: Podgląd kolorów, autouzupełnianie klas i konwerter pikseli na rem.
377. **Wtyczka RegEx Tester**: Testowanie i wyjaśnianie wyrażeń regularnych w czasie rzeczywistym.
378. **Wtyczka JSON Viewer & Formatter**: Naprawa, walidacja i wizualizacja struktury JSON.
379. **Wtyczka Markdown Note Take**: Notatnik z obsługą dwukierunkowych linków w stylu Obsidian.
380. **Wtyczka System Monitor**: Wykresy zużycia pamięci, procesora i dysku przez system.
381. **Wtyczka Icon Explorer**: Przeglądarka i kopiowanie ikonek Lucide, FontAwesome i Heroicons.
382. **Wtyczka Color Picker & Palette Builder**: Pobieranie kolorów z ekranu i generowanie palet.
383. **Wtyczka NPM Dependency Checker**: Skanowanie nieużywanych i przestarzałych pakietów npm.
384. **Wtyczka JWT Debugger**: Rozszyfrowywanie i walidacja tokenów JSON Web Token.
385. **Wtyczka GraphQL Playground**: Zapytania, mutacje i przeglądarka schematów GraphQL.
386. **Wtyczka Cron Expression Builder**: Generator i opis harmonogramów Cron.
387. **Wtyczka Base64 & Hash Encoder**: Kodowanie/dekodowanie Base64, MD5, SHA256.
388. **Wtyczka SVG Optimizer**: Czyszczenie i minifikacja kodu ikonek SVG z podglądem.
389. **Wtyczka Minifier / Formatter**: Szybkie formatowanie i minifikowanie kodu HTML, CSS, JS.
390. **Wtyczka Environment File Sync**: Synchronizacja zmiennych środowiskowych między członkami zespołu.
391. **Wtyczka HTML Preview**: Podgląd szablonów stron w różnych rozdzielczościach mobilnych.
392. **Wtyczka Code Screenshots (Carbon-like)**: Generowanie estetycznych obrazków z fragmentami kodu.
393. **Wtyczka Translation Helper**: Automatyczne wyszukiwanie i podmienianie ciągów tekstowych do i18n.
394. **Wtyczka TODO Highlighting**: Podświetlanie komentarzy `TODO`, `FIXME`, `HACK` w kodzie.
395. **Wtyczka Port Manager**: Wykrywanie zajętych portów systemowych i ich zwalnianie.
396. **Wtyczka Lighthouse Performance Check**: Szybki audyt wydajnościowy dla projektów webowych.
397. **Wtyczka Code Spelling Checker**: Sprawdzanie pisowni w nazwach zmiennych i komentarzach (Angielski/Polski).
398. **Wtyczka Keybindings Visualizer**: Interaktywny podgląd klawiatury z nałożonymi skrótami.
399. **Wtyczka Subtitle & File Converter**: Konwersja plików tekstowych między formatami CSV, JSON, XML, YAML.
400. **Wtyczka Wireframe Sketcher**: Tworzenie szybkich, prosto wyklikanych szkiców UI w interfejsie.
401. **Wtyczka Mock REST Server**: Szybkie stawianie lokalnego serwera mockującego odpowiedzi API.
402. **Wtyczka OpenCode Command Builder**: Wizualny kreator złożonych promptów dla agenta.
403. **Wtyczka Supabase Schema Generator**: Wizualny projektant tabel tworzący pliki migracji SQL.
404. **Wtyczka Audio Soundboard for Devs**: Odtwarzanie dźwięków podczas pisania lub przy udanych komitach.
405. **Wtyczka Git Hook Manager**: Konfiguracja skryptów Husky i Git Hooks bez pisania bash.
406. **Wtyczka Bundle Phobia Integration**: Sprawdzanie rozmiaru pakietu npm przed jego zainstalowaniem.
407. **Wtyczka Storybook Runner**: Uruchamianie i osadzanie widoku Storybook bezpośrednio w aplikacji.
408. **Wtyczka Shell Script Runner**: Łatwy dostęp do skryptów `.sh` i `.bat` w projekcie.
409. **Wtyczka Kafka / RabbitMQ Explorer**: Podgląd kolejek wiadomości w architekturach sterowanych zdarzeniami.
410. **Wtyczka Redis Cache Viewer**: Przeglądanie kluczy i wartości w instancji Redis.
411. **Wtyczka ElasticSearch Query Tool**: Przeglądanie indeksów i wyszukiwanie w ElasticSearch.
412. **Wtyczka Sentry Error Viewer**: Podgląd błędów produkcyjnych zagregowanych w Sentry.
413. **Wtyczka Figma Component Import**: Pobieranie komponentów z aplikacji Figma do kodu React.
414. **Wtyczka Notion Workspace Sync**: Eksportowanie notatek i zadań z MektA do Notion.
415. **Wtyczka Slack Notifications**: Wysyłanie statusu prac i powiadomień na kanał Slack.
416. **Wtyczka Discord Rich Presence**: Pokazywanie statusu pracy w MektA Studio na profilu Discord.
417. **Wtyczka Spotify Controller**: Sterowanie odtwarzaniem muzyki w tle bez opuszczania MektA.
418. **Wtyczka Jira Issue Viewer**: Podgląd przypisanych zadań z systemu Jira w psku bocznym.
419. **Wtyczka Trello Card Sync**: Zarządzanie kartami na tablicy Trello z poziomu okna aplikacji.
420. **Wtyczka GitHub Pull Request Manager**: Tworzenie, przeglądanie i komentowanie PR bez otwierania przeglądarki.

---

## ☁️ SEKCJA D: Local-First, Supabase Sync & Data Architecture (Zadania 421–540)

### D1. Local-First Engine & Offline Storage (421–460)
421. Architektura danych w oparta o paradygmat **Local-First** (Główna baza na urządzeniu użytkownika).
422. Zapytania i operacje wykonywane natychmiastowo z zerowym opóźnieniem sieciowym (Zero Latency UI).
423. Silnik pamięci podręcznej zapisujący workspace w pliku `%APPDATA%/mekta/mekta-workspace.json`.
424. Migracja na wbudowaną relacyjną bazę danych SQLite dla poprawy wydajności przy dużych workspace'ach.
425. System automatycznego tworzenia migawek stanu (Snapshots) przed każdą dużą operacją.
426. Płynne przechodzenie z trybu całkowicie bezchmurnego (Offline) do synchronizacji z Supabase.
427. Szyfrowanie wrażliwych danych w bazie lokalnej z użyciem algorytmu **AES-256-GCM**.
428. Odzyskiwanie danych w przypadku uszkodzenia pliku bazy danych (Corrupted Database Repair Utility).
429. Praca aplikacji w środowisku o ograniczonym lub braku dostępu do Internetu (Air-gapped mode).
430. Kompresja danych workspace'a (Gzip/Brotli) w celu zmniejszenia zużycia miejsca na dysku.
431. Przeglądarka zarejestrowanych zdarzeń w lokalnej bazie danych (Event Log Explorer).
432. Przycisk bezpiecznego usuwania wszystkich lokalnych danych (Wipe Local Storage & Cache).
433. Tworzenie i przywracanie kopii zapasowych do zaszyfrowanego pliku `.mektabak`.
434. Wskaźnik zużycia miejsca na dysku przez dane aplikacji na pasku stanu.
435. System automatycznego usuwania starych logów i nieużywanych migawek (Auto Garbage Collection).
436. Obsługa wielu niezależnych profilów użytkownika z osobnymi bazami lokalnymi.
437. Izolowanie konfiguracji i danych między różnymi wersjami aplikacji (Stable vs Canary).
438. Zapisywanie konfiguracji edytora i okna w formacie czytelnym dla człowieka (`settings.json`).
439. System wyliczania sum kontrolnych (Checksums) w celu weryfikacji integralności danych.
440. Wdrożenie struktury danych **CRDT** (Conflict-free Replicated Data Types) dla sprawnej synchronizacji.
441. Wykorzystanie biblioteki Yjs lub Automerge dla obsługi współdzielonych dokumentów i notatek.
442. Utrzymywanie kolejki operacji (Mutation Queue) w czasie braku połączenia z siecią.
443. Automatyczne ponawianie nieudanych zapisów sieciowych po odzyskaniu połączenia.
444. System bezpiecznego zamykania bazy danych przy wyłączaniu systemu Windows.
445. Wskaźnik stanu synchru na pasku stanu (Zielony: Zsynchronizowano, Żółty: Zapisywanie lokalne, Czerwony: Błąd).
446. Zarządzanie limitami pamięci podręcznej dla przechowywanych struktur projektowych.
447. Izolacja danych każdego projektu do osobnych podkatalogów `.mekta/` wewnątrz repozytorium.
448. Automatyczne generowanie pliku `.mekta/config.json` przy tworzeniu nowego obszaru roboczego.
449. Przycisk eksportu całego środowiska roboczego wraz z historią zapytań do pliku archive ZIP.
450. Podgląd surowych danych JSON zapisanych w plikach konfiguracyjnych bezpośrednio z okna ustawień.
451. Zabezpieczenie przed jednoczesnym otwarciem tej samej bazy danych przez dwie instancje MektA.
452. Tworzenie automatycznych kopii zapasowych przed każdą aktualizacją aplikacji.
453. Integracja lokalnej bazy z powiadomieniami o braku wolnego miejsca na dysku systemowym.
454. Szybkie przełączanie baz danych w locie bez konieczności ponownego uruchamiania interfejsu.
455. Zbudowanie uniwersalnego repozytorium danych (Data Access Layer) ukrywającego mechanizm zapisu.
456. Logowanie zmian w strukturze lokalnej bazy w pliku `.mekta/migrations.log`.
457. Optymalizacja indeksów bazy danych pod kątem szybkiego wyszukiwania fraz.
458. Wykorzystanie pamięci RAM (In-memory storage) dla operacji wymagających najwyższej wydajności.
459. Wyświetlanie ostrzeżenia w przypadku wykrycia zewnętrznej modyfikacji pliku workspace'a.
460. Obsługa tworzenia symbolicznych dowiązań (Symlinks) w strukturze plików danych MektA.

### D2. Supabase Integration & Cloud Sync (461–500)
461. Opcjonalna integracja z wybraną przez użytkownika instancją Supabase (Cloud lub Self-hosted).
462. Formularz bezpiecznego wprowadzania danych Supabase URL oraz Supabase Anon Key.
463. Zabezpieczenie przed wprowadzaniem klucza `service_role` w klienćie (Walidacja haseł i kluczy).
464. Autoryzacja użytkowników przez Supabase Auth (Email/Password, Magic Link).
465. Integracja z logowaniem jednokrotnym OAuth (GitHub, Google, GitLab, Bitbucket).
466. Wdrożenie obsługi dwuskładnikowej autoryzacji (2FA / TOTP) z Supabase Auth.
467. System bezpiecznej odnowy tokenów sesji (Token Refresh Management).
468. Synchronizacja projektów i uaktualnień do tabel w Supabase Postgres.
469. Gotowe skrypty instalacyjne SQL (`supabase/schema.sql`) z opcją wykonania z UI MektA.
470. Pełne wdrożenie polityk bezpieczeństwa **Row Level Security (RLS)** dla tabel użytkowników.
471. Dwukierunkowa synchronizacja danych między bazą lokalną SQLite a Supabase.
472. Interfejs graficzny do ręcznego rozwiązywania konfliktów danych (Conflict Resolution Screen).
473. Wybór polityki rozwiązywania konfliktów (Client Wins / Server Wins / Manual Merge).
474. Wykorzystanie **Supabase Realtime** (WebSockets) do natychmiastowego odbierania zmian z chmury.
475. Bezpieczne przechowywanie plików projektu w **Supabase Storage**.
476. Przenoszenie wygenerowanych assetów i obrazków do kubków (Buckets) Supabase Storage.
477. Automatyczne generowanie bezpiecznych adresów URL ze skończonym czasem ważności (Signed URLs).
478. Wykorzystanie funkcji brzegowych **Supabase Edge Functions** do obsługi ciężkich zadań AI.
479. Zintegrowany edytor zmiennych środowiskowych dla Supabase Edge Functions.
480. Przeglądarka logów z wykonania Supabase Edge Functions wewnątrz dolnego panelu MektA.
481. Monitorowanie wykorzystania limitów bazy Supabase w darmowym i płatnym planie.
482. Bezpieczne usuwanie danych konta i wszystkich danych chmurowych na żądanie (GDPR Right to be Forgotten).
483. Podgląd połączonych urządzeń użytkownika korzystających z tej samej instancji Supabase.
484. Opcja zdalnego wylogowania wybranych sesji i unieważnienia tokenów.
485. Integracja z Supabase Vector (pgvector) do chmurowego przechowywania embeddingów RAG.
486. Automatyczne tworzenie indeksów `HNSW` w bazie Supabase pgvector dla przyspieszenia wyszukiwania.
487. Podgląd stanu połączenia z usługą Supabase z automatycznym pętleniem powtórzeń.
488. Sygnalizacja braku dostępu do chmury i płynne przełączanie na tryb roboczy offline.
489. Narzędzie testowania poprawności konfiguracji zmiennych Supabase przed ich zapisaniem.
490. Szablony skryptów SQL ułatwiające rozbudowę schematu o nowe tabele.
491. Umożliwienie korzystania z funkcji autoryzacji Supabase bez konieczności synchronizacji plików.
492. Integracja z Supabase Webhooks do powiadamiania zewnętrznych serwisów o zdarzeniach w MektA.
493. Zintegrowana konsola SQL pozwalająca na bezpośrednie odpytywanie bazy Supabase.
494. Eksport danych z tabel Supabase do plików CSV, JSON oraz SQL.
495. Zarządzanie z poziomu UI rolamim użytkowników i uprawnieniami w bazie Supabase.
496. Podgląd aktywnego połączenia bazodanowego za pomocą wskaźnika latencji (Ping w ms).
497. Bezpieczne maskowanie kluczy autoryzacji podczas prezentacji widoków konfiguracji.
498. Automatyczna naprawa schematu tabel po wydaniu nowej wersji MektA Studio.
499. Możliwość korzystania z własnych bram sieciowych (Proxy) do połączeń z Supabase.
500. Dedykowany podgląd statystyk ruchu sieciowego wygenerowanego przez synchronizację Supabase.

### D3. Security, Encryption & Privacy Architecture (501–540)
501. Bezpieczna architektura oparta o wyeliminowanie twardo wpisanych sekretów i haseł.
502. Szyfrowanie wrażliwych konfiguracji hasłem głównym (Master Password).
503. Integracja z systemowymi menedżerami haseł (Windows Credential Manager, macOS Keychain, Secret Service API).
504. Wdrożenie standardu **PKCE** (Proof Key for Code Exchange) dla przepływów autoryzacji OAuth.
505. Ochrona przed atakami typu Cross-Site Scripting (XSS) we wbudowanych widokach podglądu webowego.
506. Wdrożenie rygorystycznej polityki bezpieczeństwa treści (**Content Security Policy — CSP**).
507. Wyłączenie możliwości wykonywania niezaufanego kodu w głównym wątku Electrona (`nodeIntegration: false`).
508. Pełne włączenie izolacji kontekstu (`contextBridge.exposeInMainWorld`).
509. Walidacja wszystkich komend i wiadomości przesyłanych przez szynę IPC między wątkami.
510. Automatyczne usuwanie kluczy API z logów błędów i zgłoszeń awarii.
511. Anonimizacja ścieżek do plików systemowych w logach (z
