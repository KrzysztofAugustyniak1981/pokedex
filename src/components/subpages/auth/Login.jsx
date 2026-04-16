import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../context/AuthContext";
import clsx from "clsx";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email jest wymagany")
    .email("Podaj poprawny adres email"),
  password: z.string().min(1, "Hasło jest wymagane"),
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

  const inputClass = clsx(
    "w-full rounded-xl border px-4 py-3 outline-none transition",
    "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400",
    "focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
    "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-900"
  );

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
    <div className="px-5 py-8">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          Logowanie
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

          <button
            type="submit"
            className="mt-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Zaloguj się
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;