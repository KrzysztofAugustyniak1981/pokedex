import { useEffect, useState } from "react";
import { getPokemonById } from "../services/pokemonService";

const usePokemon = (id) => {
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const data = await getPokemonById(id);
                setPokemon(data);
            } catch (err) {
                console.error("Błąd pobierania pokemona 1szt:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPokemon();
    }, [id]);

    return { pokemon, loading };
};

export default usePokemon;