'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Left */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <Image
              src="/assets/logo_unair.png"
              alt="Universitas Airlangga Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-white font-bold text-xl">QuizzyPlay</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="/questionnaire"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Kuisioner
              </Link>
              <Link
                href="/towergames"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Permainan Pertahanan Menara
              </Link>
              <Link
                href="/admin"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>

          {/* Logo Right (Desktop only) */}
          <div className="hidden md:flex items-center">
            <Image
              src="/assets/logo_himatika.png"
              alt="Himatika Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-b from-blue-900 to-purple-900">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
          >
            Beranda
          </Link>
          <Link
            href="/questionnaire"
            onClick={closeMobileMenu}
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
          >
            Kuisioner
          </Link>
          <Link
            href="/towergames"
            onClick={closeMobileMenu}
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
          >
            Permainan Pertahanan Menara
          </Link>
          <Link
            href="/admin"
            onClick={closeMobileMenu}
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
          >
            Admin
          </Link>
          {/* Logo Right (Mobile) */}
          <div className="flex justify-end mt-2">
            <Image
              src="/assets/logo_himatika.png"
              alt="Himatika Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 