import { useNavigate } from "react-router-dom";

const PokemonCard = ({ pokemon }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/pokemon/${pokemon.id}`);
      }}
      style={{
        border: "1px solid gray",
        padding: "10px",
        textAlign: "center",
        cursor: "pointer",
        background: "#f5f5f5",
      }}
    >
      <h3>{pokemon.name}</h3>

      <img
        src={pokemon.sprites?.front_default || pokemon.image}
        alt={pokemon.name}
      />

      <p>XP: {pokemon.base_experience}</p>
      <p>Waga: {pokemon.weight}</p>
    </div>
  );
};

export default PokemonCard;