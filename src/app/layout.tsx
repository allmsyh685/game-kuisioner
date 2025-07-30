import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GameFix2025 - AI Research Game",
  description: "Game penelitian interaktif yang mengeksplorasi pola penggunaan AI dan gameplay pertahanan menara",
};

// Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 shadow-lg border-b border-blue-700">
      <div className="flex justify-between items-center h-16 w-full relative">
        {/* Left side - Logo and Brand */}
        <div className="flex items-center space-x-3 pl-4 ml-0">
          <div className="flex-shrink-0">
            <Image
              src="/assets/logo_unair.png"
              alt="Universitas Airlangga Logo"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white">
              <span className="text-blue-400">Game</span>
              <span className="text-purple-400">Fix</span>
              <span className="text-indigo-400">2025</span>
            </h1>
          </div>
        </div>

        {/* Center - Navigation Links */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-baseline space-x-4">
            <Link
              href="/"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/game/scene/scene1"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Start Survey
            </Link>
            <a
              href="/towergames"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Tower Defense
            </a>
            <a
              href="/towergames/leaderboard"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-2 rounded-md text-sm font-bold hover:from-yellow-400 hover:to-orange-400 transition-all duration-200 shadow-lg"
            >
              🏆 Leaderboard
            </a>
          </div>
        </div>

        {/* Right side - Logo */}
        <div className="flex items-center pr-4 mr-0">
          <div className="hidden md:block">
            <Image
              src="/assets/logo_himatika.png"
              alt="Himatika Logo"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-900">
          <Link
            href="/"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>
                      <Link
              href="/game/scene/scene1"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Start Survey
            </Link>
          <a
            href="/towergames"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Tower Defense
          </a>
          <a
            href="/towergames/leaderboard"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black block px-3 py-2 rounded-md text-base font-bold"
          >
            🏆 Leaderboard
          </a>
        </div>
      </div>
    </nav>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          {children}
        </main>
      </body>
    </html>
  );
}
