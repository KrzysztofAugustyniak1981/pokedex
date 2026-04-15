import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { registerUser, getUserByEmail } from "../../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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
      const existingUser = await getUserByEmail(formData.email);

      if (existingUser) {
        enqueueSnackbar("Użytkownik o tym emailu już istnieje", {
          variant: "error",
        });
        return;
      }

      if (formData.password !== formData.repeatPassword) {
        enqueueSnackbar("Hasła się nie zgadzają", {
          variant: "error",
        });
        return;
      }

      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      enqueueSnackbar("Rejestracja udana!", {
        variant: "success",
      });

      navigate("/login");
    } catch (error) {
      console.error("Błąd rejestracji:", error);

      enqueueSnackbar("Wystąpił błąd podczas rejestracji", {
        variant: "error",
      });
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