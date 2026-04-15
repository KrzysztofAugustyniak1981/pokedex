import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
    <div style={{ padding: "20px" }}>
      <h1>Edytuj Pokemona: {pokemonName}</h1>

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

        <button type="submit">Zmień atrybuty</button>
      </form>
    </div>
  );
};

export default EditPokemonForm;