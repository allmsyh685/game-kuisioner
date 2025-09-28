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
      bgImg: '/assets/background_1.avif',
      title: 'Mulai Survei Penelitian',
      desc: 'Selamat datang di survei inovasi kuesioner yang dilengkapi dengan permainan.Survei ini terdiri dari 15 pertanyaan yang terbagi menjadi 3 bagian. Antar bagian dilengkapi dengan permainan tower yang terdiri dari 3 level.',
      button: {
        text: '🎯 Mulai Survei Penelitian',
        href: '/game/scene/scene1',
        style: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white',
      },
    },
    {
      bgImg: '/assets/background-2.avif',
      title: 'Lihat Papan Peringkat',
      desc: 'Bersaing dengan pemain lain dan lihat skor Anda pada sistem papan peringkat dinamis kami.',
      button: {
        text: '🏆 Lihat Papan Peringkat',
        href: '/towergames/leaderboard',
        style: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black',
      },
    },
    {
      bgImg: '/assets/background-3.avif',
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
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMycgaGVpZ2h0PSczJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPSczJyBoZWlnaHQ9JzMnIGZpbGw9JyMyMjInIC8+PC9zdmc+"
                  quality={60}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Overlay (darker to guarantee contrast on bright displays) */}
        <div className="absolute inset-0 bg-black/70 z-10" />
        <div className="max-w-5xl mx-auto text-center py-12 relative z-20">
          {/* Outer Title Card (Larger Container) */}
          <div
            className="relative w-full bg-black/40 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
            style={{ transform: `translateX(${cardShift}px)`, transition: 'transform 500ms ease' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/0"></div>
            
            {/* Title Section */}
            <div className="relative z-10 px-8 py-12">
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-8"
                style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}
              >
                {carouselSlides[carouselIndex].title}
              </h1>
            </div>
            
            {/* Inner Description and Button Card (Smaller, Overlapping) */}
            <div
              className="relative mx-8 -mt-6 mb-8 bg-black/60 border border-white/20 rounded-2xl shadow-xl overflow-hidden"
              style={{ transform: `translateX(${cardShift}px)`, transition: 'transform 500ms ease' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/0"></div>
              <div className="relative z-10 px-6 py-8">
                {/* Description */}
                <div className="mb-6 max-w-3xl mx-auto">
                  <p className="text-lg md:text-xl text-white leading-relaxed font-light" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.7)', whiteSpace: 'pre-line' }}>
                    {carouselSlides[carouselIndex].desc
                      .split(/(?<=\.)\s*/)
                      .filter(Boolean)
                      .join('\n')}
                  </p>
                </div>
                
                {/* Button container */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
                  <a
                    href={carouselSlides[carouselIndex].button.href}
                    className={`group relative font-bold py-3 px-6 rounded-xl text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${carouselSlides[carouselIndex].button.style}`}
                  >
                    <span className="relative z-10">{carouselSlides[carouselIndex].button.text}</span>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                  
                  {carouselIndex === 0 && (
                    <Link
                      href="/questionnaire"
                      className="group relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3 px-6 rounded-xl text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <span className="relative z-10">📝 ISI SURVEI TANPA PERMAINAN</span>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                  )}
                </div>
              </div>
              <div className="absolute bottom-2 left-2 w-8 h-8 bg-gradient-to-br from-emerald-400/30 to-teal-400/30 rounded-full blur-md"></div>
            </div>
            
            {/* Decorative elements for outer card */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-xl"></div>
          </div>
        </div>
        {/* Enhanced Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full p-3 z-10 transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Slide Sebelumnya"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full p-3 z-10 transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Slide Selanjutnya"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {/* Enhanced Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {carouselSlides.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Ke slide ${idx + 1}`}
              onClick={() => setCarouselIndex(idx)}
              className={`relative transition-all duration-300 ${
                carouselIndex === idx 
                  ? 'w-8 h-2 bg-white rounded-full shadow-lg' 
                  : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/70 hover:scale-125'
              }`}
            >
              {carouselIndex === idx && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-black bg-opacity-20" style={{ contentVisibility: 'auto', containIntrinsicSize: '1000px' }}>
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
      <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8" style={{ contentVisibility: 'auto', containIntrinsicSize: '1000px' }}>
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
