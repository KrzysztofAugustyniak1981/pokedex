import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser, getUserByEmail } from "../../../services/authService";
import clsx from "clsx";


//walidacja formularza rejestracji
const registerSchema = z
  .object({
    name: z.string().min(3, "Imię musi mieć co najmniej 3 znaki"),
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
    repeatPassword: z.string().min(1, "Powtórzenie hasła jest wymagane"),
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

  const inputClass = clsx(
    "w-full rounded-xl border px-4 py-3 outline-none transition",
    "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400",
    "focus:border-green-500 focus:ring-2 focus:ring-green-200",
    "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-green-400 dark:focus:ring-green-900"
  );

  //sprawdzanie czy email jest już dodany aby nie było duplikatów wszędzie używamy snackbarów do wyświetlania informacji o błędach lub sukcesie
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
    <div className="px-5 py-8">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          Rejestracja
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="text-left">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Imię
            </label>
            <input
              type="text"
              placeholder="Wpisz imię"
              {...register("name")}
              className={inputClass}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="text-left">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="Wpisz email"
              {...register("email")}
              className={inputClass}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="text-left">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hasło
            </label>
            <input
              type="password"
              placeholder="Wpisz hasło"
              {...register("password")}
              className={inputClass}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="text-left">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Powtórz hasło
            </label>
            <input
              type="password"
              placeholder="Powtórz hasło"
              {...register("repeatPassword")}
              className={inputClass}
            />
            {errors.repeatPassword && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.repeatPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="mt-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Zarejestruj się
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;