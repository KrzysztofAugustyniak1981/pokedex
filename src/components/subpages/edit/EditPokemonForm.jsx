import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import usePokemons from "../../../hooks/usePokemons";
import {
  getCustomPokemons,
  addCustomPokemon,
  updateCustomPokemon,
} from "../../../services/customPokemonService";

const editPokemonSchema = z.object({
  weight: z
    .number({ invalid_type_error: "Podaj wagę" })
    .positive("Waga musi być większa od 0"),
  height: z
    .number({ invalid_type_error: "Podaj wzrost" })
    .positive("Wzrost musi być większy od 0"),
  base_experience: z
    .number({ invalid_type_error: "Podaj doświadczenie" })
    .positive("Doświadczenie musi być większe od 0"),
});

const EditPokemonForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { pokemons, loading } = usePokemons();

  const [pokemonName, setPokemonName] = useState("");
  const [recordId, setRecordId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editPokemonSchema),
    defaultValues: {
      weight: "",
      height: "",
      base_experience: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const customPokemons = await getCustomPokemons();

        const apiPokemon = pokemons.find((p) => p.id === Number(id));
        const customForApi = customPokemons.find(
          (p) => p.pokemonId === Number(id)
        );
        const createdPokemon = customPokemons.find(
          (p) => String(p.id) === String(id) && !p.pokemonId
        );

        if (apiPokemon) {
          setPokemonName(apiPokemon.name);
          setRecordId(customForApi?.id || null);

          reset({
            weight: customForApi?.weight ?? apiPokemon.weight,
            height: customForApi?.height ?? apiPokemon.height,
            base_experience:
              customForApi?.base_experience ?? apiPokemon.base_experience,
          });
        } else if (createdPokemon) {
          setPokemonName(createdPokemon.name);
          setRecordId(createdPokemon.id);

          reset({
            weight: createdPokemon.weight,
            height: createdPokemon.height,
            base_experience: createdPokemon.base_experience,
          });
        }
      } catch (err) {
        console.error("Błąd ładowania danych:", err);
        enqueueSnackbar("Nie udało się załadować danych Pokémona", {
          variant: "error",
        });
      }
    };

    if (pokemons.length > 0) {
      loadData();
    }
  }, [id, pokemons, reset, enqueueSnackbar]);

  const inputClass = clsx(
    "w-full rounded-xl border px-4 py-3 outline-none transition",
    "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400",
    "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
    "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-900"
  );

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: pokemonName,
        weight: data.weight,
        height: data.height,
        base_experience: data.base_experience,
      };

      if (recordId) {
        await updateCustomPokemon(recordId, {
          id: recordId,
          ...payload,
          pokemonId: Number(id) || undefined,
        });
      } else {
        await addCustomPokemon({
          ...payload,
          pokemonId: Number(id),
        });
      }

      enqueueSnackbar(`Zmieniono atrybuty ${pokemonName}`, {
        variant: "success",
      });

      navigate("/edit");
    } catch (err) {
      console.error("Błąd zapisu:", err);

      enqueueSnackbar("Nie udało się zapisać zmian", {
        variant: "error",
      });
    }
  };

  if (loading) return <p>Ładowanie formularza...</p>;

  return (
    <div className="px-5 py-8">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          Edytuj Pokemona: {pokemonName}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-left">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Waga
              </label>
              <input
                type="number"
                placeholder="Wpisz wagę"
                {...register("weight", { valueAsNumber: true })}
                className={inputClass}
              />
              {errors.weight && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.weight.message}
                </p>
              )}
            </div>

            <div className="text-left">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Wzrost
              </label>
              <input
                type="number"
                placeholder="Wpisz wzrost"
                {...register("height", { valueAsNumber: true })}
                className={inputClass}
              />
              {errors.height && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.height.message}
                </p>
              )}
            </div>
          </div>

          <div className="text-left">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Doświadczenie
            </label>
            <input
              type="number"
              placeholder="Wpisz doświadczenie"
              {...register("base_experience", { valueAsNumber: true })}
              className={inputClass}
            />
            {errors.base_experience && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.base_experience.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="mt-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Zmień atrybuty
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPokemonForm;