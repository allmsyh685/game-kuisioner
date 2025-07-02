var MainGame = {};

MainGame.BootState = function(game){
	
};

MainGame.BootState.prototype = {

	preload: function(){
		//load any assets needed for the LoaderState
		for( var i = 0; i < MainGame.resources.BootState.spritesheets.length; i++ ){
			var obj = MainGame.resources.BootState.spritesheets[i];
			this.game.load.spritesheet(obj.name, obj.path, obj.width, obj.height);
		}

	},

	create: function(){
		this.game.input.maxPointers = 2; // Enable multitouch
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;

		// Ensure mouse input is properly enabled
		this.game.input.mouse.enabled = true;
		this.game.input.mouse.capture = false; // Don't prevent default browser behavior
		
		console.log('Boot state - Input setup:', {
			maxPointers: this.game.input.maxPointers,
			mouseEnabled: this.game.input.mouse.enabled,
			mouseCapture: this.game.input.mouse.capture,
			mousePointer: this.game.input.mousePointer
		});

		this.game.keys 			= {};
		this.game.keys.UP 		= game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.game.keys.DOWN 	= game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.game.keys.LEFT 	= game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.game.keys.RIGHT 	= game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.game.keys.REMOVE     = game.input.keyboard.addKey(Phaser.Keyboard.R);

		this.game.keys.DEBUG     = game.input.keyboard.addKey(Phaser.Keyboard.P);

		// Add up/down arrow keys for toolbar selection
		this.game.keys.TOOLBAR_UP = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		this.game.keys.TOOLBAR_DOWN = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

		this.game.state.start('Loader');
	}
};