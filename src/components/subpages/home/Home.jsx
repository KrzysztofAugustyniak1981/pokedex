import usePokemons from "../../../hooks/usePokemons";

const Home = () => {
  const { pokemons, loading, error } = usePokemons();
  

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Pokemony</h1>

      {pokemons.slice(0, 10).map((pokemon) => (
        <div key={pokemon.id}>
          <p>{pokemon.name}</p>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        </div>
      ))}
    </div>
  );
};

export default Home;