"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    root.classList.add("theme-fade");
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* private mode — theme just won't persist */
    }
    window.setTimeout(() => root.classList.remove("theme-fade"), 550);
    setDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="micro flex items-center gap-2 text-gray-500 transition-colors duration-200 hover:text-ink"
      aria-label="Toggle color theme"
    >
      <span aria-hidden="true">{dark === false ? "◐" : "◑"}</span>
      theme: {dark === null ? "dark" : dark ? "dark" : "light"}
    </button>
  );
}
