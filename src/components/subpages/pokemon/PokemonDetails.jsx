import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import usePokemon from "../../../hooks/usePokemon";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../../../services/favoriteService";

const PokemonDetails = () => {
  const { id } = useParams();
  const { pokemon, loading } = usePokemon(id);

  const [isFavorite, setIsFavorite] = useState(false);

  // 🔍 sprawdzanie czy pokemon jest w ulubionych
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const favs = await getFavorites();
        const exists = favs.find((fav) => fav.id === Number(id));
        setIsFavorite(!!exists);
      } catch (error) {
        console.error("Błąd sprawdzania ulubionych:", error);
      }
    };

    if (id) {
      checkFavorite();
    }
  }, [id]);

  // ❤️ dodawanie/usuwanie
  const handleFavorite = async () => {
    if (!pokemon) return;

    try {
      if (isFavorite) {
        await removeFavorite(Number(id));
        setIsFavorite(false);
      } else {
        await addFavorite({
          id: Number(id),
          name: pokemon.name,
          image: pokemon.sprites.front_default,
          base_experience: pokemon.base_experience,
          weight: pokemon.weight,
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Błąd zapisu ulubionych:", error);
    }
  };

  if (loading) return <p>Ładowanie...</p>;
  if (!pokemon) return <p>Brak danych</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{pokemon.name.toUpperCase()}</h1>

      <img
        src={pokemon.sprites.other["official-artwork"].front_default}
        alt={pokemon.name}
        style={{ width: "200px" }}
      />

      {/* ❤️ ULUBIONE */}
      <button
        onClick={handleFavorite}
        style={{
          marginTop: "20px",
          padding: "10px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        {isFavorite ? "❤️ Usuń z ulubionych" : "🤍 Dodaj do ulubionych"}
      </button>

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