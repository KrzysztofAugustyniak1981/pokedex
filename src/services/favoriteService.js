import axios from 'axios';

const API_URL = 'http://localhost:3001/favorites';
//pobieranie ulubionych pokemonów
export const getFavorites = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};
//dodawanie pokemona do ulubionych
export const addFavorite = async (pokemon) => {
    const res = await axios.post(API_URL, pokemon);
    return res.data;
};
//usuwanie pokemona z ulubionych
export const removeFavorite = async (favoriteId) => {
    await axios.delete(`${API_URL}/${favoriteId}`);
};