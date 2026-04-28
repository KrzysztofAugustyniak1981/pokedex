import { useEffect, useState } from "react";
import { getPokemonById } from "../services/pokemonService";

const usePokemon = (id) => {
  //pojedyńczy pokemon
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));

  //pobieranie danych pokemona z API
  useEffect(() => {
    //jeśli nie ma Id to nie pobieramy
    if (!id) {
      setPokemon(null);
      setLoading(false);
      return;
    }

    const fetchPokemon = async () => {
      setLoading(true);

      try {
        const data = await getPokemonById(id);
        setPokemon(data);
      } catch (err) {
        console.error("Błąd pobierania pokemona 1szt:", err);
        setPokemon(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
    //odpalamy tylko przy zmianie ID
  }, [id]);

  return { pokemon, loading };
};

export default usePokemon;