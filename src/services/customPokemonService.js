import axios from "axios";

const API_URL = "http://localhost:3001/customPokemons";

//pobieranie customowych pokemonów
export const getCustomPokemons = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};
//pobieranie customowego pokemona po ID jednego
export const getCustomPokemonById = async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
};
//dodawanie nowego customowego pokemona
export const addCustomPokemon = async (pokemon) => {
    const res = await axios.post(API_URL, pokemon);
    return res.data;
};
//aktualizowanie customowego pokemona
export const updateCustomPokemon = async (id, updatedPokemon) => {
    const res = await axios.put(`${API_URL}/${id}`, updatedPokemon);
    return res.data;
};