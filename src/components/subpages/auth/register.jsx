import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser, getUserByEmail } from "../../../services/authService";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Imię musi mieć co najmniej 3 znaki"),
    email: z
      .string()
      .min(1, "Email jest wymagany")
      .email("Podaj poprawny adres email"),
    password: z
      .string()
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .regex(/[A-Z]/, "Hasło musi zawierać co najmniej 1 dużą literę")
      .regex(/[0-9]/, "Hasło musi zawierać co najmniej 1 cyfrę")
      .regex(/[^A-Za-z0-9]/, "Hasło musi zawierać co najmniej 1 znak specjalny"),
    repeatPassword: z
      .string()
      .min(1, "Powtórzenie hasła jest wymagane"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Hasła się nie zgadzają",
    path: ["repeatPassword"],
  });

const Register = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const existingUser = await getUserByEmail(data.email);

      if (existingUser) {
        enqueueSnackbar("Użytkownik o tym emailu już istnieje", {
          variant: "error",
        });
        return;
      }

      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
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
            type="text"
            placeholder="Imię"
            {...register("name")}
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
          />
          {errors.name && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {errors.name.message}
            </p>
          )}
        </div>

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

        <div style={{ textAlign: "left" }}>
          <input
            type="password"
            placeholder="Powtórz hasło"
            {...register("repeatPassword")}
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
          />
          {errors.repeatPassword && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {errors.repeatPassword.message}
            </p>
          )}
        </div>

        <button type="submit">Zarejestruj się</button>
      </form>
    </div>
  );
};

export default Register;