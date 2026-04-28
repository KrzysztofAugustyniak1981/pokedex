//lista pokemonów
const ARENA_KEY = "arena";
//stan walki w arenie
const ARENA_BATTLE_STATE_KEY = "arenaBattleState";


//pobieranie pokemonów w arenie
export const getArena = () => {
  const data = localStorage.getItem(ARENA_KEY);
  return data ? JSON.parse(data) : [];
};

export const setArena = (arena) => {
  localStorage.setItem(ARENA_KEY, JSON.stringify(arena));
};
//pobieranie, ustawianie i czyszczenie stanu walki w arenie
export const getArenaBattleState = () => {
  const data = localStorage.getItem(ARENA_BATTLE_STATE_KEY);
  return data ? JSON.parse(data) : null;
};

export const setArenaBattleState = (battleState) => {
  localStorage.setItem(ARENA_BATTLE_STATE_KEY, JSON.stringify(battleState));
};

export const clearArenaBattleState = () => {
  localStorage.removeItem(ARENA_BATTLE_STATE_KEY);
};

//dodawanie pokemona do areny + usuwanie + czyszczenie areny
export const addToArena = (pokemon) => {
  const arena = getArena();

  if (arena.length >= 2) return arena;

  const exists = arena.find((p) => p.id === pokemon.id);
  if (exists) return arena;

  const updated = [...arena, pokemon];
  setArena(updated);
  return updated;
};

export const removeFromArena = (id) => {
  const updated = getArena().filter((p) => p.id !== id);
  setArena(updated);
  return updated;
};

export const clearArena = () => {
  localStorage.removeItem(ARENA_KEY);
  clearArenaBattleState();
};