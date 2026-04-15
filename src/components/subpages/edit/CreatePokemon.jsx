import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCustomPokemon } from "../../../services/customPokemonService";

const createPokemonSchema = z.object({
  name: z
    .string()
    .min(2, "Nazwa musi mieć co najmniej 2 znaki"),

  weight: z
    .number({ invalid_type_error: "Podaj wagę" })
    .positive("Waga musi być większa od 0"),

  height: z
    .number({ invalid_type_error: "Podaj wzrost" })
    .positive("Wzrost musi być większy od 0"),

  base_experience: z
    .number({ invalid_type_error: "Podaj doświadczenie" })
    .positive("Doświadczenie musi być większe od 0"),

  image: z
    .string()
    .url("Podaj poprawny URL grafiki"),
});

const CreatePokemon = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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
      image: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await addCustomPokemon({
        name: data.name,
        weight: data.weight,
        height: data.height,
        base_experience: data.base_experience,
        image: data.image,
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
        {/* NAME */}
        <div style={{ textAlign: "left" }}>
          <input
            type="text"
            placeholder="Nazwa"
            {...register("name")}
            style={{ width: "100%", padding: "10px" }}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
        </div>

        {/* WEIGHT */}
        <div style={{ textAlign: "left" }}>
          <input
            type="number"
            placeholder="Waga"
            {...register("weight", { valueAsNumber: true })}
            style={{ width: "100%", padding: "10px" }}
          />
          {errors.weight && (
            <p style={{ color: "red" }}>{errors.weight.message}</p>
          )}
        </div>

        {/* HEIGHT */}
        <div style={{ textAlign: "left" }}>
          <input
            type="number"
            placeholder="Wzrost"
            {...register("height", { valueAsNumber: true })}
            style={{ width: "100%", padding: "10px" }}
          />
          {errors.height && (
            <p style={{ color: "red" }}>{errors.height.message}</p>
          )}
        </div>

        {/* XP */}
        <div style={{ textAlign: "left" }}>
          <input
            type="number"
            placeholder="Doświadczenie"
            {...register("base_experience", { valueAsNumber: true })}
            style={{ width: "100%", padding: "10px" }}
          />
          {errors.base_experience && (
            <p style={{ color: "red" }}>
              {errors.base_experience.message}
            </p>
          )}
        </div>

        {/* IMAGE */}
        <div style={{ textAlign: "left" }}>
          <input
            type="text"
            placeholder="URL grafiki"
            {...register("image")}
            style={{ width: "100%", padding: "10px" }}
          />
          {errors.image && (
            <p style={{ color: "red" }}>{errors.image.message}</p>
          )}
        </div>

        <button type="submit">Stwórz</button>
      </form>
    </div>
  );
};

export default CreatePokemon;