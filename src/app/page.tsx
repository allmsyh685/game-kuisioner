'use client'

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


export default function Home() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [cardShift, setCardShift] = useState(0);
  const carouselSlides = [
    {
      bgImg: '/assets/background_1.jpg',
      title: 'Mulai Survei Penelitian',
      desc: 'Selamat datang di survei inovasi kuesioner yang dilengkapi dengan permainan.Survei ini terdiri dari 15 pertanyaan yang terbagi menjadi 3 bagian. Antar bagian dilengkapi dengan permainan tower yang terdiri dari 3 level..',
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

  const prevSlide = () => {
    setSlideDirection('prev');
    setCarouselIndex((carouselIndex + carouselSlides.length - 1) % carouselSlides.length);
  };
  const nextSlide = () => {
    setSlideDirection('next');
    setCarouselIndex((carouselIndex + 1) % carouselSlides.length);
  };

  // Swipe/drag support
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const onTouchEnd = () => {
    const threshold = 50; // px
    if (touchDeltaX.current > threshold) {
      prevSlide();
    } else if (touchDeltaX.current < -threshold) {
      nextSlide();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  // Simple horizontal slide-in animation for the card on slide change
  useEffect(() => {
    const initial = slideDirection === 'next' ? 48 : -48;
    // Set initial offset, then in next frame move to 0 to trigger CSS transition
    setCardShift(initial);
    const id = requestAnimationFrame(() => setCardShift(0));
    return () => cancelAnimationFrame(id);
  }, [carouselIndex, slideDirection]);

  return (
    <div className="min-h-screen">
      {/* Hero Section as Carousel */}
      <section
        className="relative min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 transition-all duration-500"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Sliding background track */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="flex h-full w-full"
            style={{
              width: `${carouselSlides.length * 100}%`,
              transform: `translateX(-${carouselIndex * (100 / carouselSlides.length)}%)`,
              transition: 'transform 600ms ease',
            }}
          >
            {carouselSlides.map((slide, idx) => (
              <div key={idx} className="relative h-full" style={{ width: `${100 / carouselSlides.length}%` }}>
                <Image
                  src={slide.bgImg}
                  alt={`Hero background ${idx + 1}`}
                  fill
                  sizes="100vw"
                  priority={idx === 0}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="max-w-3xl mx-auto text-center py-12 relative z-20">
          <div
            className="inline-block w-full bg-black/60 rounded-2xl shadow-2xl px-6 py-10 md:px-12 md:py-16"
            style={{ minHeight: '340px', transform: `translateX(${cardShift}px)`, transition: 'transform 500ms ease' }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg text-white">{carouselSlides[carouselIndex].title}</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-lg text-white">{carouselSlides[carouselIndex].desc}</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href={carouselSlides[carouselIndex].button.href}
                className={`font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg ${carouselSlides[carouselIndex].button.style}`}
              >
                {carouselSlides[carouselIndex].button.text}
              </a>
              {carouselIndex === 0 && (
                <Link
                  href="/questionnaire"
                  className="bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  📝 ISI SURVEI TANPA PERMAINAN
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* Kontrol Carousel */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white rounded-full p-2 z-10"
          aria-label="Slide Sebelumnya"
        >
          &#8592;
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white rounded-full p-2 z-10"
          aria-label="Slide Selanjutnya"
        >
          &#8594;
        </button>
        {/* Titik navigasi (gaya Material Tailwind) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {carouselSlides.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Ke slide ${idx + 1}`}
              onClick={() => setCarouselIndex(idx)}
              className={`block h-1 rounded-2xl transition-all ${carouselIndex === idx ? 'w-8 bg-white' : 'w-4 bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-black bg-opacity-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 mt-8 mb-8 md:mt-0 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Apa yang Akan Kamu Alami
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Kombinasi unik antara riset dan permainan yang membantu kami memahami inovasi kuesioner
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Fitur 1 */}
            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 p-8 rounded-xl border border-blue-700/30 hover:border-blue-500/50 transition-all duration-300">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-4">Survei Riset</h3>
              <p className="text-gray-300">
                Ikuti survei komprehensif kami tentang inovasi kuesioner
              </p>
            </div>

            {/* Fitur 2 */}
            <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 p-8 rounded-xl border border-green-700/30 hover:border-green-500/50 transition-all duration-300">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-bold text-white mb-4">Permainan Tower Defense</h3>
              <p className="text-gray-300">
                Nikmati permainan tower defense yang seru dengan strategi mendalam dan level menantang.
              </p>
            </div>

            {/* Fitur 3 */}
            <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 p-8 rounded-xl border border-yellow-700/30 hover:border-yellow-500/50 transition-all duration-300 mb-8 md:mb-0">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-white mb-4">Papan Peringkat</h3>
              <p className="text-gray-300">
                Bersaing dengan pemain lain dan lihat skor kamu pada sistem papan peringkat dinamis kami.
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
            © 2025 allmsyh685. All rights reserved. | 
          </p>
        </div>
      </footer>
    </div>
  );
}
