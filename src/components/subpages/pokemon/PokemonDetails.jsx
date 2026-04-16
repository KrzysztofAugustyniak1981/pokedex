import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import usePokemon from "../../../hooks/usePokemon";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../../../services/favoriteService";
import { getArena, addToArena } from "../../../services/arenaService";
import {
  getCustomPokemons,
  getCustomPokemonById,
} from "../../../services/customPokemonService";
import { useAuth } from "../../../context/AuthContext";

const PokemonDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const isApiPokemon = !Number.isNaN(Number(id));
  const { pokemon, loading } = usePokemon(isApiPokemon ? id : null);

  const [displayPokemon, setDisplayPokemon] = useState(null);
  const [customLoading, setCustomLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteRecordId, setFavoriteRecordId] = useState(null);
  const [arenaCount, setArenaCount] = useState(0);

  useEffect(() => {
    const loadPokemonData = async () => {
      if (isApiPokemon) {
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
              image:
                edited.image ||
                pokemon.sprites?.other?.["official-artwork"]?.front_default ||
                pokemon.sprites?.front_default,
              win: edited.win ?? 0,
              lose: edited.lose ?? 0,
            });
          } else {
            setDisplayPokemon({
              ...pokemon,
              image:
                pokemon.sprites?.other?.["official-artwork"]?.front_default ||
                pokemon.sprites?.front_default,
              win: pokemon.win ?? 0,
              lose: pokemon.lose ?? 0,
            });
          }
        } catch (error) {
          console.error("Błąd ładowania customPokemons:", error);
          setDisplayPokemon({
            ...pokemon,
            image:
              pokemon.sprites?.other?.["official-artwork"]?.front_default ||
              pokemon.sprites?.front_default,
            win: pokemon.win ?? 0,
            lose: pokemon.lose ?? 0,
          });
        }
      } else {
        setCustomLoading(true);

        try {
          const customPokemon = await getCustomPokemonById(id);

          setDisplayPokemon({
            ...customPokemon,
            image: customPokemon.image,
            types: customPokemon.types || [],
            win: customPokemon.win ?? 0,
            lose: customPokemon.lose ?? 0,
          });
        } catch (error) {
          console.error("Błąd ładowania custom Pokémona:", error);
          setDisplayPokemon(null);
        } finally {
          setCustomLoading(false);
        }
      }
    };

    loadPokemonData();
  }, [id, pokemon, isApiPokemon]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !displayPokemon) return;

      try {
        const favs = await getFavorites();

        const existingFavorite = favs.find(
          (fav) =>
            String(fav.pokemonId) === String(displayPokemon.pokemonId || displayPokemon.id) &&
            String(fav.userId) === String(user.id)
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

    if (user && displayPokemon) {
      checkFavorite();
    } else {
      setIsFavorite(false);
      setFavoriteRecordId(null);
    }
  }, [user, displayPokemon]);

  useEffect(() => {
    const arena = getArena();
    setArenaCount(arena.length);
  }, [id, user]);

  const handleFavorite = async () => {
    if (!displayPokemon || !user) return;

    try {
      const pokemonIdentifier = displayPokemon.pokemonId || displayPokemon.id;

      if (isFavorite && favoriteRecordId) {
        await removeFavorite(favoriteRecordId);
        setIsFavorite(false);
        setFavoriteRecordId(null);
      } else {
        const newFavorite = await addFavorite({
          userId: user.id,
          pokemonId: pokemonIdentifier,
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

    const arenaId = displayPokemon.pokemonId || displayPokemon.id;

    const updated = addToArena({
      id: arenaId,
      sourceId: displayPokemon.id,
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

  if ((isApiPokemon && loading) || (!isApiPokemon && customLoading)) {
    return <p>Ładowanie...</p>;
  }

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

      {displayPokemon.types?.length > 0 && (
        <>
          <h3>Typy:</h3>
          <ul>
            {displayPokemon.types.map((type, index) => (
              <li key={type?.type?.name || index}>
                {type?.type?.name || type}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default PokemonDetails;