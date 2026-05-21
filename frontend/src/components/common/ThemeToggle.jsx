import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      className={`px-3 py-2 rounded-full transition flex items-center gap-2 border ${
        darkMode ? "border-gray-700 bg-gray-800 text-gray-200" : "border-gray-200 bg-white text-gray-700"
      }`}
    >
      {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:inline text-sm">{darkMode ? "Light" : "Dark"}</span>
    </button>
  );
};

export default ThemeToggle;