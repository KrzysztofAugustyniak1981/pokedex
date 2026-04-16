import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const selectedImageUrl = useMemo(() => {
    return getPokemonImageUrl(selectedImageId);
  }, [selectedImageId]);

  const isCurrentImageUsed = usedImageIds.includes(selectedImageId);

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

  const onSubmit = async (data) => {
    try {
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
    <div style={{ padding: "20px" }}>
      <h1>Stwórz Pokemona</h1>

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
            placeholder="Nazwa"
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
            type="number"
            placeholder="Waga"
            {...register("weight", { valueAsNumber: true })}
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
          />
          {errors.weight && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {errors.weight.message}
            </p>
          )}
        </div>

        <div style={{ textAlign: "left" }}>
          <input
            type="number"
            placeholder="Wzrost"
            {...register("height", { valueAsNumber: true })}
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
          />
          {errors.height && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {errors.height.message}
            </p>
          )}
        </div>

        <div style={{ textAlign: "left" }}>
          <input
            type="number"
            placeholder="Doświadczenie"
            {...register("base_experience", { valueAsNumber: true })}
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
          />
          {errors.base_experience && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
              {errors.base_experience.message}
            </p>
          )}
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center",
          }}
        >
          <h3>Wybierz grafikę Pokémona</h3>

          <p>Numer grafiki: {selectedImageId}</p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              marginTop: "12px",
              marginBottom: "12px",
            }}
          >
            <button
              type="button"
              onClick={handlePrevImage}
              style={{ padding: "8px 14px", cursor: "pointer" }}
            >
              ←
            </button>

            <div>
              <img
                src={selectedImageUrl}
                alt={`Pokemon sprite ${selectedImageId}`}
                style={{
                  width: "140px",
                  height: "140px",
                  objectFit: "contain",
                  opacity: isCurrentImageUsed ? 0.35 : 1,
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleNextImage}
              style={{ padding: "8px 14px", cursor: "pointer" }}
            >
              →
            </button>
          </div>

          {isCurrentImageUsed ? (
            <p style={{ color: "red", fontWeight: "bold" }}>
              Ta grafika jest już użyta
            </p>
          ) : (
            <p style={{ color: "green", fontWeight: "bold" }}>
              Grafika jest dostępna
            </p>
          )}
        </div>

        <button type="submit">Stwórz</button>
      </form>
    </div>
  );
};

export default CreatePokemon;