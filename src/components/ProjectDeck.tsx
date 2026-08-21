"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import Pill from "@/components/Pill";
import type { Project } from "@/lib/content";

/** Pointer travel, in px, before a release counts as a flick rather than a click. */
const FLICK_DISTANCE = 56;
/** Anything past this much travel swallows the click, so a drag never opens a project. */
const CLICK_SLOP = 6;

/** Signed distance from the active card, wrapped so the fan stays symmetric. */
function wrappedOffset(index: number, active: number, total: number) {
  let offset = index - active;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

export default function ProjectDeck({ projects }: { projects: Project[] }) {
  const total = projects.length;
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);

  const pointerStart = useRef<number | null>(null);
  /* authoritative drag distance: state lags a frame behind the last pointermove */
  const dragged = useRef(0);
  const capturing = useRef(false);
  const swallowClick = useRef(false);

  const go = useCallback(
    (direction: number) =>
      setActive((current) => (current + direction + total) % total),
    [total],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (total < 2) return;
    pointerStart.current = e.clientX;
    dragged.current = 0;
    capturing.current = false;
    swallowClick.current = false;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const distance = e.clientX - pointerStart.current;
    dragged.current = distance;

    /* Capture only once this is unmistakably a drag. Capturing on pointerdown
       would retarget the follow-up click to this container, and the card's
       link would stop working entirely. */
    if (!capturing.current && Math.abs(distance) > CLICK_SLOP) {
      e.currentTarget.setPointerCapture(e.pointerId);
      capturing.current = true;
    }
    setDrag(distance);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const distance = dragged.current;

    if (capturing.current && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (Math.abs(distance) > FLICK_DISTANCE) go(distance < 0 ? 1 : -1);
    if (Math.abs(distance) > CLICK_SLOP) swallowClick.current = true;

    pointerStart.current = null;
    capturing.current = false;
    dragged.current = 0;
    setDrag(0);
  };

  /* A drag that ends on top of a link would otherwise navigate on release. */
  const onClickCapture = (e: React.MouseEvent) => {
    if (!swallowClick.current) return;
    e.preventDefault();
    e.stopPropagation();
    swallowClick.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    go(e.key === "ArrowLeft" ? -1 : 1);
  };

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="projects"
      onKeyDown={onKeyDown}
      className="mt-6"
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
        className="relative touch-pan-y select-none overflow-hidden py-10 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      >
        {/* the stage the deck sits on, using the site's halftone texture */}
        <div
          aria-hidden="true"
          className="halftone pointer-events-none absolute inset-x-0 bottom-6 -z-10 h-32 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]"
        />

        {/* every card shares one grid cell, so the stage is exactly as tall as the tallest */}
        <ul className="grid">
          {projects.map((p, i) => {
            const offset = wrappedOffset(i, active, total);
            const distance = Math.abs(offset);
            const isActive = offset === 0;
            const repo = p.links.find((l) => l.label === "github");

            return (
              <li
                key={p.slug}
                className="pointer-events-none flex items-center justify-center [grid-area:1/1]"
                style={{ zIndex: total - distance }}
              >
                <div
                  className="pointer-events-auto relative w-[min(84%,24rem)] transition-[transform,opacity,filter] duration-500 ease-out-expo"
                  style={{
                    transform: `translateX(calc(${offset * 32}% + ${
                      drag * (isActive ? 0.55 : 0.28)
                    }px)) rotate(${offset * 7}deg) scale(${1 - distance * 0.12})`,
                    opacity: distance > 2 ? 0 : 1 - distance * 0.45,
                    filter: isActive ? "none" : `blur(${distance * 1.5}px)`,
                  }}
                >
                  <article
                    aria-hidden={!isActive}
                    className={`flex h-full flex-col rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-shadow duration-500 ease-out-expo ${
                      isActive ? "shadow-card-hover" : "shadow-card"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="micro text-gray-500">{p.year}</span>
                      {p.featured ? (
                        <span className="rounded-full bg-ink px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-bg">
                          featured
                        </span>
                      ) : (
                        <span className="micro text-gray-500">{p.status}</span>
                      )}
                    </div>

                    <h3 className="mt-5 font-pixel text-xl lowercase leading-tight">
                      <Link
                        href={`/projects/${p.slug}`}
                        draggable={false}
                        tabIndex={isActive ? undefined : -1}
                        className="after:absolute after:inset-0 after:rounded-2xl"
                      >
                        {p.title}
                      </Link>
                    </h3>

                    <p className="mt-3 text-[13px] leading-relaxed text-gray-500">
                      {p.tagline}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <Pill key={t}>{t}</Pill>
                      ))}
                    </div>

                    {repo && (
                      <div className="mt-auto pt-6">
                        <a
                          href={repo.url}
                          draggable={false}
                          target="_blank"
                          rel="noopener noreferrer"
                          tabIndex={isActive ? undefined : -1}
                          className="micro link relative z-10 text-gray-500"
                        >
                          github ↗
                        </a>
                      </div>
                    )}
                  </article>

                  {!isActive && (
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      className="absolute inset-0 rounded-2xl"
                    >
                      <span className="sr-only">Show {p.title}</span>
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-2 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous project"
          className="micro px-1 text-gray-500 transition-colors hover:text-ink"
        >
          ←
        </button>

        <div className="flex items-center gap-2">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${p.title}`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all duration-300 ease-out-expo ${
                i === active
                  ? "w-6 bg-ink"
                  : "w-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next project"
          className="micro px-1 text-gray-500 transition-colors hover:text-ink"
        >
          →
        </button>
      </div>

      <p aria-live="polite" className="sr-only">
        {projects[active].title}, project {active + 1} of {total}
      </p>
    </div>
  );
}
