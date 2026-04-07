import { useEffect, useState } from "react";
import {
  getArena,
  removeFromArena,
  clearArena,
} from "../../../services/arenaService";

const Arena = () => {
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

  const handleFight = () => {
    if (arenaPokemons.length < 2) return;

    const [pokemon1, pokemon2] = arenaPokemons;

    const score1 = pokemon1.base_experience * pokemon1.weight;
    const score2 = pokemon2.base_experience * pokemon2.weight;

    if (score1 > score2) {
      setWinner(pokemon1);
      setLoserId(pokemon2.id);
      setIsDraw(false);
    } else if (score2 > score1) {
      setWinner(pokemon2);
      setLoserId(pokemon1.id);
      setIsDraw(false);
    } else {
      setWinner(null);
      setLoserId(null);
      setIsDraw(true);
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
          alignItems: "center",
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
              }}
            >
              {pokemon ? (
                <>
                  <button
                    onClick={() => handleRemove(pokemon.id)}
                    style={{ float: "right", cursor: "pointer" }}
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
                </>
              ) : (
                <>
                  <h2>Puste miejsce</h2>
                  <p>Dodaj Pokémona z widoku szczegółów</p>
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
        {winner && <h2>Wygrywa: {winner.name}</h2>}
        {isDraw && <h2>REMIS!</h2>}
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