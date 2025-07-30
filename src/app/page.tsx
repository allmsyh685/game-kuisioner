'use client'

import React, { useState } from 'react';
import Link from 'next/link';


export default function Home() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselSlides = [
    {
      bgImg: '/assets/background_1.jpg',
      title: 'Mulai Survei Penelitian',
      desc: 'Jelajahi dunia AI yang menarik melalui penelitian interaktif dan permainan pertahanan menara yang menarik.',
      button: {
        text: '🎯 Mulai Survei Penelitian',
        href: '/game/scene/scene1',
        style: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white',
      },
    },
    {
      bgImg: '/assets/background-2.jpg',
      title: 'Lihat Papan Peringkat',
      desc: 'Bersaing dengan pemain lain dan lihat skor Anda pada sistem papan peringkat dinamis kami.',
      button: {
        text: '🏆 Lihat Papan Peringkat',
        href: '/towergames/leaderboard',
        style: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black',
      },
    },
    {
      bgImg: '/assets/background-3.jpg',
      title: 'Admin Panel',
      desc: 'Akses dashboard admin untuk mengelola pertanyaan, tanggapan, dan banyak lagi.',
      button: {
        text: '🔑 Pergi Ke Dashboard Admin',
        href: '/admin',
        style: 'bg-gradient-to-r from-gray-700 to-blue-700 hover:from-gray-800 hover:to-blue-800 text-white',
      },
    },
  ];

  const prevSlide = () => setCarouselIndex((carouselIndex + carouselSlides.length - 1) % carouselSlides.length);
  const nextSlide = () => setCarouselIndex((carouselIndex + 1) % carouselSlides.length);

  return (
    <div className="min-h-screen">
      {/* Hero Section as Carousel */}
      <section
        className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 transition-all duration-500"
        style={{
          backgroundImage: `url(${carouselSlides[carouselIndex].bgImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 z-0" />
        <div className="max-w-3xl mx-auto text-center py-12 relative z-10">
          <div
            className="inline-block w-full bg-black/60 rounded-2xl shadow-2xl px-6 py-10 md:px-12 md:py-16"
            style={{ minHeight: '340px' }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg text-white">{carouselSlides[carouselIndex].title}</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-lg text-white">{carouselSlides[carouselIndex].desc}</p>
            <a
              href={carouselSlides[carouselIndex].button.href}
              className={`font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg ${carouselSlides[carouselIndex].button.style}`}
            >
              {carouselSlides[carouselIndex].button.text}
            </a>
          </div>
        </div>
        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white rounded-full p-2 z-10"
          aria-label="Previous Slide"
        >
          &#8592;
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white rounded-full p-2 z-10"
          aria-label="Next Slide"
        >
          &#8594;
        </button>
        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCarouselIndex(idx)}
              className={`w-3 h-3 rounded-full ${carouselIndex === idx ? 'bg-white' : 'bg-white/50'} border border-white`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-black bg-opacity-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 mt-8 mb-8 md:mt-0 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What You&apos;ll Experience
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A unique combination of research and gaming that helps us understand AI usage patterns
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 p-8 rounded-xl border border-blue-700/30 hover:border-blue-500/50 transition-all duration-300">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-4">Research Survey</h3>
              <p className="text-gray-300">
                Participate in our comprehensive survey about AI usage patterns, preferences, and experiences.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 p-8 rounded-xl border border-green-700/30 hover:border-green-500/50 transition-all duration-300">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-bold text-white mb-4">Tower Defense Game</h3>
              <p className="text-gray-300">
                Enjoy an engaging tower defense game with strategic gameplay and challenging levels.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 p-8 rounded-xl border border-yellow-700/30 hover:border-yellow-500/50 transition-all duration-300 mb-8 md:mb-0">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-white mb-4">Leaderboard</h3>
              <p className="text-gray-300">
                Compete with other players and see your scores on our dynamic leaderboard system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Apakah Kamu Siap Untuk Memulai Game?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Bergabunglah dengan ribuan peserta dalam studi penelitian kami dan nikmati pengalaman bermain game yang luar biasa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/game/scene/scene1"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Mulailah Perjalanan Anda
            </Link>
            <Link
              href="/towergames/leaderboard"
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Lihat Papan Peringkat
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black bg-opacity-40 py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-700">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 GameFix2025. All rights reserved. | Research project exploring AI usage patterns
          </p>
        </div>
      </footer>
    </div>
  );
}
