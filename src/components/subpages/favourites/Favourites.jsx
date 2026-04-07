import { useEffect, useState } from "react";
import { getFavorites } from "../../../services/favoriteService";
import PokemonCard from "../../shared/PokemonCard";

const Favourites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const data = await getFavorites();
            console.log("FAVS:", data);
            setFavorites(data);
        };

        fetchFavorites();
    }, []);

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