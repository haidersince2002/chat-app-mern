import { create } from "zustand";

const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("cc-theme") || "dark",

  initializeTheme: () => {
    const saved = localStorage.getItem("cc-theme") || "dark";
    applyTheme(saved);
    set({ theme: saved });
  },

  setTheme: (theme) => {
    localStorage.setItem("cc-theme", theme);
    applyTheme(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const cur = localStorage.getItem("cc-theme") || "dark";
    const next = cur === "dark" ? "light" : "dark";
    localStorage.setItem("cc-theme", next);
    applyTheme(next);
    set({ theme: next });
  },
}));
