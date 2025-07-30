'use client'
import React, { useEffect, Suspense, useState } from 'react';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import '../../../public/towergames/css/main.css';

function TowerGamesContent() {
  const searchParams = useSearchParams();
  const [scriptsLoaded, setScriptsLoaded] = useState({
    phaser: false,
    nipplejs: false,
    patch: false,
    states: false,
    resources: false,
    managers: false,
    entities: false,
    gui: false,
    main: false
  });
  
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

  // Function to load scripts sequentially
  const loadScriptSequentially = (src: string, id: string) => {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.id = id;
      script.onload = () => {
        console.log(`Loaded: ${src}`);
        resolve();
      };
      script.onerror = () => {
        console.error(`Failed to load: ${src}`);
        reject();
      };
      document.head.appendChild(script);
    });
  };

  // Load all scripts when component mounts
  useEffect(() => {
    const loadAllScripts = async () => {
      try {
        console.log('Starting sequential script loading...');
        
        // 1. Load Phaser first
        await loadScriptSequentially('/towergames/js/lib/phaser.min.js', 'phaser-script');
        setScriptsLoaded(prev => ({ ...prev, phaser: true }));
        
        // Small delay to ensure Phaser is properly attached to global scope
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Ensure Phaser is global
        if (typeof window !== 'undefined' && (window as any).Phaser) {
          console.log('Phaser loaded and available globally');
        } else {
          console.error('Phaser not available globally after loading');
        }
        
        // 2. Load nipplejs
        await loadScriptSequentially('https://cdn.jsdelivr.net/npm/nipplejs@0.9.0/dist/nipplejs.min.js', 'nipplejs-script');
        setScriptsLoaded(prev => ({ ...prev, nipplejs: true }));
        
        // 3. Load phaser patch
        await loadScriptSequentially('/towergames/js/lib/phaser.patch.js', 'phaser-patch-script');
        setScriptsLoaded(prev => ({ ...prev, patch: true }));
        
        // 4. Load state files (these define MainGame)
        await loadScriptSequentially('/towergames/js/states/bootstate.js', 'bootstate-script');
        await loadScriptSequentially('/towergames/js/states/loaderstate.js', 'loaderstate-script');
        await loadScriptSequentially('/towergames/js/states/mainmenustate.js', 'mainmenustate-script');
        await loadScriptSequentially('/towergames/js/states/gamestate.js', 'gamestate-script');
        await loadScriptSequentially('/towergames/js/states/gameoverstate.js', 'gameoverstate-script');
        setScriptsLoaded(prev => ({ ...prev, states: true }));
        
        // Ensure MainGame is global
        if (typeof window !== 'undefined' && (window as any).MainGame) {
          console.log('MainGame loaded and available globally');
        } else {
          console.error('MainGame not available globally after loading states');
        }
        
        // 5. Load resources and utilities
        await loadScriptSequentially('/towergames/js/resources.js', 'resources-script');
        await loadScriptSequentially('/towergames/js/waves.js', 'waves-script');
        await loadScriptSequentially('/towergames/js/points.js', 'points-script');
        setScriptsLoaded(prev => ({ ...prev, resources: true }));
        
        // 6. Load managers
        await loadScriptSequentially('/towergames/js/managers/collisionmanager.js', 'collisionmanager-script');
        await loadScriptSequentially('/towergames/js/managers/inputmanager.js', 'inputmanager-script');
        await loadScriptSequentially('/towergames/js/managers/inventorymanager.js', 'inventorymanager-script');
        await loadScriptSequentially('/towergames/js/managers/guimanager.js', 'guimanager-script');
        await loadScriptSequentially('/towergames/js/managers/wavemanager.js', 'wavemanager-script');
        setScriptsLoaded(prev => ({ ...prev, managers: true }));
        
        // 7. Load entities
        await loadScriptSequentially('/towergames/js/entities/player.js', 'player-script');
        await loadScriptSequentially('/towergames/js/entities/bullet.js', 'bullet-script');
        await loadScriptSequentially('/towergames/js/entities/bear.js', 'bear-script');
        await loadScriptSequentially('/towergames/js/entities/cane.js', 'cane-script');
        await loadScriptSequentially('/towergames/js/entities/corn.js', 'corn-script');
        await loadScriptSequentially('/towergames/js/entities/turret.js', 'turret-script');
        await loadScriptSequentially('/towergames/js/entities/mine.js', 'mine-script');
        await loadScriptSequentially('/towergames/js/entities/tooth.js', 'tooth-script');
        await loadScriptSequentially('/towergames/js/entities/explosion.js', 'explosion-script');
        setScriptsLoaded(prev => ({ ...prev, entities: true }));
        
        // 8. Load GUI components
        await loadScriptSequentially('/towergames/js/gui/toolbar.js', 'toolbar-script');
        await loadScriptSequentially('/towergames/js/gui/toolbar_slot.js', 'toolbar-slot-script');
        await loadScriptSequentially('/towergames/js/gui/hud.js', 'hud-script');
        await loadScriptSequentially('/towergames/js/gui/menuscreen.js', 'menuscreen-script');
        setScriptsLoaded(prev => ({ ...prev, gui: true }));
        
        // 9. Load main game script last
        await loadScriptSequentially('/towergames/js/main.js', 'main-script');
        setScriptsLoaded(prev => ({ ...prev, main: true }));
        
        console.log('All scripts loaded successfully!');
        
        // Final check
        setTimeout(() => {
          console.log('=== FINAL DEPENDENCY CHECK ===');
          console.log('Phaser available:', typeof (window as any).Phaser !== 'undefined');
          console.log('MainGame available:', typeof (window as any).MainGame !== 'undefined');
          console.log('Game object available:', typeof (window as any).game !== 'undefined');
          console.log('================================');
        }, 1000);
        
      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    };

    loadAllScripts();
  }, []);

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
      
      {/* Loading indicator */}
      {!scriptsLoaded.main && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3000,
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div>Loading Tower Defense Game...</div>
          <div style={{ marginTop: '10px', fontSize: '12px' }}>
            {scriptsLoaded.phaser && '✓ Phaser Loaded'}<br/>
            {scriptsLoaded.states && '✓ Game States Loaded'}<br/>
            {scriptsLoaded.resources && '✓ Resources Loaded'}<br/>
            {scriptsLoaded.managers && '✓ Managers Loaded'}<br/>
            {scriptsLoaded.entities && '✓ Entities Loaded'}<br/>
            {scriptsLoaded.gui && '✓ GUI Loaded'}<br/>
            {scriptsLoaded.main && '✓ Main Game Loaded'}
          </div>
        </div>
      )}
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