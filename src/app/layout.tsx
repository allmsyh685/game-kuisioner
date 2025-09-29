import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuizzyPlay - Gamifikasi Survey",
  description: "Game penelitian interaktif yang mengeksplorasi pola penggunaan AI dan gameplay pertahanan menara",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
          {children}
        </main>
      </body>
    </html>
  );
}
