import axios from "axios";

const API_URL = "http://localhost:3001/users";


//Pobieranie wszystkich użytkowników
export const getUsers = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

//Pobieranie użytkownika po emailu
export const getUserByEmail = async (email) => {
  const res = await axios.get(`${API_URL}?email=${email}`);
  return res.data[0] || null;
};

//Rejestracja nowego użytkownika
export const registerUser = async (userData) => {
  const res = await axios.post(API_URL, userData);
  return res.data;
};