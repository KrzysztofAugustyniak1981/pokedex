import { useEffect, useMemo, useState } from "react";
import usePokemons from "../../../hooks/usePokemons";
import { getCustomPokemons } from "../../../services/customPokemonService";

const Ranking = () => {
  const { pokemons, loading, error } = usePokemons();
  const [displayPokemons, setDisplayPokemons] = useState([]);
  const [sortBy, setSortBy] = useState("base_experience");

  useEffect(() => {
    const loadMergedPokemons = async () => {
      try {
        const customPokemons = await getCustomPokemons();

        const merged = pokemons.map((pokemon) => {
          const edited = customPokemons.find(
            (custom) => custom.pokemonId === pokemon.id
          );

          if (edited) {
            return {
              ...pokemon,
              weight: edited.weight,
              height: edited.height,
              base_experience: edited.base_experience,
              win: edited.win ?? pokemon.win,
              lose: edited.lose ?? pokemon.lose,
            };
          }

          return pokemon;
        });

        const onlyCreatedPokemons = customPokemons.filter(
          (custom) => !custom.pokemonId
        );

        setDisplayPokemons([...merged, ...onlyCreatedPokemons]);
      } catch (err) {
        console.error("Błąd ładowania customPokemons:", err);
        setDisplayPokemons(pokemons);
      }
    };

    if (pokemons.length > 0) {
      loadMergedPokemons();
    }
  }, [pokemons]);

  const sortedPokemons = useMemo(() => {
    const copied = [...displayPokemons];

    return copied.sort((a, b) => {
      if (sortBy === "wins") {
        return (b.win || 0) - (a.win || 0);
      }

      return (b[sortBy] || 0) - (a[sortBy] || 0);
    });
  }, [displayPokemons, sortBy]);

  if (loading) return <p>Ładowanie rankingu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Ranking Pokémonów</h1>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="sortBy">Sortuj według: </label>
        <select
          id="sortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: "8px", marginLeft: "10px" }}
        >
          <option value="base_experience">Doświadczenie</option>
          <option value="weight">Waga</option>
          <option value="height">Wzrost</option>
          <option value="wins">Liczba wygranych</option>
        </select>
      </div>

      <div>
        {sortedPokemons.map((pokemon, index) => (
          <div
            key={pokemon.pokemonId || pokemon.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "12px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <div style={{ width: "40px", fontWeight: "bold" }}>
              {index + 1}.
            </div>

            <img
              src={
                pokemon.sprites?.front_default ||
                pokemon.sprites?.other?.["official-artwork"]?.front_default ||
                pokemon.image
              }
              alt={pokemon.name}
              style={{ width: "60px", height: "60px", objectFit: "contain" }}
            />

            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0 }}>{pokemon.name}</h3>
              <p style={{ margin: "4px 0" }}>
                XP: {pokemon.base_experience} | Waga: {pokemon.weight} | Wzrost:{" "}
                {pokemon.height} | Wygrane: {pokemon.win || 0}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;