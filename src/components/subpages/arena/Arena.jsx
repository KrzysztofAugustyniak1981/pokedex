import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  getArena,
  removeFromArena,
  clearArena,
} from "../../../services/arenaService";
import {
  getCustomPokemons,
  addCustomPokemon,
  updateCustomPokemon,
} from "../../../services/customPokemonService";

const Arena = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [arenaPokemons, setArenaPokemons] = useState([]);
  const [winner, setWinner] = useState(null);
  const [loserId, setLoserId] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  useEffect(() => {
    const data = getArena();
    setArenaPokemons(data);
  }, []);

  const handleRemove = (id) => {
    const updated = removeFromArena(id);
    setArenaPokemons(updated);
    setWinner(null);
    setLoserId(null);
    setIsDraw(false);
  };

  const savePokemonStats = async (pokemon) => {
    const customPokemons = await getCustomPokemons();

    const existingPokemon = customPokemons.find(
      (item) => item.pokemonId === pokemon.id
    );

    const pokemonData = {
      name: pokemon.name,
      image: pokemon.image,
      weight: pokemon.weight,
      height: pokemon.height || 0,
      base_experience: pokemon.base_experience,
      win: pokemon.win || 0,
      lose: pokemon.lose || 0,
      pokemonId: pokemon.id,
    };

    if (existingPokemon) {
      await updateCustomPokemon(existingPokemon.id, {
        ...existingPokemon,
        ...pokemonData,
        id: existingPokemon.id,
      });
    } else {
      await addCustomPokemon(pokemonData);
    }
  };

  const handleFight = async () => {
    if (arenaPokemons.length < 2) return;

    const [pokemon1, pokemon2] = arenaPokemons;

    const score1 = pokemon1.base_experience * pokemon1.weight;
    const score2 = pokemon2.base_experience * pokemon2.weight;

    try {
      if (score1 > score2) {
        const updatedWinner = {
          ...pokemon1,
          base_experience: pokemon1.base_experience + 10,
          win: (pokemon1.win || 0) + 1,
          lose: pokemon1.lose || 0,
        };

        const updatedLoser = {
          ...pokemon2,
          win: pokemon2.win || 0,
          lose: (pokemon2.lose || 0) + 1,
        };

        await savePokemonStats(updatedWinner);
        await savePokemonStats(updatedLoser);

        setWinner(updatedWinner);
        setLoserId(pokemon2.id);
        setIsDraw(false);

        enqueueSnackbar(`🏆 Wygrywa ${updatedWinner.name}!`, {
          variant: "success",
        });
      } else if (score2 > score1) {
        const updatedWinner = {
          ...pokemon2,
          base_experience: pokemon2.base_experience + 10,
          win: (pokemon2.win || 0) + 1,
          lose: pokemon2.lose || 0,
        };

        const updatedLoser = {
          ...pokemon1,
          win: pokemon1.win || 0,
          lose: (pokemon1.lose || 0) + 1,
        };

        await savePokemonStats(updatedWinner);
        await savePokemonStats(updatedLoser);

        setWinner(updatedWinner);
        setLoserId(pokemon1.id);
        setIsDraw(false);

        enqueueSnackbar(`🏆 Wygrywa ${updatedWinner.name}!`, {
          variant: "success",
        });
      } else {
        setWinner(null);
        setLoserId(null);
        setIsDraw(true);

        enqueueSnackbar("🤝 Remis! Żaden Pokémon nie otrzymuje punktów.", {
          variant: "info",
        });
      }
    } catch (error) {
      console.error("Błąd podczas walki:", error);

      enqueueSnackbar("Nie udało się zapisać wyniku walki", {
        variant: "error",
      });
    }
  };

  const handleLeaveArena = () => {
    clearArena();
    setArenaPokemons([]);
    setWinner(null);
    setLoserId(null);
    setIsDraw(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Arena</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        {Array.from({ length: 2 }).map((_, index) => {
          const pokemon = arenaPokemons[index];

          return (
            <div
              key={index}
              style={{
                width: "250px",
                minHeight: "350px",
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "16px",
                textAlign: "center",
                opacity: pokemon && loserId === pokemon.id ? 0.4 : 1,
                background:
                  pokemon && winner?.id === pokemon.id ? "#d4edda" : "#fff",
              }}
            >
              {pokemon ? (
                <>
                  <button
                    onClick={() => handleRemove(pokemon.id)}
                    style={{
                      float: "right",
                      cursor: "pointer",
                    }}
                  >
                    ❌
                  </button>

                  <h2>{pokemon.name}</h2>

                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "contain",
                    }}
                  />

                  <p>XP: {pokemon.base_experience}</p>
                  <p>Waga: {pokemon.weight}</p>
                  <p>Wzrost: {pokemon.height}</p>
                  <p>Win: {pokemon.win || 0}</p>
                  <p>Lose: {pokemon.lose || 0}</p>
                </>
              ) : (
                <>
                  <h2>Puste miejsce</h2>
                  <p>Dodaj Pokémona z detali</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button
          onClick={handleFight}
          disabled={arenaPokemons.length < 2}
          style={{
            padding: "12px 24px",
            fontSize: "18px",
            cursor: arenaPokemons.length < 2 ? "not-allowed" : "pointer",
            opacity: arenaPokemons.length < 2 ? 0.5 : 1,
          }}
        >
          WALCZ!
        </button>
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {winner && <h2>🏆 Wygrywa: {winner.name}</h2>}
        {isDraw && <h2>🤝 REMIS!</h2>}
      </div>

      {(winner || isDraw) && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button onClick={handleLeaveArena}>Opuść arenę</button>
        </div>
      )}
    </div>
  );
};

export default Arena;