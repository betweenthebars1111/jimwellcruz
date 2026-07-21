import Image from "next/image";
import { profile } from "@/lib/content";
import { MinesweeperButton } from "./Minesweeper";
import GetInTouch from "./GetInTouch";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <div className="mx-auto w-full max-w-measure px-4 py-10 lg:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/ouroboros.png"
                alt=""
                width={24}
                height={24}
                className="ouro opacity-70"
              />
              <span className="font-pixel text-sm">{profile.displayName}</span>
            </div>
            <p className="micro mt-4">
              © {new Date().getFullYear()} {profile.name}
            </p>
            <MinesweeperButton className="micro link mt-2 block text-left text-gray-500">
              bored? press alt+m and try to beat me at minesweeper
            </MinesweeperButton>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <GetInTouch className="micro link text-left text-gray-500 sm:text-right">
              email ↗
            </GetInTouch>
            {profile.socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="micro link text-gray-500"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
