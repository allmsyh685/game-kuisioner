	//, kill_corn: 40 corn - 40
	//, kill_cane: 50 gumball - 50
	//, kill_bear: 30 mint - 30

// Get total waves from URL or use all if not set
(function() {
	var allWaves = [
		{ corn: 1, cane: 1, bear: 2, moment: 1 },
		{ corn: 1, cane: 1, bear: 0, moment: 1 },
		{ corn: 1, cane: 1, bear: 1, moment: 1 },
		{ corn: 1, cane: 1, bear: 1, moment: 2 },
		{ corn: 1, cane: 1, bear: 1, moment: 3 },
		{ corn: 10, cane: 10, bear: 10, moment: 3 },
		{ corn: 20, cane: 20, bear: 20, moment: 4 },
		{ corn: 10, cane: 20, bear: 20, moment: 4 },
		{ corn: 10, cane: 10, bear: 40, moment: 4 },
		{ corn: 40, cane: 40, bear: 40, moment: 5 },
		{ corn: 40, cane: 40, bear: 40, moment: 7 }
	];
	var params = new URLSearchParams(window.location.search);
	var n = parseInt(params.get('waves'));
	if (isNaN(n) || n < 1 || n > allWaves.length) n = allWaves.length;
	MainGame.waves = allWaves.slice(0, n);
})();