function Tooth(game, spawn){
	
	this.game = game;
	Phaser.Sprite.call(this, this.game, spawn.x, spawn.y, 'tooth');
	this.game.physics.arcade.enable(this);
	this.name = "tooth";

	this.anchor.setTo(0.5, 0.5);
	this.body.immovable = true;

	this.health = 500;
	this.maxHealth = 500;
	
	// Add damage protection to prevent multiple damage calls in the same frame
	this.lastDamageTime = 0;
	this.damageCooldown = 100; // 100ms cooldown between damage calls

	this.healthBar = this.game.add.sprite(this.x, this.y + 40, 'player_health');
	this.healthBar.anchor.setTo(0.5, 0.5);

	CollisionManager.addObjectToGroup(this, 'teeth');
	this.game.add.existing(this);
}

Tooth.prototype = Object.create(Phaser.Sprite.prototype);
Tooth.prototype.constructor = Tooth;

Tooth.prototype.update = function(){
	// Update health bar position to follow the tooth
	this.healthBar.x = this.x;
	this.healthBar.y = this.y + 40;

	var p = (this.health / this.maxHealth);
	p = parseFloat(p.toFixed(1));
	
	// Ensure frame calculation is within valid range
	var frame = Math.max(0, Math.min(10, Math.floor(10 - (p * 10))));
	this.healthBar.frame = frame;
}

Tooth.prototype.damage = function(amount) {
	// Check if tooth is still alive
	if (!this.alive || this.health <= 0) {
		console.log('Tooth is already dead, ignoring damage');
		return this;
	}
	
	// Check damage cooldown to prevent multiple damage calls
	var currentTime = Date.now();
	if (currentTime - this.lastDamageTime < this.damageCooldown) {
		console.log('Tooth damage blocked by cooldown');
		return this;
	}
	
	console.log('Tooth taking damage:', amount, 'Current health:', this.health);
	
	this.health -= amount;
	this.lastDamageTime = currentTime;
	
	// Ensure health doesn't go below 0
	if (this.health < 0) {
		this.health = 0;
	}
	
	console.log('Tooth health after damage:', this.health);
	
	// If health reaches 0, call die function
	if (this.health <= 0) {
		this.die();
	}
	
	return this;
}

Tooth.prototype.die = function(){
	console.log('Tooth died - GAME OVER!');
	GUIManager.destroy();
	WaveManager.destroy();
	this.game.state.states['GameOver'].win = false;
	this.game.state.start('GameOver');
}

// Override the default kill function to prevent unexpected destruction
Tooth.prototype.kill = function() {
	console.log('Tooth kill() called - preventing unexpected destruction');
	// Don't call the parent kill function to prevent the tooth from disappearing
	// Only allow destruction through the die() function
	return this;
}