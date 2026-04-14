import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { useAuth } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const themeContext = useContext(ThemeContext);

  const theme = themeContext?.theme || "light";
  const toggleTheme = themeContext?.toggleTheme;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        borderBottom: "1px solid #ddd",
        flexWrap: "wrap",
        gap: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          Pokedex
        </Link>

        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <span>Zalogowany: {user.name}</span>

            <button
              onClick={toggleTheme}
              disabled={!toggleTheme}
              style={{ cursor: toggleTheme ? "pointer" : "not-allowed" }}
            >
              Motyw: {theme === "light" ? "🌞 Light" : "🌙 Dark"}
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/favorites">Ulubione</Link>
            <Link to="/arena">Arena</Link>
            <Link to="/ranking">Ranking</Link>
            <Link to="/edit">Edytuj</Link>
            <button onClick={handleLogout}>Wyloguj</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;