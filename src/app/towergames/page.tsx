'use client'
import React, { useEffect, Suspense } from 'react';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import '../../../public/towergames/css/main.css';

function TowerGamesContent() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Remove any scroll, margin, padding for fullscreen
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    
    // Pass URL parameters to the game
    const waves = searchParams.get('waves');
    console.log('TowerGames page loaded with waves parameter:', waves);
    if (waves) {
      // Set the waves parameter in the URL for the game to read
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('waves', waves);
      window.history.replaceState({}, '', currentUrl.toString());
      console.log('Updated URL with waves parameter:', currentUrl.toString());
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
    };
  }, [searchParams]);

  return (
    <>
      <title>Tower Defense Game</title>
      <div id="phaser-div" style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1, background: 'black' }} />
      {/* Mobile Controls (hidden by default, must exist in React DOM) */}
      <div id="mobile-controls" style={{ display: 'none' }}>
        <div id="joystick-zone" style={{ position: 'fixed', left: 10, bottom: 10, width: 120, height: 120, zIndex: 1001 }}></div>
        <div id="shoot-area" style={{ position: 'fixed', right: 0, bottom: 0, width: '100vw', height: '100vh', zIndex: 1000 }}></div>
      </div>
      <button
        id="show-mobile-controls"
        style={{
          position: 'fixed',
          top: 10,
          right: 10,
          zIndex: 2000,
          padding: '10px 18px',
          fontSize: 16,
          background: '#ffb300',
          color: '#222',
          border: 'none',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          cursor: 'pointer'
        }}
        onClick={() => {
          const mobileControls = document.getElementById('mobile-controls');
          if (mobileControls) {
            mobileControls.style.display = 'block';
            if (typeof (window as any).setupMobileControls === 'function') {
              (window as any).setupMobileControls();
            }
          }
        }}
      >
        Show Mobile Controls
      </button>
      <Script src="https://cdn.jsdelivr.net/npm/nipplejs@0.9.0/dist/nipplejs.min.js" strategy="beforeInteractive" />
      {/* Load all scripts in the order from index.html */}
      <Script src="/towergames/js/lib/phaser-new.js" strategy="beforeInteractive" />
      <Script src="/towergames/js/lib/phaser.patch.js" strategy="beforeInteractive" />
      <Script src="/towergames/js/states/bootstate.js" strategy="afterInteractive" />
      <Script src="/towergames/js/states/loaderstate.js" strategy="afterInteractive" />
      <Script src="/towergames/js/states/mainmenustate.js" strategy="afterInteractive" />
      <Script src="/towergames/js/states/gamestate.js" strategy="afterInteractive" />
      <Script src="/towergames/js/states/gameoverstate.js" strategy="afterInteractive" />
      <Script src="/towergames/js/resources.js" strategy="afterInteractive" />
      <Script src="/towergames/js/waves.js" strategy="afterInteractive" />
      <Script src="/towergames/js/points.js" strategy="afterInteractive" />
      <Script src="/towergames/js/managers/collisionmanager.js" strategy="afterInteractive" />
      <Script src="/towergames/js/managers/inputmanager.js" strategy="afterInteractive" />
      <Script src="/towergames/js/managers/inventorymanager.js" strategy="afterInteractive" />
      <Script src="/towergames/js/managers/guimanager.js" strategy="afterInteractive" />
      <Script src="/towergames/js/managers/wavemanager.js" strategy="afterInteractive" />
      <Script src="/towergames/js/entities/player.js" strategy="afterInteractive" />
      <Script src="/towergames/js/entities/bullet.js" strategy="afterInteractive" />
      <Script src="/towergames/js/entities/bear.js" strategy="afterInteractive" />
      <Script src="/towergames/js/entities/cane.js" strategy="afterInteractive" />
      <Script src="/towergames/js/entities/corn.js" strategy="afterInteractive" />
      <Script src="/towergames/js/entities/turret.js" strategy="afterInteractive" />
      <Script src="/towergames/js/entities/mine.js" strategy="afterInteractive" />
      <Script src="/towergames/js/entities/tooth.js" strategy="afterInteractive" />
      <Script src="/towergames/js/entities/explosion.js" strategy="afterInteractive" />
      <Script src="/towergames/js/gui/toolbar.js" strategy="afterInteractive" />
      <Script src="/towergames/js/gui/toolbar_slot.js" strategy="afterInteractive" />
      <Script src="/towergames/js/gui/hud.js" strategy="afterInteractive" />
      <Script src="/towergames/js/gui/menuscreen.js" strategy="afterInteractive" />
      <Script src="/towergames/js/main.js" strategy="afterInteractive" />
    </>
  );
}

export default function TowerGamesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TowerGamesContent />
    </Suspense>
  );
}