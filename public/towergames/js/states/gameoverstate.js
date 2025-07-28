MainGame.GameOverState = function(game){
	
	this.win = false;
};

MainGame.GameOverState.prototype = {
    create: function(){
        console.log('GameOver state created, win:', this.win);
        
        try {
            if(this.win){
                var s = this.add.sprite(1024/2, 768/2, 'youwin');
                s.anchor.setTo(0.5, 0.5);
                s.fixedToCamera = true;
                console.log('Win sprite added');
            } else {
                var s = this.add.sprite(1024/2, 768/2, 'youlose');
                s.anchor.setTo(0.5, 0.5);
                s.fixedToCamera = true;
                console.log('Lose sprite added');
            }
        } catch (error) {
            console.error('Error creating game over sprite:', error);
        }

        // Store points in localStorage before redirecting
        if (typeof InventoryManager !== 'undefined' && InventoryManager.points !== undefined) {
            // Get current scene from URL parameters or localStorage
            var currentScene = 'scene1'; // Default
            var nextScene = 'scene2'; // Default next scene
            
            // Try to get scene from URL parameters first
            var urlParams = new URLSearchParams(window.location.search);
            var wavesParam = urlParams.get('waves');
            
            // Determine current scene based on waves parameter
            if (wavesParam) {
                switch(parseInt(wavesParam)) {
                    case 1:
                        currentScene = 'scene1';
                        nextScene = 'scene2';
                        break;
                    case 2:
                        currentScene = 'scene2';
                        nextScene = 'scene3';
                        break;
                    case 3:
                        currentScene = 'scene3';
                        nextScene = 'scene4';
                        break;
                    default:
                        currentScene = 'scene1';
                        nextScene = 'scene2';
                }
            } else {
                // Fallback: try to detect from URL path
                if (window.location.pathname.includes('scene2')) {
                    currentScene = 'scene2';
                    nextScene = 'scene3';
                } else if (window.location.pathname.includes('scene3')) {
                    currentScene = 'scene3';
                    nextScene = 'scene4';
                } else if (window.location.pathname.includes('scene4')) {
                    currentScene = 'scene4';
                    nextScene = 'scene4'; // Stay on scene4 if it's the last scene
                } else {
                    currentScene = 'scene1';
                    nextScene = 'scene2';
                }
            }
            
            // Get existing points for this scene and add current game points
            var existingPoints = parseInt(localStorage.getItem(currentScene + 'Points') || '0', 10);
            var currentGamePoints = InventoryManager.points;
            var totalPoints = existingPoints + currentGamePoints;
            
            // Store accumulated points for this scene
            localStorage.setItem(currentScene + 'Points', totalPoints.toString());
            console.log('Accumulated points for ' + currentScene + ': ' + existingPoints + ' + ' + currentGamePoints + ' = ' + totalPoints);
            
            // Determine redirect URL based on next scene
            var redirectUrl;
            if (nextScene === 'scene4') {
                // If it's the last scene, redirect to the final scene
                redirectUrl = '/game/scene/scene4';
            } else {
                // Otherwise redirect to the next scene
                redirectUrl = '/game/scene/' + nextScene;
            }
            
            console.log('Game over - redirecting to:', redirectUrl);
            
            setTimeout(function() {
                window.location.href = redirectUrl;
            }, 2000); // Increased delay to 2 seconds to show the game over screen
        } else {
            // Fallback redirect if no points
            setTimeout(function() {
                window.location.href = '/game/scene/scene2';
            }, 2000);
        }
    },

    update: function(){

    }
};