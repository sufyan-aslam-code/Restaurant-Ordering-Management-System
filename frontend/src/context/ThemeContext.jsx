import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") return true;
    if (stored === "light") return false;
    // If no stored preference, fall back to system preference
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const rootElement = document.documentElement;

    if (darkMode) {
      rootElement.classList.add("dark");
      rootElement.setAttribute("data-theme", "dark");

      localStorage.setItem("theme", "dark");
    } else {
      rootElement.classList.remove("dark");
      rootElement.setAttribute("data-theme", "light");

      localStorage.setItem("theme", "light");
    }

    rootElement.style.colorScheme = darkMode ? "dark" : "light";
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((currentThemeValue) => !currentThemeValue);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;