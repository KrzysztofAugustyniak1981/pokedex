import axios from 'axios';

const API_URL = 'http://localhost:3001/favorites';

export const getFavorites = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

export const addFavorite = async (pokemon) => {
    const res = await axios.post(API_URL, pokemon);
    return res.data;
};

export const removeFavorite = async (favoriteId) => {
    await axios.delete(`${API_URL}/${favoriteId}`);
};