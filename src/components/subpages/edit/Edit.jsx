import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePokemons from "../../../hooks/usePokemons";
import { getCustomPokemons } from "../../../services/customPokemonService";

const Edit = () => {
  const navigate = useNavigate();
  const { pokemons, loading, error } = usePokemons();
  const [mergedPokemons, setMergedPokemons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customPokemons = await getCustomPokemons();

        const mappedApiPokemons = pokemons.map((pokemon) => {
          const customVersion = customPokemons.find(
            (custom) => custom.pokemonId === pokemon.id
          );

          if (customVersion) {
            return {
              ...pokemon,
              base_experience: customVersion.base_experience,
              weight: customVersion.weight,
              height: customVersion.height,
              customRecordId: customVersion.id,
            };
          }

          return pokemon;
        });

        const onlyNewCustomPokemons = customPokemons.filter(
          (custom) => !custom.pokemonId
        );

        setMergedPokemons([...mappedApiPokemons, ...onlyNewCustomPokemons]);
      } catch (err) {
        console.error("Błąd pobierania custom Pokémonów:", err);
      }
    };

    if (pokemons.length) {
      fetchData();
    }
  }, [pokemons]);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Edycja Pokémonów</h1>

      <button
        onClick={() => navigate("/edit/create")}
        style={{
          marginBottom: "20px",
          padding: "10px 16px",
          cursor: "pointer",
        }}
      >
        Stwórz Pokemona
      </button>

      <div>
        {mergedPokemons.map((pokemon, index) => (
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
            </div>

            <button
              onClick={() =>
                navigate(`/edit/${pokemon.pokemonId || pokemon.id}`)
              }
              style={{ padding: "8px 12px", cursor: "pointer" }}
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