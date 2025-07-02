var width = 1024;
var height = 768;

var game = new Phaser.Game(width, height, Phaser.CANVAS, 'phaser-div');

game.state.add('Boot', MainGame.BootState);
game.state.add('Loader', MainGame.LoaderState);
game.state.add('MainMenu', MainGame.MainMenuState);
game.state.add('Game', MainGame.GameState);
game.state.add('GameOver', MainGame.GameOverState);

CollisionManager = new CollisionManager(game);
InputManager = new InputManager(game);
InventoryManager = new InventoryManager(game);
GUIManager = new GUIManager(game);
WaveManager = new WaveManager(game);

game.state.start('Boot');

window.game = game;

function isMobile() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
}
window.moveDirection = { x: 0, y: 0 };

let shootIndicator;

// Prevent pinch-zoom and double-tap zoom on mobile
document.addEventListener('touchmove', function(e) {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });
document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});

function setupMobileControls() {
  if (window.mobileControlsSetup) return; // Prevent double setup
  window.mobileControlsSetup = true;
  document.getElementById('mobile-controls').style.display = 'block';
  // Joystick
  const joystick = nipplejs.create({
    zone: document.getElementById('joystick-zone'),
    mode: 'static',
    position: { left: '60px', bottom: '100px' },
    color: 'blue',
    size: 100
  });
  joystick.on('move', function (evt, data) {
    if (window.GUIManager && window.GUIManager.menuScreen && window.GUIManager.menuScreen.visible) {
      window.moveDirection.x = 0;
      window.moveDirection.y = 0;
      return;
    }
    if (data && data.vector) {
      window.moveDirection.x = data.vector.x;
      window.moveDirection.y = -data.vector.y; // Invert Y axis
    }
  });
  joystick.on('end', function () {
    window.moveDirection.x = 0;
    window.moveDirection.y = 0;
  });
  // Add shoot indicator (Phaser graphics)
  shootIndicator = game.add.graphics(0, 0);
  shootIndicator.beginFill(0xff0000, 0.5);
  shootIndicator.drawCircle(0, 0, 40);
  shootIndicator.endFill();
  shootIndicator.visible = false;
  // Touch shoot area
  const shootArea = document.getElementById('shoot-area');
  shootArea.addEventListener('touchstart', function (e) {
    // Block shooting if menu is open
    if (window.GUIManager && window.GUIManager.menuScreen && window.GUIManager.menuScreen.visible) {
      return;
    }
    // For each changed touch, check if it started outside the joystick zone
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const rect = game.canvas.getBoundingClientRect();
      // SCALE touch coordinates to game resolution
      const scaleX = game.width / rect.width;
      const scaleY = game.height / rect.height;
      const x = (touch.clientX - rect.left) * scaleX;
      const y = (touch.clientY - rect.top) * scaleY;
      // Joystick zone (left:10px; bottom:10px; width:120px; height:120px;)
      const joystickZone = {
        left: 10,
        top: rect.height - 120 - 10, // bottom:10px, height:120px
        width: 120,
        height: 120
      };
      // Only shoot if the touch started outside the joystick zone
      if (
        !(x >= joystickZone.left &&
        x <= joystickZone.left + joystickZone.width &&
        y >= joystickZone.top &&
        y <= joystickZone.top + joystickZone.height)
      ) {
        // Convert to world coordinates for Phaser 1.1.4/2.x
        // Account for camera zoom on mobile
        let worldX = game.camera.x + x;
        let worldY = game.camera.y + y;
        
        // If mobile and camera is zoomed, adjust coordinates
        if (isMobile() && game.camera.scale.x === 2) {
          worldX = game.camera.x + (x / 2);
          worldY = game.camera.y + (y / 2);
        }
        if (game.player && typeof game.player.attack === 'function') {
          game.player.attack({ x: worldX, y: worldY });
        }
        // Show indicator
        shootIndicator.x = worldX;
        shootIndicator.y = worldY;
        shootIndicator.visible = true;
        setTimeout(() => { shootIndicator.visible = false; }, 300);
      }
    }
  });
}

