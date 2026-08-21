export default function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gray-300 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-gray-500">
      {children}
    </span>
  );
}
