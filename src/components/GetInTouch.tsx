"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { profile } from "@/lib/content";

export default function GetInTouch({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    setCopied(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      const el = document.createElement("textarea");
      el.value = profile.email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {open &&
        createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="get in touch"
        >
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-md"
            onClick={close}
          />
          <div className="modal-in relative w-full max-w-sm rounded-2xl border border-gray-200 bg-bg p-7 shadow-modal">
            <button
              type="button"
              onClick={close}
              aria-label="close"
              className="micro absolute right-5 top-5 text-gray-400 transition-colors duration-200 hover:text-ink"
            >
              ✕
            </button>
            <p className="micro">contact</p>
            <h2 className="mt-3 font-pixel text-2xl lowercase leading-none">
              get in touch
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed text-gray-500">
              Say hello — for work collabs or just to say hi, feel free to
              message me.
            </p>
            <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-center">
              <span className="block truncate font-mono text-[13px]">
                {profile.email}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={copy}
                className="flex-1 rounded-lg bg-ink px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-bg transition-opacity duration-200 hover:opacity-85"
              >
                {copied ? "copied ✓" : "copy to clipboard"}
              </button>
              <a
                href={`mailto:${profile.email}`}
                className="micro link shrink-0 text-gray-500"
              >
                open mail ↗
              </a>
            </div>
          </div>
        </div>,
          document.body
        )}
    </>
  );
}
