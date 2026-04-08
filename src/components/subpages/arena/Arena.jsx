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

  // 🔄 pobranie Pokémonów z localStorage
  useEffect(() => {
    const data = getArena();
    setArenaPokemons(data);
  }, []);

  // ❌ usuwanie z areny
  const handleRemove = (id) => {
    const updated = removeFromArena(id);
    setArenaPokemons(updated);
    setWinner(null);
    setLoserId(null);
    setIsDraw(false);
  };

  // ⚔️ WALKA
  const handleFight = () => {
    if (arenaPokemons.length < 2) return;

    const [pokemon1, pokemon2] = arenaPokemons;

    const score1 = pokemon1.base_experience * pokemon1.weight;
    const score2 = pokemon2.base_experience * pokemon2.weight;

    if (score1 > score2) {
      const updatedWinner = {
        ...pokemon1,
        base_experience: pokemon1.base_experience + 10,
        win: (pokemon1.win || 0) + 1,
      };

      const updatedLoser = {
        ...pokemon2,
        lose: (pokemon2.lose || 0) + 1,
      };

      setWinner(updatedWinner);
      setLoserId(pokemon2.id);
      setIsDraw(false);
    } else if (score2 > score1) {
      const updatedWinner = {
        ...pokemon2,
        base_experience: pokemon2.base_experience + 10,
        win: (pokemon2.win || 0) + 1,
      };

      const updatedLoser = {
        ...pokemon1,
        lose: (pokemon1.lose || 0) + 1,
      };

      setWinner(updatedWinner);
      setLoserId(pokemon1.id);
      setIsDraw(false);
    } else {
      setWinner(null);
      setLoserId(null);
      setIsDraw(true);
    }
  };

  // 🚪 reset areny
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

      {/* 🧱 SLOTY */}
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
                opacity:
                  pokemon && loserId === pokemon.id ? 0.4 : 1,
                background:
                  pokemon && winner?.id === pokemon.id
                    ? "#d4edda"
                    : "#fff",
              }}
            >
              {pokemon ? (
                <>
                  {/* ❌ usuń */}
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

      {/* ⚔️ WALCZ */}
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button
          onClick={handleFight}
          disabled={arenaPokemons.length < 2}
          style={{
            padding: "12px 24px",
            fontSize: "18px",
            cursor:
              arenaPokemons.length < 2 ? "not-allowed" : "pointer",
            opacity: arenaPokemons.length < 2 ? 0.5 : 1,
          }}
        >
          WALCZ!
        </button>
      </div>

      {/* 🏆 WYNIK */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {winner && <h2>🏆 Wygrywa: {winner.name}</h2>}
        {isDraw && <h2>🤝 REMIS!</h2>}
      </div>

      {/* 🚪 RESET */}
      {(winner || isDraw) && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button onClick={handleLeaveArena}>
            Opuść arenę
          </button>
        </div>
      )}
    </div>
  );
};

export default Arena;