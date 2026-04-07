export const getArena = () => {
  const data = localStorage.getItem("arena");
  return data ? JSON.parse(data) : [];
};

export const addToArena = (pokemon) => {
  const arena = getArena();

  if (arena.length >= 2) return arena;

  const exists = arena.find((p) => p.id === pokemon.id);
  if (exists) return arena;

  const updated = [...arena, pokemon];
  localStorage.setItem("arena", JSON.stringify(updated));
  return updated;
};

export const removeFromArena = (id) => {
  const updated = getArena().filter((p) => p.id !== id);
  localStorage.setItem("arena", JSON.stringify(updated));
  return updated;
};

export const clearArena = () => {
  localStorage.removeItem("arena");
};