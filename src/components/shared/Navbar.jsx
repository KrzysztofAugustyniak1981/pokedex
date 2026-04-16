import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import clsx from "clsx";
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

  const linkClass = clsx(
    "rounded-lg px-3 py-2 text-sm font-medium transition hover:opacity-80",
    "border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
  );

  const buttonClass = clsx(
    "rounded-lg px-3 py-2 text-sm font-medium transition",
    "border border-gray-300 dark:border-gray-600",
    "hover:bg-gray-100 dark:hover:bg-gray-800"
  );

  return (
    <nav className="flex flex-col gap-4 border-b border-gray-300 px-5 py-5 md:flex-row md:items-center md:justify-between dark:border-gray-700">
      <div className="flex flex-col gap-3">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
        >
          Pokedex
        </Link>

        {user && (
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
            <span className="rounded-md bg-gray-100 px-3 py-1 dark:bg-gray-800">
              Zalogowany: {user.name}
            </span>

            <button
              onClick={toggleTheme}
              disabled={!toggleTheme}
              className={clsx(
                buttonClass,
                !toggleTheme && "cursor-not-allowed opacity-50"
              )}
            >
              Motyw: {theme === "light" ? "🌞 Light" : "🌙 Dark"}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {!user ? (
          <>
            <Link
              to="/login"
              className={clsx(
                linkClass,
                "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              Login
            </Link>

            <Link
              to="/register"
              className={clsx(
                linkClass,
                "bg-green-600 text-white hover:bg-green-700"
              )}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/favorites"
              className={clsx(
                linkClass,
                "bg-pink-600 text-white hover:bg-pink-700"
              )}
            >
              Ulubione
            </Link>

            <Link
              to="/arena"
              className={clsx(
                linkClass,
                "bg-orange-600 text-white hover:bg-orange-700"
              )}
            >
              Arena
            </Link>

            <Link
              to="/ranking"
              className={clsx(
                linkClass,
                "bg-purple-600 text-white hover:bg-purple-700"
              )}
            >
              Ranking
            </Link>

            <Link
              to="/edit"
              className={clsx(
                linkClass,
                "bg-teal-600 text-white hover:bg-teal-700"
              )}
            >
              Edytuj
            </Link>

            <button
              onClick={handleLogout}
              className={clsx(
                buttonClass,
                "bg-red-600 text-white hover:bg-red-700"
              )}
            >
              Wyloguj
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;