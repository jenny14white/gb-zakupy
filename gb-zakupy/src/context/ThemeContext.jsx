import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const DEFAULT_THEME = "navy";

const AVAILABLE_THEMES = [
  "navy",
  "forest",
  "gold"
];

export function ThemeProvider({ children }) {

  const [theme, setThemeState] = useState(() => {

    const savedTheme = localStorage.getItem("gb-theme");

    if (
      savedTheme &&
      AVAILABLE_THEMES.includes(savedTheme)
    ) {
      return savedTheme;
    }

    return DEFAULT_THEME;

  });

  useEffect(() => {

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(
      "gb-theme",
      theme
    );

  }, [theme]);



  function setTheme(newTheme) {

    if (
      !AVAILABLE_THEMES.includes(newTheme)
    ) {
      return;
    }

    setThemeState(newTheme);

  }



  function toggleTheme() {

    const index =
      AVAILABLE_THEMES.indexOf(theme);

    const nextIndex =
      (index + 1) %
      AVAILABLE_THEMES.length;

    setThemeState(
      AVAILABLE_THEMES[nextIndex]
    );

  }



  return (

    <ThemeContext.Provider

      value={{

        theme,

        setTheme,

        toggleTheme,

        themes: AVAILABLE_THEMES

      }}

    >

      {children}

    </ThemeContext.Provider>

  );

}



export function useTheme() {

  return useContext(ThemeContext);

}
