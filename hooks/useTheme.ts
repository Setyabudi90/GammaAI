"use client";
import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme;
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setTheme(savedTheme || systemTheme);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.setAttribute("data-theme", theme);
      root.classList.add(theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return { theme, setTheme };
}
