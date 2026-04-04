import axios from "axios";

const API_URL = "https://pokeapi.co/api/v2/pokemon";

export const getPokemons = async () => {
  const response = await axios.get(`${API_URL}?limit=150`);

  const results = response.data.results;

  // pobranie szczegółów każdego pokemona
  const pokemonDetails = await Promise.all(
    results.map(async (pokemon) => {
      const res = await axios.get(pokemon.url);
      return res.data;
    })
  );

  return pokemonDetails;
};

export const getPokemonById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};