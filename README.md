Pokedex

Aplikacja Pokedex stworzona w React w ramach projektu.

Opis:
Aplikacja pozwala na przeglądanie Pokemonów wyszukiwanie ich dodawanie do ulubionych i robienie walk wybranymi pokemonami.

Funkcjonalność:
- Pobieramy pierwsze 150 Pokémonów  z API.
- Filtrowanie pokemonów
- Wyświetlanie karty pokemona ze szczegółami
- Sekcja ulubione do której dodajemy pokemony
- Walki pokemonów (arena)
- Ranking, edycja i tworzenie Pokemonów
- Tryb jasny/ciemny
- Logowanie użytkownika i jego ustawień

Technologie:
- HTML, css, JS, React
- ReactRouter
- Context API
- Axios
- JSON Serwer
- Reackt Hook
- Zod
- Notistack
- Tailwind CSS i clsx

Uruchomienie:
serwer:
npx json-server --watch db.json --port 3001
Aplikacja:
npm run dev
http://localhost:5173/

Struktura projektu:
components – folder z komponentami zwracającymi jsx
context – zarządzanie stanem za pomocą useContext
hooks – custom hooki
services – komunikacja z API
routes – routing aplikacji

Autor:
Krzysztof Augustyniak