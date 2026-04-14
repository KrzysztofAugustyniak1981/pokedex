import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login(formData.email, formData.password);
            alert("Logowanie udane!");
            navigate("/");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Logowanie</h1>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    maxWidth: "400px",
                    margin: "0 auto",
                }}
            >
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Hasło"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Zaloguj się</button>
            </form>
        </div>
    );
};

export default Login;