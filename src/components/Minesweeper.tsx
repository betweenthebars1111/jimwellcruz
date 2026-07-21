"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ROWS = 9;
const COLS = 9;
const MINES = 10;
const OPEN_EVENT = "ouro:minesweeper";

interface Cell {
  mine: boolean;
  adj: number;
  revealed: boolean;
  flagged: boolean;
}

type Status = "idle" | "playing" | "won" | "lost";

export function MinesweeperButton({
  className,
  children,
  onOpen,
}: {
  className?: string;
  children: React.ReactNode;
  onOpen?: () => void;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onOpen?.();
        window.dispatchEvent(new Event(OPEN_EVENT));
      }}
    >
      {children}
    </button>
  );
}

function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      mine: false,
      adj: 0,
      revealed: false,
      flagged: false,
    })),
  );
}

/* mines are placed on the first reveal so that click (and its neighbors) is always safe */
function placeMines(b: Cell[][], sr: number, sc: number) {
  const safe = new Set<number>();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = sr + dr;
      const c = sc + dc;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) safe.add(r * COLS + c);
    }
  }
  let placed = 0;
  while (placed < MINES) {
    const i = Math.floor(Math.random() * ROWS * COLS);
    if (safe.has(i)) continue;
    const r = Math.floor(i / COLS);
    const c = i % COLS;
    if (b[r][c].mine) continue;
    b[r][c].mine = true;
    placed++;
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let adj = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && b[nr][nc].mine)
            adj++;
        }
      }
      b[r][c].adj = adj;
    }
  }
}

function revealFlood(b: Cell[][], sr: number, sc: number) {
  const stack: [number, number][] = [[sr, sc]];
  while (stack.length) {
    const [r, c] = stack.pop()!;
    const cell = b[r][c];
    if (cell.revealed || cell.flagged) continue;
    cell.revealed = true;
    if (cell.adj === 0 && !cell.mine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            if (!b[nr][nc].revealed) stack.push([nr, nc]);
          }
        }
      }
    }
  }
}

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/* my claimed solve time — a fixed 21 seconds */
const TARGET = 21;

const numberColor = [
  "",
  "text-gray-500",
  "text-gray-600",
  "text-gray-700",
  "text-ink",
  "text-ink",
  "text-ink",
  "text-ink",
  "text-ink",
];

export default function Minesweeper() {
  const [open, setOpen] = useState(false);
  const [board, setBoard] = useState<Cell[][]>(emptyBoard);
  const [status, setStatus] = useState<Status>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [flagMode, setFlagMode] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const newGame = useCallback(() => {
    setBoard(emptyBoard());
    setStatus("idle");
    setElapsed(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.code === "KeyM") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const reveal = (r: number, c: number) => {
    if (status === "won" || status === "lost") return;
    const cell = board[r][c];
    if (cell.revealed || cell.flagged) return;
    const b = board.map((row) => row.map((x) => ({ ...x })));
    if (status === "idle") {
      placeMines(b, r, c);
      setStatus("playing");
    }
    if (b[r][c].mine) {
      for (const row of b) for (const x of row) if (x.mine) x.revealed = true;
      setBoard(b);
      setStatus("lost");
      return;
    }
    revealFlood(b, r, c);
    setBoard(b);
    const revealed = b.flat().filter((x) => x.revealed && !x.mine).length;
    if (revealed === ROWS * COLS - MINES) setStatus("won");
  };

  const flag = (r: number, c: number) => {
    if (status === "won" || status === "lost") return;
    if (board[r][c].revealed) return;
    const b = board.map((row) => row.map((x) => ({ ...x })));
    b[r][c].flagged = !b[r][c].flagged;
    setBoard(b);
  };

  if (!open) return null;

  const flags = board.flat().filter((x) => x.flagged).length;
  const finished = status === "won" || status === "lost";

  let result: string | null = null;
  if (status === "won") {
    result =
      elapsed <= TARGET
        ? `swept in ${fmt(elapsed)}. you beat me — my best is ${fmt(TARGET)}.`
        : `swept in ${fmt(elapsed)}. clean, but my best is ${fmt(TARGET)}.`;
  } else if (status === "lost") {
    result = `boom — ${fmt(elapsed)} in. my best is ${fmt(TARGET)}. run it back?`;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Minesweeper"
    >
      <div
        className="absolute inset-0 bg-ink/30 backdrop-blur-md"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="modal-in relative w-full max-w-sm rounded-2xl border border-gray-200 bg-bg p-7 shadow-modal outline-none"
      >
        <div className="flex items-baseline justify-between">
          <p className="micro">minesweeper — 9×9 · 10 mines</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="micro text-gray-500 transition-colors hover:text-ink"
          >
            esc ✕
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between font-mono text-xs text-gray-500">
          <span>⚑ {MINES - flags}</span>
          <span className="tabular-nums text-ink">{fmt(elapsed)}</span>
          <button
            type="button"
            onClick={() => setFlagMode((f) => !f)}
            className={`transition-colors ${flagMode ? "text-ink" : "text-gray-400 hover:text-ink"}`}
            aria-pressed={flagMode}
          >
            ⚑ mode
          </button>
          <button
            type="button"
            onClick={newGame}
            className="transition-colors hover:text-ink"
          >
            ↺ new
          </button>
        </div>

        <div className="mt-4 grid grid-cols-9 gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200">
          {board.map((row, r) =>
            row.map((cell, c) => {
              const showMine = cell.revealed && cell.mine;
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  disabled={finished}
                  onClick={() => (flagMode ? flag(r, c) : reveal(r, c))}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    flag(r, c);
                  }}
                  aria-label={`cell ${r + 1},${c + 1}`}
                  className={`flex aspect-square select-none items-center justify-center font-mono text-xs ${
                    showMine
                      ? status === "lost"
                        ? "bg-ink text-bg"
                        : "bg-bg text-ink"
                      : cell.revealed
                        ? `bg-bg ${numberColor[cell.adj]}`
                        : "bg-gray-50 transition-colors duration-150 hover:bg-gray-100"
                  }`}
                >
                  {cell.flagged && !cell.revealed
                    ? "⚑"
                    : showMine
                      ? "✱"
                      : cell.revealed && cell.adj > 0
                        ? cell.adj
                        : ""}
                </button>
              );
            }),
          )}
        </div>

        <p className="micro mt-4">my time to beat: {fmt(TARGET)}</p>
        {result && (
          <p className="mt-2 font-mono text-xs leading-relaxed text-ink">
            {result}
          </p>
        )}
      </div>
    </div>
  );
}
