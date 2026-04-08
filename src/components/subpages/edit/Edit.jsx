import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePokemons from "../../../hooks/usePokemons";
import { getCustomPokemons } from "../../../services/customPokemonService";

const Edit = () => {
  const navigate = useNavigate();
  const { pokemons, loading, error } = usePokemons();
  const [displayPokemons, setDisplayPokemons] = useState([]);

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
            };
          }

          return pokemon;
        });

        setDisplayPokemons(merged);
      } catch (err) {
        console.error("Błąd ładowania edytowanych Pokémonów:", err);
      }
    };

    if (pokemons.length > 0) {
      loadMergedPokemons();
    }
  }, [pokemons]);

  if (loading) return <p>Ładowanie edycji...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edycja Pokémonów</h1>

      <button onClick={() => navigate("/edit/create")}>
        Stwórz Pokemona
      </button>

      <div style={{ marginTop: "20px" }}>
        {displayPokemons.map((pokemon, index) => (
          <div key={pokemon.id} style={{ marginBottom: "10px" }}>
            <span>
              {index + 1}. {pokemon.name} | XP: {pokemon.base_experience} | Waga:{" "}
              {pokemon.weight} | Wzrost: {pokemon.height}
            </span>

            <button
              onClick={() => navigate(`/edit/${pokemon.id}`)}
              style={{ marginLeft: "10px" }}
            >
              Edytuj
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Edit;