function syncMobileControlsOverlay() {
  var canvas = document.getElementById('phaser-div').getElementsByTagName('canvas')[0];
  var overlay = document.getElementById('mobile-controls');
  if (!canvas || !overlay) return;
  var rect = canvas.getBoundingClientRect();
  overlay.style.left = canvas.offsetLeft + 'px';
  overlay.style.top = canvas.offsetTop + 'px';
  overlay.style.width = canvas.clientWidth + 'px';
  overlay.style.height = canvas.clientHeight + 'px';
  overlay.style.pointerEvents = 'none'; // Only children handle events
}

function resizeGame() {
  var canvas = document.getElementById('phaser-div').getElementsByTagName('canvas')[0];
  if (!canvas) return;
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  if (isMobile()) {
    // Mobile: stretch to fill entire screen
    canvas.style.width = windowWidth + 'px';
    canvas.style.height = windowHeight + 'px';
    canvas.style.marginTop = '0px';
    canvas.style.marginLeft = '0px';
  } else {
    // Desktop: preserve aspect ratio as before
    var gameRatio = width / height;
    var windowRatio = windowWidth / windowHeight;
    let displayWidth, displayHeight;
    if (windowRatio < gameRatio) {
      displayWidth = windowWidth;
      displayHeight = windowWidth / gameRatio;
    } else {
      displayWidth = windowHeight * gameRatio;
      displayHeight = windowHeight;
    }
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';
    canvas.style.marginTop = ((windowHeight - displayHeight) / 2) + 'px';
    canvas.style.marginLeft = ((windowWidth - displayWidth) / 2) + 'px';
  }
  canvas.style.display = 'block';
  canvas.style.background = 'black';
  syncMobileControlsOverlay();
}

function fixInputScaling() {
  // Only apply input scaling on mobile devices
  if (!isMobile()) return;
  
  var canvas = document.getElementById('phaser-div').getElementsByTagName('canvas')[0];
  if (!canvas) return;

  function remapInput(e) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = width / rect.width;
    var scaleY = height / rect.height;

    // Account for camera zoom on mobile
    if (isMobile() && game.camera.scale.x === 2) {
      scaleX = scaleX / 2;
      scaleY = scaleY / 2;
    }

    if (e.touches) {
      for (let i = 0; i < e.touches.length; i++) {
        // Use Object.defineProperty to override read-only clientX/clientY
        Object.defineProperty(e.touches[i], 'clientX', { value: (e.touches[i].clientX - rect.left) * scaleX, configurable: true });
        Object.defineProperty(e.touches[i], 'clientY', { value: (e.touches[i].clientY - rect.top) * scaleY, configurable: true });
      }
    } else {
      Object.defineProperty(e, 'clientX', { value: (e.clientX - rect.left) * scaleX, configurable: true });
      Object.defineProperty(e, 'clientY', { value: (e.clientY - rect.top) * scaleY, configurable: true });
    }
  }

  canvas.addEventListener('touchstart', remapInput, true);
  canvas.addEventListener('mousedown', remapInput, true);
}

window.addEventListener('resize', function() {
  if (isMobile()) {
    fixInputScaling();
  }
  resizeGame();
  syncMobileControlsOverlay();
});
window.addEventListener('orientationchange', function() {
  if (isMobile()) {
    fixInputScaling();
  }
  resizeGame();
  syncMobileControlsOverlay();
});

function updateMobileControlsVisibility() {
  var mobileControls = document.getElementById('mobile-controls');
  if (!mobileControls) return;
  
  // Hide if menuScreen is visible or not in Game state
  if (
    (window.GUIManager && window.GUIManager.menuScreen && window.GUIManager.menuScreen.visible) ||
    (game.state.current !== 'Game') ||
    !isMobile() // Always hide on desktop
  ) {
    mobileControls.style.display = 'none';
  } else {
    mobileControls.style.display = 'block';
  }
}
setInterval(updateMobileControlsVisibility, 100);

document.addEventListener('DOMContentLoaded', function() {
  if (isMobile()) {
    setupMobileControls();
    setTimeout(fixInputScaling, 200); // Only apply input scaling on mobile
  }
  // Manual toggle for dev
  var btn = document.getElementById('show-mobile-controls');
  if (btn) {
    btn.onclick = function() {
      setupMobileControls();
    };
  }
  setTimeout(function() {
    resizeGame();
    syncMobileControlsOverlay();
  }, 100); // Wait for canvas to be created
});