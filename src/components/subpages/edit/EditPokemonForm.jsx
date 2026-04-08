import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePokemons from "../../../hooks/usePokemons";
import {
    getCustomPokemons,
    addCustomPokemon,
    updateCustomPokemon,
} from "../../../services/customPokemonService";

const EditPokemonForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { pokemons } = usePokemons();

    const [formData, setFormData] = useState({
        weight: "",
        height: "",
        base_experience: "",
    });

    const [pokemonName, setPokemonName] = useState("");
    const [customRecordId, setCustomRecordId] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const apiPokemon = pokemons.find((p) => p.id === Number(id));
            const customPokemons = await getCustomPokemons();
            const customVersion = customPokemons.find(
                (custom) => custom.pokemonId === Number(id)
            );

            if (apiPokemon) {
                setPokemonName(apiPokemon.name);
                setFormData({
                    weight: customVersion?.weight || apiPokemon.weight,
                    height: customVersion?.height || apiPokemon.height,
                    base_experience:
                        customVersion?.base_experience || apiPokemon.base_experience,
                });
            } else {
                const createdPokemon = customPokemons.find(
                    (custom) => custom.id === Number(id) && !custom.pokemonId
                );

                if (createdPokemon) {
                    setPokemonName(createdPokemon.name);
                    setCustomRecordId(createdPokemon.id);
                    setFormData({
                        weight: createdPokemon.weight,
                        height: createdPokemon.height,
                        base_experience: createdPokemon.base_experience,
                    });
                }
            }

            if (customVersion) {
                setCustomRecordId(customVersion.id);
            }
        };

        if (pokemons.length) {
            loadData();
        }
    }, [id, pokemons]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (customRecordId) {
                const customPokemons = await getCustomPokemons();
                const oldRecord = customPokemons.find((p) => p.id === customRecordId);

                await updateCustomPokemon(customRecordId, {
                    ...oldRecord,
                    weight: Number(formData.weight),
                    height: Number(formData.height),
                    base_experience: Number(formData.base_experience),
                });
            } else {
                await addCustomPokemon({
                    pokemonId: Number(id),
                    name: pokemonName,
                    weight: Number(formData.weight),
                    height: Number(formData.height),
                    base_experience: Number(formData.base_experience),
                });
            }

            navigate("/");
        } catch (error) {
            console.error("Błąd edycji Pokémona:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Edytuj Pokemona: {pokemonName}</h1>

            <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}
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