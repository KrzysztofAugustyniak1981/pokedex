import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import usePokemons from "../../../hooks/usePokemons";
import {
  getCustomPokemons,
  addCustomPokemon,
  updateCustomPokemon,
} from "../../../services/customPokemonService";

const EditPokemonForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { pokemons, loading } = usePokemons();

  const [pokemonName, setPokemonName] = useState("");
  const [recordId, setRecordId] = useState(null);

  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    base_experience: "",
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
          (p) => p.id === id && !p.pokemonId
        );

        if (apiPokemon) {
          setPokemonName(apiPokemon.name);
          setRecordId(customForApi?.id || null);

          setFormData({
            weight: customForApi?.weight ?? apiPokemon.weight,
            height: customForApi?.height ?? apiPokemon.height,
            base_experience:
              customForApi?.base_experience ?? apiPokemon.base_experience,
          });
        } else if (createdPokemon) {
          setPokemonName(createdPokemon.name);
          setRecordId(createdPokemon.id);

          setFormData({
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
  }, [id, pokemons, enqueueSnackbar]);

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
      const payload = {
        name: pokemonName,
        weight: Number(formData.weight),
        height: Number(formData.height),
        base_experience: Number(formData.base_experience),
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
          type="number"
          name="weight"
          placeholder="Waga"
          value={formData.weight}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="height"
          placeholder="Wzrost"
          value={formData.height}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="base_experience"
          placeholder="Doświadczenie"
          value={formData.base_experience}
          onChange={handleChange}
          required
        />

        <button type="submit">Zmień atrybuty</button>
      </form>
    </div>
  );
};

export default EditPokemonForm;