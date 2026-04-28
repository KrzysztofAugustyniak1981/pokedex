import { createContext, useContext, useState } from "react";
import { getUserByEmail } from "../services/authService";

//globalny kontekst dla autoryzacji
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email, password) => {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      throw new Error("Użytkownik nie istnieje");
    }

    if (existingUser.password !== password) {
      throw new Error("Nieprawidłowe hasło");
    }

    setUser(existingUser);
    localStorage.setItem("user", JSON.stringify(existingUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("arena");
  };

  //udostępniamy usera i funkcje logowania/wylogowania globalnie
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};