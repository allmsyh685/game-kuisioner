function CollisionManager(game){
	
	this.game = game;
	this.groups = {
		  players: []
		, layers: []
		, drops: []
		, bullets: []
		, enemy_bullets: []
		, baddies: []
		, mines: []
		, teeth: []
		, turrets: []
	};
}

CollisionManager.prototype.addObjectToGroup = function(obj, group){
	
	var arr = this.groups[group];
	arr.push(obj);
};

CollisionManager.prototype.removeObjectFromGroup = function(obj, group){

	var arr = this.groups[group];

	if(arr.indexOf(obj) >= 0){
		arr.splice(arr.indexOf(obj), 1);
	}

};

CollisionManager.prototype.purge = function(){

	for(var i in this.groups){
		var arr = this.groups[i];
		arr = [];
	}
}

CollisionManager.prototype.update = function(){

	//PLAYER VS LAYER
	for( var i = 0; i < this.groups.players.length; i++ ){
		var player = this.groups.players[i];
		if (!player || !player.body) continue;
		for( var k = 0; k < this.groups.layers.length; k++ ){
			var layer = this.groups.layers[k];
			if (!layer) continue;
			this.game.physics.arcade.collide(player, layer);
		}
	}

	//PLAYER VS TURRETS
	for( var i = 0; i < this.groups.players.length; i++ ){
		var player = this.groups.players[i];
		for( var k = 0; k < this.groups.turrets.length; k++ ){
			var turret = this.groups.turrets[k];
			this.game.physics.arcade.collide(player, turret);
		}
	}

	//PLAYER VS TEETH
	for( var i = 0; i < this.groups.players.length; i++ ){
		var player = this.groups.players[i];
		for( var k = 0; k < this.groups.teeth.length; k++ ){
			var tooth = this.groups.teeth[k];
			this.game.physics.arcade.collide(player, tooth);
		}
	}

	//PLAYER VS BADDIES
	for( var i = 0; i < this.groups.players.length; i++ ){
		var player = this.groups.players[i];
		for( var k = 0; k < this.groups.baddies.length; k++ ){
			var baddie = this.groups.baddies[k];
			this.game.physics.arcade.collide(player, baddie, function(){
				if(baddie.name=="mint"){
					player._damage(10);
					baddie.die();
				}
				else if(baddie.name=="corn"){
					player._damage(20);
					baddie.die();
				}
			});
		}
	}

	//BULLET VS LAYER
	for( var i = 0; i < this.groups.bullets.length; i++ ){
		var bullet = this.groups.bullets[i];
		if (!bullet || !bullet.alive || !bullet.body) continue;
		for( var k = 0; k < this.groups.layers.length; k++ ){
			var layer = this.groups.layers[k];
			if (!layer) continue;
			
			// Check if bullet is touching the layer
			if (bullet.body.touching && (bullet.body.touching.left || bullet.body.touching.right || bullet.body.touching.up || bullet.body.touching.down)) {
				bullet.die();
			} else {
				// Use collide for physics but don't call the callback
				this.game.physics.arcade.collide(bullet, layer);
			}
		}
	}

	//BULLETS (player) VS TEETH
	for( var i = 0; i < this.groups.bullets.length; i++){
		var bullet = this.groups.bullets[i];
		if (!bullet || !bullet.alive) continue;
		for( var k = 0; k < this.groups.teeth.length; k++ ){
			var tooth = this.groups.teeth[k];
			this.game.physics.arcade.overlap(bullet, tooth, function(){ bullet.die(); });
		}
	}

	//BULLET VS BADDIES
	for( var i = 0; i < this.groups.bullets.length; i++ ){
		var bullet = this.groups.bullets[i];
		if (!bullet || !bullet.alive) continue;
		for( var k = 0; k < this.groups.baddies.length; k++ ){
			var baddie = this.groups.baddies[k];
			this.game.physics.arcade.overlap(bullet, baddie, function(){
				baddie._damage(bullet._parent.attackDamage, bullet._parent);
				bullet.die();
				if(bullet._parent.name=="player"){
					WaveManager.enemyHits++;
				}
			});	
		}
	}

	//BADDIES VS LAYER
	for( var i = 0; i < this.groups.baddies.length; i++ ){
		var baddie = this.groups.baddies[i];
		if (!baddie || !baddie.body) continue;
		for( var k = 0; k < this.groups.layers.length; k++ ){
			var layer = this.groups.layers[k];
			if (!layer) continue;
			this.game.physics.arcade.collide(baddie, layer);
		}
	}

	//BADDIES VS TEETH
	for( var i = 0; i < this.groups.teeth.length; i++ ){
		var tooth = this.groups.teeth[i];
		for( var k = 0; k < this.groups.baddies.length; k++ ){
			var baddie = this.groups.baddies[k];
			this.game.physics.arcade.collide(tooth, baddie, function(){
				if(baddie.name == "mint"){
					tooth.damage(20);
					baddie.die();
				}
				else if(baddie.name == "corn"){
					tooth.damage(30);
					baddie.die();
				}
			});
		}
	}

	//BADDIES VS TURRETS
	for( var i = 0; i < this.groups.baddies.length; i++ ){
		var baddie = this.groups.baddies[i];
		for( var k = 0; k < this.groups.turrets.length; k++ ){
			var turret = this.groups.turrets[k];
			this.game.physics.arcade.collide(baddie, turret, function(){
				if(baddie.name == "mint"){
					turret.damage(10);
					baddie.die();
				}
				else if(baddie.name == "corn"){
					turret.damage(20);
					baddie.die();
				}
			});
		}
	}

	//ENEMY BULLETS VS LAYER
	for( var i = 0; i < this.groups.enemy_bullets.length; i++ ){
		var bullet = this.groups.enemy_bullets[i];
		if (!bullet || !bullet.alive || !bullet.body) continue;
		for( var k = 0; k < this.groups.layers.length; k++ ){
			var layer = this.groups.layers[k];
			if (!layer) continue;
			
			// Check if bullet is touching the layer
			if (bullet.body.touching && (bullet.body.touching.left || bullet.body.touching.right || bullet.body.touching.up || bullet.body.touching.down)) {
				bullet.die();
			} else {
				// Use collide for physics but don't call the callback
				this.game.physics.arcade.collide(bullet, layer);
			}
		}
	}

	//ENEMY BULLETS VS TEETH
	for( var i = 0; i < this.groups.enemy_bullets.length; i++){
		var bullet = this.groups.enemy_bullets[i];
		if (!bullet || !bullet.alive) continue;
		for( var k = 0; k < this.groups.teeth.length; k++ ){
			var tooth = this.groups.teeth[k];
			this.game.physics.arcade.overlap(bullet, tooth, function(){ bullet.die(); tooth.damage(10) });
		}
	}

	//ENEMY BULLETS VS TURRETS
	for( var i = 0; i < this.groups.enemy_bullets.length; i++ ){
		var bullet = this.groups.enemy_bullets[i];
		if (!bullet || !bullet.alive) continue;
		for( var k = 0; k < this.groups.turrets.length; k++ ){
			var turret = this.groups.turrets[k];
			this.game.physics.arcade.overlap(bullet, turret, function(){ bullet.die(); turret.damage(5); });
		}
	}

	//ENEMY BULLETS VS PLAYER
	for( var i = 0; i < this.groups.enemy_bullets.length; i++ ){
		var bullet = this.groups.enemy_bullets[i];
		if (!bullet || !bullet.alive) continue;
		for( var k = 0; k < this.groups.players.length; k++ ){
			var player = this.groups.players[k];
			this.game.physics.arcade.overlap(bullet, player, function(){ bullet.die(); player._damage(5); });
		}
	}

};