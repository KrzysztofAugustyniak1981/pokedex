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

                // Nadpisanie danych pokemonów z API danymi z json-server
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

                // Nowo stworzone pokemony (bez pokemonId)
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

    if (loading) return <p>Ładowanie edycji...</p>;
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

            <div style={{ marginTop: "20px" }}>
                {displayPokemons.map((pokemon, index) => (
                    <div
                        key={pokemon.pokemonId || pokemon.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "10px 0",
                            borderBottom: "1px solid #ddd",
                        }}
                    >
                        <span style={{ minWidth: "40px" }}>{index + 1}.</span>

                        <img
                            src={
                                pokemon.sprites?.front_default ||
                                pokemon.sprites?.other?.["official-artwork"]?.front_default ||
                                pokemon.image
                            }
                            alt={pokemon.name}
                            style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "contain",
                            }}
                        />

                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "bold" }}>{pokemon.name}</div>
                            <div style={{ fontSize: "14px" }}>
                                XP: {pokemon.base_experience} | Waga: {pokemon.weight} | Wzrost:{" "}
                                {pokemon.height} | Win: {pokemon.win || 0} | Lose:{" "}
                                {pokemon.lose || 0}
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                navigate(`/edit/${pokemon.pokemonId || pokemon.id}`)
                            }
                            style={{
                                padding: "8px 12px",
                                cursor: "pointer",
                            }}
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