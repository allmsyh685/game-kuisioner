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
      
      {/* Load Phaser first - this must be loaded before any other scripts */}
      <Script 
        src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js" 
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('Phaser loaded successfully');
          // Ensure Phaser is available globally
          if (typeof window !== 'undefined' && (window as any).Phaser) {
            console.log('Phaser is available globally');
          }
        }}
      />
      
      {/* Ensure Phaser is attached to window */}
      <Script 
        id="ensure-phaser-global"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Ensure Phaser is available globally
            if (typeof Phaser !== 'undefined') {
              window.Phaser = Phaser;
              console.log('Phaser attached to window');
            } else {
              console.error('Phaser is not defined');
            }
          `
        }}
      />
      
      {/* Load nipplejs for mobile controls */}
      <Script 
        src="https://cdn.jsdelivr.net/npm/nipplejs@0.9.0/dist/nipplejs.min.js" 
        strategy="beforeInteractive" 
      />
      
      {/* Load all game scripts in the correct order */}
      <Script 
        src="/towergames/js/lib/phaser.patch.js" 
        strategy="afterInteractive"
        onLoad={() => console.log('Phaser patch loaded')}
      />
      
      {/* Load game states FIRST - these define MainGame */}
      <Script src="/towergames/js/states/bootstate.js" strategy="afterInteractive" />
      <Script src="/towergames/js/states/loaderstate.js" strategy="afterInteractive" />
      <Script src="/towergames/js/states/mainmenustate.js" strategy="afterInteractive" />
      <Script src="/towergames/js/states/gamestate.js" strategy="afterInteractive" />
      <Script src="/towergames/js/states/gameoverstate.js" strategy="afterInteractive" />
      
      {/* Load game resources and utilities */}
      <Script src="/towergames/js/resources.js" strategy="afterInteractive" />
      <Script src="/towergames/js/waves.js" strategy="afterInteractive" />
      <Script src="/towergames/js/points.js" strategy="afterInteractive" />
      
      {/* Load managers */}
      <Script src="/towergames/js/managers/collisionmanager.js" strategy="afterInteractive" />
      <Script src="/towergames/js/managers/inputmanager.js" strategy="afterInteractive" />
      <Script src="/towergames/js/managers/inventorymanager.js" strategy="afterInteractive" />
      <Script src="/towergames/js/managers/guimanager.js" strategy="afterInteractive" />
      <Script src="/towergames/js/managers/wavemanager.js" strategy="afterInteractive" />
      
      {/* Load entities */}
      <Script src="/towergames/js/entities/player.js" strategy="afterInteractive" />
      <Script src="/towergames/js/entities/bullet.js" strategy="afterInteractive" />
      <Script src="/towergames/js/entities/bear.js" strategy="afterInteractive" />
      <Script src="/towergames/js/entities/cane.js" strategy="afterInteractive" />
      <Script src="/towergames/js/entities/corn.js" strategy="afterInteractive" />
      <Script src="/towergames/js/entities/turret.js" strategy="afterInteractive" />
      <Script src="/towergames/js/entities/mine.js" strategy="afterInteractive" />
      <Script src="/towergames/js/entities/tooth.js" strategy="afterInteractive" />
      <Script src="/towergames/js/entities/explosion.js" strategy="afterInteractive" />
      
      {/* Load GUI components */}
      <Script src="/towergames/js/gui/toolbar.js" strategy="afterInteractive" />
      <Script src="/towergames/js/gui/toolbar_slot.js" strategy="afterInteractive" />
      <Script src="/towergames/js/gui/hud.js" strategy="afterInteractive" />
      <Script src="/towergames/js/gui/menuscreen.js" strategy="afterInteractive" />
      
      {/* Ensure MainGame is attached to window after all state files are loaded */}
      <Script 
        id="ensure-main-game-global"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Ensure MainGame is available globally
            if (typeof MainGame !== 'undefined') {
              window.MainGame = MainGame;
              console.log('MainGame attached to window');
            } else {
              console.error('MainGame is not defined');
            }
          `
        }}
      />
      
      {/* Load main game script LAST - after all dependencies are loaded */}
      <Script 
        src="/towergames/js/main.js" 
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Main game script loaded');
          // Ensure MainGame is available globally
          if (typeof window !== 'undefined' && (window as any).MainGame) {
            console.log('MainGame is available globally');
            console.log('Game initialization should start now...');
          } else {
            console.error('MainGame is not available globally');
            console.error('This means the state files did not load properly');
          }
        }}
        onError={(e) => {
          console.error('Failed to load main.js:', e);
        }}
      />
      
      {/* Debug script to check all dependencies */}
      <Script 
        id="debug-dependencies"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            setTimeout(() => {
              console.log('=== DEPENDENCY CHECK ===');
              console.log('Phaser available:', typeof window.Phaser !== 'undefined');
              console.log('MainGame available:', typeof window.MainGame !== 'undefined');
              console.log('Game object available:', typeof window.game !== 'undefined');
              console.log('=======================');
            }, 1000);
          `
        }}
      />
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