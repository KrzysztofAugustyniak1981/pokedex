import { useEffect, useState } from "react";
import { getPokemons } from "../services/pokemonService";

const usePokemons = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPokemons();
        setPokemons(data);
      } catch (err) {
        setError("Błąd pobierania Pokémonów");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { pokemons, loading, error };
};

export default usePokemons;