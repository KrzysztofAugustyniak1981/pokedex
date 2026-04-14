import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, getUserByEmail } from "../../../services/authService";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
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
      // sprawdzamy czy user już istnieje
      const existingUser = await getUserByEmail(formData.email);

      if (existingUser) {
        alert("Użytkownik o tym emailu już istnieje");
        return;
      }

      // sprawdzamy hasła
      if (formData.password !== formData.repeatPassword) {
        alert("Hasła się nie zgadzają");
        return;
      }

      // zapis do bazy
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      alert("Rejestracja udana!");

      navigate("/login");
    } catch (error) {
      console.error("Błąd rejestracji:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Rejestracja</h1>

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
          type="text"
          name="name"
          placeholder="Imię"
          value={formData.name}
          onChange={handleChange}
          required
        />

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

        <input
          type="password"
          name="repeatPassword"
          placeholder="Powtórz hasło"
          value={formData.repeatPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Zarejestruj się</button>
      </form>
    </div>
  );
};

export default Register;