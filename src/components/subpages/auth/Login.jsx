import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../context/AuthContext";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email jest wymagany")
    .email("Podaj poprawny adres email"),
  password: z
    .string()
    .min(1, "Hasło jest wymagane"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);

      enqueueSnackbar("Zalogowano pomyślnie!", {
        variant: "success",
      });

      navigate("/");
    } catch (error) {
      enqueueSnackbar(error.message || "Błąd logowania", {
        variant: "error",
      });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Logowanie</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div style={{ textAlign: "left" }}>
          <input
            type="password"
            placeholder="Hasło"
            {...register("password")}
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
          />
          {errors.password && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {errors.password.message}
            </p>
          )}
        </div>

        <button type="submit">Zaloguj się</button>
      </form>
    </div>
  );
};

export default Login;