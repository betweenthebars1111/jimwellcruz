import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { profile } from "@/lib/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Minesweeper from "@/components/Minesweeper";
import Splash from "@/components/Splash";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: {
    default: profile.name,
    template: `%s — ${profile.name}`,
  },
  description: profile.bio,
};

/* runs before paint: dark is the default, light only when explicitly chosen */
const themeInit = `(function(){try{if(localStorage.getItem("theme")!=="light")document.documentElement.classList.add("dark")}catch(e){document.documentElement.classList.add("dark")}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body
        className={`${geist.variable} ${geistMono.variable} ${serif.variable} bg-bg font-sans text-ink`}
      >
        <Splash />
        <Nav />
        <div
          aria-hidden="true"
          className="halftone pointer-events-none fixed right-0 top-0 -z-10 h-80 w-[28rem] max-w-full opacity-60 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="halftone pointer-events-none fixed bottom-0 left-0 -z-10 h-80 w-[28rem] max-w-full opacity-60 [mask-image:radial-gradient(ellipse_at_bottom_left,black,transparent_70%)] lg:left-56"
        />
        <div className="lg:pl-56">
          <main className="mx-auto w-full max-w-measure px-4 pb-16 pt-8 lg:px-6 lg:pt-16">
            {children}
          </main>
          <Footer />
        </div>
        <Minesweeper />
      </body>
    </html>
  );
}
