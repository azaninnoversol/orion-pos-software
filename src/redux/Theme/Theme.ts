// redux
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeState = "light" | "dark" | "system";

const getSystemTheme = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

const getInitialTheme = (): ThemeState => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("theme");

    if (stored === "light" || stored === "dark" || stored === "system") return stored;
  }
  return "system";
};

const applyTheme = (theme: ThemeState) => {
  const finalTheme = theme === "system" ? getSystemTheme() : theme;

  if (finalTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const initialState: { theme: ThemeState } = {
  theme: getInitialTheme(),
};

if (typeof window !== "undefined") {
  applyTheme(initialState.theme);
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeState>) => {
      state.theme = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("theme", state.theme);
        applyTheme(state.theme);
      }
    },

    toggleTheme: (state) => {
      // Toggle only between light & dark (not system)
      const newTheme = state.theme === "light" ? "dark" : "light";
      state.theme = newTheme;

      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
        applyTheme(newTheme);
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
