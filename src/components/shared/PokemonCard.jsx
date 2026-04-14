import { useNavigate } from "react-router-dom";

const PokemonCard = ({ pokemon }) => {
  const navigate = useNavigate();

  const image =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default ||
    pokemon.image;

  const name = pokemon.name;

  return (
    <div
      onClick={() => navigate(`/pokemon/${pokemon.pokemonId || pokemon.id}`)}
      style={{
        border: "1px solid gray",
        padding: "10px",
        textAlign: "center",
        cursor: "pointer",
        background: "#f5f5f5",
        transition: "transform 0.2s",
        borderRadius: "12px",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <h3>{name}</h3>

      <div
        style={{
          width: "100%",
          height: "120px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={image}
          alt={name}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      <p>XP: {pokemon.base_experience}</p>
      <p>Waga: {pokemon.weight}</p>
    </div>
  );
};

export default PokemonCard;