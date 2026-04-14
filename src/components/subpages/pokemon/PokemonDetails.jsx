import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import usePokemon from "../../../hooks/usePokemon";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../../../services/favoriteService";
import { getArena, addToArena } from "../../../services/arenaService";
import { getCustomPokemons } from "../../../services/customPokemonService";
import { useAuth } from "../../../context/AuthContext";

const PokemonDetails = () => {
  const { id } = useParams();
  const { pokemon, loading } = usePokemon(id);
  const { user } = useAuth();

  const [displayPokemon, setDisplayPokemon] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteRecordId, setFavoriteRecordId] = useState(null);
  const [arenaCount, setArenaCount] = useState(0);

  useEffect(() => {
    const loadMergedPokemon = async () => {
      if (!pokemon) return;

      try {
        const customPokemons = await getCustomPokemons();
        const edited = customPokemons.find(
          (custom) => custom.pokemonId === Number(id)
        );

        if (edited) {
          setDisplayPokemon({
            ...pokemon,
            weight: edited.weight,
            height: edited.height,
            base_experience: edited.base_experience,
            win: edited.win ?? 0,
            lose: edited.lose ?? 0,
          });
        } else {
          setDisplayPokemon({
            ...pokemon,
            win: pokemon.win ?? 0,
            lose: pokemon.lose ?? 0,
          });
        }
      } catch (error) {
        console.error("Błąd ładowania customPokemons:", error);
        setDisplayPokemon({
          ...pokemon,
          win: pokemon.win ?? 0,
          lose: pokemon.lose ?? 0,
        });
      }
    };

    loadMergedPokemon();
  }, [pokemon, id]);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const favs = await getFavorites();
        const existingFavorite = favs.find(
          (fav) => fav.pokemonId === Number(id)
        );

        if (existingFavorite) {
          setIsFavorite(true);
          setFavoriteRecordId(existingFavorite.id);
        } else {
          setIsFavorite(false);
          setFavoriteRecordId(null);
        }
      } catch (error) {
        console.error("Błąd sprawdzania ulubionych:", error);
      }
    };

    if (id && user) {
      checkFavorite();
    } else {
      setIsFavorite(false);
      setFavoriteRecordId(null);
    }
  }, [id, user]);

  useEffect(() => {
    const arena = getArena();
    setArenaCount(arena.length);
  }, [id, user]);

  const handleFavorite = async () => {
    if (!displayPokemon || !user) return;

    try {
      if (isFavorite && favoriteRecordId) {
        await removeFavorite(favoriteRecordId);
        setIsFavorite(false);
        setFavoriteRecordId(null);
      } else {
        const newFavorite = await addFavorite({
          pokemonId: Number(id),
          name: displayPokemon.name,
          image:
            displayPokemon.sprites?.other?.["official-artwork"]?.front_default ||
            displayPokemon.sprites?.front_default ||
            displayPokemon.image,
          base_experience: displayPokemon.base_experience,
          weight: displayPokemon.weight,
        });

        setIsFavorite(true);
        setFavoriteRecordId(newFavorite.id);
      }
    } catch (error) {
      console.error("Błąd zapisu ulubionych:", error);
    }
  };

  const handleAddToArena = () => {
    if (!displayPokemon || !user) return;

    const updated = addToArena({
      id: displayPokemon.id,
      name: displayPokemon.name,
      image:
        displayPokemon.sprites?.other?.["official-artwork"]?.front_default ||
        displayPokemon.sprites?.front_default ||
        displayPokemon.image,
      base_experience: displayPokemon.base_experience,
      weight: displayPokemon.weight,
      height: displayPokemon.height,
      win: displayPokemon.win,
      lose: displayPokemon.lose,
    });

    setArenaCount(updated.length);
  };

  if (loading) return <p>Ładowanie...</p>;
  if (!displayPokemon) return <p>Brak danych</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{displayPokemon.name.toUpperCase()}</h1>

      <img
        src={
          displayPokemon.sprites?.other?.["official-artwork"]?.front_default ||
          displayPokemon.sprites?.front_default ||
          displayPokemon.image
        }
        alt={displayPokemon.name}
        style={{ width: "200px" }}
      />

      {user && (
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            onClick={handleFavorite}
            style={{
              padding: "10px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            {isFavorite ? "❤️ Usuń z ulubionych" : "🤍 Dodaj do ulubionych"}
          </button>

          <button
            onClick={handleAddToArena}
            disabled={arenaCount >= 2}
            style={{
              padding: "10px",
              fontSize: "16px",
              cursor: arenaCount >= 2 ? "not-allowed" : "pointer",
              opacity: arenaCount >= 2 ? 0.6 : 1,
            }}
          >
            ⚔️ Dodaj do areny ({arenaCount}/2)
          </button>
        </div>
      )}

      <p>XP: {displayPokemon.base_experience}</p>
      <p>Waga: {displayPokemon.weight}</p>
      <p>Wzrost: {displayPokemon.height}</p>
      <p>Wygrane: {displayPokemon.win || 0}</p>
      <p>Przegrane: {displayPokemon.lose || 0}</p>

      <h3>Typy:</h3>
      <ul>
        {displayPokemon.types?.map((type) => (
          <li key={type.type.name}>{type.type.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PokemonDetails;