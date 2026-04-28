import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext";

const PokemonCard = ({ pokemon }) => {
  //pobranie danych i nawigacja
  const navigate = useNavigate();
  const { user } = useAuth();

  const image =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default ||
    pokemon.image;

  const name = pokemon.name;
  //ujednolicenie id
  const pokemonId = pokemon.pokemonId || pokemon.id;
  //statystyki walki
  const wins = pokemon.win || 0;
  const loses = pokemon.lose || 0;
  const hasBattleStats = wins > 0 || loses > 0;

  return (
    <div
      onClick={() => navigate(`/pokemon/${pokemonId}`)}
      className={clsx(
        "cursor-pointer rounded-2xl border p-4 shadow-sm transition duration-200",
        "border-gray-200 bg-white hover:scale-105 hover:shadow-lg",
        "dark:border-gray-700 dark:bg-gray-900"
      )}
    >
      <h3 className="mb-3 text-center text-lg font-bold text-gray-900 dark:text-gray-100">
        {name?.toUpperCase()}
      </h3>

      <div className="mb-4 flex h-36 items-center justify-center">
        <img
          src={image}
          alt={name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="grid gap-1 text-left text-sm text-gray-700 dark:text-gray-300">
        <p>
          <span className="font-semibold">ID:</span> {pokemonId}
        </p>
        <p>
          <span className="font-semibold">XP:</span> {pokemon.base_experience ?? 0}
        </p>
        <p>
          <span className="font-semibold">Waga:</span> {pokemon.weight ?? 0}
        </p>
        <p>
          <span className="font-semibold">Wzrost:</span> {pokemon.height ?? 0}
        </p>

        {user && hasBattleStats && (
          <>
            <p>
              <span className="font-semibold">Wygrane:</span> {wins}
            </p>
            <p>
              <span className="font-semibold">Przegrane:</span> {loses}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;