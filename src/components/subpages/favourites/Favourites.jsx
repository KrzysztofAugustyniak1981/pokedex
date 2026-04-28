import { useEffect, useState } from "react";
import { getFavorites } from "../../../services/favoriteService";
import PokemonCard from "../../shared/PokemonCard";
import { useAuth } from "../../../context/AuthContext";

const Favourites = () => {
  //pobranie usera
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    //pobieranie ulubionych pokemonów dla danego usera
    const fetchFavorites = async () => {
      if (!user) {
        setFavorites([]);
        return;
      }

      try {
        const data = await getFavorites();

        const userFavorites = data.filter(
          (pokemon) => String(pokemon.userId) === String(user.id)
        );

        setFavorites(userFavorites);
      } catch (error) {
        console.error("Błąd pobierania ulubionych:", error);
        setFavorites([]);
      }
    };

    fetchFavorites();
    //odpalamy przy zmianie usera
  }, [user]);

  if (favorites.length === 0) {
    return <p>Brak ulubionych Pokemonów.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Ulubione</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "10px",
        }}
      >
        {favorites.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};

export default Favourites;