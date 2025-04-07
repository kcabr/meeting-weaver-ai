/**
 * @description
 * Custom hook to manage application theme (light/dark).
 * It provides the current theme and a function to toggle it.
 * It interacts with localStorage to persist the theme preference and applies
 * the 'dark' class to the root element for TailwindCSS dark mode support.
 *
 * Key features:
 * - Reads initial theme from localStorage or system preference.
 * - Applies 'dark' class to the root element based on the theme.
 * - Provides a 'toggleTheme' function to switch between light and dark.
 * - Persists the selected theme to localStorage.
 *
 * @dependencies
 * - react: For useState, useEffect, useCallback hooks.
 *
 * @notes
 * - Assumes TailwindCSS dark mode is configured with the 'class' strategy.
 */

import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";

const LOCAL_STORAGE_THEME_KEY = "meetingweaver_theme";

export function useTheme(): {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
} {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "system"; // Default for SSR/build time
    }
    const storedTheme = window.localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
    return "system"; // Default preference
  });

  /**
   * @description Applies the theme class to the root element and updates localStorage.
   */
  const applyTheme = useCallback((newTheme: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let effectiveTheme: "light" | "dark";
    if (newTheme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      effectiveTheme = newTheme;
    }

    root.classList.add(effectiveTheme);
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme); // Store user's preference ('system', 'light', or 'dark')
    setThemeState(newTheme); // Update hook state
  }, []);

  /**
   * @description Effect to apply the theme on initial load and when theme state changes.
   * Also listens for system preference changes if theme is 'system'.
   */
  useEffect(() => {
    applyTheme(theme);

    // Handle system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        // Only re-apply if tracking system preference
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyTheme]); // Re-run if theme preference changes

  /**
   * @description Toggles the theme between light and dark. If currently 'system',
   * it defaults to toggling based on the current *effective* theme.
   */
  const toggleTheme = useCallback(() => {
    let currentEffectiveTheme: "light" | "dark";
    if (theme === "system") {
      currentEffectiveTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
    } else {
      currentEffectiveTheme = theme;
    }
    const nextTheme = currentEffectiveTheme === "light" ? "dark" : "light";
    applyTheme(nextTheme); // Set explicitly to light/dark, moving away from 'system'
  }, [theme, applyTheme]);

  /**
   * @description Allows setting the theme explicitly (light, dark, or system).
   */
  const setTheme = (newTheme: Theme) => {
    applyTheme(newTheme);
  };

  return { theme, toggleTheme, setTheme };
}
