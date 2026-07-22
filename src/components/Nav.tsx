"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/lib/content";
import ThemeToggle from "./ThemeToggle";
import { MinesweeperButton } from "./Minesweeper";

const items = [
  { label: "name", href: "/" },
  { label: "projects", href: "/#projects" },
  { label: "experience", href: "/#experience" },
  { label: "certifications", href: "/#certifications" },
  { label: "recommendations", href: "/#recommendations" },
  { label: "affiliations", href: "/#affiliations" },
  { label: "github", href: "/#github" },
  { label: "stack", href: "/stack" },
  { label: "gear", href: "/gear" },
];

/* the homepage "stack" section is intentionally omitted — it has no
   /#stack nav item, so tracking it would leave the indicator with nothing
   to point at. experience stays active until certifications scrolls in. */
const homeSectionIds = [
  "projects",
  "experience",
  "certifications",
  "recommendations",
  "affiliations",
  "github",
];

/* on the homepage, track which section is currently in view */
function useCurrentSection() {
  const pathname = usePathname();
  const [section, setSection] = useState<string | null>(null);
  /* after a nav click, briefly ignore scroll events so the clicked
     target stays selected even if the page can't scroll it to the top */
  const holdUntil = useRef(0);

  const select = useCallback((id: string | null) => {
    holdUntil.current = Date.now() + 600;
    setSection(id);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setSection(null);
      return;
    }
    const onScroll = () => {
      if (Date.now() < holdUntil.current) return;
      const doc = document.documentElement;
      const scanline = Math.min(window.innerHeight * 0.35, 240);
      let current: string | null = null;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
        current = homeSectionIds[homeSectionIds.length - 1];
      } else {
        for (const id of homeSectionIds) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= scanline) current = id;
        }
      }
      setSection(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return { section, select };
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { section, select } = useCurrentSection();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" && section === null;
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      return (
        (pathname === "/" && section === id) || pathname.startsWith(`/${id}/`)
      );
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <ul className="space-y-2.5">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <li key={item.label}>
            <Link
              href={item.href}
              onClick={() => {
                if (pathname === "/") {
                  if (item.href.startsWith("/#")) select(item.href.slice(2));
                  else if (item.href === "/") select(null);
                }
                onNavigate?.();
              }}
              className={`-ml-6 flex items-baseline gap-2 font-mono text-xs lowercase transition-colors duration-200 ${
                active ? "text-ink" : "text-gray-500 hover:text-ink"
              }`}
            >
              <span
                aria-hidden="true"
                className={`w-4 shrink-0 text-right transition-opacity duration-200 ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              >
                →
              </span>
              {item.label === "name" ? profile.displayName : item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <Image
        src="/images/ouroboros.png"
        alt=""
        width={22}
        height={22}
        className="ouro"
      />
      <span className="font-pixel text-sm">
        {profile.displayName}
      </span>
    </Link>
  );
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col border-r border-gray-200 bg-bg px-6 py-8 lg:flex">
        <Logo />
        <div className="mt-8 h-px bg-gray-200" aria-hidden="true" />
        <nav className="mt-8 flex-1" aria-label="Main">
          <p className="micro mb-4">index</p>
          <NavLinks />
        </nav>
        <div className="h-px bg-gray-200" aria-hidden="true" />
        <div className="mt-6 space-y-3">
          <MinesweeperButton className="micro block text-left text-gray-500 transition-colors duration-200 hover:text-ink">
            minesweeper · alt+m
          </MinesweeperButton>
          <ThemeToggle />
        </div>
      </aside>

      {/* mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-bg/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="micro text-gray-500 transition-colors duration-200 hover:text-ink"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? "close ✕" : "menu ≡"}
        </button>
      </header>

      {/* mobile overlay menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-bg px-6 py-6 lg:hidden">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="micro text-gray-500 hover:text-ink"
              aria-label="Close menu"
            >
              close ✕
            </button>
          </div>
          <nav className="mt-12 flex-1" aria-label="Main">
            <p className="micro mb-5">index</p>
            <div className="[&_a]:text-base [&_li]:mb-1">
              <NavLinks onNavigate={() => setMenuOpen(false)} />
            </div>
          </nav>
          <div className="space-y-3 border-t border-gray-200 pt-6">
            <MinesweeperButton
              className="micro block text-left text-gray-500 hover:text-ink"
              onOpen={() => setMenuOpen(false)}
            >
              minesweeper
            </MinesweeperButton>
            <ThemeToggle />
          </div>
        </div>
      )}
    </>
  );
}
