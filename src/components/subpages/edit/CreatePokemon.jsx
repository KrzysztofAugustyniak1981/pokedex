import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { addCustomPokemon } from "../../../services/customPokemonService";

const CreatePokemon = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    name: "",
    weight: "",
    height: "",
    base_experience: "",
    image: "",
  });

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
      await addCustomPokemon({
        name: formData.name,
        weight: Number(formData.weight),
        height: Number(formData.height),
        base_experience: Number(formData.base_experience),
        image: formData.image,
        win: 0,
        lose: 0,
      });

      enqueueSnackbar(`Nowy pokemon ${formData.name} został dodany`, {
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
          type="text"
          name="name"
          placeholder="Nazwa"
          value={formData.name}
          onChange={handleChange}
          required
        />

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

        <input
          type="text"
          name="image"
          placeholder="URL grafiki"
          value={formData.image}
          onChange={handleChange}
          required
        />

        <button type="submit">Stwórz</button>
      </form>
    </div>
  );
};

export default CreatePokemon;