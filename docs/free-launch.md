# Darmowy launch MektA Studio

MektA może działać bez płatnych usług:

1. Lokalnie — desktop zapisuje dane w folderze użytkownika AppData.
2. Supabase Free — opcjonalna chmura i logowanie.
3. GitHub Releases — darmowa dystrybucja instalatora przez workflow release.yml.
4. GitHub Pages lub Cloudflare Pages — darmowa strona projektu i dokumentacja.

## Wydanie bez pieniędzy

Załóż publiczne repozytorium GitHub 'meklasdev/MektA', dodaj pliki projektu i utwórz tag:

~~~bash
git add .
git commit -m "prepare free public release"
git tag v2.0.1
git push origin main --tags
~~~

GitHub Actions zbuduje instalator Windows i opublikuje go w Releases. Workflow korzysta z wbudowanego GITHUB_TOKEN, więc nie wymaga osobnego API key.

## Ważne ograniczenie Windows

Płatny certyfikat code-signing nie jest używany. Windows może pokazać SmartScreen przy pierwszym uruchomieniu. To nie blokuje aplikacji, ale przed szerokim wydaniem warto kiedyś kupić certyfikat.

## Aktualizacje

Electron ma skonfigurowany electron-updater z GitHub Releases. Aktualizacje zadziałają, kiedy release zawiera installer i blockmap z workflow.

## Prywatność

Tryb lokalny nie wysyła danych do sieci. Tryb Supabase wysyła tylko dane zapisane przez użytkownika do skonfigurowanego projektu. Nie używamy service-role key w aplikacji desktopowej.
