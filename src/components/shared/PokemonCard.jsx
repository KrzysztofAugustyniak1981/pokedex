import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PokemonCard = ({ pokemon }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const image =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default ||
    pokemon.image;

  const name = pokemon.name;
  const pokemonId = pokemon.pokemonId || pokemon.id;
  const wins = pokemon.win || 0;
  const loses = pokemon.lose || 0;
  const hasBattleStats = wins > 0 || loses > 0;

  return (
    <div
      onClick={() => navigate(`/pokemon/${pokemonId}`)}
      style={{
        border: "1px solid var(--border)",
        padding: "12px",
        textAlign: "center",
        cursor: "pointer",
        background: "var(--bg)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        borderRadius: "12px",
        boxShadow: "var(--shadow)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "10px" }}>
        {name?.toUpperCase()}
      </h3>

      <div
        style={{
          width: "100%",
          height: "140px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
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

      <div
        style={{
          display: "grid",
          gap: "6px",
          fontSize: "14px",
          textAlign: "left",
        }}
      >
        <p>ID: {pokemonId}</p>
        <p>XP: {pokemon.base_experience ?? 0}</p>
        <p>Waga: {pokemon.weight ?? 0}</p>
        <p>Wzrost: {pokemon.height ?? 0}</p>

        {user && hasBattleStats && (
          <>
            <p>Wygrane: {wins}</p>
            <p>Przegrane: {loses}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;