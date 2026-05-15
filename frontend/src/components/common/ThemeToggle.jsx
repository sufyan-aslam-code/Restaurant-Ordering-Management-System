const ThemeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
    >
      {darkMode ? "Light" : "Dark"}
    </button>
  );
};

export default ThemeToggle;