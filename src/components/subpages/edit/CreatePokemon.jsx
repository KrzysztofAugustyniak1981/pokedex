import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addCustomPokemon,
  getCustomPokemons,
} from "../../../services/customPokemonService";

const MIN_IMAGE_ID = 151;
const MAX_IMAGE_ID = 300;

//walidacja formularza(zod)
const createPokemonSchema = z.object({
  name: z.string().min(2, "Nazwa musi mieć co najmniej 2 znaki"),
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

const getPokemonImageUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const CreatePokemon = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [selectedImageId, setSelectedImageId] = useState(MIN_IMAGE_ID);
  const [usedImageIds, setUsedImageIds] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPokemonSchema),
    defaultValues: {
      name: "",
      weight: "",
      height: "",
      base_experience: "",
    },
  });
  //pobieranie grafik
  useEffect(() => {
    const loadUsedImages = async () => {
      try {
        const customPokemons = await getCustomPokemons();

        const ids = customPokemons
          .map((pokemon) => {
            if (!pokemon.image) return null;

            const match = pokemon.image.match(/\/(\d+)\.png$/);
            return match ? Number(match[1]) : null;
          })
          .filter(Boolean);

        setUsedImageIds(ids);
      } catch (error) {
        console.error("Błąd pobierania użytych grafik:", error);
      }
    };

    loadUsedImages();
  }, []);
  //wybieranie grafiki
  const selectedImageUrl = useMemo(() => {
    return getPokemonImageUrl(selectedImageId);
  }, [selectedImageId]);
  //sprawdzanie czy grafika jest użyta
  const isCurrentImageUsed = usedImageIds.includes(selectedImageId);
  //kolejna grafika
  const findNextAvailableImage = (startId, direction) => {
    let nextId = startId;

    while (nextId >= MIN_IMAGE_ID && nextId <= MAX_IMAGE_ID) {
      if (!usedImageIds.includes(nextId)) {
        return nextId;
      }

      nextId += direction;
    }

    return null;
  };

  const handlePrevImage = () => {
    const nextAvailable = findNextAvailableImage(selectedImageId - 1, -1);

    if (nextAvailable === null) {
      enqueueSnackbar("Brak wcześniejszych dostępnych grafik", {
        variant: "warning",
      });
      return;
    }

    setSelectedImageId(nextAvailable);
  };

  const handleNextImage = () => {
    const nextAvailable = findNextAvailableImage(selectedImageId + 1, 1);

    if (nextAvailable === null) {
      enqueueSnackbar("Brak kolejnych dostępnych grafik", {
        variant: "warning",
      });
      return;
    }

    setSelectedImageId(nextAvailable);
  };

  const inputClass = clsx(
    "w-full rounded-xl border px-4 py-3 outline-none transition",
    "border-gray-300 bg-white text-gray-900 placeholder:text-gray-400",
    "focus:border-teal-500 focus:ring-2 focus:ring-teal-200",
    "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-teal-400 dark:focus:ring-teal-900"
  );

  const navButtonClass = clsx(
    "rounded-xl border px-4 py-2 font-semibold transition",
    "border-gray-300 bg-white text-gray-900 hover:bg-gray-100",
    "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
  );

  const onSubmit = async (data) => {
    try {
      //blokowaniu duplikatów grafik
      if (isCurrentImageUsed) {
        enqueueSnackbar("Ta grafika jest już użyta. Wybierz inną.", {
          variant: "error",
        });
        return;
      }

      await addCustomPokemon({
        name: data.name,
        weight: data.weight,
        height: data.height,
        base_experience: data.base_experience,
        image: selectedImageUrl,
        win: 0,
        lose: 0,
      });

      enqueueSnackbar(`Nowy pokemon ${data.name} został dodany`, {
        variant: "success",
      });

      navigate("/edit");
    } catch (error) {
      console.error("Błąd tworzenia Pokémona:", error);

      enqueueSnackbar("Nie udało się stworzyć nowego Pokémona", {
        variant: "error",
      });
    }
  };

  return (
    <div className="px-5 py-8">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          Stwórz Pokemona
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="text-left">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nazwa
            </label>
            <input
              type="text"
              placeholder="Wpisz nazwę"
              {...register("name")}
              className={inputClass}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

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

          <div className="rounded-2xl border border-gray-200 p-5 text-center dark:border-gray-700">
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Wybierz grafikę Pokémona
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Numer grafiki: <span className="font-bold">{selectedImageId}</span>
            </p>

            <div className="my-4 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={handlePrevImage}
                className={navButtonClass}
              >
                ←
              </button>

              <div className="flex h-40 w-40 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                <img
                  src={selectedImageUrl}
                  alt={`Pokemon sprite ${selectedImageId}`}
                  className={clsx(
                    "max-h-full max-w-full object-contain transition",
                    isCurrentImageUsed && "opacity-30"
                  )}
                />
              </div>

              <button
                type="button"
                onClick={handleNextImage}
                className={navButtonClass}
              >
                →
              </button>
            </div>

            {isCurrentImageUsed ? (
              <p className="font-semibold text-red-600 dark:text-red-400">
                Ta grafika jest już użyta
              </p>
            ) : (
              <p className="font-semibold text-green-600 dark:text-green-400">
                Grafika jest dostępna
              </p>
            )}
          </div>

          <button
            type="submit"
            className="mt-2 rounded-xl bg-teal-600 px-4 py-3 font-semibold text-white transition hover:bg-teal-700"
          >
            Stwórz
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePokemon;