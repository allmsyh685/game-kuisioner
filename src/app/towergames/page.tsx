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
    // Hilangkan scroll, margin, dan padding untuk mode layar penuh
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    
    // Teruskan parameter URL ke permainan
    const waves = searchParams.get('waves');
    console.log('TowerGames page loaded with waves parameter:', waves);
    if (waves) {
      // Setel parameter waves di URL agar dapat dibaca oleh game
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

  // Fungsi untuk memuat skrip secara berurutan
  const loadScriptSequentially = (src: string, id: string) => {
    return new Promise<void>((resolve, reject) => {
      // Hindari memuat skrip yang sama dua kali
      const existing = document.getElementById(id) as HTMLScriptElement | null;
      if (existing) {
        console.log(`Already present: ${src}`);
        return resolve();
      }
      const script = document.createElement('script');
      script.src = src;
      script.id = id;
      script.async = false;
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

  // Muat semua skrip saat komponen pertama kali dirender
  useEffect(() => {
    const loadAllScripts = async () => {
      try {
        if ((window as any).__tower_game_scripts_loaded__) {
          console.log('Tower game scripts were already loaded, skipping re-load.');
          return;
        }
        console.log('Starting sequential script loading...');
        
        // 1. Muat Phaser terlebih dahulu
        await loadScriptSequentially('/towergames/js/lib/phaser.min.js', 'phaser-script');
        setScriptsLoaded(prev => ({ ...prev, phaser: true }));
        
        // Jeda kecil untuk memastikan Phaser terpasang ke scope global
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Pastikan Phaser bersifat global
        if (typeof window !== 'undefined' && (window as any).Phaser) {
          console.log('Phaser loaded and available globally');
        } else {
          console.error('Phaser not available globally after loading');
        }
        
        // 2. Muat nipplejs
        await loadScriptSequentially('https://cdn.jsdelivr.net/npm/nipplejs@0.9.0/dist/nipplejs.min.js', 'nipplejs-script');
        setScriptsLoaded(prev => ({ ...prev, nipplejs: true }));
        
        // 3. Muat phaser patch
        await loadScriptSequentially('/towergames/js/lib/phaser.patch.js', 'phaser-patch-script');
        setScriptsLoaded(prev => ({ ...prev, patch: true }));
        
        // 4. Muat file state (mendefinisikan MainGame)
        await loadScriptSequentially('/towergames/js/states/bootstate.js', 'bootstate-script');
        await loadScriptSequentially('/towergames/js/states/loaderstate.js', 'loaderstate-script');
        await loadScriptSequentially('/towergames/js/states/mainmenustate.js', 'mainmenustate-script');
        await loadScriptSequentially('/towergames/js/states/gamestate.js', 'gamestate-script');
        await loadScriptSequentially('/towergames/js/states/gameoverstate.js', 'gameoverstate-script');
        setScriptsLoaded(prev => ({ ...prev, states: true }));
        
        // Pastikan MainGame bersifat global
        if (typeof window !== 'undefined' && (window as any).MainGame) {
          console.log('MainGame loaded and available globally');
        } else {
          console.error('MainGame not available globally after loading states');
        }
        
        // 5. Muat resources dan utilities
        await loadScriptSequentially('/towergames/js/resources.js', 'resources-script');
        await loadScriptSequentially('/towergames/js/waves.js', 'waves-script');
        await loadScriptSequentially('/towergames/js/points.js', 'points-script');
        setScriptsLoaded(prev => ({ ...prev, resources: true }));
        
        // 6. Muat managers
        await loadScriptSequentially('/towergames/js/managers/collisionmanager.js', 'collisionmanager-script');
        await loadScriptSequentially('/towergames/js/managers/inputmanager.js', 'inputmanager-script');
        await loadScriptSequentially('/towergames/js/managers/inventorymanager.js', 'inventorymanager-script');
        await loadScriptSequentially('/towergames/js/managers/guimanager.js', 'guimanager-script');
        await loadScriptSequentially('/towergames/js/managers/wavemanager.js', 'wavemanager-script');
        setScriptsLoaded(prev => ({ ...prev, managers: true }));
        
        // 7. Muat entities
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
        
        // 8. Muat komponen GUI
        await loadScriptSequentially('/towergames/js/gui/toolbar.js', 'toolbar-script');
        await loadScriptSequentially('/towergames/js/gui/toolbar_slot.js', 'toolbar-slot-script');
        await loadScriptSequentially('/towergames/js/gui/hud.js', 'hud-script');
        await loadScriptSequentially('/towergames/js/gui/menuscreen.js', 'menuscreen-script');
        setScriptsLoaded(prev => ({ ...prev, gui: true }));
        
        // 9. Muat skrip game utama terakhir
        await loadScriptSequentially('/towergames/js/main.js', 'main-script');
        setScriptsLoaded(prev => ({ ...prev, main: true }));
        
        console.log('All scripts loaded successfully!');
        (window as any).__tower_game_scripts_loaded__ = true;
        
        // Pengecekan akhir
        setTimeout(() => {
          console.log('=== FINAL DEPENDENCY CHECK ===');
          console.log('Phaser available:', typeof (window as any).Phaser !== 'undefined');
          console.log('MainGame available:', typeof (window as any).MainGame !== 'undefined');
          console.log('Game object available:', typeof (window as any).game !== 'undefined');
          console.log('================================');
        }, 1000);
        
      } catch (error) {
        console.error('Terjadi kesalahan saat memuat skrip:', error);
      }
    };

    loadAllScripts();
  }, []);

  return (
    <>
      <title>Permainan Tower Defense</title>
      <div id="phaser-div" style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 1, background: 'black' }} />
      {/* Kontrol Mobile (tersembunyi secara default, harus ada di React DOM) */}
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
        Tampilkan Kontrol Mobile
      </button>
      
      {/* Indikator pemuatan */}
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
          <div>Memuat Permainan Tower Defense...</div>
          <div style={{ marginTop: '10px', fontSize: '12px' }}>
            {scriptsLoaded.phaser && '✓ Phaser Dimuat'}<br/>
            {scriptsLoaded.states && '✓ State Game Dimuat'}<br/>
            {scriptsLoaded.resources && '✓ Resource Dimuat'}<br/>
            {scriptsLoaded.managers && '✓ Manager Dimuat'}<br/>
            {scriptsLoaded.entities && '✓ Entity Dimuat'}<br/>
            {scriptsLoaded.gui && '✓ GUI Dimuat'}<br/>
            {scriptsLoaded.main && '✓ Game Utama Dimuat'}
          </div>
        </div>
      )}
    </>
  );
}

export default function TowerGamesPage() {
  return (
    <Suspense fallback={<div>Memuat...</div>}>
      <TowerGamesContent />
    </Suspense>
  );
}