MainGame.GameOverState = function(game){
	
	this.win = false;
};

MainGame.GameOverState.prototype = {
    create: function(){
        if(this.win){
            var s = this.add.sprite(1024/2, 768/2, 'youwin');
            s.anchor.setTo(0.5, 0.5);
            s.fixedToCamera = true;
        } else {
            var s = this.add.sprite(1024/2, 768/2, 'youlose');
            s.anchor.setTo(0.5, 0.5);
            s.fixedToCamera = true;
        }

        // Store points in localStorage before redirecting
        if (typeof InventoryManager !== 'undefined' && InventoryManager.points !== undefined) {
            // Get current scene from URL or default to scene1
            var currentScene = 'scene1'; // Default
            if (window.location.pathname.includes('scene2')) {
                currentScene = 'scene2';
            } else if (window.location.pathname.includes('scene3')) {
                currentScene = 'scene3';
            } else if (window.location.pathname.includes('scene4')) {
                currentScene = 'scene4';
            }
            
            // Get existing points for this scene and add current game points
            var existingPoints = parseInt(localStorage.getItem(currentScene + 'Points') || '0', 10);
            var currentGamePoints = InventoryManager.points;
            var totalPoints = existingPoints + currentGamePoints;
            
            // Store accumulated points for this scene
            localStorage.setItem(currentScene + 'Points', totalPoints.toString());
            console.log('Accumulated points for ' + currentScene + ': ' + existingPoints + ' + ' + currentGamePoints + ' = ' + totalPoints);
        }

        setTimeout(function() {
            window.location.href = "scene2.html";
        }, 1000); 
    },

    update: function(){

    }
};