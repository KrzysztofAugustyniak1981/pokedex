import { useState, useEffect } from "react";
import usePokemons from "../../../hooks/usePokemons";
import PokemonCard from "../../shared/PokemonCard";
import { getCustomPokemons } from "../../../services/customPokemonService";

const Home = () => {
  const { pokemons, loading, error } = usePokemons();

  const [displayPokemons, setDisplayPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    const loadMergedPokemons = async () => {
      try {
        //pobieramy custom pokemony z naszego "bazy danych"
        const customPokemons = await getCustomPokemons();
        //łączymy dane z API i custom pokemony
        const mergedApiPokemons = pokemons.map((pokemon) => {
          const edited = customPokemons.find(
            (custom) => custom.pokemonId === pokemon.id
          );

          if (edited) {
            return {
              ...pokemon,
              weight: edited.weight,
              height: edited.height,
              base_experience: edited.base_experience,
              win: edited.win ?? pokemon.win ?? 0,
              lose: edited.lose ?? pokemon.lose ?? 0,
            };
          }

          return {
            ...pokemon,
            win: pokemon.win ?? 0,
            lose: pokemon.lose ?? 0,
          };
        });
        //dodajemy pokemony które zostały stworzone
        const createdPokemons = customPokemons
          .filter((custom) => !custom.pokemonId)
          .map((custom) => ({
            ...custom,
            win: custom.win ?? 0,
            lose: custom.lose ?? 0,
          }));

        setDisplayPokemons([...mergedApiPokemons, ...createdPokemons]);
      } catch (err) {
        console.error("Błąd ładowania customPokemons:", err);
        setDisplayPokemons(pokemons);
      }
    };

    if (pokemons.length > 0) {
      loadMergedPokemons();
    }
  }, [pokemons]);
  //filtrowanie pokemonów
  const filteredPokemons = displayPokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPokemons = filteredPokemons.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredPokemons.length / ITEMS_PER_PAGE);
  //resetowanie strony po zmianie
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pokedex</h1>

      <input
        type="text"
        placeholder="Szukaj pokemona..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "10px", marginBottom: "20px", width: "100%" }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "10px",
        }}
      >
        {paginatedPokemons.map((pokemon) => (
          <PokemonCard key={pokemon.pokemonId || pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              margin: "5px",
              padding: "10px",
              background: currentPage === i + 1 ? "black" : "lightgray",
              color: currentPage === i + 1 ? "white" : "black",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;