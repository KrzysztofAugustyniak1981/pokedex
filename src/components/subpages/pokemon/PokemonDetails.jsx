import { useParams } from "react-router-dom";
import usePokemon from "../../../hooks/usePokemon";

const PokemonDetails = () => {
  const { id } = useParams();
  const { pokemon, loading } = usePokemon(id);

  if (loading) return <p>Ładowanie...</p>;
  if (!pokemon) return <p>Brak danych</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{pokemon.name.toUpperCase()}</h1>

      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
      />

      <p>XP: {pokemon.base_experience}</p>
      <p>Waga: {pokemon.weight}</p>
      <p>Wzrost: {pokemon.height}</p>

      <h3>Typy:</h3>
      <ul>
        {pokemon.types.map((type) => (
          <li key={type.type.name}>{type.type.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonDetails;