"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark" || stored === "system")
      return stored as ThemeMode;
  } catch {}
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mounted, setMounted] = useState(false); // ✅ SSR 차단용 플래그
  const [theme, setThemeState] = useState<ThemeMode>(() => getInitialTheme());
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true); // 클라이언트에서만 렌더링 가능
  }, []);

  useEffect(() => {
    if (!mounted) return; // 클라이언트 렌더링 전에는 아무것도 안함
    if (typeof document === "undefined" || typeof window === "undefined")
      return;

    const root = document.documentElement;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = (mode: ThemeMode) => {
      const shouldDark = mode === "system" ? mql.matches : mode === "dark";
      setResolvedTheme(shouldDark ? "dark" : "light");
      if (shouldDark) root.classList.add("dark");
      else root.classList.remove("dark");
    };

    apply(theme);
    try {
      window.localStorage.setItem("theme", theme);
    } catch {}

    const listener = () => {
      if (theme === "system") {
        apply("system");
      }
    };
    mql.addEventListener?.("change", listener);
    return () => mql.removeEventListener?.("change", listener);
  }, [theme, mounted]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, resolvedTheme }),
    [theme, setTheme, resolvedTheme]
  );

  // SSR 시에는 아무것도 렌더링하지 않음
  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};
