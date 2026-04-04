import { useState, useEffect } from "react";
import usePokemons from "../../../hooks/usePokemons";
import PokemonCard from "../../shared/PokemonCard";

const Home = () => {
  const { pokemons, loading, error } = usePokemons();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 15;

  //filtracja pokemonów na podstawie wyszukiwania
  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  //paginacja
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPokemons = filteredPokemons.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredPokemons.length / ITEMS_PER_PAGE);

  //resetowanie strony po zmianie wyszukiwania
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pokemony</h1>

      {/* Pole wyszukiwania */}
      <input
        type="text"
        placeholder="Szukaj pokemona..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "10px", marginBottom: "20px", width: "100%" }}
      />

    {/* Lista pokemonów */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "10px",
        }}
      >
        {paginatedPokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      {/* Paginacja */}
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