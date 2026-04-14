import { createContext, useContext, useEffect, useState } from "react";
import { getUserByEmail } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // 🔁 odczyt usera z localStorage przy starcie
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // 🔐 login
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

    // 🚪 logout
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// custom hook (żeby łatwiej używać)
export const useAuth = () => {
    return useContext(AuthContext);
};