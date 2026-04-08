import { useMemo, useState } from "react";
import usePokemons from "../../../hooks/usePokemons";

const Ranking = () => {
  const { pokemons, loading, error } = usePokemons();
  const [sortBy, setSortBy] = useState("base_experience");

  const sortedPokemons = useMemo(() => {
    const copied = [...pokemons];

    return copied.sort((a, b) => {
      if (sortBy === "wins") {
        return (b.win || 0) - (a.win || 0);
      }

      return (b[sortBy] || 0) - (a[sortBy] || 0);
    });
  }, [pokemons, sortBy]);

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
            key={pokemon.id}
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