import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  getArena,
  setArena,
  removeFromArena,
  clearArena,
  getArenaBattleState,
  setArenaBattleState,
  clearArenaBattleState,
} from "../../../services/arenaService";
import {
  getCustomPokemons,
  addCustomPokemon,
  updateCustomPokemon,
} from "../../../services/customPokemonService";

const Arena = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [arenaPokemons, setArenaPokemons] = useState([]);
  const [winnerName, setWinnerName] = useState("");
  const [loserId, setLoserId] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [battleFinished, setBattleFinished] = useState(false);

  useEffect(() => {
    //ładowanie pokemonów z areny i stanu walki
    const arenaData = getArena();
    setArenaPokemons(arenaData);

    const savedBattleState = getArenaBattleState();
    if (savedBattleState) {
      setWinnerName(savedBattleState.winnerName || "");
      setLoserId(savedBattleState.loserId || null);
      setIsDraw(savedBattleState.isDraw || false);
      setBattleFinished(savedBattleState.battleFinished || false);
    }
  }, []);
  //resetowanie stanu walki
  const resetBattleState = () => {
    setWinnerName("");
    setLoserId(null);
    setIsDraw(false);
    setBattleFinished(false);
    clearArenaBattleState();
  };
  //usuwanie pokemona i wyniku z areny
  const handleRemove = (id) => {
    const updated = removeFromArena(id);
    setArenaPokemons(updated);
    resetBattleState();
  };

  //zapisywanie statystyk
  const savePokemonStats = async (pokemon) => {
  const customPokemons = await getCustomPokemons();

  if (pokemon.isCustom) {
    const existingCustomPokemon = customPokemons.find(
      (item) => String(item.id) === String(pokemon.sourceId)
    );

    if (!existingCustomPokemon) return;

    await updateCustomPokemon(existingCustomPokemon.id, {
      ...existingCustomPokemon,
      weight: pokemon.weight,
      height: pokemon.height || 0,
      base_experience: pokemon.base_experience,
      win: pokemon.win || 0,
      lose: pokemon.lose || 0,
      image: pokemon.image,
      name: pokemon.name,
    });

    return;
  }

  const existingPokemon = customPokemons.find(
    (item) => Number(item.pokemonId) === Number(pokemon.pokemonId)
  );

  const pokemonData = {
    name: pokemon.name,
    image: pokemon.image,
    weight: pokemon.weight,
    height: pokemon.height || 0,
    base_experience: pokemon.base_experience,
    win: pokemon.win || 0,
    lose: pokemon.lose || 0,
    pokemonId: pokemon.pokemonId,
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
  //logika walki, aktualizacja statystyk, obsługa wyników
  const handleFight = async () => {
    if (arenaPokemons.length < 2 || battleFinished) return;

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

        const updatedArena = [updatedWinner, updatedLoser];

        setArenaPokemons(updatedArena);
        setArena(updatedArena);

        setWinnerName(updatedWinner.name);
        setLoserId(updatedLoser.id);
        setIsDraw(false);
        setBattleFinished(true);

        setArenaBattleState({
          winnerName: updatedWinner.name,
          loserId: updatedLoser.id,
          isDraw: false,
          battleFinished: true,
        });

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

        const updatedArena = [pokemon1, pokemon2].map((pokemon) =>
          pokemon.id === updatedWinner.id ? updatedWinner : updatedLoser
        );

        setArenaPokemons(updatedArena);
        setArena(updatedArena);

        setWinnerName(updatedWinner.name);
        setLoserId(updatedLoser.id);
        setIsDraw(false);
        setBattleFinished(true);

        setArenaBattleState({
          winnerName: updatedWinner.name,
          loserId: updatedLoser.id,
          isDraw: false,
          battleFinished: true,
        });

        enqueueSnackbar(`🏆 Wygrywa ${updatedWinner.name}!`, {
          variant: "success",
        });
      } else {
        setWinnerName("");
        setLoserId(null);
        setIsDraw(true);
        setBattleFinished(true);

        setArenaBattleState({
          winnerName: "",
          loserId: null,
          isDraw: true,
          battleFinished: true,
        });

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
    resetBattleState();
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
                  pokemon && winnerName === pokemon.name ? "#d4edda" : "#fff",
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
          disabled={arenaPokemons.length < 2 || battleFinished}
          style={{
            padding: "12px 24px",
            fontSize: "18px",
            cursor:
              arenaPokemons.length < 2 || battleFinished
                ? "not-allowed"
                : "pointer",
            opacity: arenaPokemons.length < 2 || battleFinished ? 0.5 : 1,
          }}
        >
          WALCZ!
        </button>
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {!!winnerName && <h2>🏆 Wygrywa: {winnerName}</h2>}
        {isDraw && <h2>🤝 REMIS!</h2>}
      </div>

      {battleFinished && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button onClick={handleLeaveArena}>Opuść arenę</button>
        </div>
      )}
    </div>
  );
};

export default Arena;